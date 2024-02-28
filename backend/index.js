import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import DB from "./db/client.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: "./backend/.env",
});

const appHost = process.env.APP_HOST;
const appPort = process.env.APP_PORT;

const app = express();
const db = new DB();

// logging middleware
app.use("*", (req, res, next) => {
  console.log(req.method, req.baseUrl || req.url, new Date().toISOString());

  next();
});

// middleware for static app files
app.use("/", express.static(path.resolve(__dirname, "../dist")));

// get voyages
app.get('/getvoyages', async (req, res) => {
  // TODO
});

// body parsing middleware
app.use('/getvoyages', express.json());

const server = app.listen(Number(appPort), appHost, async () => {
  try {
    await db.connect();
  } catch (error) {
    console.log('Port workstation app shut down');
    process.exit(100);
  }

  console.log(`Port workstation app started at host http://${appHost}:${appPort}`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(async () => {
    await db.disconnect();
    console.log('HTTP server closed');
  });
})