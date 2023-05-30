import { faker } from "@faker-js/faker";
import { Page } from "puppeteer";

const URL = "http://localhost/sid/index.php/sid_core/form";

export default async function createDusun(page: Page) {
  await page.goto(URL);

  // nik
  await page.waitForSelector('input[name="dusun"]');
  await page.type('input[name="dusun"]', faker.location.city());

  // SUBMIT
  await Promise.all([
    page.click("button[type='submit']"),
    page.waitForNavigation({ waitUntil: "networkidle0", timeout: 2000 }),
  ]);
}
