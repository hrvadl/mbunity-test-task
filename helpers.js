const fs = require("fs");

const writeFile = (data, destination) => fs.writeFileSync(destination, data);
const readFile = (path) => fs.readFileSync(path);

module.exports = {
  writeFile,
  readFile,
};
