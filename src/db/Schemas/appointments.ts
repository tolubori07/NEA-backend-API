import { readJsonFile } from "../../utils/readJsonFile";

interface AppointmentType {
  ID: string;
  Date: Date;
  Time: string;  // Assuming time is in 'HH:MM' format
  Donation_Centre: string;
  Donor: string;
}

class Appointment implements AppointmentType {
  ID: string;
  Date: Date;
  Time: string;
  Donation_Centre: string;
  Donor: string;

  private constructor(id: string, date: Date, time: string, donation_centre: string, donor: string) {
    this.ID = id;
    this.Date = date;
    this.Time = time;
    this.Donation_Centre = donation_centre;
    this.Donor = donor;
  }

  // Factory method to create a new Appointment instance
  static async create(date: Date, time: string, donation_centre: string, donor: string): Promise<Appointment> {
    const id = await this.generateID();
    return new Appointment(id, date, time, donation_centre, donor);
  }

  // Method to generate the ID based on the current list of appointments
  private static async generateID(): Promise<string> {
    const list = await readJsonFile('appointments');
    const nextID = list.length + 1;
    if (nextID < 10) {
      return `A00${nextID}`;
    } else if (nextID < 100) {
      return `A0${nextID}`;
    } else {
      return `A${nextID}`;
    }
  }
}

export { Appointment, type AppointmentType };

