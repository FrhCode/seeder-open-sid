import generateNik from "../utils/generateNik";
import path from "path";
import fs from "fs";
import invariant from "tiny-invariant";
import { faker } from "@faker-js/faker";
import { Page } from "puppeteer";

import { PendingXHR } from "pending-xhr-puppeteer";
import arrayElement from "../utils/arrayElement";

const URL = "http://localhost/sidisa/index.php/penduduk/form_peristiwa/5";

export default async function createPenduduk(page: Page) {
  const personFolder = path.join(process.cwd(), "assets", "person");

  const listImg = fs
    .readdirSync(personFolder)
    .filter((file) => new RegExp(".(jpe?g|png)$$", "gi").exec(file));

  const randomPdfPath = path.join(personFolder, arrayElement(listImg));

  await page.goto(URL);

  // FOTO
  // upload document
  const elementHandle = await page.$('input[type="file"][name="foto"]');
  await elementHandle?.uploadFile(randomPdfPath);

  // nik
  await page.waitForSelector("input[name='nik']");
  await page.type("input[name='nik']", generateNik());

  // nama
  await page.waitForSelector("input[name='nama']");
  await page.type("input[name='nama']", faker.person.fullName());

  // hubungan dalam keluarga
  await page.waitForSelector('select[name="kk_level"]~*');
  await page.click('select[name="kk_level"]~*');
  const [_, ...choice] = await page.$$(".select2-results__options > li");
  const selectedChoice = faker.number.int({ min: 0, max: choice.length - 1 });
  await choice[0].click();

  // Jenis kelamin
  await page.waitForSelector('select[name="sex"]');
  // 1 pria || 2 wanita
  await page.select(
    'select[name="sex"]',
    faker.number.int({ max: 2, min: 1 }).toString()
  );

  // agama
  await page.waitForSelector('select[name="agama_id"]');
  // 1 islam || 2 kristen || 3 katolik || 4 hindu  || 5 buda || 6 cina || 7 DLL
  await page.select(
    'select[name="agama_id"]',
    faker.number.int({ max: 7, min: 1 }).toString()
  );

  // status penduduk
  await page.waitForSelector('select[name="status"]');
  // 1 tetap || 2 tidak tetap
  await page.select(
    'select[name="status"]',
    faker.number.int({ max: 2, min: 1 }).toString()
  );

  // tempat lahir
  await page.waitForSelector('input[name="tempatlahir"]');
  await page.type('input[name="tempatlahir"]', faker.location.city());

  // tanggal lahir
  const date = faker.date.between({
    from: "1990-01-01T00:00:00.000Z",
    to: "2000-01-01T00:00:00.000Z",
  });
  const formatedDate = `${date.getDate().toString().padStart(2, "0")}-${date
    .getMonth()
    .toString()
    .padStart(2, "0")}-${date.getFullYear()}`;
  await page.evaluate((formatedDate) => {
    const tanggalLahirInput = document.querySelector(
      "#tgl_lahir"
    ) as HTMLInputElement | null;

    if (!tanggalLahirInput) return;
    tanggalLahirInput.value = formatedDate;
  }, formatedDate);

  // pendidikan
  await page.waitForSelector('select[name="pendidikan_kk_id"]');
  // 1 TIDAK SEKOLAH || 2 BELUM TAMAT SD || 3 TAMAT SD || 4 SLTP || 5 SLTA || 6 S1 || 7 D3 || 8 D4 ||  9 S2 || 10 S3
  await page.select(
    'select[name="pendidikan_kk_id"]',
    faker.number.int({ max: 10, min: 1 }).toString()
  );

  // pekerjaan
  await page.waitForSelector('select[name="pekerjaan_id"]');
  await page.select(
    'select[name="pekerjaan_id"]',
    faker.number.int({ max: 89, min: 1 }).toString()
  );

  // Warga Negara
  await page.waitForSelector('select[name="warganegara_id"]');
  // 1 WNI || 2 WNA
  await page.select(
    'select[name="warganegara_id"]',
    faker.number.int({ max: 2, min: 1 }).toString()
  );

  // nama ayah
  await page.waitForSelector('input[name="nama_ayah"]');
  await page.type('input[name="nama_ayah"]', "-");

  // nama ibu
  await page.waitForSelector('input[name="nama_ibu"]');
  await page.type('input[name="nama_ibu"]', "-");

  // await sleep(parseInt(waitTimeout));

  const pendingXHR = new PendingXHR(page);

  await pendingXHR.waitForAllXhrFinished();
  // nama dusun
  await page.waitForSelector('select[name="dusun"] > option:nth-child(2)');
  const selectedDusun = await page.$$eval(
    'select[name="dusun"]  option',
    (options) => {
      const randomIndexFromOptions =
        1 + Math.floor(Math.random() * options.length);
      return options[randomIndexFromOptions].value;
    }
  );
  await page.waitForSelector('select[name="dusun"]');
  await page.select('select[name="dusun"]', selectedDusun);

  await pendingXHR.waitForAllXhrFinished();
  // RW
  // await sleep(parseInt(waitTimeout));
  await page.waitForSelector('select[name="rw"] option');
  const selectedRW = await page.$$eval(
    'select[name="rw"] option',
    (options) => {
      const elements = options.filter(
        (option) =>
          option.textContent !== "-" && option.textContent !== "Pilih RW"
      );

      console.log({ elements, options });

      function arrayElement<T>(element: T[]) {
        return element[Math.floor(Math.random() * element.length)];
      }

      return arrayElement(elements).value || "1";
    }
  );

  await page.waitForSelector('select[name="rw"]');
  await page.select('select[name="rw"]', selectedRW);
  // console.log(selectedRW);

  await pendingXHR.waitForAllXhrFinished();
  // RT
  // await sleep(parseInt(waitTimeout));
  await page.waitForSelector('select[name="id_cluster"] option');
  const selectedRT = await page.$$eval(
    'select[name="id_cluster"] option',
    (options) => {
      const elements = options.filter(
        (option) =>
          option.textContent !== "-" && option.textContent !== "Pilih RT "
      );

      function arrayElement<T>(element: T[]) {
        return element[Math.floor(Math.random() * element.length)];
      }

      return arrayElement(elements).value || "1";
    }
  );

  await page.waitForSelector('select[name="id_cluster"]');
  await page.select('select[name="id_cluster"]', selectedRT);

  // alamat sebelumnya
  await page.waitForSelector('input[name="alamat_sebelumnya"]');
  await page.type('input[name="alamat_sebelumnya"]', "-");

  // Cara menghubungi
  await page.waitForSelector('select[name="hubung_warga"]');
  await page.select(
    'select[name="hubung_warga"]',
    faker.helpers.arrayElement(["Email", "Telegram"])
  );

  // Status Kawin
  await page.waitForSelector('select[name="status_kawin"]');
  // 1 Belum kawin
  await page.select(
    'select[name="status_kawin"]',
    faker.number.int({ max: 1, min: 1 }).toString()
  );

  // Golongan darah
  await page.waitForSelector('select[name="golongan_darah_id"]');
  await page.select(
    'select[name="golongan_darah_id"]',
    faker.number.int({ max: 13, min: 1 }).toString()
  );

  // SUBMIT
  await Promise.all([
    page.click("button[type='submit']"),
    page.waitForNavigation({ waitUntil: "networkidle0", timeout: 2000 }),
  ]);
}
