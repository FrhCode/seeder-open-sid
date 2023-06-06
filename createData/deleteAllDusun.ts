import { type Page } from "puppeteer"
import * as dotenv from "dotenv"
dotenv.config()

const URL = `${process.env.APP_URL}/index.php/sid_core`

export default async function deleteAllDusun(page: Page) {
  await page.goto(URL)

  await page.waitForSelector('[name="per_page"]', { timeout: 500 })
  await page.select('[name="per_page"]', "100")

  await page.waitForNavigation({ waitUntil: "networkidle0" })

  const deleteBtn = await page.$('[title="Hapus"]')

  if (deleteBtn == null) return

  await deleteBtn.click()
  await page.waitForSelector('[id="ok-delete"]', { timeout: 500 })

  await page.$eval('[id="ok-delete"]', (el) => {
    const element = el as HTMLButtonElement
    element.click()
  })

  await page.goto(URL)

  const deleteBtnExists = await page.evaluate(() => {
    const element = document.querySelector('[title="Hapus"]')
    console.log(element)

    return element
  })

  if (deleteBtnExists == null) return

  await deleteAllDusun(page)
}
