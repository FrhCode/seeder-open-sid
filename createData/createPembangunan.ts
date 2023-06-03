import { faker } from '@faker-js/faker'
import { type Page } from 'puppeteer'
import { PendingXHR } from 'pending-xhr-puppeteer'
import path from 'path'
import fs from 'fs'
import arrayElement from '../utils/arrayElement'
import writeErrorLog from '../utils/writeErrorLog'
import createPembangunanProgress from './createPembangunanProgress'

import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()

const URL = `${process.env.APP_URL}/index.php/admin_pembangunan/form`

export default async function createPembangunan(
  page: Page,
  count: number
): Promise<void> {
  for (let index = 0; index < count; index++) {
    console.log(`Creating pembangunan ${index + 1} of ${count}`)

    try {
      await fillPembangunanForm(page)
    } catch (error) {
      if (!(error instanceof Error)) return
      index--

      await writeErrorLog(
        `Failed to create pembangunan in index ${index + 1}\n${error.message}`,
        'CREATE_PEMBANGUNAN'
      )
    }
  }

  await createPembangunanProgress(page)
}

async function fillPembangunanForm(page: Page): Promise<void> {
  await page.goto(URL)
  const pendingXHR = new PendingXHR(page)

  // judul
  await page.waitForSelector('input[name="judul"]', { timeout: 500 })
  await page.type('input[name="judul"]', faker.lorem.text())

  // PELAKSANA
  await page.waitForSelector('input[name="pelaksana_kegiatan"]', {
    timeout: 500
  })
  await page.type(
    'input[name="pelaksana_kegiatan"]',
    faker.company.buzzPhrase()
  )

  // volume
  await page.waitForSelector('input[name="volume"]', { timeout: 500 })
  await page.type(
    'input[name="volume"]',
    `${faker.number.int({ min: 800, max: 10000 })} KM`
  )

  // waktu
  await page.waitForSelector('input[name="waktu"]', { timeout: 500 })
  await page.type(
    'input[name="waktu"]',
    `${faker.number.int({ min: 12, max: 30 })}`
  )

  // SUMBER DANA PEMERINTAH
  await page.waitForSelector('input[name="sumber_biaya_pemerintah"]', {
    timeout: 500
  })
  await page.type(
    'input[name="sumber_biaya_pemerintah"]',
    `${faker.number.int({ min: 100000000, max: 1000000000 })}`
  )

  // SUMBER DANA PROVINSI
  await page.waitForSelector('input[name="sumber_biaya_provinsi"]', {
    timeout: 500
  })
  await page.type(
    'input[name="sumber_biaya_provinsi"]',
    `${faker.number.int({ min: 100000000, max: 1000000000 })}`
  )

  // SUMBER DANA KABUPATEN
  await page.waitForSelector('input[name="sumber_biaya_kab_kota"]', {
    timeout: 500
  })
  await page.type(
    'input[name="sumber_biaya_kab_kota"]',
    `${faker.number.int({ min: 100000000, max: 1000000000 })}`
  )

  // SUMBER DANA SWADAYA
  await page.waitForSelector('input[name="sumber_biaya_swadaya"]', {
    timeout: 500
  })
  await page.type(
    'input[name="sumber_biaya_swadaya"]',
    `${faker.number.int({ min: 100000000, max: 1000000000 })}`
  )

  // MANFAAT
  await page.waitForSelector('textarea[name="manfaat"]', { timeout: 500 })
  await page.type('textarea[name="manfaat"]', faker.lorem.sentence())

  // KETERANGAN
  await page.waitForSelector('textarea[name="keterangan"]', { timeout: 500 })
  const text = faker.lorem.paragraph()
  await page.evaluate((text) => {
    const textInput = document.querySelector(
      'textarea[name="keterangan"]'
    ) as HTMLTextAreaElement

    textInput.value = text
  }, text)

  // SUMBER DANA
  await page.waitForSelector('[data-select2-id="1"]', { timeout: 500 })
  await page.click('[data-select2-id="1"]')
  await pendingXHR.waitForAllXhrFinished()
  await page.waitForSelector('.select2-results__options li', { timeout: 500 })
  let options = await page.$$('.select2-results__options li')
  let randomNumber = faker.number.int({
    min: 0,
    max: options.length - 1
  })
  await options[randomNumber].click()

  // TAHUN ANGGARAN
  await page.waitForSelector('[data-select2-id="3"]', { timeout: 500 })
  await page.click('[data-select2-id="3"]')
  await pendingXHR.waitForAllXhrFinished()
  await page.waitForSelector('.select2-results__options li', { timeout: 500 })
  options = await page.$$('.select2-results__options li')
  randomNumber = faker.number.int({
    min: 0,
    max: options.length - 1
  })
  await options[randomNumber].click()

  // SIFAT PROYEK
  await page.waitForSelector('[data-select2-id="5"]', { timeout: 500 })
  await page.click('[data-select2-id="5"]')
  await pendingXHR.waitForAllXhrFinished()
  await page.waitForSelector('.select2-results__options li', { timeout: 500 })
  options = await page.$$('.select2-results__options li')
  randomNumber = faker.number.int({
    min: 1,
    max: options.length - 1
  })
  await options[randomNumber].click()

  // LOKASI PROYEK
  await page.waitForSelector('[data-select2-id="7"]', { timeout: 500 })
  await page.click('[data-select2-id="7"]')
  await pendingXHR.waitForAllXhrFinished()
  await page.waitForSelector('.select2-results__options li', { timeout: 500 })
  options = await page.$$('.select2-results__options li')
  randomNumber = faker.number.int({
    min: 1,
    max: options.length - 1
  })
  await options[randomNumber].click()

  const articleFolder = path.join(process.cwd(), 'assets', 'article')

  const listImg = fs
    .readdirSync(articleFolder)
    .filter((file) => file.match(/.(jpe?g|png)$/gi))

  const randomImgPath = path.join(articleFolder, arrayElement(listImg))

  // FOTO
  // upload document
  const elementHandle = await page.$('input[type="file"][name="foto"]')
  await elementHandle?.uploadFile(randomImgPath)

  // SUBMIT
  await Promise.all([
    page.click("button[type='submit']"),
    page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 10000 })
  ])

  await page.waitForSelector('[title="Tambah Data Baru"]', { timeout: 500 })
}
