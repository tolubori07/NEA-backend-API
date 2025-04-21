import { readJsonFile } from "../../utils/readJsonFile";

interface AnnouncementType {
  ID: string;
  Body: string;
  Title: string;
  Announcer: string;
  Time: Date | string;
}

class Announcement implements AnnouncementType {
  ID: string;
  Body: string;
  Title: string;
  Announcer: string;
  Time: Date | string;

  private constructor(
    id: string,
    body: string,
    title: string,
    announcer: string,
    time: Date | string,
  ) {
    this.ID = id;
    this.Body = body;
    this.Title = title;
    this.Announcer = announcer;
    this.Time = time;
  }

  static async create(
    body: string,
    title: string,
    announcer: string,
    time: Date | string,
  ): Promise<Announcement> {
    const id = await this.generateID();
    return new Announcement(id, body, title, announcer, time);
  }

  private static async generateID(): Promise<string> {
    const list = await readJsonFile("announcements");

    const idx = typeof list.IDX === "number" ? list.IDX : 0;
    const nextID = idx + 1;

    if (nextID < 10) {
      return `AN00${nextID}`;
    } else if (nextID < 100) {
      return `AN0${nextID}`;
    } else {
      return `AN${nextID}`;
    }
  }
}

export { Announcement, type AnnouncementType };
