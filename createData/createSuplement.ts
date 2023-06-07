import * as dotenv from "dotenv";
import { Page } from "puppeteer";
import randomNumberBelow from "../utils/randomNumberBelow";
import writeErrorLog from "../utils/writeErrorLog";

dotenv.config();

const URL = `${process.env.APP_URL}/index.php/suplemen/form_terdata/1`;

export default async function createSuplement(page: Page) {
  for (const [index] of Array(100).entries()) {
    try {
      console.log(`Creating penerima suplement ${index + 1} of 100`);

      await fillForm(page);
    } catch (error) {
      if (!(error instanceof Error)) return;

      writeErrorLog(
        `Failed to create suplement\nMessage: ${error.message}`,
        "CREATE_SUPLEMENT"
      );
    }
  }
}

async function fillForm(page: Page) {
  await page.goto(URL);

  await page.waitForSelector('[id="select2-terdata-container"]');

  await page.click('[id="select2-terdata-container"]');
  await page.waitForSelector('[class="select2-results"] ul li');
  const [, ...optionsAnggota] = await page.$$(".select2-results ul li");
  const randomOptionsAnggotaIndex = randomNumberBelow(optionsAnggota.length);
  await optionsAnggota[randomOptionsAnggotaIndex].click();

  await page.waitForSelector('[id="select2-terdata-container"]');

  await page.click("button[type='submit']");
  await page.waitForSelector('[title="Tambah Data Warga"]');
}
