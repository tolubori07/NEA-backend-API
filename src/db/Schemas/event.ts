import { readJsonFile } from "../../utils/readJsonFile";

interface EventType {
  ID: string;
  Name: string;
  Center: string;
  Date: Date;
  Start_Time: Date;
  End_Time: Date;
  Target: Number;
}

class Event implements EventType {
  ID: string;
  Name: string;
  Center: string;
  Date: Date;
  Start_Time: Date;
  End_Time: Date;
  Target: Number;

  private constructor(
    id: string,
    name: string,
    center: string,
    date: Date,
    start_time: Date,
    end_time: Date,
    target: Number,
  ) {
    this.ID = id;
    this.Name = name;
    this.Center = center;
    this.Date = date;
    this.Start_Time = start_time;
    this.End_Time = end_time;
    this.Target = target;
  }

  // Factory method to create a new Appointment instance
  static async create(
    name: string,
    center: string,
    date: Date,
    start_time: Date,
    end_time: Date,
    target: Number,
  ): Promise<Event> {
    const id = await this.generateID();
    return new Event(id, name, center, date, start_time, end_time, target);
  }

  // Method to generate the ID based on the current list of appointments
  private static async generateID(): Promise<string> {
    const list = await readJsonFile("events");
    const nextID = list.IDX + 1;
    if (nextID < 10) {
      return `E00${nextID}`;
    } else if (nextID < 100) {
      return `E0${nextID}`;
    } else {
      return `E${nextID}`;
    }
  }
}

export { Event, type EventType };
