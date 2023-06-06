import * as path from "path"
import appendTextToFile from "./appendTextToFile"

type ErrorType =
  | "CREATE_PENDUDUK"
  | "CREATE_PENGATURAN_DESA"
  | "CREATE_SK_KADES"
  | "CREATE_PEMBANGUNAN"
  | "CREATE_ARTICLE"
  | "CREATE_PROGRESS_PEMBANGUNAN"
  | "CREATE_DUSUN"
  | "CREATE_RW"
  | "CREATE_RT"
  | "CREATE_SUB_GALERY"
  | "CREATE_GALERY"
  | "CREATE_LAPAK_PRODUCT"
  | "CREATE_LAPAK_CATEGORY"
  | "CREATE_LAPAK_PELAPAK"

export default async function writeErrorLog(
  text: string,
  errorType: ErrorType
): Promise<void> {
  const errorFileNames: Record<ErrorType, string> = {
    CREATE_PENDUDUK: "create_penduduk_error.txt",
    CREATE_PENGATURAN_DESA: "create_pengaturan_desa_error.txt",
    CREATE_SK_KADES: "create_sk_kades_error.txt",
    CREATE_PEMBANGUNAN: "create_pembangunan_error.txt",
    CREATE_ARTICLE: "create_article_error.txt",
    CREATE_PROGRESS_PEMBANGUNAN: "create_progress_pembangunan_error.txt",
    CREATE_DUSUN: "create_dusun_error.txt",
    CREATE_RW: "create_rw_error.txt",
    CREATE_RT: "create_rt_error.txt",
    CREATE_SUB_GALERY: "create_sub_galery_error.txt",
    CREATE_GALERY: "create_galery_error.txt",
    CREATE_LAPAK_PRODUCT: "create_lapak_product_error.txt",
    CREATE_LAPAK_CATEGORY: "create_lapak_category_error.txt",
    CREATE_LAPAK_PELAPAK: "create_lapak_pelapak_error.txt"
  }

  const folderName = path.join(process.cwd(), "log", "error")

  const fileName = errorFileNames[errorType]

  const filePath = path.join(folderName, fileName)

  appendTextToFile(filePath, text)
}
