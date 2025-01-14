// This is the standard test for AS-Covers.
// If it fails, something was changed that broke it.
// To add new checks, just copy-and-paste coverReport.json to coverReportSnapshot.json.

const loader = require("@assemblyscript/loader");
const fs = require("fs");
const { Covers } = require("../packages/glue/lib/index");
const covers = new Covers();
const Linecol = require('line-column')

const wasmModule = loader.instantiateSync(
  fs.readFileSync("./output/output.wasm"),
  covers.installImports({})
);
covers.registerLoader(wasmModule);

wasmModule.exports._start();

const JSONreport = JSON.stringify(covers.toJSON(), null, 2)

const resultSnapShot = fs.readFileSync('./output/coverReportSnapshot.json').toString()

const linecol = Linecol(resultSnapShot)

for (let i = 0; i < resultSnapShot.length; i++) {

  if (JSONreport[i] !== resultSnapShot[i]) {
    const lc = linecol.fromIndex(i+1)
    throw new Error(`Result Failed at ./output/coverReport.json:${lc.line}:${lc.col}`)
  }

}

if (resultSnapShot === JSONreport) {
    console.log('Test Result: Passed.')
} else {
  console.log('Test Result: Failed.')
}

fs.writeFileSync(
  "./output/coverReport.json",
  JSONreport
);

const output = covers.stringify();
process.stdout.write(output);
