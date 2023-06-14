import { type Page } from "puppeteer";

import * as dotenv from "dotenv";
import writeErrorLog from "../utils/writeErrorLog";
import { faker } from "@faker-js/faker";
import createSubGalery from "./createSubGalery";
import getFileFromDirectory from "../utils/getFileFromDirectory";
dotenv.config();

const URL = `${process.env.APP_URL}/index.php/gallery`;

export default async function createGalery(page: Page, count: number) {
  for (let index = 0; index < count; index++) {
    console.log(`Creating Image ${index + 1} of ${count}`);

    try {
      await page.goto(URL);

      await page.waitForSelector('[title="Tambah Artikel"]');
      await page.click('[title="Tambah Artikel"]');

      await page.waitForSelector('[name="nama"]');
      const text = faker.lorem.sentence({ max: 5, min: 3 });
      await page.$eval(
        'input[name="nama"]',
        (e, text) => {
          const input = e as HTMLInputElement;
          input.value = text;
        },
        text
      );

      const randomImgPath = getFileFromDirectory("article");

      await page.waitForSelector('input[type="file"]');
      const fileInput = await page.$('input[type="file"]');

      // Set the value of the file input to the file path
      await fileInput?.uploadFile(randomImgPath);

      await page.click('[type="submit"]');

      await page.waitForSelector('[title="Tambah Artikel"]', { timeout: 3000 });
    } catch (error) {
      if (!(error instanceof Error)) return;

      index--;

      writeErrorLog(
        `Failed to create Galery in index ${index + 1}\n${error.message}`,
        "CREATE_GALERY"
      );
    }
  }

  await page.waitForSelector('[name="per_page"]');
  await page.select('[name="per_page"]', "100");

  await page.waitForSelector('[title="Rincian Album"]');
  const subGaleryURLs = await page.$$eval('[title="Rincian Album"]', (el) => {
    const element = el as HTMLAnchorElement[];
    return element.map((a) => a.href);
  });

  for (const link of subGaleryURLs) {
    const randomNumber = faker.number.int({ min: 5, max: 10 });
    await createSubGalery(page, randomNumber, link).catch(() => {
      console.log("UNEXPECTED ERROR");
    });
  }
}
