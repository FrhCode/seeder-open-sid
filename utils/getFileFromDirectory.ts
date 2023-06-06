import * as fs from "fs"
import path from "path"

type Folder = "article" | "pdf" | "person"

export default function getFileFromDirectory(folder: Folder): string {
  const directory = path.join(process.cwd(), "assets", folder)
  // Check if the provided path is a valid directory
  if (!fs.existsSync(directory) || !fs.lstatSync(directory).isDirectory()) {
    throw new Error("Invalid directory path")
  }

  // Get a list of all files in the directory
  const files: string[] = fs.readdirSync(directory)

  // Choose a random file from the list
  const randomFile: string = files[Math.floor(Math.random() * files.length)]

  // Return the absolute path of the randomly chosen file
  const absolutePath: string = path.join(directory, randomFile)
  return absolutePath
}
