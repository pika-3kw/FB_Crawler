const puppeteer = require("puppeteer");

const login = require("./login");

const element = {
  commentOrReply:
    ".stjgntxs.ni8dbmo4.l82x9zwi.uo3d90p7.h905i5nu.monazrh9 .d2edcug0.hpfvmrgz.qv66sw1b.c1et5uql.rrkovp55.a8c37x1j.keod5gw0.nxhoafnm.aigsh9s9.d3f4x2em.fe6kdd0r.mau55g9w.c8b282yb.iv3no6db.jq4qci2q.a3bd9o3v.knj5qynh.oo9gr5id",
  replyButton:
    ".oajrlxb2.bp9cbjyn.g5ia77u1.mtkw9kbi.tlpljxtp.qensuy8j.ppp5ayq2.goun2846.ccm00jje.s44p3ltw.mk2mc5f4.rt8b4zig.n8ej3o3l.agehan2d.sk4xxmp2.rq0escxv.nhd2j8a9.pq6dq46d.mg4g778l.btwxx1t3.g5gj957u.p7hjln8o.kvgmc6g5.cxmmr5t8.oygrvhab.hcukyx3x.tgvbjcpo.hpfvmrgz.jb3vyjys.p8fzw8mz.qt6c0cv9.a8nywdso.l9j0dhe7.i1ao9s8h.esuyzwwr.f1sip0of.du4w35lb.lzcic4wl.abiwlrkh.gpro0wi8.m9osqain.buofh1pr",
  tag:
    ".oajrlxb2.g5ia77u1.qu0x051f.esr5mh6w.e9989ue4.r7d6kgcz.rq0escxv.nhd2j8a9.nc684nl6.p7hjln8o.kvgmc6g5.cxmmr5t8.oygrvhab.hcukyx3x.jb3vyjys.rz4wbd8a.qt6c0cv9.a8nywdso.i1ao9s8h.esuyzwwr.f1sip0of.lzcic4wl.oo9gr5id.gpro0wi8.lrazzd5p",
  link:
    ".cwj9ozl2.tvmbv18p .oajrlxb2.g5ia77u1.qu0x051f.esr5mh6w.e9989ue4.r7d6kgcz.rq0escxv.nhd2j8a9.nc684nl6.p7hjln8o.kvgmc6g5.cxmmr5t8.oygrvhab.hcukyx3x.jb3vyjys.rz4wbd8a.qt6c0cv9.a8nywdso.i1ao9s8h.esuyzwwr.f1sip0of.lzcic4wl.py34i1dx.gpro0wi8",
};

const crawl = async (url) => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });

  await login(page);

  await page.goto(url);

  // Show All Reply

  const replyElem = element.replyButton;

  while (true) {
    try {
      await page.waitForSelector(replyElem, {
        timeout: 5000,
      });

      await page.evaluate((replyElem) => {
        const replyButton = document.querySelector(replyElem);
        if (replyButton.innerText.includes("Ẩn")) {
          replyButton.parentNode.removeChild(replyButton);
          return;
        }

        return replyButton.click();
      }, replyElem);
    } catch (e) {
      break;
    }
  }

  // Remove tag
  await page.$$eval(element.tag, (tags) =>
    tags.map((tag) => (tag.innerHTML = ""))
  );

  // Remove link
  await page.$$eval(element.link, (links) =>
    links.map((links) => (link.innerHTML = ""))
  );

  // Get Comments And Reply
  let listComment = await page.$$eval(element.commentOrReply, (comments) =>
    comments.map((comment) => comment.innerText.trim().replaceAll(" \n ", " "))
  );

  await browser.close();

  return listComment;
};

module.exports = crawl;
