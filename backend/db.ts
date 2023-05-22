import { Client } from "https://deno.land/x/postgres/mod.ts";

const client = new Client({
  user: "robinson",
  password: "azerty",
  database: "eventio",
  hostname: "localhost",
  port: 5432,
});

await client.connect();

export default client;
