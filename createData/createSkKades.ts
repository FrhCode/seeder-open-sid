import { type Page } from "puppeteer";
import { faker } from "@faker-js/faker";
import writeErrorLog from "../utils/writeErrorLog";

import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import getFileFromDirectory from "../utils/getFileFromDirectory";
dotenv.config();

const URL = `${process.env.APP_URL}/index.php/dokumen_sekretariat/form/2`;

export default async function createSkKades(page: Page, count: number) {
  for (let index = 0; index < count; index++) {
    console.log(`Creating SK Kades ${index + 1} of ${count}`);
    const randomPdfPath = getFileFromDirectory("pdf");

    try {
      await fillCreateSkKadesForm(page, randomPdfPath);
    } catch (error) {
      if (!(error instanceof Error)) return;

      index--;

      writeErrorLog(
        `Failed to create sk kades in index ${index + 1}\n${error.message}`,
        "CREATE_SK_KADES"
      );
    }
  }
}

async function fillCreateSkKadesForm(page: Page, randomPdfPath: string) {
  await page.goto(URL);

  // nama
  await page.waitForSelector('input[name="nama"]', { timeout: 500 });
  await page.$eval(
    'input[name="nama"]',
    (e, text) => {
      e.value = text;
    },
    faker.lorem.words()
  );

  // upload document
  const elementHandle = await page.$('input[name="satuan"][type="file"]');
  await elementHandle?.uploadFile(randomPdfPath);

  // tgl ditetapkan
  const date = faker.date.between({
    from: "1990-01-01T00:00:00.000Z",
    to: "2000-01-01T00:00:00.000Z",
  });
  const formatedDate = `${date.getDate().toString().padStart(2, "0")}-${date
    .getMonth()
    .toString()
    .padStart(2, "0")}-${date.getFullYear()}`;
  await page.waitForSelector('input[name="attr[tgl_kep_kades]"]', {
    timeout: 500,
  });
  await page.type('input[name="attr[tgl_kep_kades]"]', formatedDate);

  await page.evaluate(() => {
    const element = document.querySelector(
      'input[name="attr[tgl_kep_kades]"]'
    ) as HTMLInputElement;

    element.value = "";
  });

  await page.type('input[name="attr[tgl_kep_kades]"]', formatedDate);

  // keterangan
  await page.waitForSelector('textarea[name="attr[keterangan]"]', {
    timeout: 500,
  });
  await page.$eval(
    'textarea[name="attr[keterangan]"]',
    (e, text) => {
      e.value = text;
    },
    faker.lorem.words()
  );

  // SUBMIT;
  await Promise.all([
    page.click("button[type='submit']"),
    page.waitForNavigation({ waitUntil: "networkidle0", timeout: 10000 }),
  ]);

  await page.waitForSelector('[title="Tambah Menu Baru"]', { timeout: 500 });
}
