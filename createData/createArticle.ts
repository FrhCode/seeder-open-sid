import { faker } from "@faker-js/faker";
import { Page } from "puppeteer";
import sleep from "../utils/sleep";
import path from "path";
import fs, { link } from "fs";
import arrayElement from "../utils/arrayElement";
import writeErrorLog from "../utils/writeErrorLog";

import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();

const URL = `${process.env.APP_URL}/index.php/web`;

async function getArticleCreateLink(page: Page) {
  const [a, ul, b] = await page.$$(".nav.nav-pills.nav-stacked");

  const link = await ul.evaluate((ul) => {
    const anchorElement = ul.querySelectorAll("a");

    const link: string[] = [];

    anchorElement.forEach((a) => {
      link.push(a.href);
    });

    return link;
  });

  link.pop();

  return link;
}

async function generateArticle(page: Page, link: string) {
  const randomNumber = faker.number.int({ min: 30, max: 50 });
  for (let index = 0; index < randomNumber; index++) {
    try {
      console.log(link, { count: randomNumber, currentAction: index });

      await page.goto(link);

      await page.waitForSelector(
        ".btn.btn-social.btn-flat.btn-success.btn-sm.btn-sm.visible-xs-block.visible-sm-inline-block.visible-md-inline-block.visible-lg-inline-block"
      );
      await page.click(
        ".btn.btn-social.btn-flat.btn-success.btn-sm.btn-sm.visible-xs-block.visible-sm-inline-block.visible-md-inline-block.visible-lg-inline-block"
      );

      await page.waitForSelector('input[name="judul"]');
      await page.type('input[name="judul"]', faker.lorem.text());

      const articleFolder = path.join(process.cwd(), "assets", "person");

      const listImg = fs
        .readdirSync(articleFolder)
        .filter((file) => new RegExp(".(jpe?g|png)$$", "gi").exec(file));

      const randomImgPath = path.join(articleFolder, arrayElement(listImg));

      // FOTO
      // upload document
      const elementHandle = await page.$('input[type="file"][name="gambar"]');
      await elementHandle?.uploadFile(randomImgPath);

      await page.waitForSelector("iframe");

      await sleep(1000);

      const randomArrayText: string[] = [];
      const paragraphsCount = faker.number.int({ min: 10, max: 20 });

      for (let index = 0; index < paragraphsCount; index++) {
        randomArrayText.push(faker.lorem.paragraph({ min: 20, max: 40 }));
      }

      await page.evaluate((randomArrayText) => {
        const body = document
          .querySelector("iframe")!
          .contentDocument?.querySelector("body");

        const textArray = randomArrayText.map((text) => {
          const pTag = document.createElement("p");
          pTag.innerText = text;

          return pTag;
        });

        while (body?.lastElementChild) {
          body.removeChild(body.lastElementChild);
        }

        body?.append(...textArray);
      }, randomArrayText);

      await Promise.all([
        page.click("button[type='submit']"),
        page.waitForNavigation({ waitUntil: "networkidle0", timeout: 4000 }),
      ]);
    } catch (error: any) {
      index--;

      await writeErrorLog(
        `Failed to create article in ${link} index ${index + 1}\n${
          error.message
        }`,
        "CREATE_ARTICLE"
      );
    }
  }
}

export default async function createArticle(page: Page) {
  await page.goto(URL);

  const links = await getArticleCreateLink(page);
  // await generateArticle(page, links[0]);

  // links.forEach(async (link) => {
  // });

  for (let index = 0; index < links.length; index++) {
    const link = links[index];
    await generateArticle(page, link);
  }
}
