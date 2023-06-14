import { type Page } from "puppeteer";

import * as dotenv from "dotenv";
import { faker } from "@faker-js/faker";
import writeErrorLog from "../utils/writeErrorLog";
import getFileFromDirectory from "../utils/getFileFromDirectory";
dotenv.config();

export default async function createSubGalery(
  page: Page,
  count = 100,
  URL: string
) {
  for (let index = 0; index < count; index++) {
    console.log(`Creating Image ${index + 1} of ${count}`);

    try {
      await page.goto(URL);

      await page.waitForSelector('[title="Tambah Album"]', { timeout: 500 });
      await page.click('[title="Tambah Album"]');

      await page.waitForSelector('[name="nama"]', { timeout: 2000 });

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

      await page.waitForSelector('input[type="file"]', { timeout: 1000 });
      const fileInput = await page.$('input[type="file"]');

      // Set the value of the file input to the file path
      await fileInput?.uploadFile(randomImgPath);

      await page.click('[type="submit"]');

      await page.waitForSelector('[title="Tambah Album"]', { timeout: 2000 });
    } catch (error) {
      if (!(error instanceof Error)) return;

      index--;

      writeErrorLog(
        `Failed to create Sub Galery in index ${index + 1}\n${error.message}`,
        "CREATE_SUB_GALERY"
      );
    }
  }
}
