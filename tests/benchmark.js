const Benchmark = require('benchmark');
const getTrail = require('../modules/getTrail');
const createPool = require('../modules/genericQuery').pool;

const pool = createPool();
const suite = new Benchmark.Suite;

suite.add("get trail", async () => {
  await getTrail(141044, pool)
}).on('cycle', function(event) {
  console.log(String(event.target));
}).on('complete', async () => {
  console.log("benchmark tests complete")
  await pool.end();
}).run({'async': true})
