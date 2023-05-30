import puppeteer from "puppeteer";
import invariant from "tiny-invariant";
import login from "./login";
import * as dotenv from "dotenv";
import createSkKades from "./createData/createSkKades";
import createPembangunan from "./createData/createPembangunan";
import createArticle from "./createData/createArticle";
import createDusun from "./createData/createDusun";
import deleteAllDusun from "./createData/deleteAllDusun";

dotenv.config();

const PENDUDUK_COUNT = 1000;
const DUSUN_COUNT = 20;
const PENGATURAN_DESA_COUNT = 100;
const SK_KADES_COUNT = 50;
const PEMBANGUNAN_COUNT = 100;
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

  await createDusun(page, DUSUN_COUNT);
  // await createPenduduk(page, PENDUDUK_COUNT);
  // await createPengaturanDesa(page, PENGATURAN_DESA_COUNT);
  // await createSkKades(page, SK_KADES_COUNT);
  // await createPembangunan(page, PEMBANGUNAN_COUNT);
  // await createArticle(page);

  // await deleteAllDusun(page);

  await browser.close();
}

main();
