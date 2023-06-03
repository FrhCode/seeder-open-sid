import { faker } from '@faker-js/faker'
import { type Page } from 'puppeteer'
import { PendingXHR } from 'pending-xhr-puppeteer'
import path from 'path'
import fs from 'fs'
import arrayElement from '../utils/arrayElement'
import generateRandomArray from '../utils/generateRandomArray'
import writeErrorLog from '../utils/writeErrorLog'

import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()

const URL = `${process.env.APP_URL}/index.php/admin_pembangunan`

async function getUpdateProgressUrls(page: Page): Promise<string[]> {
  return await page.$$eval(
    'a.btn.bg-purple.btn-flat.btn-sm',
    (anchors: HTMLAnchorElement[]) => {
      return anchors.map((anchor) => anchor.href)
    }
  )
}

async function fillFormProgress(
  page: Page,
  url: string,
  percentage: string
): Promise<void> {
  await page.goto(url)

  await Promise.all([
    page.click('[title="Tambah Data Baru"]'),
    page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 10000 })
  ])

  // click custom input percentage
  await page.waitForSelector('[data-toggle="buttons"] *:nth-child(2)', {
    timeout: 500
  })
  await page.click('[data-toggle="buttons"] *:nth-child(2)')

  // percentage
  await page.waitForSelector('input[name="persentase"]', {
    timeout: 500
  })
  await page.type('input[name="persentase"]', percentage)

  const articleFolder = path.join(process.cwd(), 'assets', 'article')

  const listImg = fs
    .readdirSync(articleFolder)
    .filter((file) => file.match(/.(jpe?g|png)$/gi))

  const randomImgPath = path.join(articleFolder, arrayElement(listImg))

  // FOTO
  // upload document
  const elementHandle = await page.$('input[type="file"][name="gambar"]')
  await elementHandle?.uploadFile(randomImgPath)

  // keterangan
  await page.waitForSelector('textarea[name="keterangan"]', {
    timeout: 500
  })
  await page.type('textarea[name="keterangan"]', faker.lorem.paragraph())

  await Promise.all([
    page.click("button[type='submit']"),
    page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 10000 })
  ])

  await page.waitForSelector('[title="Tambah Data Baru"]', { timeout: 500 })
}

export default async function createPembangunanProgress(
  page: Page
): Promise<void> {
  await page.goto(URL)
  const pendingXHR = new PendingXHR(page)

  await page.waitForSelector('select[name="tabel-pembangunan_length"]')
  await page.select('select[name="tabel-pembangunan_length"]', '100')

  await pendingXHR.waitForAllXhrFinished()

  const updateProgressUrls = await getUpdateProgressUrls(page)

  for (const updateUrl of updateProgressUrls) {
    const randomNumber = faker.number.int({ min: 5, max: 20 })
    const percentageProgresses = generateRandomArray(randomNumber, 1, 100)

    for (const [index, percentage] of percentageProgresses.entries()) {
      try {
        console.log({ url: updateUrl, target: randomNumber, index: index + 1 })

        await fillFormProgress(page, updateUrl, `${percentage}%`).catch(() => {
          console.log('fail', { url: updateUrl, target: randomNumber })
        })
      } catch (error) {
        if (!(error instanceof Error)) return

        await writeErrorLog(
          `Failed to create sk kades in ${updateUrl} index ${index + 1}\n${
            error.message
          }`,
          'CREATE_PROGRESS_PEMBANGUNAN'
        )
      }
    }
  }
}
