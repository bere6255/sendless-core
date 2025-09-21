/* eslint-disable camelcase */
const asyncRedis = require("async-redis");

const redisMainUrl = process.env.REDIS_URL;
const redisMainPort = process.env.REDIS_PORT;
const redisMainPassword = process.env.REDIS_PASSWORD;

let clientMain
export default async () => {
  try {
    clientMain = asyncRedis.createClient(redisMainPort, redisMainUrl);
    clientMain.auth(redisMainPassword, (err: any) =>
      console.error("Main Redis PASSWORD : ERROR : ", err)
    );
    clientMain.on("error", (err: any) => console.error("MAIN ERR : REDIS : ", err));

    return {
      clientMain,
    };
  } catch (e: any) {
    console.log(`Connection::::Redis error %s`, e.message);
  }
};

