import * as path from 'path'
import appendTextToFile from './appendTextToFile'

type ErrorType =
  | 'CREATE_PENDUDUK'
  | 'CREATE_PENGATURAN_DESA'
  | 'CREATE_SK_KADES'
  | 'CREATE_PEMBANGUNAN'
  | 'CREATE_ARTICLE'
  | 'CREATE_PROGRESS_PEMBANGUNAN'
  | 'CREATE_DUSUN'
  | 'CREATE_RW'
  | 'CREATE_RT'
  | 'CREATE_SUB_GALERY'
  | 'CREATE_GALERY'

export default async function writeErrorLog(
  text: string,
  errorType: ErrorType
): Promise<void> {
  let fileName = 'create_penduduk_error.txt'

  switch (errorType) {
    case 'CREATE_PENDUDUK':
      fileName = 'create_penduduk_error.txt'
      break
    case 'CREATE_PENGATURAN_DESA':
      fileName = 'create_pengaturan_desa_error.txt'
      break
    case 'CREATE_SK_KADES':
      fileName = 'create_sk_kades_error.txt'
      break
    case 'CREATE_PEMBANGUNAN':
      fileName = 'create_pembangunan_error.txt'
      break
    case 'CREATE_ARTICLE':
      fileName = 'create_article_error.txt'
      break
    case 'CREATE_PROGRESS_PEMBANGUNAN':
      fileName = 'create_progress_pembangunan_error.txt'
      break
    case 'CREATE_DUSUN':
      fileName = 'create_dusun_error.txt'
      break
    case 'CREATE_RW':
      fileName = 'create_rw_error.txt'
      break
    case 'CREATE_RT':
      fileName = 'create_rt_error.txt'
      break
    case 'CREATE_SUB_GALERY':
      fileName = 'create_sub_galery_error.txt'
      break
    case 'CREATE_GALERY':
      fileName = 'create_galery_error.txt'
      break

    default:
      break
  }

  const folderName = path.join(process.cwd(), 'log', 'error')

  const filePath = path.join(folderName, fileName)

  appendTextToFile(filePath, text)
}
