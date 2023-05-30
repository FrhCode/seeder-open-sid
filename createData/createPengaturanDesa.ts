import { Page } from "puppeteer";
import fs from "fs";
import path from "path";
import arrayElement from "../utils/arrayElement";
import { faker } from "@faker-js/faker";

const URL = "http://localhost/sid/index.php/dokumen_sekretariat/form/3";

export default async function createPengaturanDesa(page: Page) {
  const pdfFolder = path.join(process.cwd(), "assets", "pdf");

  const listPdf = fs
    .readdirSync(pdfFolder)
    .filter((file) => new RegExp(".*.pdf$", "gi").exec(file));

  const randomPdfPath = path.join(pdfFolder, arrayElement(listPdf));

  await page.goto(URL);

  // nama
  await page.waitForSelector('input[name="nama"]');
  await page.type('input[name="nama"]', faker.lorem.words());

  // upload document
  const elementHandle = await page.$('input[name="satuan"][type="file"]');
  await elementHandle?.uploadFile(randomPdfPath);

  // tipe
  await page.waitForSelector(".select2-selection.select2-selection--single");
  await page.click(".select2-selection.select2-selection--single");
  await page.waitForSelector(".select2-results li");
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
  await page.waitForSelector('input[name="attr[tgl_ditetapkan]"]');

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
    page.waitForNavigation({ waitUntil: "networkidle0", timeout: 2000 }),
  ]);
}
