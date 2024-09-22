import { write } from "bun";
import { binarySearch } from "../algorithms/BinarySearch";
import type { GenericObject } from "../types";
import { quickSort } from "../algorithms/Quicksort";
import { readJsonFile } from "../utils/readJsonFile";

class Database {
  private query: GenericObject[] = [];

  constructor() {}

  //create table
  createTable(name: string): void {
    Bun.write(
      `./src/db/tables/${name}.json`,
      JSON.stringify({ ID_Count: 0, data: [] }, null, 4),
    );
  }

  //findone record only

  async findOne(from: string, key: string, target: any) {
    try {
      // Read the JSON file and parse it into an array of objects
      const file = await readJsonFile(from);
      const data = file.data;
      console.log(data)
      // Sort the data based on the specified key
      const sortedList = quickSort(data, key);

      // Perform binary search on the sorted list
      const index = binarySearch(sortedList, key, target);

      // If a valid index is found, return the corresponding object
      if (index !== -1) {
        return sortedList[index]; // Return from sortedList, not data
      } else {
        return undefined;
      }
    } catch (error) {
      console.error("Error in findOne:", error);
      return undefined;
    }
  }

  //select required fields
  async select(fields: string[], from: string): Promise<this> {
    try {
      const file = await readJsonFile(from);
      const data = file.data;

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
                throw new Error(
                  `Property ${field} does not exist in table ${from}`,
                );
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
    return this; // Return this for chaining
  }

  //find all occurences; used in where method
  private findAllOccurences = (
    list: GenericObject[],
    field: string,
    target: any,
  ): GenericObject[] => {
    // Use binarySearch to find the index of one occurrence
    list = quickSort(list, field);
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
  };

  //where
  where(key: string, target: any) {
    // Filter the current query results based on the key and target
    this.query = this.findAllOccurences(this.query, key, target);
    return this; // Return the filtered results
  }

  getResults(): GenericObject[] {
    return this.query;
  }

  //insert INTO
  async insertINTO(table: string, values: GenericObject) {
    const jsonData = await readJsonFile(table.toLowerCase());

    // Increment ID count and assign new ID
    jsonData.ID_Count += 1;
    jsonData.data.push(values);

    await write(
      `./src/db/tables/${table.toLowerCase()}.json`,
      JSON.stringify(jsonData, null, 4),
    );
  }

  orderBy(by: string) {
    this.query = quickSort(this.query, by);
    return this;
  }

  async update(
    table: string,
    key: string,
    target: string,
    fields: string[],
    newVals: any[],
  ) {
    let file = await readJsonFile(table);
    const data = file.data;
    const index = binarySearch(data, key, target);
    if (index === -1) return null;
    const Nfields = fields;
    Nfields.forEach((field, i) => {
      data[index][field] = newVals[i];
    });

    await write(
      `./src/db/tables/${table.toLocaleLowerCase()}.json`,
      JSON.stringify({ data: data }, null, 4),
    );
    return this;
  }

  async delete(table: string, key: string, target: string) {
    let file = await readJsonFile(table);
    const data = file.data;
    const index = binarySearch(data, key, target);
    if (index === -1) return null;
    data.splice(index, 1);
    await write(
      `./src/db/tables/${table.toLowerCase()}.json`,
      JSON.stringify({ data: data }, null, 4),
    );
  }
}
export default Database;
