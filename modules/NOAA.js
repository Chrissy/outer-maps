import request from 'request';
import Moment from 'moment';

const key = 'aMjnYsZqxVmjzkbPYtHBVXUnYHUROvwS';

const getData = function({dataSetID = null, stationID = null, startDate="01-01", endDate="01-01", dataTypeIDs = []} = {}) {
  return get(`/data?datasetid=${dataSetID}&stationid=${stationID}&startdate=2010-${startDate}&enddate=2010-${endDate}&datatypeid=${dataTypeIDs.join("&datatypeid=")}&limit=10&units=standard`);
}

const getDataForToday = function({dataSetID = null, stationID = null, dataTypeIDs = []} = {}) {
  const moment = new Moment;
  const dateString = moment.format("MM-DD");
  return getData({startDate: dateString, endDate: dateString, dataSetID: dataSetID, stationID: stationID, dataTypeIDs: dataTypeIDs})
}

const getStation = function({x = null, y = null, dataSetID = null, size = 0.2}) {
  return new Promise(function(resolve){
    get(`/stations/?extent=${x - size},${y - size},${x + size},${y + size}&datasetid=${dataSetID}`).then(function(response){
      resolve(response.results.sort(function(a, b) {
        return distance(a, {x: x, y: y}) - distance(b, {x: x, y: y});
      })[0]);
    });
  });
}

const getDataFromNearestStation = function({x = null, y = null, dataSetID = "", dataTypeIDs = []} = {}) {
  return new Promise(function(resolve){
    getStation({x: x, y: y, dataSetID: dataSetID}).then(function(station) {
      if (station) {
        return resolve(getDataForToday({stationID: station.id, dataSetID: dataSetID, dataTypeIDs: dataTypeIDs}));
      }
    });
  });
}

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

const getDatasetsForStation = (stationID) => get(`/datasets?stationid=${stationID}`);

const getDataTypesForDataCategory = (dataCategoryID) => get(`/datatypes?datacategoryid=${dataCategoryID}`);

const getDataTypesForStationAndDataset = (stationID, dataSetID) => get(`/datatypes?stationid=${stationID}&datasetid=${dataSetID}&limit=100`);

const getDataCategories = () => get(`/datacategories?limit=50`);

const getDatasets = () => get("/datasets");

const getDataTypeInfo = (dataTypeId) => get(`/datatypes/${dataTypeId}`);

const getLocationCategories = () => get("/locationcategories");

const distance = function(point1, point2) {
  return Math.abs(point1.x - point2.x) + Math.abs(point1.y - point2.y);
}

export {getDataFromNearestStation}
