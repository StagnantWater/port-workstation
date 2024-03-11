import pg from "pg";

export default class DB {
  #dbClient = null;
  #dbHost = "";
  #dbPort = "";
  #dbName = "";
  #dbLogin = "";
  #dbPassword = "";

  constructor() {
    this.#dbHost = process.env.DB_HOST;
    this.#dbPort = process.env.DB_PORT;
    this.#dbName = process.env.DB_NAME;
    this.#dbLogin = process.env.DB_LOGIN;
    this.#dbPassword = process.env.DB_PASSWORD;

    this.#dbClient = new pg.Client({
      user: this.#dbLogin,
      password: this.#dbPassword,
      host: this.#dbHost,
      port: this.#dbPort,
      database: this.#dbName,
    });
  }

  async connect() {
    try {
      await this.#dbClient.connect();
      console.log("DB connection established");
    } catch (error) {
      console.error("Unable to connect to DB: ", error);
      return Promise.reject(error);
    }
  }

  async disconnect() {
    await this.#dbClient.end();
    console.log("DB connection was closed");
  }

  async getVoyages() {
    try {
      const voyages = await this.#dbClient.query(
        "SELECT voyages.id, voyages.destination_id, voyages.ferry_id, destinations.name AS destination_name, ferries.name AS ferry_name, hold, autopark FROM voyages, ferries, destinations WHERE ferry_id = ferries.id AND destination_id = destinations.id;",
      );

      return voyages.rows;
    } catch (error) {
      console.error("Unable to get voyages, error: ", error);
      return Promise.reject({
        type: "internal",
        error,
      });
    }
  }

  async addVoyage({ voyageID, destinationID, ferryID } = {
    voyageID: null, destinationID: null, ferryID: null }
    ) {
      if (!voyageID || !destinationID || !ferryID) {
        const errMsg = `Add voyage error: wrong params (id: ${voyageID}, destinationID: ${destinationID}, ferryID: ${ferryID})`;
        console.error(errMsg);
        return Promise.reject({
          type: "client",
          error: new Error(errMsg),
        });
      }

      try {
        await this.#dbClient.query(
          "INSERT INTO voyages (id, destination_id, ferry_id) VALUES ($1, $2, $3);",
          [voyageID, destinationID, ferryID]
        );
      } catch (error) {
        console.error("Unable to add voyage, error: ", error);
        return Promise.reject({
          type: "internal",
          error,
        });
      }
  }

  async deleteVoyage({ voyageID } = { voyageID: null }) {
    if (!voyageID) {
      const errMsg = `Delete voyage error: wrong params (voyageID: ${voyageID})`;
      console.error(errMsg);
      return Promise.reject({
        type: "client",
        error: new Error(errMsg),
      });
    }

    try {
      await this.#dbClient.query("DELETE FROM voyages WHERE id = $1;", [voyageID]);
    } catch (error) {
      console.error("Unable to delete voyage, error: ", error);
      return Promise.reject({
        type: "internal",
        error,
      });
    }
  }

  async updateVoyage({ voyageID, destinationID } = { voyageID: null, destinationID: null }) {
    if (!voyageID || !destinationID) {
      const errMsg = `Edit voyage error: wrong params (voyageID: ${voyageID}, destinationID: ${destinationID})`;
      console.error(errMsg);
      return Promise.reject({
        type: "client",
        error: new Error(errMsg),
      });
    }

    try {
      await this.#dbClient.query("UPDATE voyages SET destination_id = $1 WHERE id = $2;", [destinationID, voyageID]);
    } catch (error) {
      console.error("Unable to edit voyage, error: ", error);
      return Promise.reject({
        type: "internal",
        error,
      });
    }
  }

  async getPassengers() {
    try {
      const passengers = await this.#dbClient.query(
        "SELECT * FROM passengers ORDER BY passenger_type;"
      );

      return passengers.rows;
    } catch (error) {
      console.error("Unable to get passengers, error: ", error);
      return Promise.reject({
        type: "internal",
        error,
      });
    }
  }

  async getDestinations() {
    try {
      const destinations = await this.#dbClient.query(
        "SELECT * FROM destinations;"
      );

      return destinations.rows;
    } catch (error) {
      console.error("Unable to get destinations, error: ", error);
      return Promise.reject({
        type: "internal",
        error,
      });
    }
  }

  async getFerries() {
    try {
      const ferries = await this.#dbClient.query(
        "SELECT * FROM ferries;"
      );

      return ferries.rows;
    } catch (error) {
      console.error("Unable to get ferries, error: ", error);
      return Promise.reject({
        type: "internal",
        error,
      });
    }
  }

  async getVoyageByFerry({ ferryID } = { ferryID: null }) {
    if (!ferryID) {
      const errMsg = `Wrong params (ferryID: ${ferryID})`;
      console.error(errMsg);
      return Promise.reject({
        type: "client",
        error: new Error(errMsg),
      });
    }
    try {
      const voyage = await this.#dbClient.query(
        "SELECT id FROM voyages WHERE ferry_id = $1;",
        [ferryID]
      );

      return voyage.rows;
    } catch (error) {
      console.error("Unable to get voyage by ferryID, error: ", error);
      return Promise.reject({
        type: "internal",
        error,
      });
    }
  }

  async addPassenger(
    { passengerID, type, name, size, voyageID } = {
      passengerID: null,
      type: null,
      name: null,
      size: null,
      voyageID: null
    }
  ) {
    if (!passengerID || !type || !name || !size || !voyageID) {
      const errMsg = `Add passenger error: wrong params`;
      console.error(errMsg);
      return Promise.reject({
        type: "client",
        error: new Error(errMsg),
      });
    }

    try {
      await this.#dbClient.query(
        "INSERT INTO passengers (id, name, passenger_type, space_occupied, voyage_id) VALUES ($1, $2, $3, $4, $5);",
        [passengerID, name, type, parseInt(size), voyageID]
      );
    } catch (error) {
      console.error("Unable to add passenger, error: ", error);
      return Promise.reject({
        type: "internal",
        error,
      });
    }
  }

  async deletePassenger({ passengerID } = { passengerID: null }) {
    if (!passengerID) {
      const errMsg = `Delete passenger error: wrong params (passengerID: ${passengerID})`;
      console.error(errMsg);
      return Promise.reject({
        type: "client",
        error: new Error(errMsg),
      });
    }

    try {
      await this.#dbClient.query("DELETE FROM passengers WHERE id = $1;", [passengerID]);
    } catch (error) {
      console.error("Unable to delete passenger, error: ", error);
      return Promise.reject({
        type: "internal",
        error,
      });
    }
  }

  async updatePassenger({ passengerID, voyageID } = { passengerID: null, voyageID: null }) {
    if (!passengerID || !voyageID) {
      const errMsg = `Move passenger error: wrong params`;
      console.error(errMsg);
      return Promise.reject({
        type: "client",
        error: new Error(errMsg),
      });
    }

    try {
      await this.#dbClient.query("UPDATE passengers SET voyage_id = $1 WHERE id = $2;", [voyageID, passengerID]);
    } catch (error) {
      console.error("Unable to move passenger, error: ", error);
      return Promise.reject({
        type: "internal",
        error,
      });
    }
  }
}
