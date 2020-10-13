const fs = require("fs");

const urlLogin = "https://vi-vn.facebook.com/login/";

const login = async (page) => {
  let cookies;

  // Try get cookies available
  try {
    cookies = fs.readFileSync("cookies.json");
    cookies = JSON.parse(cookies);
    await page.setCookie(...cookies);
  } catch (error) {
    console.log(error);
  }

  await page.goto(urlLogin);

  // Try To Login Facebook
  try {
    await page.type("#email", process.env.EMAIL);
    await page.type("#pass", process.env.PASS);
    await page.click("#loginbutton");

    await page.waitForNavigation();

    cookies = await page.cookies();

    fs.writeFile("cookies.json", JSON.stringify(cookies), function (err) {
      if (err) {
        return console.log(err);
      }
      console.log("The file was saved!");
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = login;
