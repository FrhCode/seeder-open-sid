import { type Page } from 'puppeteer'
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()

const URL = `${process.env.APP_URL}/index.php/siteman`

export default async function login(page: Page): Promise<void> {
  await page.goto(URL)

  // username
  await page.waitForSelector("input[name='username']", { timeout: 500 })
  await page.type("input[name='username']", process.env.LOGIN_USER ?? '')
  // passowrd
  await page.waitForSelector("input[name='password']", { timeout: 500 })
  await page.type("input[name='password']", process.env.LOGIN_PASSWORD ?? '')

  // submit and navigate
  await Promise.all([
    page.click('button'),
    page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 10000 })
  ])
}
