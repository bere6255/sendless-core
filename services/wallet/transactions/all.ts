import Transactions from "../../../models/Transactions";
import User from "../../../models/User";
import date from 'date-and-time';
const logPrefix = "[WALLET:TRANACTIONS:SERVICE]";

export default async ({ user, type, page, limit = 10 }: { user: any; type: string | null; page: number, limit: number }) => {
    try {
        const user_id = user.id;
        if (!user_id) {
            console.log(`${logPrefix} user or asset id not found ===> `, user_id, type, page, limit);
            return { status: false, data: {}, message: "Wallet or asset id is required" }
        }
        const sortedTransaction = <any>[];
        const peerUserIds = <any>[];
        let userTransactions = <any>[];
        if (type === "main") {
            userTransactions = await Transactions.query().where({ user_id, status: "successful" }).whereNotIn("type", ['loans', 'saving', 'airtime', 'mobileData', 'electricity', 'bills']).page(page, limit);
        } else {
            userTransactions = await Transactions.query().where({ user_id, status: "successful", type }).page(page, limit);
        }
        if (userTransactions.results.length > 0) {
            for (let index = 0; index < userTransactions.results.length; index++) {
                peerUserIds.push(userTransactions.results[index].peer_user_id);
            }
        }

        const loadedPeeUsers = await User.query().select("id", "firstName", "lastName", "avatar").whereIn("id", peerUserIds);

        if (loadedPeeUsers.length > 0) {
            for (let transindex = 0; transindex < userTransactions.results.length; transindex++) {
                const singleTrans = userTransactions.results[transindex];
                for (let userindex = 0; userindex < loadedPeeUsers.length; userindex++) {
                    const userDetails = loadedPeeUsers[userindex];
                    if (singleTrans.peer_user_id === userDetails.id) {
                        delete singleTrans.balance;
                        sortedTransaction.push({
                            ...singleTrans,
                            amount: singleTrans.amount / 100,
                            created_at: date.format(singleTrans.created_at, 'YYYY/MM/DD HH:mm:ss'),
                            updated_at: date.format(singleTrans.created_at, 'YYYY/MM/DD HH:mm:ss'),
                            peeUser: userDetails,
                            user: { id: user.id, firstName: user.firstName, lastName: user.lastName, avatar: user.avatar }
                        })
                    }

                }
            }
        }


        const totalRecords = userTransactions.total;
        const currentPage = page;
        const nextPage = page + 1;
        let previousPage = 0

        if (page - 1 >= 0) {
            previousPage = page - 1;
        }


        return {
            status: true,
            data: { currentPage, nextPage, results: sortedTransaction.reverse(), totalRecords, limit, previousPage },
            message: `Transactions fetch successfully`,
        };

    } catch (error: any) {
        console.log(`${logPrefix} Fetch transaction Error ======>`, error.message, error.stack);
        return {
            status: false,
            data: {},
            message: "Failed get fetch transaction, please try again in a few minutes",
            errors: [],
        };

    }
}