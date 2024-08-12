interface Donor {
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
  Password: string
}
class Donor {
  constructor(
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
    Password: string) {
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
}

export type {Donor as DonorType}
export {Donor}
