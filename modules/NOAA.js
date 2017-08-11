import Moment from 'moment';
import distance from '@turf/distance';
const moment = new Moment;
const key = 'aMjnYsZqxVmjzkbPYtHBVXUnYHUROvwS';

const get = function(path) {
  return fetch(`https://www.ncdc.noaa.gov/cdo-web/api/v2${path}`, {
    headers: new Headers({'token': key})
  }).then(response => response.json())
  .then(data => data);
}

const getData = function({dataSetID, stationID, date, endDate, dataTypeIDs}) {
  return new Promise(function(resolve){
    get(`/data?datasetid=${dataSetID}&stationid=${stationID}&startdate=2010-${date}&enddate=2010-${date}&datatypeid=${dataTypeIDs.join("&datatypeid=")}&limit=10&units=standard`).then(({results}) => {
      resolve(results.reduce((r, v) => {
        return {...r, [v.datatype]: v}
      }, {}));
    });
  });
}

const getStation = function({x, y, dataSetID, size = 0.3}) {
  return get(`/stations/?extent=${x - size},${y - size},${x + size},${y + size}&datasetid=${dataSetID}`).then(function(response){
    return response.results.sort(function(a, b) {
      return distance([a.x, a.y], [x, y]) - distance([b.x, b.y], [x, y]);
    })[0];
  });
}

export default ({x, y, dataSetID, dataTypeIDs}) => {
  return getStation({x, y, dataSetID}).then(station => {
    if (station) return getData({
      stationID: station.id,
      date: moment.format("MM-DD"),
      dataSetID,
      dataTypeIDs,
    });
  });
}
