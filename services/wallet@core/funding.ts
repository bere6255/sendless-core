/* eslint-disable camelcase */
import mysql from "mysql2";
import { raw } from "objection";
import Transactions from "../../models/Transactions"
import redisConnection from "../../redis/redisConnection";
import generateRef from "../../utils/generateRef";
import phoneMessage from "../../helpers/messages/phoneMessage";
import VirtualAccounts from "../../models/VirtualAccounts";
const logPrefix = "WALLET@CORE:FUNDING:SERVICE";
type transactionType = {
  user_id: string,
  user_email: string,
  user_phone: string,
  peer_user_id: string,
  description: string,
  reference: string,
  amount: number,
  walletType: string,
  charge: number,
  type: string,
  outward: boolean,
  provider: string,
  meta: any,
  uniqueKey: string
}
export default async ({
  user_id,
  user_email,
  user_phone,
  peer_user_id,
  description,
  reference,
  walletType,
  amount,
  charge,
  type,
  outward,
  provider,
  meta,
  uniqueKey
}: transactionType) => {
  try {
    console.log(
      `${logPrefix} init ===>`,
      JSON.stringify({
        user_id,
        user_email,
        peer_user_id,
        walletType,
        amount,
        reference,
        provider,
        meta,
        type,
      })
    );
    if (amount <= 0) {
      return {
        status: false,
        data: {},
        message: "Amount most be above 100 ",
      };
    }

    const redisRes = await redisConnection({
      type: "lock",
      key: `transaction:lock:${user_id}`,
      value: reference,
      time:120
    });

    console.log(
      `${logPrefix} Redis lock response ===>`,
      redisRes,
      JSON.stringify({
        user_id,
        peer_user_id,
        walletType,
        amount,
        reference,
        type,
      })
    );
    if (!redisRes) {
      console.log(
        `${logPrefix} Redis lock ===> `,
        redisRes,
        JSON.stringify({
          user_id,
          peer_user_id,
          amount,
          walletType,
          reference,
          type,
        })
      );
      return {
        status: false,
        data: {},
        message: "processing user transation",
      };
    }

    const newReference = generateRef({ type });

    const sumuserTrans = await Transactions.query()
      .select(raw("COALESCE(SUM(amount), 0)"))
      .where({ user_id, status: "successful" });

    console.log(
      "sumuserTrans x sumPeeruserTrans===>",
      user_id,
      peer_user_id,
      sumuserTrans[0]["COALESCE(SUM(amount), 0)"]
    );

    const lastBalance = sumuserTrans[0]["COALESCE(SUM(amount), 0)"] || 0;
    const lastBalanceReceiver = 0;

    const query = `CALL createTransaction(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @addedTransaction, @newBalance, @lastBalance, @transactionType, @amount, @insertRowCount, @proceed);`;
    const params = [
      lastBalance,
      lastBalanceReceiver,
      uniqueKey,
      user_id,
      peer_user_id,
      amount,
      description,
      newReference,
      "successful",
      outward,
      walletType,
      type,
      provider,
      charge,
      reference,
      JSON.stringify(meta)
    ];

    const buildQuery = mysql.format(query, params);

    let res = await Transactions.knex().raw(buildQuery);


    await redisConnection({
      type: "delete",
      key: `transaction:lock:${user_id}`,
      value: null,
      time: null
    });

    let transactionResp = { ...res[0][0][0] };

    const addedTrans = transactionResp["@addedTransaction"];
    const newBalance = transactionResp["@newBalance"];
    if (addedTrans) {
        const getAccount = await VirtualAccounts.query().findOne({ user_id });
      if (getAccount) {
         const phoneData = {
        type: "Credit",
        account: getAccount.account_number,
          message: description.substr(0, 50),
        amount: `₦${parseInt(`${amount / 100}`).toLocaleString("en-US")}`,
        balance: `₦${parseInt(`${newBalance / 100}`).toLocaleString("en-US")}`
      }

      await phoneMessage({
        phone: user_phone,
        type: "transaction",
        meta: phoneData
      })
      }
    }

    return {
      status: true,
      data: { ...res[0][0][0] },
      message: "processed transation successfully",
    };
  } catch (error: any) {
    await redisConnection({
      type: "delete",
      key: `transaction:lock:${user_id}`,
      value: null,
      time: null
    });

    console.log(`${logPrefix} error ===> code: ${error.code}`, error.message, error.stack);
    if (error.code) {
      if (error.code === "ER_SP_DOES_NOT_EXIST") {
        console.log("ER_SP_DOES_NOT_EXIST", error);
        const finalError = {
          status: false,
          "@addedTransaction": 0,
          "@insertRowCount": 0,
          "@proceed": 0,
          message: "please try again",
        };
        return finalError;
      } else if (error.code === "ER_DUP_ENTRY") {
        const finalError = {
          status: true,
          "@addedTransaction": 0,
          "@insertRowCount": 0,
          "@proceed": 0,
          message: "duplicate entry",
        };
        return finalError;
      } else {
        const finalError = {
          status: false,
          "@addedTransaction": 0,
          "@insertRowCount": 0,
          "@proceed": 0,
          message: "please try again",
        };
        return finalError;
      }
    }
  }

};
