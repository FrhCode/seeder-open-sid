import puppeteer from "puppeteer";
import login from "./login";
import * as dotenv from "dotenv";
import createLapakProduct from "./createData/createLapakProduct";
import createLapakPelapak from "./createData/createLapakPelapak";
import createVaksin from "./createData/createVaksin";
import createKelompok from "./createData/createKelompok";

dotenv.config();

const PENDUDUK_COUNT = 1000;
const DUSUN_COUNT = 5;
const PENGATURAN_DESA_COUNT = 100;
const SK_KADES_COUNT = 50;
const PEMBANGUNAN_COUNT = 100;
const GALERY_COUNT = 100;

console.log({
  PEMBANGUNAN_COUNT,
  DUSUN_COUNT,
  PENDUDUK_COUNT,
  PENGATURAN_DESA_COUNT,
  SK_KADES_COUNT,
  GALERY_COUNT,
});

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

  // await deleteAllDusun(page)
  // await createDusun(page, DUSUN_COUNT)
  // await createPenduduk(page, PENDUDUK_COUNT)
  // await createPengaturanDesa(page, PENGATURAN_DESA_COUNT)
  // await createSkKades(page, SK_KADES_COUNT)
  // await createPembangunan(page, PEMBANGUNAN_COUNT)
  // await createArticle(page)

  // await createSubGalery(page)
  // await createGalery(page, GALERY_COUNT)
  // await createLapakProduct(page)

  // for (let index = 0; index < 1; index++) {
  //   try {
  //     await createLapakProduct(page)
  //   } catch (error) {
  //     if (!(error instanceof Error)) return

  //     writeErrorLog(
  //       `Failed to create product in index ${index + 1}\n${error.message}`,
  //       "CREATE_LAPAK_PRODUCT"
  //     )
  //   }
  // }

  // await deleteAllProducts(page)

  // await createLapakCategory(page, 5)
  // await createLapakPelapak(page, 10);
  // await createLapakProduct(page, 100);

  // console.log("FINISH")
  // await createVaksin(page);
  // await
  await createKelompok(page);
  await browser.close();
}

main();
