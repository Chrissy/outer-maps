import Moment from 'moment';
import distance from '@turf/distance';
const moment = new Moment;
const key = 'aMjnYsZqxVmjzkbPYtHBVXUnYHUROvwS';

const get = path => {
  return fetch(`https://www.ncdc.noaa.gov/cdo-web/api/v2${path}`, {
    headers: new Headers({'token': key})
  }).then(response => response.json());
};

const getStation = ({dataSetID, stationID, date, endDate, dataTypeIDs}) => {
  return get(`/data?datasetid=${dataSetID}&stationid=${stationID}&startdate=2010-${date}&enddate=2010-${date}&datatypeid=${dataTypeIDs.join("&datatypeid=")}&limit=10&units=standard`).then(({results}) => {
    return results.reduce((r, v) => {
      return {...r, [v.datatype]: v.value}
    }, {});
  });
};

const getStations = ({x, y, dataSetID, dataTypeIDs, size = 0.2,}) => {
  return get(`/stations/?extent=${x - size},${y - size},${x + size},${y + size}&datasetid=${dataSetID}&datatypeid=${dataTypeIDs.join("&datatypeid=")}`).then(response => {
    if (response.results) {
      return response.results;
    } else if (size > 0.7) {
      return null;
    } else {
      return getStations({x, y, dataSetID, dataTypeIDs, size: size + 0.2});
    }
  });
};

const getBestStation = ({x, y, stations}) => {
  if (stations.length == 1) return stations[0];
  return stations.map(e => {
    return {...e, distance: distance([e.latitude, e.longitude], [x, y])}
  }).sort((a, b) => a.distance - b.distance)[0];
}

export default ({x, y, dataSetID, dataTypeIDs}) => {
  return getStations({x, y, dataSetID, dataTypeIDs}).then(stations => {
    if (!stations.length) return null;
    return getStation({
      stationID: getBestStation({x, y, stations}).id,
      date: moment.format("MM-DD"),
      dataSetID,
      dataTypeIDs
    });
  });
};
