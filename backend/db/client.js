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
        "SELECT voyages.id, voyages.destination_id, voyages.ferry_id, destinations.name AS destination_name, ferries.name AS ferry_name FROM voyages, ferries, destinations WHERE ferry_id = ferries.id AND destination_id = destinations.id;",
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
}
