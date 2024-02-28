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
        "SELECT * FROM voyages;"
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
}
