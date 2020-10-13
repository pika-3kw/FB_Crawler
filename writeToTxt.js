const fs = require("fs");
const path = require("path");

/**
 *
 * @param {String} filename
 * @param {Array} data
 */

const writeToTxt = async (filename, data) => {
  try {
    fs.writeFileSync(path.join("output", filename), data.join("\n\n\n"));
  } catch (error) {
    console.log(error);
  }
};

module.exports = writeToTxt;
