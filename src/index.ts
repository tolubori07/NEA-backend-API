import Server from "./server";
import db from "./db";
import parseBody from './utils/parseBody';
import sha256 from './algorithms/sha-256'
import { Donor } from "./db/Schemas/donors";
import { Volunteer, type VolunteerType } from "./db/Schemas/volunteer";
import { generateToken } from './utils/generatetoken'
import { Appointment } from "./db/Schemas/appointments";
import { protect } from "./middleware/authMiddleware";
import { Event } from "./db/Schemas/event";


const port = process.env.PORT

const app = new Server()

app.get('/', () => {
  const file = Bun.file('./src/db/tables/donors.json')
  return new Response(file)
})

app.get('/test', async () => {
  return Response.json((await db.select(['ID', 'Body'], 'announcements')).where('ID', 'AN001'))
})

app.get('/findone', async () => {
  return Response.json(await db.findOne('Donors', 'LastName', 'Johnson'))
})



app.post("/dlogin", async (req: Request) => {
  try {
    const { email, password } = await parseBody(req);
    if (!email || !password) {
      return new Response("Please fill all fields", { status: 400 });
    }

    //@ts-ignore
    const donor: Donor = (await db.findOne('Donors', 'Email', email));

    if (!donor) {
      return new Response("Account not found", { status: 400 });
    }

    const isPasswordCorrect = sha256.verify(password, donor.Password);

    if (isPasswordCorrect) {
      return Response.json({
        token: generateToken(donor.ID),
        id: donor.ID,
        firstname: donor.FirstName,
        lastname: donor.LastName,
        email: donor.Email,
        dob: donor.DateOfBirth,
        title: donor.Title,
        phone: donor.PhoneNumber,
        city: donor.Cityofresidence,
        postcode: donor.PostCode,
        bloodgroup: donor.BloodGroup,
        genotype: donor.Genotype,
        occupation: donor.Occupation,
      });
    } else {
      return new Response("Incorrect Password", { status: 400 });
    }
  } catch (error) {
    console.error("Error during login:", error);
    return new Response("Invalid request body", { status: 400 });
  }
});


app.post("/appointments", async (req: Request) => {
  const donor: Donor = await protect(req)
  if (donor) {
    const { date, time, centre } = await parseBody(req);
    if (!date || !time || !centre) {
      return new Response("Missing fields for creating appointments", { status: 400 })
    }
    const appointmemnt = await Appointment.create(date, time, centre, donor.ID)
    await db.insertINTO('appointments', appointmemnt)
    return Response.json(appointmemnt, { status: 201 })
  } else {
    return new Response("Not Authorised", { status: 401 })
  }
})

//@ts-ignore
app.get("/appointments", async (req: Request) => {
  const donor: Donor = await protect(req)
  if (donor) {
    const query = (await db.select(['*'], 'Appointments')).where('Donor', donor.ID)
    if (JSON.stringify(query) === '[]') {
      return new Response("You have no appointments", { status: 200 })
    }
    return Response.json(query, { status: 200 })
  }
})

app.post("/vlogin", async (req: Request) => {
  try {
    const { email, password } = await parseBody(req);
    if (!email || !password) {
      return new Response("Please fill all fields", { status: 400 });
    }

    //@ts-ignore
    const volunteer: Volunteer = (await db.findOne('Volunteer', 'Email', email));

    if (!volunteer) {
      return new Response("Account not found", { status: 400 });
    }

    const isPasswordCorrect = sha256.verify(password, volunteer.Password);

    if (isPasswordCorrect) {
      return Response.json({
        token: generateToken(volunteer.ID),
        id: volunteer.ID,
        firstname: volunteer.First_Name,
        lastname: volunteer.Last_Name,
        email: volunteer.Email,
        dob: volunteer.Date_Of_Birth,
        title: volunteer.Title,
        phone: volunteer.Phone_Number,
        city: volunteer.City_of_residence,
        postcode: volunteer.PostCode,
        bloodgroup: volunteer.BloodGroup,
        genotype: volunteer.Genotype,
        occupation: volunteer.Occupation,
        admin: volunteer.Admin,
        service: volunteer.ServiceOffered
      });
    } else {
      return new Response("Incorrect Password", { status: 400 });
    }
  } catch (error) {
    console.error("Error during login:", error);
    return new Response("Invalid request body", { status: 400 });
  }
});


app.post("/events", async(req:Request)=>{ 
  const volunteer:Volunteer = await protect(req)
  if(volunteer && volunteer.Admin === true){
    const {name,location,address,postcode,date,start_time,end_time,target} = await parseBody(req)
    if(!name || !location || !address || !postcode || !date || !start_time || !end_time || !target){ 
      return new Response("Please fill in all details",{status:400})
    }
    const event = await Event.create(name,location,address,postcode,date,start_time,end_time,target)
    await db.insertINTO('events',event)
    return Response.json(event,{status:201})
  } else{ 
    return new Response("Not authorised",{status:400})
  }
})

app.get("/events", async(req:Request)=>{ 
 const volunteer: Volunteer = await protect(req)
  if (volunteer) {
    const query = (await db.select(['*'], 'Events'))
    if (JSON.stringify(query) === '[]') {
      return new Response("There are no events", { status: 200 })
    }
    return Response.json(query, { status: 200 })
  }else{ 
    return new Response("Not authorised",{status:401})
  }
 
})

//@ts-ignore
app.listen(port)
