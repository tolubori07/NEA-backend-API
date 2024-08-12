interface VolunteerType {
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
  Occupation: string,
  Password: string,
  Admin: boolean,
  ServiceOffered: string,
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
  ServiceOffered: string;

  constructor(
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
    ServiceOffered: string,
    Occupation: string,
    Admin: boolean) {
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
    this.ServiceOffered = ServiceOffered;
    this.Admin = Admin;
  }
}

export { Volunteer, type VolunteerType }
