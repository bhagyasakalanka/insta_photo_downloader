const puppeteer = require("puppeteer");
var fs = require("fs");

exports.urlScrapper = async (
  usernames,
  maxImagePerUsername,
  outputFile,
  fb_email,
  fb_pass,
  dirAbsPath
) => {
  const args = ["--disable-setuid-sandbox", "--no-sandbox"];
  const options = {
    args,
    headless: false,
    ignoreHTTPSErrors: true,
    userDataDir: "./usrdir",
  };
  const browser = await puppeteer.launch(options);

  const page = await browser.newPage();

  await page.setViewport({
    width: 1000,
    height: 1000,
  });

  await page.goto("https://www.instagram.com/accounts/login");

  //   await page.click(
  //     "#react-root > section > main > div > div._2z6nI > article > div:nth-child(1) > div > div:nth-child(1) > div:nth-child(1)"
  //   );

  try {
    await page.waitForSelector(
      "#loginForm > div > div:nth-child(5) > button > span.KPnG0",
      { timeout: 10000 }
    );
    await page.click(
      "#loginForm > div > div:nth-child(5) > button > span.KPnG0"
    );
    await page.waitForSelector("#email", { timeout: 3000 });
    await page.type("#email", fb_email);
    await page.type("#pass", fb_pass);
    await page.click("#loginbutton");
  } catch (error) {
    await page.waitForSelector("body", { timeout: 15000 });
  }

  for (let index = 0; index < usernames.length; index++) {
    const username = usernames[index];
    try {
      await page.goto("https://www.instagram.com/" + username);

      let outterCount = 0;
      try {
        while (outterCount < Math.floor(maxImagePerUsername / 3)) {
          outterCount++;
          let innerCount = 0;
          while (innerCount < 3) {
            innerCount++;
            var photoSelector =
              "#react-root > section > main > div > div._2z6nI > article > div:nth-child(1) > div > div:nth-child(" +
              outterCount +
              ") > div:nth-child(" +
              innerCount +
              ")";
            await page.waitForSelector(photoSelector, { timeout: 8000 });
            await page.click(photoSelector);
            await page.waitForSelector(
              "body > div._2dDPU.CkGkG > div.zZYga > div > article > div.MEAGs > button > div > div > svg",
              { timeout: 8000 }
            );
            await page.click(
              "body > div._2dDPU.CkGkG > div.zZYga > div > article > div.MEAGs > button > div > div > svg"
            );
            const [button] = await page.$x(
              "//button[contains(., 'Copy Link')]",
              { timeout: 3000 }
            );
            if (button) {
              await button.click();
            }
            // await page.waitForSelector("Copy Link", { timeout: 3000 });
            // await page.click(
            //   "body > div.RnEpo.Yx5HN > div > div > div > div > button:nth-child(5)"
            // );
            await page.click(
              "body > div._2dDPU.CkGkG > div.Igw0E.IwRSH.eGOV_._4EzTm.BI4qX.qJPeX.fm1AK.TxciK.yiMZG > button > div > svg",
              { timeout: 4000 }
            );

            const page2 = await browser.newPage();
            await page2.setViewport({
              width: 1000,
              height: 1000,
            });
            await page2.goto("file://" + dirAbsPath + "/text-area.html");

            const input = await page2.$("#mytext");
            await input.focus();

            await page2.keyboard.down("Control");
            await page2.keyboard.press("V");
            await page2.keyboard.up("Control");

            const element = await page2.$("#mytext");

            const fileUrl = await page2.evaluate(
              (element) => element.value,
              element
            );

            fs.appendFile(outputFile, fileUrl + "\n", (err) => {
              if (err) console.log(err);
            });
            await page2.close();
          }
        }
      } catch (error) {
        console.log("all photos downloaded for the user: " + username);
      }
    } catch (error) {
      console.log("no access or no photo found for the user: " + username);
    }
  }
  await browser.close();
};
