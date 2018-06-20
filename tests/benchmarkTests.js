const Benchmark = require("benchmark");
const getTrail = require("../modules/getTrail");
const getBoundary = require("../modules/getBoundary");
const createPool = require("../db/genericQuery").pool;

const pool = createPool();
const suite = new Benchmark.Suite();

suite
  .add("get trail", {
    fn: async deferred => {
      //current benchmark ~1.2ops/sec
      await getTrail(141044, pool);
      deferred.resolve();
    },
    defer: true
  })
  .add("get boundary", {
    fn: async deferred => {
      //current benchmark ~1.1ops/sec
      await getBoundary(1496, pool);
      deferred.resolve();
    },
    defer: true
  })
  .on("cycle", function(event) {
    console.log(String(event.target));
  })
  .on("complete", async () => {
    console.log("tests complete");
    await pool.end();
  })
  .run({ async: true });
