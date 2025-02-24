import { readJsonFile } from "../../utils/readJsonFile";

interface VolunteerType {
  ID: string;
  First_Name: string;
  Last_Name: string;
  Email: string;
  Date_Of_Birth: Date;
  Title: string;
  Phone_Number: string;
  City_of_residence: string;
  PostCode: string;
  BloodGroup: string;
  Genotype: string;
  Occupation: string;
  Password: string;
  Admin: boolean;
  services: string[];
}
class Volunteer implements VolunteerType {
  ID: string;
  First_Name: string;
  Last_Name: string;
  Email: string;
  Date_Of_Birth: Date;
  Title: string;
  Phone_Number: string;
  City_of_residence: string;
  PostCode: string;
  BloodGroup: string;
  Genotype: string;
  Occupation: string;
  Password: string;
  Admin: boolean;
  services: string[];

  private constructor(
    ID: string,
    First_Name: string,
    Last_Name: string,
    Email: string,
    Date_Of_Birth: Date,
    Title: string,
    Phone_Number: string,
    City_of_residence: string,
    PostCode: string,
    BloodGroup: string,
    Genotype: string,
    Password: string,
    services: string[],
    Occupation: string,
    Admin: boolean,
  ) {
    this.ID = ID;
    this.First_Name = First_Name;
    this.Last_Name = Last_Name;
    this.Email = Email;
    this.Date_Of_Birth = Date_Of_Birth;
    this.Title = Title;
    this.Phone_Number = Phone_Number;
    this.City_of_residence = City_of_residence;
    this.PostCode = PostCode;
    this.BloodGroup = BloodGroup;
    this.Genotype = Genotype;
    this.Occupation = Occupation;
    this.Password = Password;
    this.services = services;
    this.Admin = Admin;
  }

  //Factory method to create a new Donor instance
  static async create(
    First_Name: string,
    Last_Name: string,
    Email: string,
    Date_of_Birth: Date,
    Title: string,
    Phone_Number: string,
    City_of_residence: string,
    PostCode: string,
    BloodGroup: string,
    Genotype: string,
    Occupation: string,
    services: string[],
    Password: string,
    Admin: boolean,
  ): Promise<Volunteer> {
    const id = await this.generateID();
    return new Volunteer(
      id,
      First_Name,
      Last_Name,
      Email,
      Date_of_Birth,
      Title,
      Phone_Number,
      City_of_residence,
      PostCode,
      BloodGroup,
      Genotype,
      Password,
      services,
      Occupation,
      Admin,
    );
  }

  // Method to generate the ID based on the current list of appointments
  private static async generateID(): Promise<string> {
    const list = await readJsonFile("volunteer");
    const nextID = list.IDX + 1;
    if (nextID < 10) {
      return `V00${nextID}`;
    } else if (nextID < 100) {
      return `V0${nextID}`;
    } else {
      return `V${nextID}`;
    }
  }
}

export { Volunteer, type VolunteerType };
