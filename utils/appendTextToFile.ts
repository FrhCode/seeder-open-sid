import * as fs from "fs";
import * as path from "path";

export default function appendTextToFile(filePath: string, text: string): void {
  try {
    // Create the folder if it doesn't exist
    const folderPath = path.dirname(filePath);
    fs.mkdirSync(folderPath, { recursive: true });

    // Check if the file exists, create it if it doesn't
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, "");
    }

    // Append the text to the file
    fs.appendFileSync(filePath, text + "\n\n");
  } catch (error) {
    console.log("An error occurred while accessing the file.");
  }
}
