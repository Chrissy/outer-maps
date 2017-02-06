import request from 'request';
import Moment from 'moment';

const key = 'aMjnYsZqxVmjzkbPYtHBVXUnYHUROvwS';

export default class NOAA {

  getData({dataSetID = null, stationID = null, startDate="01-01", endDate="01-01", dataTypeIDs = []} = {}) {
    return get(`/data?datasetid=${dataSetID}&stationid=${stationID}&startdate=2010-${startDate}&enddate=2010-${endDate}&datatypeid=${dataTypeIDs.join("&datatypeid=")}&limit=10&units=standard`);
  }

  getDataForToday({dataSetID = null, stationID = null, dataTypeIDs = []} = {}) {
    const moment = new Moment;
    const dateString = moment.format("MM-DD");
    return this.getData({startDate: dateString, endDate: dateString, dataSetID: dataSetID, stationID: stationID, dataTypeIDs: dataTypeIDs})
  }

  getStation({x = null, y = null, dataSetID = null, size = 0.2}) {
    return new Promise(function(resolve){
      get(`/stations/?extent=${x - size},${y - size},${x + size},${y + size}&datasetid=${dataSetID}`).then(function(response){
        resolve(response.results.sort(function(a, b) {
          return distance(a, {x: x, y: y}) - distance(b, {x: x, y: y});
        })[0]);
      });
    });
  }

  getDataFromNearestStation({x = null, y = null, dataSetID = "", dataTypeIDs = []} = {}) {
    return new Promise(function(resolve){
      this.getStation({x: x, y: y, dataSetID: dataSetID}).then(function(station) {
        if (station) {
          return resolve(this.getDataForToday({stationID: station.id, dataSetID: dataSetID, dataTypeIDs: dataTypeIDs}));
        }
      }.bind(this));
    }.bind(this));
  }

  getDatasetsForStation(stationID) {
    return get(`/datasets?stationid=${stationID}`);
  }

  getDataTypesForDataCategory(dataCategoryID) {
    return get(`/datatypes?datacategoryid=${dataCategoryID}`);
  }

  getDataTypesForStationAndDataset(stationID, dataSetID) {
    return get(`/datatypes?stationid=${stationID}&datasetid=${dataSetID}&limit=100`);
  }

  getDataCategories() {
    return get(`/datacategories?limit=50`);
  }

  getDatasets() {
    return get("/datasets");
  }

  getDataTypeInfo(dataTypeId) {
    return get(`/datatypes/${dataTypeId}`);
  }

  getLocationCategories() {
    return get("/locationcategories");
  }
};

const get = function(path) {
  return new Promise(function(resolve, reject) {
    request({
      url:`https://www.ncdc.noaa.gov/cdo-web/api/v2${path}`,
      headers: { 'token': key }
    }, function(error, response, body) {
      resolve(JSON.parse(response.body));
    });
  });
}

const distance = function(point1, point2) {
  return Math.abs(point1.x - point2.x) + Math.abs(point1.y - point2.y);
}
