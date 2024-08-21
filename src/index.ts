import Server from "./server";
import db from "./db";
import parseBody from './utils/parseBody';
import sha256 from './algorithms/sha-256'
import { Donor } from "./db/Schemas/donors";
import { Volunteer, type VolunteerType } from "./db/Schemas/volunteer";
import { generateToken } from './utils/generatetoken'
import { Appointment, type AppointmentType } from "./db/Schemas/appointments";
import { protect } from "./middleware/authMiddleware";
import { Event } from "./db/Schemas/event";
import type { GenericObject } from "./types";


const port = process.env.PORT
const CORS_HEADERS = new Headers({
  'Access-Control-Allow-Origin': 'http://localhost:5173', // Instead of '*'
  'Access-Control-Allow-Methods': 'OPTIONS, POST, GET, PUT, PATCH, DELETE',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
});


const app = new Server()

app.get('/', () => {
  const file = Bun.file('./src/db/tables/donors.json')
  return new Response(file, { headers: CORS_HEADERS })
})

app.options("/dlogin", (req: Request) => {
  // Apply CORS headers to preflight requests
  return new Response(null, { status: 204, headers: CORS_HEADERS });
});

app.options("/availableSlots", (req: Request) => {
  // Apply CORS headers to preflight requests
  return new Response(null, { status: 204, headers: CORS_HEADERS });
});

app.options("/vlogin", (req: Request) => {
  // Apply CORS headers to preflight requests
  return new Response(null, { status: 204, headers: CORS_HEADERS });
});

app.options("/appointments", (req: Request) => {
  // Apply CORS headers to preflight requests
  return new Response(null, { status: 204, headers: CORS_HEADERS });
});

app.options("/nextAppointment", (req: Request) => {
  // Apply CORS headers to preflight requests
  return new Response(null, { status: 204, headers: CORS_HEADERS });
});


app.options("/events", (req: Request) => {
  // Apply CORS headers to preflight requests
  return new Response(null, { status: 204, headers: CORS_HEADERS });
});

app.options("/search", (req: Request) => {
  // Apply CORS headers to preflight requests
  return new Response(null, { status: 204, headers: CORS_HEADERS });
});

app.options("/getcentre", (req: Request) => {
  // Apply CORS headers to preflight requests
  return new Response(null, { status: 204, headers: CORS_HEADERS });
});


app.post("/dlogin", async (req: Request) => {
  // Apply CORS middleware
  try {
    const { email, password } = await parseBody(req);
    if (!email || !password) {
      return new Response("Please fill all fields", { status: 400, headers: CORS_HEADERS });
    }

    //@ts-ignore
    const donor: Donor = (await db.findOne('Donors', 'Email', email));

    if (!donor) {
      return new Response("Account not found", { status: 400, headers: CORS_HEADERS });
    }

    const isPasswordCorrect = sha256.verify(password, donor.Password);

    if (isPasswordCorrect) {
      const res = new Response(JSON.stringify({
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
      }), { status: 200, headers: CORS_HEADERS });
      return res
    } else {
      return new Response("Incorrect Password", { status: 400 });
    }
  } catch (error) {
    console.error("Error during login:", error);
    return new Response("Invalid request body", { status: 400, headers: CORS_HEADERS });
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
    const res = Response.json(appointmemnt, { status: 201, headers: CORS_HEADERS })
    return res
  } else {
    return new Response("Not Authorised", { status: 401 })
  }
})

//@ts-ignore
app.get("/appointments", async (req: Request) => {
  try {
    const donor: Donor = await protect(req);
    if (donor) {
      const query = (await db.select(['*'], 'Appointments')).where('Donor', donor.ID).getResults();

      if (query.length === 0) {
        return new Response("You have no appointments", { status: 200 });
      }

      const res: GenericObject[] = await Promise.all(
        query.map(async (appointment: AppointmentType) => {
          const donationCentre = await db.findOne('Centre', 'ID', appointment.Donation_Centre);

          return {
            ID: appointment.ID,
            Date: appointment.Date,
            Donation_Centre: donationCentre,
            Donor: appointment.Donor,
            Time: appointment.Time,
          };
        })
      );

      return Response.json(res, { status: 200, headers: CORS_HEADERS });
    } else {
      return new Response("Unauthorized", { status: 401 });
    }
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
});

app.get('/nextAppointment', async (req: Request) => {
  try {
    const donor = await protect(req)
    if (donor) {
      console.log(donor)
      const query = (await db.select(['*'], 'Appointments'))
        .where('Donor', donor.ID).getResults()
      const appointment = query[0];
      console.table(appointment)
      const donationcentre = await db.findOne('Centre', 'ID', appointment.Donation_Centre);
      console.log(donationcentre)
      return Response.json({
        ID: appointment.ID,
        Date: appointment.Date,
        Donation_Centre: donationcentre,
        Donor: appointment.Donor,
        Time: appointment.Time
      }, { status: 200, headers: CORS_HEADERS })
    }
  } catch (error) {
    console.error(error)
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
      }, { status: 200, headers: CORS_HEADERS });
    } else {
      return new Response("Incorrect Password", { status: 400 });
    }
  } catch (error) {
    console.error("Error during login:", error);
    return new Response("Invalid request body", { status: 400 });
  }
});


