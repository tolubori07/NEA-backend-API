 export const readJsonFile= async(fileName: string)=> {
    const filePath = `./src/db/tables/${fileName}.json`;
    const fileContent = await Bun.file(filePath).text();
    const fileData = JSON.parse(fileContent);
    return fileData.data;
  }

