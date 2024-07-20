const puppeteer = require("puppeteer");
const fs = require("fs");
const https = require('https');

exports.urlScrapper = async (
  usernames,
  insta_username,
  insta_pass,
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


  // Function to download image from URL
  const downloadImage = (url, filePath) => {
    return new Promise((resolve, reject) => {
      const file = fs.createWriteStream(filePath);
      https.get(url, response => {
        response.pipe(file);
        file.on('finish', () => {
          file.close(resolve(filePath));
        });
      }).on('error', error => {
        fs.unlink(filePath, () => reject(error)); // Delete the file async if an error occurs
      });
    });
  };

  try {
    
    await page.waitForSelector("#loginForm > div > div:nth-child(1) > div > label > input", { timeout: 6000 });
    await page.locator("#loginForm > div > div:nth-child(1) > div > label > input").fill(insta_username);
    await page.locator("#loginForm > div > div:nth-child(2) > div > label > input").fill(insta_pass);
    await page.locator("#loginForm > div > div:nth-child(3) > button > div").click();
    // Dummy wait
    try {
      await page.waitForSelector('::-p-xpath//*[@id="mount_0_0_c6"]/div/div/div[2]/div/div/div[1]/div[2]/div/div[2]/section/main/div/header/section/div[1]/div[1]/a/h2)', {timeout: 10000});
    } catch (error) {
      // Do nothing
    }
  } catch (error) {
    await page.waitForSelector("body", { timeout: 15000 });
  }

  for (let index = 0; index < usernames.length; index++) {
    const username = usernames[index];
    try {
      await page.goto("https://www.instagram.com/" + username);

      try {
        
            try {
              await page.waitForSelector('::-p-xpath//*[@id="mount_0_0_c6"]/div/div/div[2]/div/div/div[1]/div[2]/div/div[2]/section/main/div/header/section/div[1]/div[1]/a/h2)', {timeout: 10000});
            } catch (error) {
              // Do nothing
            }
            await page.waitForSelector('img');

            // Extract image URLs
            const imgUrls = await page.$$eval('img', imgs => imgs.map(img => img.src));
            for (let i = 2; i < imgUrls.length; i++) {
              console.log(imgUrls[i])
              let imageName = dirAbsPath + username + "_" + (i - 2) + ".jpg";
              console.log(imageName)
              downloadImage(imgUrls[i],imageName)
                .then(downloadedFilePath => {
                  console.log(`Image downloaded to ${downloadedFilePath}`);
                })
                .catch(error => {
                  console.error(`Error downloading image: ${error}`);
                });
            };

      } catch (error) {
        console.error(error)
        console.log("all photos downloaded for the user: " + username);x
      }
    } catch (error) {
      console.log("no access or no photo found for the user: " + username);
    }
  }
  await browser.close();
};
