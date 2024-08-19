import { write } from "bun";
import { binarySearch } from "../algorithms/BinarySearch";
import type { GenericObject } from '../types'
import { quickSort } from "../algorithms/Quicksort";
import { readJsonFile } from "../utils/readJsonFile";

class Database {
  private query: GenericObject[] = [];

  constructor() { }

  //read json file
  private async readJsonFile(fileName: string) {
    const filePath = `./src/db/tables/${fileName.toLowerCase()}.json`;
    const fileContent = await Bun.file(filePath).text();
    const fileData = JSON.parse(fileContent);
    return fileData.data;
  }

  //create table
  createTable(name: string, fields: string[]): void {
    Bun.write(`./src/db/tables/${name}.json`, JSON.stringify({ fields: fields, data: [] }, null, 4));
  }

//findone record only
  async findOne(from: string, key: string, target: any): Promise<GenericObject | undefined> {
    try {
      const data = await this.readJsonFile(from);
      //@ts-ignore
      return data[binarySearch(data, key, target)]
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }


  //select required fields
  async select(fields: string[], from: string): Promise<this> {
    try {
      const data = await readJsonFile(from);

      if (data && Array.isArray(data)) {
        if (fields.length === 1 && fields[0] === "*") {
          this.query = data;
        } else {
          this.query = data.map((row) => {
            const selectedRow: GenericObject = {};
            for (let field of fields) {
              if (row.hasOwnProperty(field)) {
                selectedRow[field] = row[field];
              } else {
                throw new Error(`Property ${field} does not exist in table ${from}`);
              }
            }
            return selectedRow;
          });
        }
      } else {
        throw new Error(`No data array found in table: ${from}`);
      }
    } catch (error) {
      console.error(`Error selecting data from table: ${from}`, error);
      this.query = [];
    }
    return this;  // Return this for chaining
  }

  //find all occurences; used in where method
    private findAllOccurences = (list: GenericObject[], field: string, target: any): GenericObject[] => {
    // Use binarySearch to find the index of one occurrence
    const index = binarySearch(list, field, target);
    if (index === -1) return [];

    const results: GenericObject[] = [];

    // Collect all occurrences to the left of the found index
    let i = index;
    while (i >= 0 && list[i][field] === target) {
      results.unshift(list[i]);
      i--;
    }

    // Collect all occurrences to the right of the found index
    i = index + 1;
    while (i < list.length && list[i][field] === target) {
      results.push(list[i]);
      i++;
    }

    return results;
  }


  //where
  where(key: string, target: any): GenericObject[] {
    // Filter the current query results based on the key and target
    this.query = this.findAllOccurences(this.query, key, target);
    return this.query;  // Return the filtered results
}




//insert INTO
  async insertINTO(table:string,values:GenericObject){ 
    const data = await this.readJsonFile(table.toLowerCase());
    data.push(values)
    await write(`./src/db/tables/${table.toLowerCase()}.json`,JSON.stringify({data:data},null,4))
  }

  orderBy(by:string){ 
    this.query = quickSort(this.query,by)
    return this
  }

}

export default Database;
