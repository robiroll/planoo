import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { cryptoRandomString } from "https://deno.land/x/crypto_random_string@1.0.0/mod.ts"
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import {
  Event,
  EventConfig,
  Calendar,
} from 'https://deno.land/x/simple_ics@0.0.11/mod.ts';
import dayjs from "https://cdn.skypack.dev/dayjs@1.10.4";

import db from "./db.ts";

type Event = {
  id: string;
  title: string;
  description: string;
};

const formatDate = (date: string) => {
  const baseDate = dayjs(date)
  const dateArray = [baseDate.year(), baseDate.month(), baseDate.date(), baseDate.hour(), baseDate.minute()]
  return dateArray
}

function generateId() {
  return Math.floor(Math.random() * 900000) + 100000;
}

const app = new Application();
const router = new Router();

// Enable CORS for all routes
app.use(
  oakCors({
    origin: "*", // allow any origin
  }),
);

router.get("/", (ctx) => {
  ctx.response.body = "Hello, world!";
});

router.post("/api/create", async (ctx) => {
  const { title, description, startDate, endDate, location } = await ctx.request.body().value;
  const id = generateId();

  try {
    const result = await db.queryObject({
      text: "INSERT INTO events (id, title, description, start_date, end_date, location) VALUES ($1, $2, $3, $4, $5, $6)",
      args: [id, title, description, startDate, endDate, location],
    });

    ctx.response.status = 201;
    ctx.response.body = { success: true, id };
  } catch (err) {
    console.log("Error creating event:", err);
    ctx.response.status = 500;
    ctx.response.body = { message: "Internal server error" };
  }
});

router.post("/api/add-guest", async (ctx) => {
  const { id, name } = await ctx.request.body().value;

  if(!id || !name.trim()) {
    ctx.response.status = 400;
    ctx.response.body = { success: false, message: "Missing parameters" };
    return;
  }

  try {
    const result = await db.queryObject({
      text: `UPDATE events SET guests = array_append(guests, $1) WHERE id = $2`,
      args: [name, id],
    });

    ctx.response.body = { success: true, message: "Guest added successfully" };
  } catch (err) {
    console.log("Error adding guest:", err);
    ctx.response.status = 500;
    ctx.response.body = { message: "Internal server error" };
  }
});

router.post("/api/edit", async (ctx) => {
  const { id, title, description, startDate, endDate, location } = await ctx.request.body().value;

  if(!id) {
    ctx.response.status = 400;
    ctx.response.body = { success: false, message: "Missing id" };
    return;
  }

  if(!title && !description && !startDate && !endDate && !location) {
    ctx.response.status = 400;
    ctx.response.body = { success: false, message: "Missing parameters" };
    return;
  }

  try {
    await db.queryObject({
      text: `
        UPDATE events SET
          title = $1,
          description = $2,
          start_date = $3,
          end_date = $4,
          location = $5
        WHERE id = $6
      `,
      args: [title, description, startDate, endDate, location, id],
    });

    ctx.response.body = { success: true, message: "Event updated successfully" };
  } catch (err) {
    console.log("Error updating event:", err);
    ctx.response.status = 500;
    ctx.response.body = { message: "Internal server error" };
  }


});

router.get("/api/events/:id", async (ctx) => {
  const { id } = ctx.params;

  try {
    const result = await db.queryObject({
      text: "SELECT * FROM events WHERE id = $1",
      args: [id],
    });

    if (result.rows.length === 0) {
      ctx.response.status = 404;
      ctx.response.body = { success: false, message: "Event not found" };
      return;
    }

    const event = result.rows[0];

    const beginDate = formatDate(event.start_date)
    const endDate = formatDate(event.end_date)

    const cfg1: EventConfig = {
      title: event.title,
      beginDate,
      endDate,
      desc: `Event.io link: www.event.io/${id} ${event.description.replace(/(\r\n|\n|\r)/gm, " ")}`,
    };

    
    const evt1 = new Event(cfg1);
    const calendar = new Calendar([evt1]);
    const filename = `${id}.ics`;

    ctx.response.body = { success: true, event, calendar: calendar.toString(), params: ctx, downloadLink: `data:text/calendar;charset=utf-8,${encodeURIComponent(calendar.toString())}` };
  } catch (err) {
    console.log("Error getting event:", err);
    ctx.response.status = 500;
    ctx.response.body = { message: "Internal server error" };
  }
});

app.use(router.routes());
app.use(router.allowedMethods());

console.log("Server running on port 8000");

await app.listen({ port: 8000 });
