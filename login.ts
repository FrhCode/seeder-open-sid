import { Page } from "puppeteer";

export default async function login(page: Page) {
  await page.goto("http://localhost/sidisa/index.php/siteman");

  // username
  await page.waitForSelector("input[name='username']");
  await page.type("input[name='username']", "admin");
  // passowrd
  await page.waitForSelector("input[name='password']");
  await page.type("input[name='password']", "indonesia123B$");

  // submit and navigate
  await Promise.all([
    page.click("button"),
    page.waitForNavigation({ waitUntil: "networkidle0" }),
  ]);
}
