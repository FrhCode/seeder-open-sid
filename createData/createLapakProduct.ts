import { type Page } from "puppeteer"

import * as dotenv from "dotenv"
import sleep from "../utils/sleep"
import randomNumberBelow from "../utils/randomNumberBelow"
import { faker } from "@faker-js/faker"
import getFileFromDirectory from "../utils/getFileFromDirectory"
import roundToNearest100 from "../utils/roundToNearest100"
import calculateDifference from "../utils/calcDifferent"
import writeErrorLog from "../utils/writeErrorLog"

dotenv.config()

const URL = `${process.env.APP_URL}/index.php/lapak_admin/produk`

export default async function createLapakProduct(page: Page, counter: number) {
  let index = counter
  while (index) {
    try {
      const iteration = calculateDifference(counter, index)
      console.log(`CREATE Product, ${iteration} of ${counter}`)
      index--

      await fillForm(page)
    } catch (error) {
      if (!(error instanceof Error)) return

      const indexError = calculateDifference(counter, index)

      await writeErrorLog(
        `Failed to create Category in index ${indexError}\n${error.message}`,
        "CREATE_RT"
      )
      counter++
    }
  }
}

async function fillForm(page: Page) {
  await page.goto(URL)

  await page.click('[title="Tambah Data"]')

  await page.waitForSelector('input[name="nama"]')
  await sleep(500)

  // Nama Pelapak
  await page.click('[title="Pilih Nama Pelapak"]')
  await page.waitForSelector(".select2-results ul li")
  const [, ...optionsPelapak] = await page.$$(".select2-results ul li")
  const randomOptionsPelapakIndex = randomNumberBelow(optionsPelapak.length)
  await optionsPelapak[randomOptionsPelapakIndex].click()

  // Pilih Kategori
  await page.click('[title="Pilih Kategori Produk"]')
  await page.waitForSelector(".select2-results ul li")
  const [, ...optionsKategori] = await page.$$(".select2-results ul li")
  const randomOptionsKategoriIndex = randomNumberBelow(optionsKategori.length)
  await optionsKategori[randomOptionsKategoriIndex].click()

  // Pilih Satuan
  await page.click('[title="Pilih Satuan Produk"]')
  await page.waitForSelector(".select2-results ul li")
  const [, ...optionsSatuan] = await page.$$(".select2-results ul li")
  const randomOptionsSatuanIndex = randomNumberBelow(optionsKategori.length)
  await optionsSatuan[randomOptionsSatuanIndex].click()

  // nama product
  await page.type('input[name="nama"]', faker.commerce.product())

  // Harga
  await page.type(
    '[name="harga"]',
    roundToNearest100(faker.number.int({ min: 40000, max: 1000000 })).toString()
  )

  const randomSentenseCount = faker.number.int({ min: 1, max: 10 })
  const desc = faker.lorem.paragraph(randomSentenseCount)
  await page.evaluate((desc) => {
    const element = document.querySelector(
      '[name="deskripsi"]'
    ) as HTMLTextAreaElement | null

    if (!element) return

    element.value = desc
  }, desc)

  // diskon
  const diskon = faker.number.int({ min: 5, max: 99 }).toString()
  await page.evaluate((diskon) => {
    const input = document.querySelector(
      'input[id="persen"]'
    ) as HTMLInputElement

    input.value = diskon
  }, diskon)

  // Image
  const image = getFileFromDirectory("article")
  const elementHandle = await page.$('input[type="file"][name="foto_1"]')
  await elementHandle?.uploadFile(image)

  await page.click("button[type='submit']")
  await page.waitForSelector('[title="Tambah Data"]', { timeout: 3000 })
}
