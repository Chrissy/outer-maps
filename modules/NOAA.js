import Moment from 'moment';

const key = 'aMjnYsZqxVmjzkbPYtHBVXUnYHUROvwS';

const getData = function({dataSetID, stationID, startDate="01-01", endDate="01-01", dataTypeIDs = {}} = {}) {
  return new Promise(function(resolve){
    get(`/data?datasetid=${dataSetID}&stationid=${stationID}&startdate=2010-${startDate}&enddate=2010-${endDate}&datatypeid=${Object.values(dataTypeIDs).join("&datatypeid=")}&limit=10&units=standard`).then((response) => {
      let newObj = {};
      for (var [key, value] of Object.entries(dataTypeIDs)) {
        newObj[key] = findByDatatype(value, response.results)
      };
      resolve(newObj);
    });
  });
}

const getDataForToday = function({dataSetID, stationID, dataTypeIDs = {}} = {}) {
  const moment = new Moment;
  const dateString = moment.format("MM-DD");
  return getData({startDate: dateString, endDate: dateString, dataSetID: dataSetID, stationID: stationID, dataTypeIDs: dataTypeIDs})
}

const getStation = function({x, y, dataSetID, size = 0.3}) {
  return get(`/stations/?extent=${x - size},${y - size},${x + size},${y + size}&datasetid=${dataSetID}`).then(function(response){
    return response.results.sort(function(a, b) {
      return distance(a, {x: x, y: y}) - distance(b, {x: x, y: y});
    })[0];
  });
}

const getDataFromNearestStation = function({x, y, dataSetID = "", dataTypeIDs = {}} = {}) {
  return getStation({x: x, y: y, dataSetID: dataSetID}).then(station => {
    if (station) {
      return getDataForToday({stationID: station.id, dataSetID: dataSetID, dataTypeIDs: dataTypeIDs});
    }
  });
}

const get = function(path) {
  return fetch(`https://www.ncdc.noaa.gov/cdo-web/api/v2${path}`, {
    headers: new Headers({'token': key})
  }).then(response => response.json())
  .then(data => data);
}

const findByDatatype = (datatype, data) => {
  return (data.find(node => node.datatype == datatype) || {}).value || "unknown";
}

const convertToPercent = (integer) => parseInt(integer/10);

const distance = (point1, point2) => Math.abs(point1.x - point2.x) + Math.abs(point1.y - point2.y);

export {getDataFromNearestStation, convertToPercent}
