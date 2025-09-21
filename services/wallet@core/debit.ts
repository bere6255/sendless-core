/* eslint-disable camelcase */
import * as env from "dotenv"
env.config()
import transactionNGN from "./transactions";
import User from "../../models/User";
// import date from "date-and-time";
import phoneMessage from "../../helpers/messages/phoneMessage";
// import VirtualAccounts from "../../models/VirtualAccounts";
const TENCOIN_COLLECTIONS = process.env.TENCOIN_COLLECTIONS;
const logPrefix = "[WALLET@CORE:DEBIT:SERVICE]";

type transactionType = {
  user_id: string,
  peer_user_id: string,
  description: string,
  reference: string,
  amount: number,
  charge: number,
  type: string,
  meta: any
}
export default async ({
  user_id,
  peer_user_id,
  description,
  reference,
  amount,
  charge,
  type,
  meta
}: transactionType) => {
  try {

    console.log(
      `${logPrefix} init ===> `,
      JSON.stringify({
        user_id,
        peer_user_id,
        description,
        reference,
        amount,
        charge,
        type,
        meta
      })
    );

    if (user_id === peer_user_id) {
      console.log(`${logPrefix} same user account`, user_id, peer_user_id);
      return { status: false, data: {}, message: "You can not send money to your self" };
    }
    const checkSender = await User.query().findOne({
      id: user_id
    });
    if (!checkSender) {
      console.log(
        `${logPrefix} Sender account not fund ===> `,
        JSON.stringify({
          user_id,
          peer_user_id,
          description,
          reference,
          amount,
          charge,
          type,
          meta
        })
      );
      return { status: false, data: {}, message: "Sender account not fund" };
    }
    const checkReciver = await User.query().findOne({
      id: peer_user_id,
    });
    if (!checkReciver) {
      console.log(
        `${logPrefix} Reciver account not fund ===> `,
        JSON.stringify({
          user_id,
          peer_user_id,
          description,
          reference,
          amount,
          charge,
          type,
          meta
        })
      );
      return { status: false, data: {}, message: "Reciver account not fund" };
    }

    const tencoinCollectionAccount = await User.query().findOne({
      id: TENCOIN_COLLECTIONS,
    });
    if (!tencoinCollectionAccount) {
      console.log(
        `${logPrefix} collection account error ===> `,
        JSON.stringify({
          user_id,
          peer_user_id,
          description,
          reference,
          amount,
          charge,
          type,
          meta
        })
      );
      return { status: false, data: {}, message: "Please try again in a few minutes" };
    }

    if (description) {
      if (description.length >= 240) {
        description = description.substr(0, 240) + "...";
      }
    }

    const outward = ["disburse", "withdrawal"].includes(type) ? true : false;
    // atempt to debit user
    const debitPayload = {
      uniqueKey: reference,
      user_id,
      peer_user_id,
      description,
      reference,
      amount: -amount,
      charge,
      type,
      outward,
      redisLock: true,
      meta
    }
    console.log(`${logPrefix} transaction payload ===> `, JSON.stringify(debitPayload));

    let transactionResp = await transactionNGN(debitPayload);

    console.log(
      `${logPrefix} transactionRes:::===> ${reference}`,
      JSON.stringify(transactionResp),
      "data ===> ",
      JSON.stringify({
        user_id,
        peer_user_id,
        description,
        reference,
        amount,
        charge,
        type,
        meta
      })
    );
    if (transactionResp.status === false) {
      return {
        status: false,
        data: {},
        message: transactionResp.message
      };
    }
    const addedTransaction = transactionResp["@addedTransaction"];
    const creditId = transactionResp["@creditId"];
    let newBalance = transactionResp["@newBalance"];
    if (addedTransaction === 2) {
      return {
        status: true,
        data: {},
        message: "Insufficient Funds"
      };
    }

    if ((charge > 0)) {
      let chargTransactionResp = await transactionNGN({
        uniqueKey: `charg_${reference}`,
        user_id,
        peer_user_id: tencoinCollectionAccount.id,
        description,
        reference: `charg_${reference}`,
        amount: -charge,
        charge,
        outward,
        type,
        redisLock: true,
        meta
      });

      console.log(
        "ChargTransactionRes:::==> ",
        `charg_${reference}`,
        JSON.stringify(chargTransactionResp),
        "data ===> ",
        JSON.stringify({
          user_id,
          peer_user_id: tencoinCollectionAccount.id,
          description,
          reference: `charg_${reference}`,
          amount: -charge,
          charge,
          type,
          meta
        })
      );

      newBalance = chargTransactionResp["@newBalance"];
    }



    // date.format(now, 'YYYY/MM/DD HH:mm:ss');

    // handle transaction notification  
    const sendUser = [ "withdrawal", "disburse", "reversal", "deposit"];
    const sendPeerUser = ["p2p"];
    // if (sendUser.includes(type)) {
    //   const getAccount = await VirtualAccounts.query().findOne({ user_id });
    //   if (getAccount) {
    //     if (description) {
    //       if (description.length > 50) {
    //         description = description.substr(0, 50);
    //       }
    //     }
    //     const phoneData = {
    //       type: "Debit",
    //       account: getAccount.account_number,
    //       message: description,
    //       amount: `₦${parseInt(`${amount / 100}`).toLocaleString("en-US")}`,
    //       balance: `₦${parseInt(`${newBalance / 100}`).toLocaleString("en-US")}`
    //     }

    //     await phoneMessage({
    //       phone: checkSender.phone,
    //       type: "transaction",
    //       meta: phoneData
    //     })
    //   }

    // }

    // if (sendPeerUser.includes(type)) {
    //   const emailPayload = {
    //     name: checkReciver?.firstName,
    //     reference,
    //     description,
    //     date: now,
    //     amount: `₦ ${parseInt(`${amount / 100}`).toLocaleString("en-US")}`
    //   }

    //   await emailMessage({
    //     email: checkReciver.email,
    //     type: "transaction",
    //     meta: emailPayload
    //   })
    // }


    return { status: true, data: {}, message: "Processing transation" };


  } catch (error: any) {
    console.log(`${logPrefix} error ===> `, error.message, error.stack);
    return { status: true, data: {}, message: "Processing transaction" };
  }
}
