import { faker } from "@faker-js/faker";
import { Page } from "puppeteer";

const URL = `${process.env.APP_URL}/index.php/kategori/form`;
const CATEGORY_COUNT = 5;

export default async function createArticleCategory(page: Page) {
  for (let index = 0; index < CATEGORY_COUNT; index++) {
    console.log(
      `Creating Article Category index ${index + 1} of ${CATEGORY_COUNT}`
    );

    try {
      await page.goto(URL);

      const randomNumber = faker.number.int({ min: 2, max: 6 });

      await page.type(
        '[name="kategori"]',
        faker.word.words({ count: randomNumber })
      );

      await page.click('[type="submit"]');

      await page.waitForSelector('[title="Tambah Kategori Baru"]', {
        timeout: 1000,
      });
    } catch (error) {
      index--;
    }
  }
}
