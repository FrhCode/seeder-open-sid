import { type Page } from "puppeteer"

import * as dotenv from "dotenv"
import writeErrorLog from "../utils/writeErrorLog"
import * as fs from "fs"
import * as path from "path"
import { faker } from "@faker-js/faker"
import arrayElement from "../utils/arrayElement"
import createSubGalery from "./createSubGalery"
dotenv.config()

const URL = `${process.env.APP_URL}/index.php/gallery`

export default async function createGalery(page: Page, count: number) {
  for (let index = 0; index < count; index++) {
    console.log(`Creating Image ${index + 1} of ${count}`)

    try {
      await page.goto(URL)

      await page.waitForSelector('[title="Tambah Artikel"]')
      await page.click('[title="Tambah Artikel"]')

      await page.waitForSelector('[name="nama"]')
      await page.type('[name="nama"]', faker.lorem.sentence())

      const articleFolder = path.join(process.cwd(), "assets", "article")

      const listImg = fs
        .readdirSync(articleFolder)
        .filter((file) => file.match(/.(jpe?g|png)$/gi))

      const randomImgPath = path.join(articleFolder, arrayElement(listImg))

      await page.waitForSelector('input[type="file"]')
      const fileInput = await page.$('input[type="file"]')

      // Set the value of the file input to the file path
      await fileInput?.uploadFile(randomImgPath)

      await page.click('[type="submit"]')

      await page.waitForSelector('[title="Tambah Artikel"]', { timeout: 3000 })
    } catch (error) {
      if (!(error instanceof Error)) return

      index--

      await writeErrorLog(
        `Failed to create Galery in index ${index + 1}\n${error.message}`,
        "CREATE_GALERY"
      )
    }
  }

  await page.waitForSelector('[name="per_page"]')
  await page.select('[name="per_page"]', "100")

  await page.waitForSelector('[title="Rincian Album"]')
  const subGaleryURLs = await page.$$eval('[title="Rincian Album"]', (el) => {
    const element = el as HTMLAnchorElement[]
    return element.map((a) => a.href)
  })

  for (const link of subGaleryURLs) {
    const randomNumber = faker.number.int({ min: 5, max: 10 })
    await createSubGalery(page, randomNumber, link).catch(() => {
      console.log("UNEXPECTED ERROR")
    })
  }
}
