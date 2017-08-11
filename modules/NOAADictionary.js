const conversions = {
  maxTemperature: "DLY-TMAX-NORMAL",
  minTemperature: "DLY-TMIN-NORMAL",
  chanceOfPercipitation: "DLY-PRCP-PCTALL-GE001HI",
  chanceOfHeavyPercipitation: "DLY-PRCP-PCTALL-GE050HI",
  chanceOfSnow: "DLY-SNOW-PCTALL-GE001TI",
  chanceOfHeavySnow: "DLY-SNOW-PCTALL-GE030TI",
  chanceOfSnowPack: "DLY-SNWD-PCTALL-GE001WI",
  chanceOfHeavySnowPack: "DLY-SNWD-PCTALL-GE010WI",
  normalDaily: "NORMAL_DLY"
}

export default (key) => conversions[key]
