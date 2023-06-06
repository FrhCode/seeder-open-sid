import { type Page } from "puppeteer"
import * as dotenv from "dotenv"
import sleep from "../utils/sleep"
import { faker } from "@faker-js/faker"
import writeErrorLog from "../utils/writeErrorLog"
import calculateDifference from "../utils/calcDifferent"
import randomNumberBelow from "../utils/randomNumberBelow"
import generateRandomLatLongInRadius from "../utils/generateRandomLatLongInRadius"
dotenv.config()

const URL = `${process.env.APP_URL}/index.php/lapak_admin/pelapak`

export default async function createLapakPelapak(page: Page, counter: number) {
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
  const namaPelapak = await page.evaluate((e) => {
    const name = e.innerHTML.replace(/.* - /, "")
    return name
  }, optionsPelapak[randomOptionsPelapakIndex])
  await optionsPelapak[randomOptionsPelapakIndex].click()

  // phone
  const phonePelapak = faker.phone.number("0###########")
  await page.type('[id="telepon"]', phonePelapak)
  await page.click('[type="submit"]')

  await page.waitForSelector('[data-title="Tambah Data"]')

  await page.select('[name="tabel-pelapak_length"]', "100")

  await sleep(300)

  // PETA
  await page.evaluate(
    (namaPelapak, phonePelapak) => {
      const trs = document.querySelectorAll<HTMLTableRowElement>("tbody tr")

      let result: HTMLTableRowElement | null = null
      trs.forEach((tr) => {
        const name = tr.querySelector("td:nth-child(4)")?.innerHTML
        const phone = tr.querySelector("td:nth-child(5)")?.innerHTML

        const isTarget = namaPelapak === name && phonePelapak === phone

        if (isTarget) {
          result = tr
        }
      })

      if (!result) return

      const btnAddLokasi = (
        result as HTMLTableRowElement
      ).querySelector<HTMLAnchorElement>('[title="Lokasi"]')

      if (!btnAddLokasi) return

      btnAddLokasi.click()
    },
    namaPelapak,
    phonePelapak
  )

  await page.waitForSelector('[name="lat"]')

  const defaultLat = -6.933047173611062
  const defaultLong = 107.71777153015138

  const [lattitude, longtitude] = generateRandomLatLongInRadius(
    defaultLat,
    defaultLong,
    10
  )

  await page.$eval(
    'input[name="lat"]',
    (input, lattitude) => {
      input.value = lattitude.toString()
    },
    lattitude
  )
  await page.$eval(
    'input[name="lng"]',
    (input, longtitude) => {
      input.value = longtitude.toString()
    },
    longtitude
  )

  await page.click('[type="submit"]')

  await page.waitForSelector('[data-title="Tambah Data"]')
}
