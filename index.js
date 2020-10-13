require("dotenv").config();
const writeToTxt = require("./writeToTxt");

const crawler = require("./crawler");

const url =
  "https://www.facebook.com/groups/794171057388979/permalink/946220738850676/";

const main = async () => {
  console.log("Start crawl. Waiting...");
  try {
    const data = await crawler(url);

    // Write File
    await writeToTxt("data.txt", data);

    console.log("Completed");
  } catch (error) {
    console.log(error);
  }
};

main();
