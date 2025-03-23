import { readJsonFile } from "../../utils/readJsonFile";

interface eventVolunteerType {
  ID: string;
  event: string;
  volunteer: string;
}

class eventVolunteer implements eventVolunteerType {
  ID: string;
  event: string;
  volunteer: string;

  private constructor(ID: string, event: string, volunteer: string) {
    this.event = event;
    this.volunteer = volunteer;
    this.ID = ID;
  }

  static async create(
    Event: string,
    volunteer: string,
  ): Promise<eventVolunteer> {
    const id = await this.generateID();
    return new eventVolunteer(id, Event, volunteer);
  }

  private static async generateID(): Promise<string> {
    const list = await readJsonFile("events:volunteer");
    const nextID = list.IDX + 1;
    if (nextID < 10) {
      return `EV00${nextID}`;
    } else if (nextID < 100) {
      return `EV0${nextID}`;
    } else {
      return `EV${nextID}`;
    }
  }
}

export type { eventVolunteer as eventVolunteerType };
export { eventVolunteer };
