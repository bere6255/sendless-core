import Transactions from "../../../models/Transactions";
import User from "../../../models/User";
import date from 'date-and-time';
const logPrefix = "[WALLET:SINGLETRANACTIONS:SERVICE]";

export default async ({ user, reference }: { user: any; reference: string; }) => {
    try {
        const user_id = user.id;
        if (!user_id || !reference) {
            console.log(`${logPrefix} user id or reference not found ===> `, user_id);
            return { status: false, statusCode: 400, data: {}, message: "User id or reference is required" }
        }
        
        const userTransactions = await Transactions.query().findOne({ user_id, reference });
        
        if (!userTransactions) {
            console.log(`${logPrefix} transaction not found reference ${reference}`);
            return { status: false, statusCode: 400, data: {}, message: "Transaction not found" }
        }
        const loadedPeeUsers = await User.query().select("id", "firstName", "lastName", "avatar").findOne({ id: userTransactions.peer_user_id });
        if (!loadedPeeUsers) {
            console.log(`${logPrefix} Peer user not found reference ${reference}`);
            return { status: false, statusCode: 400, data: {}, message: "Transaction not found" }
        }

       const sortedTransaction = {
            ...userTransactions,
            amount: userTransactions.amount / 100,
            created_at: date.format(userTransactions.created_at, 'YYYY/MM/DD HH:mm:ss'),
            updated_at: date.format(userTransactions.created_at, 'YYYY/MM/DD HH:mm:ss'),
            peeUser: loadedPeeUsers,
            user: {id: user.id, firstName: user.firstName, lastName: user.lastName, avatar: user.avatar}
        }
        return {
            statusCode: 200,
            status: true,
            data: sortedTransaction,
            message: `Transactions fetch successfully`,
        };

    } catch (error: any) {
        console.log(`${logPrefix} Fetch transaction Error ======>`, error.message, error.stack);
        return {
            statusCode: 401,
            status: false,
            data: {},
            message: "Failed get fetch transaction, please try again in a few minutes"
        };

    }
}