import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import DB from "./db/client.js";
import { log } from "console";

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
app.get('/voyages', async (req, res) => {
  try {
    const [dbVoyages, dbPassengers] = await Promise.all([db.getVoyages(), db.getPassengers()]);

    const passengers = dbPassengers.map(({ id, name, passenger_type, space_occupied, voyage_id }) => ({
      passengerID: id,
      name: name,
      type: passenger_type,
      size: space_occupied,
      voyageID: voyage_id
    }));

    const voyages = dbVoyages.map((voyage) => ({
      voyageID: voyage.id,
      destinationID: voyage.destination_id,
      destinationName: voyage.destination_name,
      ferryID: voyage.ferry_id,
      ferryName: voyage.ferry_name,
      passengers: passengers.filter(passenger => passenger.voyageID === voyage.id)
    }));

    res.statusCode = 200;
    res.statusMessage = 'OK';
    res.json({ voyages });
  } catch (err) {
    res.statusCode = 500;
    res.statusMessage = 'Internal server error';
    res.json({
      timestamp: new Date().toISOString(),
      statusCode: 500,
      message: `Getting voyages error: ${err.message || err.error}`
    });
  }
});

// body parsing middleware
app.use('/voyages', express.json());
// add voyage
app.post('/voyages', async (req, res) => {
  try {
    const { voyageID, destinationID, ferryID } = req.body;
    await db.addVoyage({ voyageID, destinationID, ferryID });

    res.statusCode = 200;
    res.statusMessage = 'OK';
    res.send();
  } catch (err) {
    switch (err.type) {
      case 'client':
        res.statusCode = 400;
        res.statusMessage = 'Bad request';
        break;
      default:
        res.statusCode = 500;
        res.statusMessage = 'Internal server error';
        break;
    }
    res.json({
      timestamp: new Date().toISOString(),
      statusCode: res.statusCode,
      message: `Add voyage error: ${err.error.message || err.error}`
    });
  }
});

// get destinations
app.get('/destinations', async (req, res) => {
  try {
    const dbDestinations = await db.getDestinations();

    const destinations = dbDestinations.map(({ id, name }) => ({
      destinationID: id,
      name: name,
    }));

    res.statusCode = 200;
    res.statusMessage = 'OK';
    res.json({ destinations });
  } catch (err) {
    res.statusCode = 500;
    res.statusMessage = 'Internal server error';
    res.json({
      timestamp: new Date().toISOString(),
      statusCode: 500,
      message: `Getting destinations error: ${err.message || err.error}`
    });
  }
});

// get ferries
app.get('/ferries', async (req, res) => {
  try {
    const dbFerries = await db.getFerries();

    const ferries = dbFerries.map(({ id, name, hold, autopark }) => ({
      ferryID: id,
      name: name,
      hold: hold,
      autopark: autopark
    }));

    res.statusCode = 200;
    res.statusMessage = 'OK';
    res.json({ ferries });
  } catch (err) {
    res.statusCode = 500;
    res.statusMessage = 'Internal server error';
    res.json({
      timestamp: new Date().toISOString(),
      statusCode: 500,
      message: `Getting ferries error: ${err.message || err.error}`
    });
  }
});

app.use('/isassigned/:ferryID', express.json());
app.post('/isassigned/:ferryID', async (req, res) => {
  try {
    const { ferryID } = req.params;
    const getVoyageByFerryResponse = await db.getVoyageByFerry({ferryID: ferryID});

    // 201 - not assigned, 202 - assigned
    res.statusCode = (JSON.stringify(getVoyageByFerryResponse) === '[]') ? 201 : 202;
    res.statusMessage = 'OK';
    res.send();
  } catch (err) {
    res.statusCode = 500;
    res.statusMessage = 'Internal server error';
    res.json({
      timestamp: new Date().toISOString(),
      statusCode: 500,
      message: `Ferry check error: ${err.message || err.error}`
    });
  }
});

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