/* eslint-disable camelcase */
import redisConnection from "../../redis/redisConnection";
import debitWallet from "../wallet@core/debitWallet";
import debitTransaction from "../wallet@core/debit";

const logPrefix = "[WALLET:DEBITP2P:SERVICE]";

type TransactionType = {
  user_id: string;
  peer_user_id: string;
  description: string;
  reference: string;
  wallet: string;
  amount: number;
  charge: number;
  type: string;
  limit: number;
  meta: any;
};

export default async ({
  user_id,
  peer_user_id,
  description,
  reference,
  amount,
  wallet,
  charge,
  type,
  limit,
  meta
}: TransactionType) => {
  try {
    console.log(`${logPrefix} init ===> `, JSON.stringify({
      user_id,
      peer_user_id,
      description,
      reference,
      wallet,
      amount,
      charge,
      type,
      meta
    }));

    if (user_id === peer_user_id) {
      console.log(`${logPrefix} user to self error ===>`, JSON.stringify({
        user_id,
        peer_user_id,
        description,
        reference,
        wallet,
        amount,
        charge,
        type
      }));

      return { status: false, data: {}, message: "You cannot send money to yourself" };
    }

    const lockKey = `p2p:${user_id}${peer_user_id}${amount}`;
    const lockValue = JSON.stringify({ user_id, peer_user_id, description, wallet, reference, amount });

    const lockTrans = await redisConnection({
      type: "lock",
      key: lockKey,
      value: lockValue,
      time: 30
    });

    if (!lockTrans) {
      console.log(`${logPrefix} redis duplicate transaction ===>`, lockValue);
      return {
        status: false,
        data: {},
        message: "We are still processing your previous transaction"
      };
    }


    let finalDescription = description;
    if (finalDescription?.length >= 200) {
      finalDescription = finalDescription.substring(0, 200) + "...";
    }

    try {
      const debitWalletRes = await debitWallet({ user_id, amount, wallet });

      if (!debitWalletRes.status) {
        console.log(`${logPrefix} debit wallet error ===>`, debitWalletRes.message, JSON.stringify({
          user_id,
          peer_user_id,
          finalDescription,
          reference,
          amount,
          meta
        }));

        return { status: false, data: {}, message: debitWalletRes.message };
      }
    } catch (error: any) {
      console.log(`${logPrefix} debit wallet catch error ===>`, error.message, error.response?.data?.message);
      return { status: false, data: {}, message: "Transaction Failed, Please try again" };
    }

    // Attempt to finalize debit transaction
    const debitPayload = {
      user_id,
      peer_user_id,
      description: finalDescription,
      reference,
      amount: amount * 100, // Convert to kobo
      charge,
      type,
      meta
    };

    console.log(`${logPrefix} debit payload ===>`, JSON.stringify(debitPayload));

    const debitRes = await debitTransaction(debitPayload);

    console.log(`${logPrefix} debit response ===>`, debitRes.data);

    if (!debitRes.status) {
      console.log(`${logPrefix} debit transaction error ===>`, debitRes.message, JSON.stringify({
        user_id,
        peer_user_id,
        reference,
        amount
      }));

      return { status: false, data: {}, message: "Transaction Failed, Please try again" };
    }

    return { status: true, data: {}, message: "Processing transaction" };

  } catch (error: any) {
    console.log(`${logPrefix} catch error ===>`, error.message, error.stack);
    return { status: false, data: {}, message: "Transaction Failed, Please try again" };
  }
};
