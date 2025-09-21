import User from "../../models/User"
import bcrypt from "bcryptjs"
import { transaction } from "objection"
import Wallet from "../../models/Wallet"
import Refferal from "../../models/Refferal"
import generateJWT from "../../helpers/generateJWT"
// import emailMessage from "../../helpers/messages/emailMessage";
import getUser from "../profile/getUser"
import AppError from "../../utils/AppError"
type register = {
    fullName: string
    email: string
    phone: string
    password: string
    refCode: any
}
type userData = {
    phone?: string;
    email?: string;
    full_name: string;
    password: string;
    email_verified_at?: Date | null;
    phone_verified_at?: Date | null;
    notification: number;
    created_at: Date;
    updated_at: Date;
}
const saltRounds = process.env.SALT_ROUNDS || "10";
const logPrefix = "[AUTH:REGISTER:SERVICE]";

export default async ({ fullName, refCode, email, phone, password }: register) => {

    console.log(`${logPrefix} init ===> `, JSON.stringify({ email, phone, fullName }));

    const userPhone = await User.query()
        .findOne({ phone }).orWhere({ email });

    if (userPhone) {
        throw new AppError("You already have an account with this email, please login", 400, logPrefix, {});
    }

    let passwordHash: any = null;
    if (password) {
        passwordHash = await bcrypt.hash(password, parseInt(saltRounds));
    }
    let newUser: any = null;
    let defaultWallet;



    if (!defaultWallet) {
        throw new AppError("Country not found, please try again", 400, logPrefix, {});
    }

    try {
        await transaction(
            User,
            Wallet,
            async (User: any) => {
                const newUserData: userData = {
                    phone,
                    email,
                    full_name: fullName,
                    password: passwordHash,
                    email_verified_at: new Date(),
                    phone_verified_at: new Date(),
                    notification: 1,
                    created_at: new Date(),
                    updated_at: new Date(),
                };

                newUser = await User.query().insertAndFetch(newUserData);

            }
        );
    } catch (error: any) {
        console.log(error);

        throw new AppError("Registration error, kindly try again in a few minutes", 400, logPrefix, {});

    }
    if (!newUser) {
        throw new AppError("Registration error, kindly try again in a few minutes", 400, logPrefix, {});
    }

    const token = generateJWT(newUser.id);

    const theUser = await User.query()
        .findById(newUser.id);

    // work on refCode section

    if (refCode) {
        const refUser = await User.query().findOne({ tag: refCode });
        if (refUser) {
            await Refferal.query().insert({
                user_id: refUser.id,
                peer_user_id: theUser?.id,
                status: "pending",
                created_at: new Date(),
                updated_at: new Date(),
            })
        }
    }
    if (theUser) {
        const userProfile = await getUser({ userId: theUser.id });
        // await emailMessage({ email: theUser.email, type: "welcome", meta: { name: firstName } });
        return {
            status: "success",
            statusCode: 200,
            data: { token, ...userProfile.data },
            message: "Registration successful "
        };
    }
    return { status: false, statusCode: 400, data: {}, message: "Registration unsuccessful, kindly try again in a few minutes" }

}