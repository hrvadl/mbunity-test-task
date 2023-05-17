const fs = require("fs");

const writeFile = (data, destination) => fs.writeFileSync(destination, data);
const readFile = (path, convertFn = null) =>
  convertFn && typeof convertFn === "function"
    ? convertFn(fs.readFileSync(path))
    : fs.readFileSync(path);

module.exports = {
  writeFile,
  readFile,
};
