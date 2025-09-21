/* eslint-disable camelcase */
require("dotenv").config();
import RedisConnect from "./redis";

export default async ({ type, key, value, time= 300 }:{type: string; key: string; value: string | null, time: number | null}) => {
  return RedisConnect().then(async ({ clientMain }: any) => {
    try {
      switch (type) {
        case "get":
          return await clientMain.get(key);
        case "set":
          return await clientMain.set(key, value);
        case "lock":
          return await clientMain.set(key, value, "NX", `EX`, time);
        case "delete":
          return await clientMain.del(key);
        default:
          return null;
      }
    } catch (e: any) {
      console.log(`Retry error %s`, e.message);
      return null;
    }
  });
};

