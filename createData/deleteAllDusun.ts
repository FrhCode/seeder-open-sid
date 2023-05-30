import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import { type Page } from 'puppeteer'
dotenv.config()

const URL = `${process.env.APP_URL}/index.php/sid_core`

export default async function deleteAllDusun(page: Page): Promise<void> {
  await page.goto(URL)

  let deleteBtn = await page.$('[title="Hapus"]')

  if (deleteBtn == null) return

  await deleteBtn.click()
  await page.waitForSelector('[id="ok-delete"]')

  await page.$eval('[id="ok-delete"]', (el) => {
    const element = el as HTMLButtonElement
    element.click()
  })

  deleteBtn = await page.$('[title="Hapus"]')
  if (deleteBtn != null) {
    await deleteAllDusun(page)
  }
}
