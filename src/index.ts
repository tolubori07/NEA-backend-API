import Server from "./server";
import db from "./db";
import parseBody from "./utils/parseBody";
import sha256 from "./algorithms/sha-256";
import { Donor } from "./db/Schemas/donors";
import { Volunteer } from "./db/Schemas/volunteer";
import { generateToken } from "./utils/generatetoken";
import { Appointment, type AppointmentType } from "./db/Schemas/appointments";
import { protect } from "./middleware/authMiddleware";
import { Event } from "./db/Schemas/event";
import type { GenericObject } from "./types";

const port: string | undefined = process.env.PORT;
const CORS_HEADERS = new Headers({
  "Access-Control-Allow-Origin": "http://localhost:5173", // Instead of '*'
  "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT, PATCH, DELETE",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
});

const app = new Server();

app.get("/", () => {
  const file = Bun.file("./src/db/tables/donors.json");
  return new Response(file, { headers: CORS_HEADERS });
});

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

app.options("/appointment", (req: Request) => {
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

app.options("/rescheduleappointment", (req: Request) => {
  // Apply CORS headers to preflight requests
  return new Response(null, { status: 204, headers: CORS_HEADERS });
});

app.options("/cancelappointment", (req: Request) => {
  // Apply CORS headers to preflight requests
  return new Response(null, { status: 204, headers: CORS_HEADERS });
});

//HTTP POST verb endpoint for donor login
app.post("/dlogin", async (req: Request) => {
  //Try to parse the email and password from the request body
  try {
    const { email, password } = await parseBody(req);
    //if email or password is not found we return a status 400 error(i.e bad request) to the user
    if (!email || !password) {
      return new Response("Please fill all fields", {
        status: 400,
        headers: CORS_HEADERS,
      });
    }

    //@ts-ignore
    // Initialise use the findone method to find a donor with the matching email
    const donor: Donor = await db.findOne("Donors", "Email", email);

    //if we cannot find the donor in the table we return a  status code 400 for an invalid request
    if (!donor) {
      return new Response("Account not found", {
        status: 400,
        headers: CORS_HEADERS,
      });
    }

    // use the sha-256 verification algorithm  to confirm if the password matches
    // if they do, the function returns true else false
    const isPasswordCorrect = sha256.verify(password, donor.Password);

    //if password is correct then we return the neccessary user information
    if (isPasswordCorrect) {
      const res = new Response(
        JSON.stringify({
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
        }),
        { status: 200, headers: CORS_HEADERS },
      );
      return res;
    }
    //if the password doesn't match we return an error messag along with a status code
    else {
      return new Response("Incorrect Password", { status: 401 });
    }
    //if an error occurs then return error during login
  } catch (error) {
    return new Response("Invalid request body:" + error, {
      status: 400,
      headers: CORS_HEADERS,
    });
  }
});

//HTTP POST endpoint for creating appointments
app.post("/appointments", async (req: Request) => {
  // protect the request by verifying the user and fetch the request user
  const donor: Donor = await protect(req);
  // check if the donor exists
  if (donor) {
    //if they exist parse the date, time and request centre from the request body
    const { date, time, centre } = await parseBody(req);
    //if any of the fields are missing, return an error to the user
    if (!date || !time || !centre) {
      return new Response("Missing fields for creating appointments", {
        status: 400,
      });
    }
    // create an appointment using the data parsed from the request and the donor's ID
    const appointmemnt = await Appointment.create(date, time, centre, donor.ID);
    //then insert the appointment into the appointments table
    await db.insertINTO("appointments", appointmemnt);
    //return the appointments as a response
    const res = Response.json(appointmemnt, {
      status: 201,
      headers: CORS_HEADERS,
    });
    return res;
    //if donor is not found, then return an error telling the user that they are unauthorised
  } else {
    return new Response("Not Authorised", { status: 401 });
  }
});

//@ts-ignore
//HTTP GET route for fetching user's appointments
app.get("/appointments", async (req: Request) => {
  //try to get the donor by decoding the donor ID from the bearer token in the header, this is also used as a method to protect the route
  try {
    const donor: Donor = await protect(req);
    //if the ID is decoded from the header, find the donor's appointments in the database
    if (donor) {
      const query = (await db.select(["*"], "Appointments"))
        .where("Donor", donor.ID)
        .orderBy("Date")
        .getResults();
      //if the length is 0 we can assume that the donor has no appointments and return a message telling them that they have none
      if (query.length === 0) {
        return new Response("You have no appointments", { status: 200 });
      }
      // initialise a result variable
      const res: GenericObject[] = await Promise.all(
        //loop through the array list of appointments and find which appointment centres match which donationn centre id in the appointment centre and return the donation centre object to the element in the list
        //@ts-ignore
        query.map(async (appointment: AppointmentType) => {
          const donationCentre = await db.findOne(
            "Centre",
            "ID",
            appointment.Donation_Centre,
          );

          return {
            ID: appointment.ID,
            Date: appointment.Date,
            Donation_Centre: donationCentre,
            Donor: appointment.Donor,
            Time: appointment.Time,
          };
        }),
      );
      //return the list of objects and return it with a status code 200 for success
      return Response.json(res, { status: 200, headers: CORS_HEADERS });
    } else {
      //if no donor matches the donor ID then we return an error telling them that they are unauthorised to make requests to these requests using a status code 401
      return new Response("Unauthorized", { status: 401 });
    }
  } catch (error) {
    //if there's an unexpected error, then we return an error 500(i.e internal server error)
    return new Response("Internal Server Error", { status: 500 });
  }
});

//HTTP GET route to get the user's next appointment
//@ts-ignore
app.get("/nextAppointment", async (req: Request) => {
  //try to get the donor by decoding the donor ID from the bearer token in the header, this is also used as a method to protect the route
  try {
    const donor = await protect(req);
    //if the id is found in the header, we select all of the user's appointments
    //then we order it by date and select the first appointment only as our response body
    if (donor) {
      const query = (await db.select(["*"], "Appointments"))
        .where("Donor", donor.ID)
        .orderBy("Date")
        .getResults();
      const appointment = query[0];
      //then find the donation centre for that appointment and add it to the response body
      const donationcentre = await db.findOne(
        "Centre",
        "ID",
        appointment.Donation_Centre,
      );
      return Response.json(
        {
          ID: appointment.ID,
          Date: appointment.Date,
          Donation_Centre: donationcentre,
          Donor: appointment.Donor,
          Time: appointment.Time,
        },
        { status: 200, headers: CORS_HEADERS },
      );
    }
  } catch (error) {
    //if there's an unexpected error, then we can return an error 500 for an internal server error
    return new Response("Errror while fetching appointment" + error, {
      status: 500,
    });
  }
});

//@ts-ignore
app.post("/appointment", async (req: Request) => {
  //try to get the donor by decoding the donor ID from the bearer token in the header, this is also used as a method to protect the route
  try {
    const donor = await protect(req);
    const { ID } = await parseBody(req);
    //if the id is found in the header, we select all of the user's appointments
    //then we order it by date and select the first appointment only as our response body
    if (donor) {
      const appointment = await db.findOne("appointments", "ID", ID);
      console.log(appointment);
      //then find the donation centre for that appointment and add it to the response body
      const donationcentre = await db.findOne(
        "Centre",
        "ID",
        appointment.Donation_Centre,
      );
      return Response.json(
        {
          ID: appointment.ID,
          Date: appointment.Date,
          Donation_Centre: donationcentre,
          Donor: appointment.Donor,
          Time: appointment.Time,
        },
        { status: 200, headers: CORS_HEADERS },
      );
    }
  } catch (error) {
    //if there's an unexpected error, then we can return an error 500 for an internal server error
    return new Response("Errror while fetching appointment" + error, {
      status: 500,
    });
  }
});

app.post("/vlogin", async (req: Request) => {
  try {
    const { email, password } = await parseBody(req);
    if (!email || !password) {
      return new Response("Please fill all fields", { status: 400 });
    }

    //@ts-ignore
    const volunteer: Volunteer = await db.findOne("Volunteer", "Email", email);

    if (!volunteer) {
      return new Response("Account not found", { status: 400 });
    }

    const isPasswordCorrect = sha256.verify(password, volunteer.Password);

    if (isPasswordCorrect) {
      return Response.json(
        {
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
          service: volunteer.ServiceOffered,
        },
        { status: 200, headers: CORS_HEADERS },
      );
    } else {
      return new Response("Incorrect Password", { status: 400 });
    }
  } catch (error) {
    console.error("Error during login:", error);
    return new Response("Invalid request body", { status: 400 });
  }
});

app.post("/events", async (req: Request) => {
  const volunteer: Volunteer = await protect(req);
  if (volunteer && volunteer.Admin === true) {
    const {
      name,
      location,
      address,
      postcode,
      date,
      start_time,
      end_time,
      target,
    } = await parseBody(req);
    if (
      !name ||
      !location ||
      !address ||
      !postcode ||
      !date ||
      !start_time ||
      !end_time ||
      !target
    ) {
      return new Response("Please fill in all details", { status: 400 });
    }
    const event = await Event.create(
      name,
      location,
      address,
      postcode,
      date,
      start_time,
      end_time,
      target,
    );
    await db.insertINTO("events", event);
    return Response.json(event, { status: 201, headers: CORS_HEADERS });
  } else {
    return new Response("Not authorised", { status: 400 });
  }
});

app.get("/events", async (req: Request) => {
  const volunteer: Volunteer = await protect(req);
  if (volunteer) {
    const query = await db.select(["*"], "Events");
    if (JSON.stringify(query) === "[]") {
      return new Response("There are no events", {
        status: 200,
        headers: CORS_HEADERS,
      });
    }
    return Response.json(query, { status: 200 });
  } else {
    return new Response("Not authorised", { status: 401 });
  }
});

//HTTP POST route for serching for donation centres in a city/town
app.post("/search", async (req: Request) => {
  //we parse the city from the request body
  const { city } = await parseBody(req);
  //then find all centres with that city as their city
  const query = (await db.select(["*"], "Centre"))
    .where("City", city)
    .getResults();
  // return the Appointments as a response object
  return Response.json(query, { status: 200, headers: CORS_HEADERS });
});

app.get("/getcentre", async (req: Request) => {
  try {
    // Extracting ID from query parameters
    const url = new URL(req.url);
    //using the builtin searchparam function to get the ID from the parameter
    const id = url.searchParams.get("id");
    //if there's no id in the url then we return an error message
    if (!id) {
      return new Response("ID parameter is required", {
        status: 400,
        headers: CORS_HEADERS,
      });
    }

    // Fetch the centre using the ID
    const response = await db.findOne("centre", "ID", id);

    if (!response) {
      return new Response("Centre not found", {
        status: 404,
        headers: CORS_HEADERS,
      });
    }

    return Response.json(response, { status: 200, headers: CORS_HEADERS });
  } catch (error) {
    console.error("Error fetching centre:", error);
    return new Response("Internal Server Error", {
      status: 500,
      headers: CORS_HEADERS,
    });
  }
});

app.get("/availableSlots", async (req: Request) => {
  try {
    const url = new URL(req.url);
    const date = url.searchParams.get("date");
    const centreId = url.searchParams.get("id");

    if (!date || !centreId) {
      return new Response("Date and Centre ID are required", {
        status: 400,
        headers: CORS_HEADERS,
      });
    }

    // Define centre's opening hours
    const openingTime = 8; // 8 AM
    const closingTime = 18; // 6 PM
    const maxAppointmentsPerSlot = 5;

    // Generate all possible time slots for the day (on the hour)
    const allSlots: string[] = [];
    for (let hour = openingTime; hour < closingTime; hour++) {
      const hourStr = hour.toString().padStart(2, "0");
      allSlots.push(`${hour.toString().padStart(2, "0")}:00`);
    }

    // Retrieve all appointments for the given date and centre
    const appointments = (await db.select(["*"], "Appointments"))
      .where("Date", date)
      .getResults();
    // Count appointments for each time slot
    const bookedSlots: { [key: string]: number } = {};
    for (const appointment of appointments) {
      const preTime = new Date(appointment.Time);
      const time = `${preTime.getUTCHours()}:0${preTime.getUTCMinutes()}`;

      if (bookedSlots[time]) {
        // If the time slot already exists in bookedSlots, increment the count
        bookedSlots[time]++;
      } else {
        // If the time slot doesn't exist yet, initialize it with a count of 1
        bookedSlots[time] = 1;
      }
    }

    // Filter out fully booked slots
    const availableSlots: string[] = [];
    for (const slot of allSlots) {
      if (!bookedSlots[slot] || bookedSlots[slot] < maxAppointmentsPerSlot) {
        availableSlots.push(slot);
      }
    }

    return Response.json(availableSlots, {
      status: 200,
      headers: CORS_HEADERS,
    });
  } catch (error) {
    console.error("Error fetching available slots:", error);
    return new Response("Internal Server Error", {
      status: 500,
      headers: CORS_HEADERS,
    });
  }
});

//@ts-ignore
app.put("/rescheduleappointment", async (req: Request) => {
  try {
    const donor: Donor = await protect(req);
    if (!donor) {
      return new Response("Unauthorised, Donor not verified", {
        status: 401,
        headers: CORS_HEADERS,
      });
    }

    const { password, fields, values, appointment } = (await parseBody(
      req,
    )) as {
      password: string;
      fields: string[];
      values: any[];
      appointment: string;
    };
    const isPasswordCorrect: boolean = sha256.verify(password, donor.Password);
    if (!isPasswordCorrect) {
      return new Response("Oops, Incorrect Password", {
        status: 401,
        headers: CORS_HEADERS,
      });
    }

    await db.update("appointments", "ID", appointment, fields, values);

    return new Response("Appointment rescheduled successfully", {
      status: 200,
      headers: CORS_HEADERS,
    });
  } catch (error) {
    console.error("Error rescheduling appointment:", error);
    return new Response("Internal Server Error", {
      status: 500,
      headers: CORS_HEADERS,
    });
  }
});

//@ts-ignore
app.delete("/cancelappointment", async (req: Request) => {
  try {
    const donor: Donor = await protect(req);
    if (!donor)
      return new Response("Unauthorised, Donor not verified", {
        status: 401,
        headers: CORS_HEADERS,
      });
    const { password, appointment_id } = await parseBody(req);
    const isPasswordCorrect: boolean = sha256.verify(password, donor.Password);
    if (!isPasswordCorrect) {
      return new Response("Oops, Incorrect Password", {
        status: 401,
        headers: CORS_HEADERS,
      });
    }
    const appointment: Appointment = await db.findOne(
      "appointments",
      "ID",
      appointment_id,
    );
    if (appointment) {
      await db.delete("appointments", "ID", appointment_id);
    } else {
      return new Response("That appointment doesn't exist", {
        status: 400,
        headers: CORS_HEADERS,
      });
    }
    return new Response("Appointment Deleted succefully", {
      status: 200,
      headers: CORS_HEADERS,
    });
  } catch (error) {
    console.error("An error occured");

    return new Response("Internal Server Error", {
      status: 500,
      headers: CORS_HEADERS,
    });
  }
});

//@ts-ignore
app.listen(port);
