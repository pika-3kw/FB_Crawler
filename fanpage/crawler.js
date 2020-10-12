const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");

const url = "https://www.facebook.com/xu.ngan.182/posts/135610794196030";

const urlLogin = "https://vi-vn.facebook.com/login/";

const element = {
  commentOrReply:
    ".stjgntxs.ni8dbmo4.l82x9zwi.uo3d90p7.h905i5nu.monazrh9 .d2edcug0.hpfvmrgz.qv66sw1b.c1et5uql.rrkovp55.a8c37x1j.keod5gw0.nxhoafnm.aigsh9s9.d3f4x2em.fe6kdd0r.mau55g9w.c8b282yb.iv3no6db.jq4qci2q.a3bd9o3v.knj5qynh.oo9gr5id",
  replyButton:
    ".oajrlxb2.bp9cbjyn.g5ia77u1.mtkw9kbi.tlpljxtp.qensuy8j.ppp5ayq2.goun2846.ccm00jje.s44p3ltw.mk2mc5f4.rt8b4zig.n8ej3o3l.agehan2d.sk4xxmp2.rq0escxv.nhd2j8a9.pq6dq46d.mg4g778l.btwxx1t3.g5gj957u.p7hjln8o.kvgmc6g5.cxmmr5t8.oygrvhab.hcukyx3x.tgvbjcpo.hpfvmrgz.jb3vyjys.p8fzw8mz.qt6c0cv9.a8nywdso.l9j0dhe7.i1ao9s8h.esuyzwwr.f1sip0of.du4w35lb.lzcic4wl.abiwlrkh.gpro0wi8.m9osqain.buofh1pr",
  tag:
    ".oajrlxb2.g5ia77u1.qu0x051f.esr5mh6w.e9989ue4.r7d6kgcz.rq0escxv.nhd2j8a9.nc684nl6.p7hjln8o.kvgmc6g5.cxmmr5t8.oygrvhab.hcukyx3x.jb3vyjys.rz4wbd8a.qt6c0cv9.a8nywdso.i1ao9s8h.esuyzwwr.f1sip0of.lzcic4wl.oo9gr5id.gpro0wi8.lrazzd5p",
};

const crawl = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });

  let cookies;
  try {
    cookies = fs.readFileSync("cookies.json");
    cookies = JSON.parse(cookies);
    await page.setCookie(...cookies);
  } catch (error) {
    console.log(error);
  }

  await page.goto(urlLogin);

  // Login To Facebook
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
  } catch (error) {}

  await page.goto(url);

  // Show All Reply
  const replyElem = element.replyButton;
  while (true) {
    try {
      await page.waitForSelector(replyElem, {
        timeout: 5000,
      });

      await page.evaluate(
        (replyElem) => document.querySelector(replyElem).click(),
        replyElem
      );
    } catch (e) {
      break;
    }
  }

  // Remove tag
  await page.$$eval(element.tag, (tags) =>
    tags.map((tag) => (tag.innerHTML = ""))
  );

  // Get Comments And Reply
  let listComment = await page.$$eval(element.commentOrReply, (comments) =>
    comments.map((comment) => comment.innerText.trim().replaceAll(" \n ", " "))
  );

  // Write File
  try {
    fs.writeFileSync(
      path.join("output", "text.txt"),
      listComment.join("\n\n\n")
    );
  } catch (error) {
    console.log(error);
  }

  console.log("Completed");

  await browser.close();
};

module.exports = crawl;
