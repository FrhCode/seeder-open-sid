import { Page } from "puppeteer";
import path from "path";
import fs from "fs";
import arrayElement from "../utils/arrayElement";
import { faker } from "@faker-js/faker";
import sleep from "../utils/sleep";

const URL = "http://localhost/sid/index.php/dokumen_sekretariat/form/2";

export default async function createSkKades(page: Page) {
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

  // tgl ditetapkan
  const date = faker.date.between({
    from: "1990-01-01T00:00:00.000Z",
    to: "2000-01-01T00:00:00.000Z",
  });
  const formatedDate = `${date.getDate().toString().padStart(2, "0")}-${date
    .getMonth()
    .toString()
    .padStart(2, "0")}-${date.getFullYear()}`;
  await page.waitForSelector('input[name="attr[tgl_kep_kades]"]');
  await page.type('input[name="attr[tgl_kep_kades]"]', formatedDate);

  await page.evaluate(() => {
    const element = document.querySelector(
      'input[name="attr[tgl_kep_kades]"]'
    ) as HTMLInputElement;

    element.value = "";
  });

  await page.type('input[name="attr[tgl_kep_kades]"]', formatedDate);

  // keterangan
  await page.waitForSelector('textarea[name="attr[keterangan]"]');
  await page.type('textarea[name="attr[keterangan]"]', faker.lorem.words());

  // SUBMIT;
  await Promise.all([
    page.click("button[type='submit']"),
    page.waitForNavigation({ waitUntil: "networkidle0" }),
  ]);
}