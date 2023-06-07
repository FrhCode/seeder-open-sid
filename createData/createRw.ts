import { faker } from "@faker-js/faker";
import { type Page } from "puppeteer";
import writeErrorLog from "../utils/writeErrorLog";
import generateRandomNumber from "../utils/generateRandomNumber";
import createRt from "./createRt";

import * as dotenv from "dotenv";
dotenv.config();

export default async function createRw(page: Page, count: number, URL: string) {
  await page.goto(URL);

  let existingRwNumbers: number[] = [];

  try {
    await page.waitForSelector("tbody tr:not(:first-child) td:nth-child(3)", {
      timeout: 500,
    });
    existingRwNumbers = await page
      .$$eval("tbody tr:not(:first-child) td:nth-child(3)", (tds) => {
        return tds.map((td) => td.innerHTML);
      })
      .then((value) => value.map((a) => parseInt(a)));
  } catch (error) {}

  for (let index = 0; index < count; index++) {
    try {
      console.log(`Creating RW ${index + 1} of ${count}`);

      await fillCreateRwForm(page, existingRwNumbers);
    } catch (error) {
      if (!(error instanceof Error)) return;

      index--;

      writeErrorLog(
        `Failed to create RW in index ${index + 1}\n${error.message}`,
        "CREATE_RW"
      );
    }
  }

  const [, ...createRtUrls] = await page.$$eval(
    'a.btn[title="Rincian Sub Wilayah RW"]',
    (anchors) => {
      return anchors.map((a) => (a as HTMLAnchorElement).href);
    }
  );

  const randomNumber = faker.number.int({ min: 5, max: 9 });
  for (const url of createRtUrls) {
    await createRt(page, randomNumber, url);
  }
}

async function fillCreateRwForm(page: Page, existingRwNumbers: number[]) {
  await Promise.all([
    page.click('[title="Tambah Data"]'),
    page.waitForNavigation({ waitUntil: "networkidle0", timeout: 10000 }),
  ]);

  const randomNumberExcludeExisting = generateRandomNumber(
    1,
    100,
    existingRwNumbers
  );

  await page.waitForSelector('[name="rw"]', { timeout: 500 });
  await page.type('[name="rw"]', randomNumberExcludeExisting.toString());

  await Promise.all([
    page.click('[type="submit"]'),
    page.waitForNavigation({ waitUntil: "networkidle0", timeout: 10000 }),
  ]);

  await page.waitForSelector('[title="Tambah Data"]', { timeout: 500 });
}
