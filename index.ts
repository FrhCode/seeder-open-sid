import puppeteer from 'puppeteer'
import login from './login'
import * as dotenv from 'dotenv'
import createGalery from './createData/createGalery'

dotenv.config()

const PENDUDUK_COUNT = 1000
const DUSUN_COUNT = 5
const PENGATURAN_DESA_COUNT = 100
const SK_KADES_COUNT = 50
const PEMBANGUNAN_COUNT = 100
const GALERY_COUNT = 100

console.log({
  PEMBANGUNAN_COUNT,
  DUSUN_COUNT,
  PENDUDUK_COUNT,
  PENGATURAN_DESA_COUNT,
  SK_KADES_COUNT
})

async function main(): Promise<void> {
  const browser = await puppeteer.launch({
    // headless: false,
    headless: 'new',
    // devtools: true,

    defaultViewport: null,
    args: ['--start-maximized']
  })
  // const page = await browser.newPage();
  const [page] = await browser.pages()

  await login(page)

  // await deleteAllDusun(page)
  // await createDusun(page, DUSUN_COUNT)
  // await createPenduduk(page, PENDUDUK_COUNT)
  // await createPengaturanDesa(page, PENGATURAN_DESA_COUNT)
  // await createSkKades(page, SK_KADES_COUNT)
  // await createPembangunan(page, PEMBANGUNAN_COUNT)
  // await createArticle(page)

  // await createSubGalery(page)
  await createGalery(page, GALERY_COUNT)
  // await browser.close()
}

main()
  .then(() => {})
  .catch(() => {})
