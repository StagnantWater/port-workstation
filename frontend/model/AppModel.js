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
  } // checkFerryAssignment

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

  static async deleteVoyage({ voyageID } = { voyageID: null }) {
    try {
      const deleteVoyageResponse = await fetch(`http://localhost:4321/voyages/${voyageID}`, {
        method: "DELETE",
      });

      if (deleteVoyageResponse.status !== 200) {
        const deleteVoyageBody = await deleteVoyageResponse.json();
        return Promise.reject(deleteVoyageBody);
      }

      return {
        timestamp: new Date().toISOString(),
        message: `Рейс удален`,
      };
    } catch (err) {
      return Promise.reject({
        timestamp: new Date().toISOString(),
        statusCode: 0,
        message: err.message,
      });
    }
  } // deleteVoyage

  static async updateVoyage({ voyageID, destinationID } = { voyageID: null, destinationID: null }) {
    try {
      const updateVoyageResponse = await fetch(
        `http://localhost:4321/voyages/${voyageID}`,
        {
          method: "PATCH",
          body: JSON.stringify({ destinationID }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (updateVoyageResponse.status !== 200) {
        const updateVoyageBody = await updateVoyageResponse.json();
        return Promise.reject(updateVoyageBody);
      }

      return {
        timestamp: new Date().toISOString(),
        message: `Рейс изменен`,
      };
    } catch (err) {
      return Promise.reject({
        timestamp: new Date().toISOString(),
        statusCode: 0,
        message: err.message,
      });
    }
  } // updateVoyage

  static async addPassenger({ passengerID, type, name, size, voyageID } = { passengerID: null, type: null, name: null, size: null, voyageID: null }) {
    try {
      const addPassengerResponse = await fetch("http://localhost:4321/passengers", {
        method: "POST",
        body: JSON.stringify({ passengerID, type, name, size, voyageID }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (addPassengerResponse.status !== 200) {
        const addPassengerBody = await addPassengerResponse.json();
        return Promise.reject(addPassengerBody);
      }

      return {
        timestamp: new Date().toISOString(),
        message: `Груз '${name}' был успешно добавлен`,
      };
    } catch (err) {
      return Promise.reject({
        timestamp: new Date().toISOString(),
        statusCode: 0,
        message: err.message,
      });
    }
  } // addPassenger

  static async deletePassenger({ passengerID } = { passengerID: null }) {
    try {
      const deletePassengerResponse = await fetch(`http://localhost:4321/passengers/${passengerID}`, {
        method: "DELETE",
      });

      if (deletePassengerResponse.status !== 200) {
        const deletePassengerBody = await deletePassengerResponse.json();
        return Promise.reject(deletePassengerBody);
      }

      return {
        timestamp: new Date().toISOString(),
        message: `Рейс удален`,
      };
    } catch (err) {
      return Promise.reject({
        timestamp: new Date().toISOString(),
        statusCode: 0,
        message: err.message,
      });
    }
  } // deletePassenger

  static async movePassenger({ passengerID, voyageID } = { passengerID: null, voyageID: null }) {
    try {
      const movePassengerResponse = await fetch(
        `http://localhost:4321/passengers/${passengerID}`,
        {
          method: "PATCH",
          body: JSON.stringify({ voyageID }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (movePassengerResponse.status !== 200) {
        const movePassengerBody = await movePassengerResponse.json();
        return Promise.reject(movePassengerBody);
      }

      return {
        timestamp: new Date().toISOString(),
        message: `Груз перемещен`,
      };
    } catch (err) {
      return Promise.reject({
        timestamp: new Date().toISOString(),
        statusCode: 0,
        message: err.message,
      });
    }
  } // movePassenger
}
