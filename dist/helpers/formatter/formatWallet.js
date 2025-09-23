"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (wallet) => {
    try {
        if (typeof wallet === "undefined") {
            return null;
        }
        delete wallet.id;
        delete wallet.user_id;
        return {
            currency_name: "NGDT",
            img: "https://dara-core.s3.amazonaws.com/wallet-img/Bitcoin-Logo-700x394.png",
            amount: wallet.amount === null ? 0 : wallet.amount,
            created_at: wallet.created_at,
            updated_at: wallet.updated_at,
        };
    }
    catch (error) {
        return null;
    }
};
//# sourceMappingURL=formatWallet.js.map