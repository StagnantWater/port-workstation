export default class AppModel {
  static async getVoyages() {
    try {
      const getVoyagesResponse = await fetch(
        "http://localhost:4321/voyages"
      );
      const getVoyagesBody = await getVoyagesResponse.json();

      if (getVoyagesResponse.status !== 200) {
        return Promise.reject(getVoyagesBody);
      }

      return getVoyagesBody.voyages;
    } catch (err) {
      return Promise.reject({
        timestamp: new Date().toISOString(),
        statusCode: 0,
        message: err.message,
      });
    }
  } // getVoyages

  static async getDestinations() {
    try {
      const getDestinationsResponse = await fetch(
        "http://localhost:4321/destinations"
      );
      const getDestinationsBody = await getDestinationsResponse.json();

      if (getDestinationsResponse.status !== 200) {
        return Promise.reject(getDestinationsBody);
      }

      return getDestinationsBody.destinations;
    } catch (err) {
      return Promise.reject({
        timestamp: new Date().toISOString(),
        statusCode: 0,
        message: err.message,
      });
    }
  } // getDestinations

  static async getFerries() {
    try {
      const getFerriesResponse = await fetch(
        "http://localhost:4321/ferries"
      );
      const getFerriesBody = await getFerriesResponse.json();

      if (getFerriesResponse.status !== 200) {
        return Promise.reject(getFerriesBody);
      }

      return getFerriesBody.ferries;
    } catch (err) {
      return Promise.reject({
        timestamp: new Date().toISOString(),
        statusCode: 0,
        message: err.message,
      });
    }
  } // getFerries

  static async checkFerryAssignment({ ferryID } = { ferryID: null }) {
    try {
      const checkFerryResponse = await fetch(
        `http://localhost:4321/isassigned/${ferryID}`,
        {
          method: "POST"
        }
      );

      if (checkFerryResponse.status === 201) {
        return false;
      } else if (checkFerryResponse.status === 202) {
        return true;
      } else {
        return Promise.reject();
      }
    } catch (err) {
      return Promise.reject({
        timestamp: new Date().toISOString(),
        statusCode: 0,
        message: err.message,
      });
    }
  }

  static async addVoyage({ voyageID, destinationID, ferryID } = { voyageID: null, destinationID: null, ferryID: null }) {
    try {
      const addVoyageResponse = await fetch(
        "http://localhost:4321/voyages",
        {
          method: "POST",
          body: JSON.stringify({ voyageID, destinationID, ferryID }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (addVoyageResponse.status !== 200) {
        const addVoyageBody = await addVoyageResponse.json();
        return Promise.reject(addVoyageBody);
      }

      return {
        timestamp: new Date().toISOString(),
        message: `Добавлен рейс`,
      };
    } catch (err) {
      return Promise.reject({
        timestamp: new Date().toISOString(),
        statusCode: 0,
        message: err.message,
      });
    }
  } // addVoyage

  // add passenger
  // upd passenger
  // upd passengers (reorder)
  // delete passenger
  // transfer passenger
}
