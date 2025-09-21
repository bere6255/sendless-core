import Transactions from "../../models/Transactions"
import debit from "./debit";
const logPrefix = "[REVERSE:TRANSACTION:SERVICE]";
export default async (reference: string) => {
    try {
        console.log(`${logPrefix} init ===> reference:`, reference);

        // queue for 24h before runing tsq on the transaction then take action acodinly 

        const getTransaction = await Transactions.query().where({ reference }).where("amount", "<", 0).first();
        if (!getTransaction) {
            console.log(`${logPrefix} not found error ===> reference:`, reference);
            return { status: false, data: {}, message: "Transaction not found" };
        }
        console.log(getTransaction);
        await debit({
            user_id: getTransaction.peer_user_id,
            peer_user_id: getTransaction.user_id,
            amount: -getTransaction.amount,
            charge: getTransaction.charge,
            description: `Reversal ${getTransaction.description}`,
            reference: `reversal_${reference}`,
            type: "reversal",
            meta: getTransaction.meta
        });
        return { status: true, data: {}, message: "processing transaction" };
    } catch (error) {
        console.log(`${logPrefix} error ===> `, error.message, error.stack);
        return { status: false, data: {}, message: "Faild to process transaction" };
    }
}