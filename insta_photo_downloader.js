const puppeteer = require("puppeteer");
var fs = require("fs");
const readline = require("readline");

exports.downloader = async (inputFile) => {
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

  await page.goto("https://downloadgram.com/");

  const fileStream = fs.createReadStream(inputFile);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  for await (const line of rl) {
    var breakCount = 0;
    while (breakCount < 3) {
      breakCount++;
      try {
        const pages = await browser.pages();

        if (pages.length > 1) {
          for (let index = 0; index < pages.length; index++) {
            const element = pages[index];
            if (
              (await element.title()) !==
              "DownloadGram - Instagram photo, video and IGTV downloader online"
            ) {
              await element.close();
            }
          }
        }

        await page.waitForSelector("#dg-url", { timeout: 8000 });
        await page.click("#dg-url", { clickCount: 2 });
        await page.type("#dg-url", line);
        await page.click("#dg-submit");
        await page.waitForSelector("#results > div > a");
        await page.click("#results > div > a");

        break;
      } catch (error) {
        await page.goto("https://downloadgram.com/");
      }
    }
  }
  await browser.close();
};
