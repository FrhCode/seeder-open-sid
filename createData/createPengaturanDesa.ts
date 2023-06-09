import { type Page } from "puppeteer";
import { faker } from "@faker-js/faker";
import writeErrorLog from "../utils/writeErrorLog";

import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import getFileFromDirectory from "../utils/getFileFromDirectory";
dotenv.config();

const URL = `${process.env.APP_URL}/index.php/dokumen_sekretariat/form/3`;

export default async function createPengaturanDesa(page: Page, count: number) {
  for (let index = 0; index < count; index++) {
    console.log(`Creating Pengatura Desa ${index + 1} of ${count}`);
    const randomPdfPath = getFileFromDirectory("pdf");

    try {
      await fillCreatePengaturanDesa(page, randomPdfPath);
    } catch (error) {
      if (!(error instanceof Error)) return;

      index--;

      writeErrorLog(
        `Failed to create Pengaturan Desa in index ${index + 1}\n${
          error.message
        }`,
        "CREATE_PENGATURAN_DESA"
      );
    }
  }
}

async function fillCreatePengaturanDesa(page: Page, randomPdfPath: string) {
  await page.goto(URL);

  // nama
  await page.waitForSelector('input[name="nama"]', { timeout: 500 });
  await page.type('input[name="nama"]', faker.lorem.words());

  // upload document
  const elementHandle = await page.$('input[name="satuan"][type="file"]');
  await elementHandle?.uploadFile(randomPdfPath);

  // tipe
  await page.waitForSelector(".select2-selection.select2-selection--single", {
    timeout: 500,
  });
  await page.click(".select2-selection.select2-selection--single");
  await page.waitForSelector(".select2-results li", { timeout: 500 });
  const valid = await page.$$(".select2-results li");
  const randomIndex = faker.number.int({ min: 1, max: 3 });
  await valid[randomIndex].click();

  // tgl ditetapkan
  const date = faker.date.between({
    from: "1990-01-01T00:00:00.000Z",
    to: "2000-01-01T00:00:00.000Z",
  });
  const formatedDate = `${date.getDate().toString().padStart(2, "0")}-${date
    .getMonth()
    .toString()
    .padStart(2, "0")}-${date.getFullYear()}`;
  await page.waitForSelector('input[name="attr[tgl_ditetapkan]"]', {
    timeout: 500,
  });

  await page.evaluate(() => {
    const element = document.querySelector(
      'input[name="attr[tgl_ditetapkan]"]'
    ) as HTMLInputElement;

    element.value = "";
  });

  await page.type('input[name="attr[tgl_ditetapkan]"]', formatedDate);
  // const dateInput = await page.$('input[name="attr[tgl_ditetapkan]"]');
  // dateInput?.click({ count: 4 });
  // await page.type('input[name="attr[tgl_ditetapkan]"]', "");

  // SUBMIT;
  await Promise.all([
    page.click("button[type='submit']"),
    page.waitForNavigation({ waitUntil: "networkidle0", timeout: 10000 }),
  ]);

  await page.waitForSelector('[title="Tambah Menu Baru"]', { timeout: 500 });
}
