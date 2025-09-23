"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formartPhone = exports.getDateTime = exports.randomNumber = void 0;
const countries_1 = __importDefault(require("../constants/countries"));
const randomNumber = (length) => {
    let text = "";
    const possible = "123456789";
    for (let i = 0; i < length; i++) {
        const sup = Math.floor(Math.random() * possible.length);
        text += i > 0 && sup === i ? "0" : possible.charAt(sup);
    }
    return Number(text);
};
exports.randomNumber = randomNumber;
const getDateTime = () => {
    const today = new Date();
    const date = today.getFullYear() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getDate();
    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    const dateTime = date + " " + time;
    return dateTime;
};
exports.getDateTime = getDateTime;
const formartPhone = ({ phone, country }) => {
    const countryData = countries_1.default.find(c => c.symbol.toLowerCase() === country.toLowerCase() || c.alpha3Code.toLowerCase() === country.toLowerCase());
    if (!countryData) {
        console.warn(`No dial code found for country: ${country}`);
        return { status: false, phone };
    }
    const dialCode = countryData.dialCode.replace("+", "");
    let formattedPhone = phone.trim();
    // Remove leading zeros
    formattedPhone = formattedPhone.replace(/^0+/, "");
    // Remove existing country code if accidentally included
    if (formattedPhone.startsWith(dialCode)) {
        return { status: true, phone: `${formattedPhone}` };
    }
    return { status: true, phone: `${dialCode}${formattedPhone}` };
};
exports.formartPhone = formartPhone;
//# sourceMappingURL=util.js.map