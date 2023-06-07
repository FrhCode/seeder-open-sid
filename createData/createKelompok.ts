import * as dotenv from "dotenv";
import { Page } from "puppeteer";
import randomNumberBelow from "../utils/randomNumberBelow";
import sleep from "../utils/sleep";
import writeErrorLog from "../utils/writeErrorLog";

dotenv.config();

const URL = `${process.env.APP_URL}/index.php/kelompok/form_anggota/1`;

export default async function createKelompok(page: Page) {
  for (const [index] of Array(100).entries()) {
    try {
      console.log(`Creating anggota kelompok ${index + 1} of 100`);

      await fillForm(page);
    } catch (error) {
      if (!(error instanceof Error)) return;

      writeErrorLog(
        `Failed to kelompok\nMessage: ${error.message}`,
        "CREATE_KELOMPOK"
      );
    }
  }
}

async function fillForm(page: Page) {
  await page.goto(URL);

  await page.waitForSelector('[id="select2-id_penduduk-container"]');

  await page.click('[id="select2-id_penduduk-container"]');
  await page.waitForSelector('[class="select2-results"] ul li');
  const [, ...optionsAnggota] = await page.$$(".select2-results ul li");
  const randomOptionsAnggotaIndex = randomNumberBelow(optionsAnggota.length);
  await optionsAnggota[randomOptionsAnggotaIndex].click();

  await page.click('[id="select2-jabatan-container"]');
  await page.waitForSelector('[class="select2-results"] ul li');
  const [, ...optionRole] = await page.$$(".select2-results ul li");
  await optionRole[optionRole.length - 1].click();

  await page.click("button[type='submit']");
  await page.waitForSelector('[id="select2-id_penduduk-container"]');
}
