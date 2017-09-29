import dateFormat from 'dateformat';
import distance from '@turf/distance';
const key = 'aMjnYsZqxVmjzkbPYtHBVXUnYHUROvwS';

const get = path => {
  return fetch(`https://www.ncdc.noaa.gov/cdo-web/api/v2${path}`, {
    headers: new Headers({'token': key})
  }).then(response => response.json());
};

const getStation = ({dataSetId, stationId, date, dataTypeIds}) => {
  return get(`/data?datasetid=${dataSetId}&stationid=${stationId}&startdate=2010-${date}&enddate=2010-${date}&datatypeid=${dataTypeIds.join("&datatypeid=")}&limit=10&units=standard`).then(({results}) => {
    return results.reduce((r, v) => {
      return {...r, [v.datatype]: v.value}
    }, {});
  });
};

const getStations = ({x, y, dataSetId, dataTypeIds, size = 10}) => {
  return get(`/stations/?extent=${x - size},${y - size},${x + size},${y + size}&datasetid=${dataSetId}&datatypeid=${dataTypeIds.join("&datatypeid=")}`).then(response => {
    if (response.results) {
      return response.results;
    } else if (size > 30) {
      return null;
    } else {
      return getStations({x, y, dataSetId, dataTypeIds, size: size + 0.2});
    }
  });
};

const getBestStation = ({x, y, stations}) => {
  if (stations.length == 1) return stations[0];
  return stations.map(e => {
    return {...e, distance: distance([e.latitude, e.longitude], [x, y])}
  }).sort((a, b) => a.distance - b.distance)[0];
}

const getDataFromNearestStation = ({x, y, dataSetId, dataTypeIds}) => {
  return getStations({x, y, dataSetId, dataTypeIds}).then(stations => {
    if (!stations.length) return null;
    return getStation({
      stationId: getBestStation({x, y, stations}).id,
      date: dateFormat(new Date(), "mm-dd"),
      dataSetId,
      dataTypeIds
    });
  });
};

export const getNoaaData = ({x, y, dataSetId, dataTypeIds, stationId}) => {
  if (stationId && stationId !== '') {
    return getStation({dataSetId, stationId: "GHCND:" + stationId, date: dateFormat(new Date(), "mm-dd"), dataTypeIds});
  } else {
    return getDataFromNearestStation({x, y, dataSetId, dataTypeIds});
  }
}
