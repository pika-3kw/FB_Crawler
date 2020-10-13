require("dotenv").config();

const fanpageCrawler = require("./fanpage/crawler");

const main = async () => {
  await fanpageCrawler();
};

main();
