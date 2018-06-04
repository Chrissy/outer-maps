import {getWeather} from '../modules/getWeather';

const mockParams = {
  x: 48.57246675272445,
  y: -120.935243081307,
  stationId: "USC00457185",
  dataSetId: "NORMAL_DLY",
  dataTypeIds: [
    "DLY-TMAX-NORMAL",
    "DLY-TMIN-NORMAL",
    "DLY-PRCP-PCTALL-GE001HI",
    "DLY-PRCP-PCTALL-GE050HI"
  ]
}

let weather;

beforeAll(async () => {
  weather = await getWeather(mockParams);
});

test('weather has a max temp', () => {
  expect(typeof weather["DLY-TMAX-NORMAL"]).toBe('number');
});

test('weather has a min temp', () => {
  expect(typeof weather["DLY-TMIN-NORMAL"]).toBe('number');
});

test('weather has low precipitation', () => {
  expect(typeof weather["DLY-PRCP-PCTALL-GE001HI"]).toBe('number');
});

test('weather has low precipitation', () => {
  expect(typeof weather["DLY-PRCP-PCTALL-GE050HI"]).toBe('number');
});
