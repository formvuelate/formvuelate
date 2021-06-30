/**
 * Node.js script to bundle the .d.ts files into a single output
 */

const dts = require("dts-bundle");
const path = require("path");

dts.bundle({
  name: "formvuelate",
  main: path.resolve(__dirname, "../src/types"),
  out: path.resolve(__dirname, "../dist/formvuelate.d.ts")
});
