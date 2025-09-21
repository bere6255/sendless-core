/* eslint-disable camelcase */
require("dotenv").config();
import Wallet from "../../models/Wallet"
const logPrefix = "[WALLET@CORE:DEBITWALLET:SERVICES]";

type transactionType = {
  user_id: string,
  amount: number,
  wallet: string
}

export default async ({
  user_id,
  wallet,
  amount,
}: transactionType) => {
  try {
    console.log(
      `${logPrefix} init ===> `,
      JSON.stringify({
        user_id,
        amount
      })
    );
    amount = amount * 100;
    const checkWallet = await Wallet.query().findOne({ user_id, type: wallet });
    if (!checkWallet) {

      console.log(`${logPrefix} wallet not found ===> `, user_id);

      return {
        status: false,
        data: {},
        message: "Wallet not found",
      };
    }

    /** Attempt to debit sender */
    const balance = await Wallet.query()
      .decrement("amount", amount)
      .where("amount", ">=", amount)
      .where({ id: checkWallet.id });

    if (balance === 0) {
      return {
        status: false,
        data: {},
        message: "Insufficient Funds",
      };
    }

    const newWalletBalance = await Wallet.query().findOne({ id: checkWallet.id });


    console.log(`${logPrefix} balance ===> user_id: ${user_id} balance: ${newWalletBalance.amount}`);

    return {
      status: true,
      data: { user_id, balance: newWalletBalance.amount },
      message: "Debit process successfully",
    };
  } catch (error: any) {

    console.log(`${logPrefix} Error :::===> `, error.code, error.stack);
    return {
      status: false,
      data: {},
      message: "Unable to complete this trasnactions at the moment, kindly try again in a few minutes",
    };
  }

};
