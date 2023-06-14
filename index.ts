import puppeteer from "puppeteer";
import login from "./login";
import * as dotenv from "dotenv";
import createPenduduk from "./createData/createPenduduk";
import createDusun from "./createData/createDusun";
import createPengaturanDesa from "./createData/createPengaturanDesa";
import createSkKades from "./createData/createSkKades";
import createPembangunan from "./createData/createPembangunan";
import createArticle from "./createData/createArticle";
import createLapakCategory from "./createData/createLapakCategory";
import createLapakPelapak from "./createData/createLapakPelapak";
import createLapakProduct from "./createData/createLapakProduct";
import createVaksin from "./createData/createVaksin";
import createKelompok from "./createData/createKelompok";
import createLembaga from "./createData/createLembaga";
import createSuplement from "./createData/createSuplement";
import createGalery from "./createData/createGalery";

dotenv.config();

const PENDUDUK_COUNT = 100;
const DUSUN_COUNT = 5;
const PENGATURAN_DESA_COUNT = 50;
const SK_KADES_COUNT = 50;
const PEMBANGUNAN_COUNT = 50;
const GALERY_COUNT = 25;

async function main() {
  const browser = await puppeteer.launch({
    // headless: false,
    headless: "new",
    // devtools: true,

    defaultViewport: null,
    args: ["--start-maximized"],
  });
  // const page = await browser.newPage();
  const [page] = await browser.pages();

  await login(page);

  await createDusun(page, DUSUN_COUNT);
  await createPenduduk(page, PENDUDUK_COUNT);
  await createPengaturanDesa(page, PENGATURAN_DESA_COUNT);
  await createSkKades(page, SK_KADES_COUNT);
  await createPembangunan(page, PEMBANGUNAN_COUNT);

  await createArticle(page);

  await createGalery(page, GALERY_COUNT);

  await createLapakCategory(page, 5);
  await createLapakPelapak(page, 10);
  await createLapakProduct(page, 100);

  // console.log("FINISH")
  await createVaksin(page);
  // await
  await createKelompok(page);
  await createLembaga(page);
  await createSuplement(page);
  await browser.close();
}

main();
