import countries from "../constants/countries";

export const randomNumber = (length: number) => {
  let text = "";
  const possible = "123456789";
  for (let i = 0; i < length; i++) {
    const sup = Math.floor(Math.random() * possible.length);
    text += i > 0 && sup === i ? "0" : possible.charAt(sup);
  }
  return Number(text);
}
export const getDateTime = () => {
  const today = new Date();
  const date =
    today.getFullYear() +
    "-" +
    (today.getMonth() + 1) +
    "-" +
    today.getDate();
  const time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  const dateTime = date + " " + time;
  return dateTime;
}

export const formartPhone = ({ phone, country }: { phone: string, country: string }) => {
  const countryData = countries.find(c =>
    c.symbol.toLowerCase()===country.toLowerCase() || c.alpha3Code.toLowerCase()===country.toLowerCase()
  );

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

