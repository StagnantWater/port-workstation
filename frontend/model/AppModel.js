export default class AppModel {
  static async getVoyages() {
    try {
      const getVoyagesResponse = await fetch(
        "http://localhost:4321/getvoyages"
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
        "http://localhost:4321/getdestinations"
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
        "http://localhost:4321/getferries"
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
          method: "POST",
          // body: JSON.stringify({ ferryID }),
          // headers: {
          //   "Content-Type": "application/json",
          // },
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

  // add voyage
  // add passenger
  // upd passenger
  // upd passengers (reorder)
  // delete passenger
  // transfer passenger
}
