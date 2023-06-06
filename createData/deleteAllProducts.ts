import { type Page } from "puppeteer";
import * as dotenv from "dotenv";
import { PendingXHR } from "pending-xhr-puppeteer";
import sleep from "../utils/sleep";
dotenv.config();

const URL = `${process.env.APP_URL}/index.php/lapak_admin/produk`;

export default async function deleteAllProducts(page: Page) {
  // console.log("GOTO")
  await page.goto(URL);
  // console.log("BERES GOTO")
  const pendingXHR = new PendingXHR(page);

  // console.log("SELECT SEARCH")
  await page.waitForSelector('[name="tabel-produk_length"]');
  // console.log("SELECT FOUND")
  // console.log("SELECT VALUE")
  await page.select('[name="tabel-produk_length"]', "100");
  // console.log("SELECT VALUE DONE")
  // console.log("XHR")
  await pendingXHR.waitForAllXhrFinished();

  // console.log("BERES XHR")

  await page.click('[id="checkall"]');
  await page.click('[title="Hapus Data"]');
  await sleep(500);
  await page.click('[id="ok-delete"]');
}
