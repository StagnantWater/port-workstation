export default class AppModel {
  static async getVoyages() {
    try {
      const getVoyagesResponse = await fetch("http://localhost:4321/getvoyages");
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

  // add voyage
  // add passenger
  // upd passenger
  // upd passengers (reorder)
  // delete passenger
  // transfer passenger
}
