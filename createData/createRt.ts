import { type Page } from "puppeteer";
import writeErrorLog from "../utils/writeErrorLog";
import generateRandomNumber from "../utils/generateRandomNumber";

import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();

export default async function createRt(page: Page, count: number, URL: string) {
  await page.goto(URL);

  let existingRtNumbers: number[] = [];

  try {
    await page.waitForSelector("tbody tr td:nth-child(3)", {
      timeout: 500,
    });
    existingRtNumbers = await page
      .$$eval("tbody tr td:nth-child(3)", (tds) => {
        return tds.map((td) => td.innerHTML);
      })
      .then((value) => value.map((a) => parseInt(a)));
    // eslint-disable-next-line no-empty
  } catch (error) {}

  for (let index = 0; index < count; index++) {
    try {
      console.log(`Creating RT ${index + 1} of ${count}`);

      await fillRtForm(page, existingRtNumbers);
    } catch (error) {
      if (!(error instanceof Error)) return;

      index--;

      writeErrorLog(
        `Failed to create RT in index ${index + 1}\n${error.message}`,
        "CREATE_RT"
      );
    }
  }
}

async function fillRtForm(page: Page, existingRtNumbers: number[]) {
  await Promise.all([
    page.click('[title="Tambah Data"]'),
    page.waitForNavigation({ waitUntil: "networkidle0", timeout: 10000 }),
  ]);

  const randomNumberExcludeExisting = generateRandomNumber(
    1,
    100,
    existingRtNumbers
  );

  await page.waitForSelector('[name="rt"]', { timeout: 500 });
  await page.type('[name="rt"]', randomNumberExcludeExisting.toString());

  await Promise.all([
    page.click('[type="submit"]'),
    page.waitForNavigation({ waitUntil: "networkidle0", timeout: 10000 }),
  ]);

  await page.waitForSelector('[title="Tambah Data"]', { timeout: 500 });
}
