import puppeteer, { Page } from "puppeteer";
import path from "path";
import fs from "fs";
import invariant from "tiny-invariant";
import login from "./login";
import createPenduduk from "./createData/createPenduduk";
import * as dotenv from "dotenv";
import createPengaturanDesa from "./createData/createPengaturanDesa";
import createSkKades from "./createData/createSkKades";
import createArticle from "./createData/createArticle";
import createPembangunan from "./createData/createPembangunan";

dotenv.config();

const PENDUDUK_COUNT = 1000;
const DUSUN_COUNT = 4;
const PENGATURAN_DESA_COUNT = 100;
const SK_KADES_COUNT = 50;
const PEMBANGUNAN_COUNT = 2000;
let counter;

const { waitTimeout } = process.env;
invariant(waitTimeout, "waitTimeout Cannot be Null");

async function main() {
  const browser = await puppeteer.launch({
    // headless: false,
    headless: "new",
    // devtools: true,

    defaultViewport: null,
    args: ["--start-maximized"],
  });
  // const page = await browser.newPage();
  var [page] = await browser.pages();

  await login(page);

  // const filePath = path.join(process.cwd(), "screenshot");
  // const fileName = `${new Date().getTime()}.png`;

  // if (!fs.existsSync(filePath)) {
  //   fs.mkdirSync(filePath, { recursive: true });
  // }

  // counter = 0;
  // while (counter !== PENDUDUK_COUNT) {
  //   try {
  //     console.log(`Creating User Number: ${counter}`);

  //     await createPenduduk(page);
  //     counter++;
  //   } catch (error) {}
  // }

  // await createPenduduk(page);

  // await createPenduduk(page);

  // generate dusun
  // counter = 0;
  // while (counter !== DUSUN_COUNT) {
  //   try {
  //     console.log(`Creating Dusun Number: ${counter}`);

  //     await createDusun(page);
  //     counter++;
  //   } catch (error) {}
  // }

  // await page.screenshot({
  //   path: path.join(filePath, fileName),
  //   fullPage: true,
  // });

  // counter = 0;
  // while (counter !== PENGATURAN_DESA_COUNT) {
  //   try {
  //     console.log(`Creating PENGATURAN DESA Number: ${counter}`);

  //     await createPengaturanDesa(page);
  //     counter++;
  //   } catch (error) {}
  // }

  // counter = 0;
  // while (counter !== SK_KADES) {
  //   try {
  //     console.log(`Creating SK KADES Number: ${counter}`);

  //     await createSkKades(page);
  //     counter++;
  //   } catch (error) {}
  // }

  // await createPenduduk(page);

  // await createArticle(page);

  counter = 0;
  while (counter !== PEMBANGUNAN_COUNT) {
    try {
      console.log(`Creating Pembangunan Number: ${counter}`);

      await createPembangunan(page);
      counter++;
    } catch (error) {}
  }

  await createPembangunan(page);
  await browser.close();
}

main();
