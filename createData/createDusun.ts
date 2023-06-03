import { faker } from '@faker-js/faker'
import { type Page } from 'puppeteer'
import writeErrorLog from '../utils/writeErrorLog'
import createRw from './createRw'

import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()

const URL = `${process.env.APP_URL}/index.php/sid_core/form`

export default async function createDusun(
  page: Page,
  count: number
): Promise<void> {
  // CREATE DUSUN
  for (let index = 0; index < count; index++) {
    try {
      console.log(`Creating dusun ${index + 1} of ${count}`)

      await fillCreateDusunForm(page)
    } catch (error: any) {
      if (!(error instanceof Error)) return
      index--

      await writeErrorLog(
        `Failed to create dusun in index ${index + 1}\n${error.message}`,
        'CREATE_DUSUN'
      )
    }
  }

  await page.waitForSelector('[name="per_page"]', { timeout: 500 })
  await Promise.all([
    page.select('[name="per_page"]', '100'),
    page.waitForNavigation({ waitUntil: 'networkidle0' })
  ])

  // CREATE RW
  const createRwUrls = await page.$$eval(
    'a.btn[title="Rincian Sub Wilayah"]',
    (anchors) => {
      console.log(anchors)

      return anchors.map((a) => (a as HTMLAnchorElement).href)
    }
  )

  const randomNumber = faker.number.int({ min: 3, max: 6 })

  for (const url of createRwUrls) {
    await createRw(page, randomNumber, url)
  }
}

async function fillCreateDusunForm(page: Page): Promise<void> {
  await page.goto(URL)

  // nik
  await page.waitForSelector('input[name="dusun"]', { timeout: 500 })
  await page.type('input[name="dusun"]', faker.location.city())

  // SUBMIT
  await Promise.all([
    page.click("button[type='submit']"),
    page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 10000 })
  ])

  await page.waitForSelector('[title="Tambah Data"]', { timeout: 500 })
}
