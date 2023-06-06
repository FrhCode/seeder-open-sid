import { type Page } from "puppeteer"
import * as dotenv from "dotenv"
import { PendingXHR } from "pending-xhr-puppeteer"
import sleep from "../utils/sleep"
import { faker } from "@faker-js/faker"
import writeErrorLog from "../utils/writeErrorLog"
import calculateDifference from "../utils/calcDifferent"
import randomNumberBelow from "../utils/randomNumberBelow"
dotenv.config()

const URL = `${process.env.APP_URL}/index.php/lapak_admin/pelapak`

export default async function createLapakPelapak(
  page: Page,
  counter: number
): Promise<void> {
  let index = counter
  while (index) {
    try {
      const iteration = calculateDifference(counter, index)
      console.log(`CREATE PELAPAK, ${iteration} of ${counter}`)
      index--

      await fillForm(page)
    } catch (error) {
      if (!(error instanceof Error)) return

      const indexError = calculateDifference(counter, index)

      writeErrorLog(
        `Failed to create pelapak in index ${indexError}\n${error.message}`,
        "CREATE_LAPAK_PELAPAK"
      )
      counter++
    }
  }
}

async function fillForm(page: Page) {
  await page.goto(URL)

  await page.click('[data-title="Tambah Data"]')
  await sleep(1000)

  // Pelapak
  await page.click('[title="-- Silahkan Cari NIK - Nama Penduduk --"]')
  await page.waitForSelector(".select2-results ul li")
  const [, ...optionsPelapak] = await page.$$(".select2-results ul li")
  const randomOptionsPelapakIndex = randomNumberBelow(optionsPelapak.length)
  await optionsPelapak[randomOptionsPelapakIndex].click()

  // phone
  await page.type('[id="telepon"]', faker.phone.number("0###########"))
  await page.click('[type="submit"]')
  await page.waitForSelector('[data-title="Tambah Data"]')
}
