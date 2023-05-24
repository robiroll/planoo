import { Client } from "https://deno.land/x/postgres/mod.ts";

const client = new Client({
  user: "robinson",
  password: "RazZ13MattazZ",
  database: "postgres",
  hostname: "planoo.cnj09xyahhy1.us-east-2.rds.amazonaws.com",
  port: 5432,
});

await client.connect();

export default client;
