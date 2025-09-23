"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.currency = exports.moneyFormat = void 0;
const commaNumber = require("comma-number");
const currency = {
    symbol: {
        sa: "R",
        usd: "$",
        euro: "€",
        gbp: "£",
        ksh: "K",
        cad: "C$",
    },
};
exports.currency = currency;
const moneyFormat = function (amount, symbol = "sa", nocurrency = false) {
    try {
        const _currency = nocurrency === true ? "" : currency.symbol[symbol];
        if (!amount) {
            return _currency + "0";
        }
        amount = Math.round(amount * 100) / 100;
        const theAmount = amount < 0 ? `-${commaNumber(-amount)}` : commaNumber(amount);
        return _currency + theAmount;
        // return _currency + Math.round(parseInt(amount));
    }
    catch (e) {
        console.log("moneyFormat::::Error=====>", e);
        return 0;
    }
};
exports.moneyFormat = moneyFormat;
//# sourceMappingURL=currency.js.map