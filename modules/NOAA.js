import Moment from 'moment';
import distance from '@turf/distance';
const moment = new Moment;
const key = 'aMjnYsZqxVmjzkbPYtHBVXUnYHUROvwS';

const get = path => {
  return fetch(`https://www.ncdc.noaa.gov/cdo-web/api/v2${path}`, {
    headers: new Headers({'token': key})
  }).then(response => response.json());
};

const getData = ({dataSetID, stationID, date, endDate, dataTypeIDs}) => {
  return get(`/data?datasetid=${dataSetID}&stationid=${stationID}&startdate=2010-${date}&enddate=2010-${date}&datatypeid=${dataTypeIDs.join("&datatypeid=")}&limit=10&units=standard`).then(({results}) => {
    return results.reduce((r, v) => {
      return {...r, [v.datatype]: v}
    }, {});
  });
};

const getStations = ({x, y, dataSetID, size = 0.1,}) => {
  return get(`/stations/?extent=${x - size},${y - size},${x + size},${y + size}&datasetid=${dataSetID}`).then(response => {
    if (response.results) {
      return response.results;
    } else if (size > 0.6) {
      return null;
    } else {
      return getStations({x, y, dataSetID, size: size + 0.1});
    }
  });
};

export default ({x, y, dataSetID, dataTypeIDs}) => {
  return getStations({x, y, dataSetID}).then(stations => {
    if (!stations.length) return null;
    const station = stations.sort((a, b) => {
      return distance([a.x, a.y], [x, y]) - distance([b.x, b.y], [x, y]);
    })[0];
    return getData({
      stationID: station.id,
      date: moment.format("MM-DD"),
      dataSetID,
      dataTypeIDs,
    });
  });
};
