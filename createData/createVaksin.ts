import * as dotenv from "dotenv";
import { Page } from "puppeteer";
import randomNumberBelow from "../utils/randomNumberBelow";
import getFileFromDirectory from "../utils/getFileFromDirectory";
import writeErrorLog from "../utils/writeErrorLog";
import getRandomDate from "../utils/getRandomDate";

dotenv.config();

const URL = `${process.env.APP_URL}/index.php/vaksin_covid`;

export default async function createVaksin(page: Page) {
  const updateUrls = await getUpdateURL(page);

  for (const [index, URL] of updateUrls.entries()) {
    console.log(`Update Vaksin ${index + 1} of ${updateUrls.length}`);

    await page.goto(URL);

    try {
      await fillForm(page);
    } catch (error) {
      if (!(error instanceof Error)) return;

      writeErrorLog(
        `Failed To create Vaksin\nMessage: ${error.message}`,
        "CREATE_VAKSIN"
      );
    }
  }
}

async function getPaginationURls(page: Page) {
  return page.$$eval(".pagination a", (anchors) => {
    return anchors.filter((a) => a.innerHTML.match("[0-9]")).map((a) => a.href);
  });
}

async function getUpdateURL(page: Page) {
  await page.goto(URL);
  await page.select('[name="per_page"]', "200");
  await page.waitForSelector('a[title="Update Vaksin"]');

  const paginationUrls = await getPaginationURls(page);

  const urls = [];

  for (const URL of paginationUrls) {
    await page.goto(URL);

    await page.waitForSelector('a[title="Update Vaksin"]');

    const a = await page.$$eval('a[title="Update Vaksin"]', (anchors) => {
      const elements = anchors as HTMLAnchorElement[];
      return elements.map((element) => element.href);
    });

    urls.push(...a);
  }

  return urls;
}

async function fillForm(page: Page) {
  await page.waitForSelector('[id="centang_vaksin_1"]');

  await page.$eval('input[id="centang_vaksin_3"]', (input) => {
    if (input.checked) {
      input.click();
    }
  });

  await page.$eval('input[id="centang_vaksin_2"]', (input) => {
    if (input.checked) {
      input.click();
    }
  });

  await page.$eval('input[id="centang_vaksin_1"]', (input) => {
    if (input.checked) {
      input.click();
    }
  });

  // Vaksin 1
  const isAlreadyVaksin_1 = Math.random() < 0.8;
  if (isAlreadyVaksin_1) {
    await page.$eval('input[id="centang_vaksin_1"]', (input) => {
      input.click();
    });
    await page.$eval(
      'input[name="tgl_vaksin_1"]',
      (input, date) => {
        input.value = date;
      },
      getRandomDate(new Date("2020-01-01"), new Date("2020-05-01"))
    );
    await page.click('[id="select2-jenis_vaksin_1-container"]');
    await page.waitForSelector('[id="select2-jenis_vaksin_1-results"] li');
    const [...optionsVaksin1] = await page.$$(
      '[id="select2-jenis_vaksin_1-results"] li'
    );
    const randomOptionsVaksin1Index = randomNumberBelow(optionsVaksin1.length);
    await optionsVaksin1[randomOptionsVaksin1Index].click();
    await page
      .$('input[type="file"][id="file1"]')
      .then((element) => element?.uploadFile(getFileFromDirectory("article")));
  }

  // Vaksin 2
  const isAlreadyVaksin_2 = isAlreadyVaksin_1 && Math.random() < 0.7;
  if (isAlreadyVaksin_2) {
    await page.$eval('input[id="centang_vaksin_2"]', (input) => {
      input.click();
    });
    await page.$eval(
      'input[name="tgl_vaksin_2"]',
      (input, date) => {
        input.value = date;
      },
      getRandomDate(new Date("2021-01-01"), new Date("2021-05-01"))
    );
    await page.click('[id="select2-jenis_vaksin_2-container"]');
    await page.waitForSelector('[id="select2-jenis_vaksin_2-results"] li');
    const [...optionsVaksin2] = await page.$$(
      '[id="select2-jenis_vaksin_2-results"] li'
    );
    const randomOptionsVaksin2Index = randomNumberBelow(optionsVaksin2.length);
    await optionsVaksin2[randomOptionsVaksin2Index].click();
    await page
      .$('input[type="file"][id="file2"]')
      .then((element) => element?.uploadFile(getFileFromDirectory("article")));
  }

  // Vaksin 3
  const isAlreadyVaksin_3 =
    isAlreadyVaksin_1 && isAlreadyVaksin_2 && Math.random() < 0.4;
  if (isAlreadyVaksin_3) {
    await page.$eval('input[id="centang_vaksin_3"]', (input) => {
      input.click();
    });

    await page.$eval(
      'input[name="tgl_vaksin_3"]',
      (input, date) => {
        input.value = date;
      },
      getRandomDate(new Date("2022-01-01"), new Date("2022-05-01"))
    );
    await page.click('[id="select2-jenis_vaksin_3-container"]');
    await page.waitForSelector('[id="select2-jenis_vaksin_3-results"] li');
    const [...optionsVaksin3] = await page.$$(
      '[id="select2-jenis_vaksin_3-results"] li'
    );
    const randomOptionsVaksin3Index = randomNumberBelow(optionsVaksin3.length);
    await optionsVaksin3[randomOptionsVaksin3Index].click();
    await page
      .$('input[type="file"][id="file3"]')
      .then((element) => element?.uploadFile(getFileFromDirectory("article")));
  }

  await page.click('[type="submit"]');
  await page.waitForSelector('[title="Tambah Data"]', { timeout: 5000 });
}
