import { faker } from "@faker-js/faker";
import { ElementHandle, Page } from "puppeteer";
import sleep from "../utils/sleep";
import writeErrorLog from "../utils/writeErrorLog";
import generateRandomNumber from "../utils/generateRandomNumber";

import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();

const URL = `${process.env.APP_URL}/index.php/sid_core`;

export default async function deleteAllDusun(page: Page) {
  await page.goto(URL);

  let deleteBtn = await page.$('[title="Hapus"]');

  if (!deleteBtn) return;

  await deleteBtn.click();
  await page.waitForSelector('[id="ok-delete"]');

  await page.$eval('[id="ok-delete"]', (el) => {
    const element = el as HTMLButtonElement;
    element.click();
  });

  deleteBtn = await page.$('[title="Hapus"]');
  if (deleteBtn) {
    deleteAllDusun(page);
  }
}
