interface centre{
    ID: string,
    Address: string,
    Postcode: string,
    Name: string,
}

class centre{
    constructor(address: string, postcode: string, id: string,name:string) {
        this.Address = address;
        this.Postcode = postcode;
        this.ID = id;
        this.Name = name;
    }
}