app.post("/events", async (req: Request) => {
  const volunteer: Volunteer = await protect(req)
  if (volunteer && volunteer.Admin === true) {
    const { name, location, address, postcode, date, start_time, end_time, target } = await parseBody(req)
    if (!name || !location || !address || !postcode || !date || !start_time || !end_time || !target) {
      return new Response("Please fill in all details", { status: 400 })
    }
    const event = await Event.create(name, location, address, postcode, date, start_time, end_time, target)
    await db.insertINTO('events', event)
    return Response.json(event, { status: 201, headers: CORS_HEADERS })
  } else {
    return new Response("Not authorised", { status: 400 })
  }
})

app.get("/events", async (req: Request) => {
  const volunteer: Volunteer = await protect(req)
  if (volunteer) {
    const query = (await db.select(['*'], 'Events'))
    if (JSON.stringify(query) === '[]') {
      return new Response("There are no events", { status: 200, headers: CORS_HEADERS })
    }
    return Response.json(query, { status: 200 })
  } else {
    return new Response("Not authorised", { status: 401 })
  }
})


app.post('/search', async (req: Request) => {
  const { city } = await parseBody(req)
  const query = (await db.select(['*'], 'Centre'))
    .where('City', city)
    .getResults()
  return Response.json(query, { status: 200, headers: CORS_HEADERS })
})


app.get("/getcentre", async (req: Request) => {
  try {
    // Extracting ID from query parameters
    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return new Response("ID parameter is required", { status: 400, headers: CORS_HEADERS });
    }

    // Fetch the centre using the ID
    const response = await db.findOne('centre', 'ID', id);

    if (!response) {
      return new Response("Centre not found", { status: 404, headers: CORS_HEADERS });
    }

    return Response.json(response, { status: 200, headers: CORS_HEADERS });
  } catch (error) {
    console.error("Error fetching centre:", error);
    return new Response("Internal Server Error", { status: 500, headers: CORS_HEADERS });
  }
})


app.get("/availableSlots", async (req: Request) => {
  try {
    const url = new URL(req.url);
    const date = url.searchParams.get('date');
    const centreId = url.searchParams.get('id');

    if (!date || !centreId) {
      return new Response("Date and Centre ID are required", { status: 400, headers: CORS_HEADERS });
    }

    // Define centre's opening hours
    const openingTime = 8; // 8 AM
    const closingTime = 18; // 6 PM
    const maxAppointmentsPerSlot = 5;

    // Generate all possible time slots for the day (on the hour)
    const allSlots: string[] = [];
    for (let hour = openingTime; hour < closingTime; hour++) {
      const hourStr = hour.toString().padStart(2, '0');
      allSlots.push(`${hour.toString().padStart(2, '0')}:00`);
    }

    // Retrieve all appointments for the given date and centre
    const appointments = (await db.select(['*'], 'Appointments'))
      .where('Date', date)
      .getResults();
      console.log(appointments)
      //.where('Donation_Centre', centreId)

    console.log(appointments);

    // Count appointments for each time slot
    const bookedSlots: { [key: string]: number } = {};
   for (const appointment of appointments) {
  const preTime = new Date(appointment.Time);
    const time = `${preTime.getUTCHours()}:0${preTime.getUTCMinutes()}`

  if (bookedSlots[time]) {
    // If the time slot already exists in bookedSlots, increment the count
    bookedSlots[time]++;
  } else {
    // If the time slot doesn't exist yet, initialize it with a count of 1
    bookedSlots[time] = 1;
  }
}
    console.log(bookedSlots)

    // Filter out fully booked slots
    const availableSlots: string[] = [];
    for (const slot of allSlots) {
      if (!bookedSlots[slot] || bookedSlots[slot] < maxAppointmentsPerSlot) {
        availableSlots.push(slot);
      }
    }

    return Response.json(availableSlots, { status: 200, headers: CORS_HEADERS });
  } catch (error) {
    console.error("Error fetching available slots:", error);
    return new Response("Internal Server Error", { status: 500, headers: CORS_HEADERS });
  }
});




//@ts-ignore
app.listen(port)
