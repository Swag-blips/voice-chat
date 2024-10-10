import { StreamClient } from "@stream-io/node-sdk";
import dotenv from "dotenv";

dotenv.config();

let apiKey = process.env.STREAM_API_KEY;
let apiSecret = process.env.STREAM_CLIENT_SECRET;

if (!apiKey || !apiSecret) {
  throw new Error("Stream Api key must be defined in environment variables");
}
export const client = new StreamClient(apiKey, apiSecret);



