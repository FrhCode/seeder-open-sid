import { type Page } from 'puppeteer'

import * as dotenv from 'dotenv'
import * as fs from 'fs'
import * as path from 'path'
import { faker } from '@faker-js/faker'
import arrayElement from '../utils/arrayElement'
import writeErrorLog from '../utils/writeErrorLog'
dotenv.config()

export default async function createSubGalery(
  page: Page,
  count: number = 100,
  URL: string
): Promise<void> {
  for (let index = 0; index < count; index++) {
    console.log(`Creating Image ${index + 1} of ${count}`)

    try {
      await page.goto(URL)

      await page.waitForSelector('[title="Tambah Album"]', { timeout: 500 })
      await page.click('[title="Tambah Album"]')

      await page.waitForSelector('[name="nama"]', { timeout: 2000 })
      await page.type('[name="nama"]', faker.lorem.text())

      const articleFolder = path.join(process.cwd(), 'assets', 'article')

      const listImg = fs
        .readdirSync(articleFolder)
        .filter((file) => file.match(/.(jpe?g|png)$/gi))

      const randomImgPath = path.join(articleFolder, arrayElement(listImg))

      await page.waitForSelector('input[type="file"]', { timeout: 1000 })
      const fileInput = await page.$('input[type="file"]')

      // Set the value of the file input to the file path
      await fileInput?.uploadFile(randomImgPath)

      await page.click('[type="submit"]')

      await page.waitForSelector('[title="Tambah Album"]', { timeout: 2000 })
    } catch (error) {
      if (!(error instanceof Error)) return

      index--

      await writeErrorLog(
        `Failed to create Sub Galery in index ${index + 1}\n${error.message}`,
        'CREATE_SUB_GALERY'
      )
    }
  }
}
