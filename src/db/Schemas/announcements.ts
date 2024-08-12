interface Announcement{ 
  ID: string,
  Body:string,
  Title:string,
  Announcer: string 
} 

class Announcement{
  constructor(ID:string,Body:string,Title:string,Announcer:string) {
    this.ID = ID;
    this.Body = Body;
    this.Title = Title;
    this.Announcer = Announcer;
  }
}
export {Announcement}
