import dotenv from "dotenv";
dotenv.config();
import {
  TransportOptionBuilder,
  ClientOptionBuilder,
  DefaultClient,
  GlobalApiEndpoint,
  GlobalFuturesApiEndpoint,
  GlobalBrokerApiEndpoint
} from "kucoin-universal-sdk";

const key = process.env.KC_API_KEY || "";
const secret = process.env.KC_API_SECRET || "";
const passphrase = process.env.KC_API_PASSPHRASE || "";
const KC_BROKER_NAME = process.env.KC_BROKER_NAME || "";
const KC_BROKER_PARTNER = process.env.KC_BROKER_PARTNER || "";
const secretBroker = process.env.KC_BROKER_KEY || "";


export default () => {
  // Set specific options, others will fall back to default values
  var httpTransportOption = new TransportOptionBuilder()
    .setKeepAlive(true)
    .setMaxConnsPerHost(10)
    .setMaxIdleConns(10)
    .build();
  // Create a client using the specified options
  var clientOption = new ClientOptionBuilder()
    .setKey(key)
    .setSecret(secret)
    .setPassphrase(passphrase)
    .setSpotEndpoint(GlobalApiEndpoint)
    .setFuturesEndpoint(GlobalFuturesApiEndpoint)
    .setBrokerEndpoint(GlobalBrokerApiEndpoint)
    .setBrokerKey(secretBroker)
    .setBrokerName(KC_BROKER_NAME)
    .setBrokerPartner(KC_BROKER_PARTNER)
    .setTransportOption(httpTransportOption)
    .build();
  return new DefaultClient(clientOption);
}