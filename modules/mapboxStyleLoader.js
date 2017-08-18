const req = require.context("../styles", true, /\.json$/);
const base = req("./base.json");
const baseLayers = base.layers.map(l => req(`./${l}.json`));
const source = "composite"

export default Object.assign({}, base, {
  layers: [].concat(...baseLayers).map(l => {
    if (l.source && l.source == "$source") l.source = source;
    return l;
  }),
  sources: base["remote"]
});
