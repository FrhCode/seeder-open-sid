import { type Page } from "puppeteer"
import * as dotenv from "dotenv"
import { PendingXHR } from "pending-xhr-puppeteer"
import sleep from "../utils/sleep"
import { faker } from "@faker-js/faker"
import writeErrorLog from "../utils/writeErrorLog"
import calculateDifference from "../utils/calcDifferent"
dotenv.config()

const URL = `${process.env.APP_URL}/index.php/lapak_admin/kategori`

export default async function createLapakCategory(
  page: Page,
  counter: number
): Promise<void> {
  let index = counter
  while (index) {
    try {
      const iteration = calculateDifference(counter, index)
      console.log(`CREATE CATEGORY, ${iteration} of ${counter}`)
      index--

      await fillForm(page)
    } catch (error) {
      if (!(error instanceof Error)) return

      const indexError = calculateDifference(counter, index)

      writeErrorLog(
        `Failed to create product in index ${indexError}\n${error.message}`,
        "CREATE_LAPAK_PRODUCT"
      )
      counter++
    }
  }
}

async function fillForm(page: Page) {
  await page.goto(URL)

  await page.click('[data-title="Tambah Data"]')
  await sleep(1000)

  await page.type('[name="kategori"]', faker.word.noun())

  await page.click('[type="submit"]')

  await page.waitForSelector('[data-title="Tambah Data"]')
}
