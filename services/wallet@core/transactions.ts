/* eslint-disable camelcase */
import { raw } from "objection";
import mysql from "mysql2";
import redisConnect from "../../redis/redisConnection"
import Transactions from "../../models/Transactions"

type transactionType = {
  uniqueKey: string,
  user_id: string,
  peer_user_id: string,
  description: string,
  reference: string,
  amount: number,
  charge: number,
  type: string,
  outward: boolean,
  redisLock: boolean,
  meta: any
}
const logPrefix = "[WALLET@CORE:TRANSACTIONS:SERVICE]";
export default async ({
  uniqueKey,
  user_id,
  peer_user_id,
  description,
  reference,
  amount,
  charge,
  type,
  outward,
  meta,
  redisLock = true,
}: transactionType) => {
  try {
    console.log(
      `${logPrefix} Init :::::===> `,
      JSON.stringify({
        user_id,
        peer_user_id,
        amount,
        reference,
        type,
        meta
      })
    );

    if (redisLock === true) {
      const redisRes = await redisConnect({
        type: "lock",
        key: `transaction:lock:${user_id}`,
        value: reference,
        time: 120
      });

      console.log(
        `${logPrefix} Redis lock response ===>`,
        redisRes,
        JSON.stringify({
          user_id,
          peer_user_id,
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
    }

    const sumuserTrans = await Transactions.query()
      .select(raw("COALESCE(SUM(amount), 0)"))
      .where({ user_id, status: "successful" });

    // check if manage account if yes skip sum for peer user
    const sumPeeruserTrans = await Transactions.query()
      .select(raw("COALESCE(SUM(amount), 0)"))
      .where({ user_id: peer_user_id, status: "successful" });
    console.log(
      "sumuserTrans x sumPeeruserTrans===>",
      user_id,
      peer_user_id,
      sumuserTrans[0]["COALESCE(SUM(amount), 0)"],
      sumPeeruserTrans[0]["COALESCE(SUM(amount), 0)"]
    );

    const lastBalance = sumuserTrans[0]["COALESCE(SUM(amount), 0)"] || 0;
    const lastBalanceReceiver = sumPeeruserTrans[0]["COALESCE(SUM(amount), 0)"] || 0;

    const query = `CALL createTransaction(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @addedTransaction, @newBalance, @lastBalance, @transactionType, @amount, @insertRowCount, @proceed);`;
    const params = [
      lastBalance,
      lastBalanceReceiver,
      uniqueKey,
      user_id,
      peer_user_id,
      amount,
      description,
      reference,
      "successful",
      outward,
      type,
      "tencoin",
      charge,
      uniqueKey,
      null
    ];

    const buildQuery = mysql.format(query, params);

    let res = await Transactions.knex().raw(buildQuery);

    if (redisLock === true) {
      await redisConnect({
        type: "delete",
        key: `transaction:lock:${user_id}`,
        value: null,
        time: null
      });
    }

    return {
      status: true,
      ...res[0][0][0],
      message: "Processing transation",
    };
  } catch (error: any) {
    if (redisLock === true) {
      await redisConnect({
        type: "delete",
        key: `transaction:lock:${user_id}`,
        value: null,
        time: null
      });
    }
    if (error.code) {
      console.log(`${logPrefix} createTransaction:::Reject:::Error===> `, error.code, error.message);
      if (error.code === "ER_SP_DOES_NOT_EXIST") {
        console.log("ER_SP_DOES_NOT_EXIST", error);
        const finalError = {
          status: false,
          "@addedTransaction": 0,
          "@insertRowCount": 0,
          "@proceed": 0,
          message: error.code,
        };
        return finalError;
      } else if (error.code === "ER_DUP_ENTRY") {
        const finalError = {
          status: false,
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
          message: error.code,
        };
        return finalError;
      }
    }
  }
};
