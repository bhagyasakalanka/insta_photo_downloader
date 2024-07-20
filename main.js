
const urlScraper = require("./insta_url_scrapper").urlScrapper;

// Absolute path to the main directory (ex:- "C:/Users/User/Desktop/insta_photo_downloader/")
const dirAbsPath = "";

// Insta email (ex:- "example@email.com")
const insta_username = "";

// Insta pass (ex:- "password")
const insta_pass = "";

// username list ----- add new usernames -----
const usernames = [""];

(async () => {
  await urlScraper(
    usernames,
    insta_username,
    insta_pass,
    dirAbsPath
  );
  console.log("url scrape done");
  
})();
