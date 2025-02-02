import { readJsonFile } from "../../utils/readJsonFile";

interface DonorType {
  ID: string;
  FirstName: string;
  LastName: string;
  Email: string;
  DateOfBirth: Date;
  Title: string;
  PhoneNumber: string;
  Cityofresidence: string;
  PostCode: string;
  BloodGroup: string;
  Genotype: string;
  Occupation: string;
  Password: string;
}
class Donor implements DonorType {
  ID: string;
  FirstName: string;
  LastName: string;
  Email: string;
  DateOfBirth: Date;
  Title: string;
  PhoneNumber: string;
  Cityofresidence: string;
  PostCode: string;
  BloodGroup: string;
  Genotype: string;
  Occupation: string;
  Password: string;

  private constructor(
    ID: string,
    FirstName: string,
    LastName: string,
    Email: string,
    DateOfBirth: Date,
    Title: string,
    PhoneNumber: string,
    Cityofresidence: string,
    PostCode: string,
    BloodGroup: string,
    Genotype: string,
    Occupation: string,
    Password: string,
  ) {
    this.ID = ID;
    this.FirstName = FirstName;
    this.LastName = LastName;
    this.Email = Email;
    this.DateOfBirth = DateOfBirth;
    this.Title = Title;
    this.PhoneNumber = PhoneNumber;
    this.Cityofresidence = Cityofresidence;
    this.PostCode = PostCode;
    this.BloodGroup = BloodGroup;
    this.Genotype = Genotype;
    this.Occupation = Occupation;
    this.Password = Password;
  }

  //Factory method to create a new Donor instance
  static async create(
    FirstName: string,
    LastName: string,
    Email: string,
    DateOfBirth: Date,
    Title: string,
    PhoneNumber: string,
    Cityofresidence: string,
    PostCode: string,
    BloodGroup: string,
    Genotype: string,
    Occupation: string,
    Password: string,
  ): Promise<Donor> {
    const id = await this.generateID();
    return new Donor(
      id,
      FirstName,
      LastName,
      Email,
      DateOfBirth,
      Title,
      PhoneNumber,
      Cityofresidence,
      PostCode,
      BloodGroup,
      Genotype,
      Occupation,
      Password,
    );
  }

  // Method to generate the ID based on the current list of appointments
  private static async generateID(): Promise<string> {
    const list = await readJsonFile("donors");
    const nextID = list.IDX + 1;
    if (nextID < 10) {
      return `D00${nextID}`;
    } else if (nextID < 100) {
      return `D0${nextID}`;
    } else {
      return `D${nextID}`;
    }
  }
}

export type { Donor as DonorType };
export { Donor };
