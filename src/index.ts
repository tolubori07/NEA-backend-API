import Server from "./server";
import db from "./db";
import parseBody from "./utils/parseBody";
import sha256 from "./algorithms/sha-256";
import { Donor } from "./db/Schemas/donors";
import { Announcement } from "./db/Schemas/announcements";
import { Volunteer, type VolunteerType } from "./db/Schemas/volunteer";
import { generateToken } from "./utils/generatetoken";
import { Appointment, type AppointmentType } from "./db/Schemas/appointments";
import { protect } from "./middleware/authMiddleware";
import { Event } from "./db/Schemas/event";
import type { GenericObject } from "./types";
import { quickSort } from "./algorithms/Quicksort";
import {
  eventVolunteer,
  type eventVolunteerType,
} from "./db/Schemas/events:volunteer";
import { sendHTMLmail } from "./utils/gmailHTMLmailer";
import { binarySearch } from "./algorithms/BinarySearch";

const port: string | undefined = process.env.PORT;
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT, PATCH, DELETE",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Credentials": "true",
};

const headers = ` <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Password Updated</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background-color: rgb(214, 219, 232);
            margin: 0;
            padding: 0;
            color: rgb(52, 53, 54);
        }

        .container {
            max-width: 600px;
            margin: 20px auto;
            padding: 30px;
            background-color: #fff;
            border: 4px solid rgb(218, 51, 39);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            border-radius: 10px;
        }

        .header {
            background-color: rgb(218, 51, 39);
            padding: 30px;
            text-align: center;
            color: white;
            font-size: 24px;
            text-transform: uppercase;
            font-weight: bold;
            border-radius: 10px 10px 0 0;
            letter-spacing: 2px;
            border-bottom: 4px solid rgb(231, 127, 132);
        }

        .content {
            padding: 20px;
            text-align: center;
            margin-top: 20px;
        }

        .content p {
            font-size: 18px;
            line-height: 1.6;
            margin-bottom: 20px;
        }

        .footer {
            text-align: center;
            font-size: 14px;
            color: rgb(52, 53, 54);
            margin-top: 40px;
            padding: 20px;
            border-top: 4px solid rgb(218, 51, 39);
        }

        .footer p {
            margin: 5px 0;
        }
    </style>
</head>
<body>
`;
const close = ` </body>
</html>
`;

const app = new Server();

app.get("/", async (req: Request) => {
  const query = (await db.select(["*"], "Appointments")).getResults();
  return Response.json(query);
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

app.options("/dsignup", (req: Request) => {
  // Apply CORS headers to preflight requests
  return new Response(null, { status: 204, headers: CORS_HEADERS });
});
app.options("/availableSlots", (req: Request) => {
  // Apply CORS headers to preflight requests
  return new Response(null, { status: 204, headers: CORS_HEADERS });
});
app.options("/updatepassword", (req: Request) => {
  // Apply CORS headers to preflight requests
  return new Response(null, { status: 204, headers: CORS_HEADERS });
});
app.options("/announcements", (req: Request) => {
  // Apply CORS headers to preflight requests
  return new Response(null, { status: 204, headers: CORS_HEADERS });
});
app.options("/bookevent", (req: Request) => {
  // Apply CORS headers to preflight requests
  return new Response(null, { status: 204, headers: CORS_HEADERS });
});
app.options("/dsignup", (req: Request) => {
  // Apply CORS headers to preflight requests
  return new Response(null, { status: 204, headers: CORS_HEADERS });
});
app.options("/signedevents", (req: Request) => {
  // Apply CORS headers to preflight requests
  return new Response(null, { status: 204, headers: CORS_HEADERS });
});
app.options("/unsignedevents", (req: Request) => {
  // Apply CORS headers to preflight requests
  return new Response(null, { status: 204, headers: CORS_HEADERS });
});
app.options("/upcomingevent", (req: Request) => {
  // Apply CORS headers to preflight requests
  return new Response(null, { status: 204, headers: CORS_HEADERS });
});
app.options("/sendmessage", (req: Request) => {
  // Apply CORS headers to preflight requests
  return new Response(null, { status: 204, headers: CORS_HEADERS });
});
app.options("/cancelevent", (req: Request) => {
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

    // Initialise use the findone method to find a donor with the matching email
    const donor: Donor = await db.findOne(
      "donors",
      "Email",
      email.toLowerCase(),
    );

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

//HTTP POST endpoint for creating Donors
//@ts-ignore
app.post("/dsignup", async (req: Request) => {
  try {
    const {
      firstname,
      lastname,
      email,
      DOB,
      title,
      phoneNumber,
      city,
      postcode,
      bloodgroup,
      genotype,
      occupation,
      password,
    } = await parseBody(req);
    const check = await db.findOne("Donors", "Email", email);
    if (check) {
      return new Response("Donor Already Exists", {
        status: 400,
        headers: CORS_HEADERS,
      });
    }
    if (
      !firstname ||
      !lastname ||
      !email ||
      !DOB ||
      !title ||
      !phoneNumber ||
      !city ||
      !postcode ||
      !bloodgroup ||
      !genotype ||
      !occupation ||
      !password
    ) {
      return new Response("Please fill all fields", {
        status: 400,
        headers: CORS_HEADERS,
      });
    } else {
      const hashedpassword = sha256.sign(password);
      try {
        const donor = await Donor.create(
          firstname,
          lastname,
          email.toLowerCase(),
          DOB,
          title,
          phoneNumber,
          city,
          postcode,
          bloodgroup,
          genotype,
          occupation,
          hashedpassword,
        );
        await db.insertINTO("donors", donor);
        const htmlContent = `
${headers}
<div class="container">
        <div class="header">
            <h1>Welcome to Onehealth Life Savers</h1>
        </div>
        <div class="content">
            <p>Dear ${title}${" "}${firstname},</p>
            <p>Thank you for signing up to become a life-saver! Your willingness to donate blood can help save lives and make a real difference in the community.</p>
            <p>Get started by booking your first donation appointment today.</p>
            <a href="onehealthls.netlify.app/donor/bookappointment" class="button">Schedule Your Donation</a>
        </div>
        <div class="footer">
            <p>If you have any questions, feel free to contact us at <a mailto="olifesavers@gmail.com">olifesavers@gmail.com</p>
            <p>&copy; 2025 LifeSave Blood Donation. All rights reserved.</p>
        </div>
    </div>
${close}
`;
        sendHTMLmail(email, "Welcome Aboard", htmlContent)
          .then(console.log)
          .catch(console.error);

        return Response.json(
          {
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
          },
          { status: 201, headers: CORS_HEADERS },
        );
      } catch (error) {
        console.error(error);
      }
    }
  } catch (error) {
    return new Response("Invalid request body" + error, {
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
    const appointment = await Appointment.create(date, time, centre, donor.ID);
    //then insert the appointment into the appointments table
    await db.insertINTO("appointments", appointment);
    const content = `
${headers}    <div class="container">
        <div class="header">
            <h1>Your Appointment is Confirmed!</h1>
        </div>
        <div class="content">
            <p>Dear ${donor.Title} ${donor.LastName},</p>
            <p>Thank you for scheduling your blood donation appointment! We're excited to have you join us in this life-saving effort.</p>
            <p>To view the details of your appointment, please click the link below:</p>
            
            <a href="https://onehealthls.netlify.app/donor/manageappointment/${appointment.ID}" class="button">View Your Appointment Details</a>

            <p>If you have any questions or need to reschedule, feel free to contact us.</p>
        </div>
        <div class="footer">
            <p>If you need further assistance, please reach out to us at olifesavers@gmail.com.</p>
            <p>&copy; 2025 LifeSave Blood Donation. All rights reserved.</p>
        </div>
    </div>
${close}
`;
    sendHTMLmail(donor.Email, "Thank You for booking an Appointment!", content)
      .then(console.log)
      .catch(console.error);
    //return the appointments as a response
    const res = Response.json(appointment, {
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
      if (query.length == 0) {
        return new Response("1", { status: 200, headers: CORS_HEADERS });
      }
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

app.post("/vsignup", async (req: Request) => {
  try {
    const {
      firstname,
      lastname,
      email,
      DOB,
      title,
      phoneNumber,
      city,
      postcode,
      bloodgroup,
      genotype,
      occupation,
      skills,
      password,
    } = await parseBody(req);
    const check = await db.findOne("Volunteer", "Email", email);
    if (check) {
      return new Response("Volunteer Already Exists", {
        status: 400,
        headers: CORS_HEADERS,
      });
    }
    if (
      !firstname ||
      !lastname ||
      !email ||
      !DOB ||
      !title ||
      !phoneNumber ||
      !city ||
      !postcode ||
      !bloodgroup ||
      !genotype ||
      !occupation ||
      !skills ||
      !password
    ) {
      return new Response("Please fill all fields", {
        status: 400,
        headers: CORS_HEADERS,
      });
    } else {
      const hashedpassword = sha256.sign(password);
      try {
        const volunteer: Volunteer = await Volunteer.create(
          firstname,
          lastname,
          email.toLowerCase(),
          DOB,
          title,
          phoneNumber,
          city,
          postcode,
          bloodgroup,
          genotype,
          occupation,
          skills,
          hashedpassword,
          false, //admin = false for generic volunteer
        );
        await db.insertINTO("volunteer", volunteer);
        const htmlContent = `
${headers}
    <div class="container">
        <div class="header">
            <h1>Welcome to Onehealth Life Savers</h1>
        </div>
        <div class="content">
            <p>Dear ${title}${" "}${firstname},</p>
            <p>Thank you for signing up to become a life-saver! Your willingness to volunteer your time can help save lives and make a real difference in the community.</p>
        </div>
        <div class="footer">
            <p>If you have any questions, feel free to contact us at <a mailto="olifesavers@gmail.com">olifesavers@gmail.com</p>
            <p>&copy; 2025 LifeSave Blood Donation. All rights reserved.</p>
        </div>
    </div>
${close}
`;
        sendHTMLmail(email, "Welcome Aboard", htmlContent)
          .then(console.log)
          .catch(console.error);

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
            services: volunteer.Services,
          },
          { status: 201, headers: CORS_HEADERS },
        );
      } catch (error) {
        console.error(error);
      }
    }
  } catch (error) {
    return new Response("Invalid request body" + error, {
      status: 400,
      headers: CORS_HEADERS,
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
          service: volunteer.Services,
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
    const { name, center, date, start_time, end_time, target } =
      await parseBody(req);
    if (!name || !center || !date || !start_time || !end_time || !target) {
      return new Response("Please fill in all details", { status: 400 });
    }
    const event = await Event.create(
      name,
      center,
      date,
      start_time,
      end_time,
      target,
    );
    await db.insertINTO("events", event);
    return Response.json("", { status: 201, headers: CORS_HEADERS });
  } else {
    return new Response("Not authorised", { status: 400 });
  }
});

//HTTP POST route for serching for donation centres in a city/town
app.get("/getcentres", async (req: Request) => {
  const query = (await db.select(["*"], "Centre")).getResults();
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

    const { fields, values, appointment } = (await parseBody(req)) as {
      fields: string[];
      values: any[];
      appointment: string;
    };
    await db.update("appointments", "ID", appointment, fields, values);
    const content = `
${headers}
    <div class="container">
        <div class="header">
            Appointment Rescheduled!
        </div>

        <div class="content">
            <p>Hi ${donor.FirstName},</p>
            <p>Your blood donation appointment has been successfully rescheduled with OneHealth Lifesavers.</p>
            <p>You can view your updated appointment details by clicking the button below:</p>
            <a href="https://onehealthls.netlfy.app/donor/manageappointment/${appointment}" class="button">View Appointment</a>
        </div>

        <div class="footer">
            <p>If you have any questions or need assistance, contact us at <a href="mailto:olifesavers@gmail.com">olifesavers@gmail.com</a>.</p>
            <p>&copy; 2025 OneHealth Lifesavers. All rights reserved.</p>
        </div>
    </div>
${close}
`;
    sendHTMLmail(donor.Email, "Appointment Rescheduled", content)
      .then(console.log)
      .catch(console.error);
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
  const donor = await protect(req);
  if (donor) {
    try {
      const url = new URL(req.url);
      const id = url.searchParams.get("id");

      if (!id) {
        return new Response("No ID provided", {
          status: 401,
          headers: CORS_HEADERS,
        });
      }
      db.delete("appointments", "ID", id);
      const content = `
${headers}
    <div class="container">
        <div class="header">
            Appointment Deleted
        </div>

        <div class="content">
            <p>Hi ${donor.FirstName},</p>
            <p>We’re reaching out to let you know that your blood donation appointment with OneHealth Lifesavers has been successfully cancelled.</p>
            <p>If you’d like to book another appointment in the future, we’d be more than happy to have you back!</p>
        </div>

        <div class="footer">
            <p>If you have any questions or need assistance, contact us at <a href="mailto:olifesavers@gmail.com">olifesavers@gmail.com</a>.</p>
            <p>&copy; 2025 OneHealth Lifesavers. All rights reserved.</p>
        </div>
    </div>

${close}
`;
      sendHTMLmail(donor.Email, "Appointment Cancelled", content)
        .then(console.log)
        .catch(console.error);

      return new Response("Appointments deleted", {
        status: 200,
        headers: CORS_HEADERS,
      });
    } catch (error) {
      console.error("An error occured", error);
    }
  } else {
    return new Response("Unauthorised", { status: 401, headers: CORS_HEADERS });
  }
});

app.put("/updatepassword", async (req: Request) => {
  try {
    const donor: Donor = await protect(req);
    if (!donor) {
      return new Response("Unauthorised, Donor not verified", {
        status: 401,
        headers: CORS_HEADERS,
      });
    }

    const { current, newpassword } = await parseBody(req);
    const isPasswordCorrect = sha256.verify(current, donor.Password);
    if (!isPasswordCorrect) {
      return new Response("Oops, Incorrect Password", {
        status: 401,
        headers: CORS_HEADERS,
      });
    }
    await db.update(
      "donors",
      "ID",
      donor.ID,
      ["Password"],
      [sha256.sign(newpassword)],
    );
    const content = `   
${headers}
<div class="container">
        <div class="header">
            Password Updated
        </div>

        <div class="content">
            <p>Hi ${donor.FirstName},</p>
            <p>We wanted to let you know that your password for OneHealth Lifesavers has been successfully updated.</p>
            <p>If you didn’t make this change, please contact our support team immediately.</p>
        </div>

        <div class="footer">
            <p>If you have any questions or need assistance, contact us at <a href="mailto:olifesavers@gmail.com">olifesavers@gmail.com</a>.</p>
            <p>&copy; 2025 OneHealth Lifesavers. All rights reserved.</p>
        </div>
    </div>
${close}
`;
    sendHTMLmail(donor.Email, "Appointment Rescheduled", content)
      .then(console.log)
      .catch(console.error);

    return new Response("Password changeed successfully", {
      status: 200,
      headers: CORS_HEADERS,
    });
  } catch (err) {
    console.error("Error changing password:", err);
    return new Response("Internal Server Error", {
      status: 500,
      headers: CORS_HEADERS,
    });
  }
});

app.put("/vupdatepassword", async (req: Request) => {
  try {
    const volunteer: Volunteer = await protect(req);
    if (!volunteer) {
      return new Response("Unauthorised, Volunteer not verified", {
        status: 401,
        headers: CORS_HEADERS,
      });
    }

    const { current, newpassword } = await parseBody(req);
    const isPasswordCorrect = sha256.verify(current, volunteer.Password);
    if (!isPasswordCorrect) {
      return new Response("Oops, Incorrect Password", {
        status: 401,
        headers: CORS_HEADERS,
      });
    }
    await db.update(
      "volunteer",
      "ID",
      volunteer.ID,
      ["Password"],
      [sha256.sign(newpassword)],
    );
    const content = `   
${headers}
<div class="container">
        <div class="header">
            Password Updated
        </div>

        <div class="content">
            <p>Hi ${volunteer.First_Name},</p>
            <p>We wanted to let you know that your password for OneHealth Lifesavers has been successfully updated.</p>
            <p>If you didn’t make this change, please contact our support team immediately.</p>
        </div>

        <div class="footer">
            <p>If you have any questions or need assistance, contact us at <a href="mailto:olifesavers@gmail.com">olifesavers@gmail.com</a>.</p>
            <p>&copy; 2025 OneHealth Lifesavers. All rights reserved.</p>
        </div>
    </div>
${close}
`;
    sendHTMLmail(volunteer.Email, "Appointment Rescheduled", content)
      .then(console.log)
      .catch(console.error);

    return new Response("Password changed successfully", {
      status: 200,
      headers: CORS_HEADERS,
    });
  } catch (err) {
    console.error("Error changing password:", err);
    return new Response("Internal Server Error", {
      status: 500,
      headers: CORS_HEADERS,
    });
  }
});

app.post("/announcements", async (req: Request) => {
  try {
    const volunteer: Volunteer = await protect(req);
    if (!volunteer || !volunteer.Admin) {
      return new Response("Unauthorised, you don't have admin access", {
        status: 401,
        headers: CORS_HEADERS,
      });
    }
    const { Title, Body } = await parseBody(req);
    if (!Title || !Body) {
      return new Response("Missing fields in request", {
        status: 400,
        headers: CORS_HEADERS,
      });
    }
    const time = new Date().toISOString();
    const announcement = await Announcement.create(
      Body,
      Title,
      volunteer.ID,
      time,
    );
    await db.insertINTO("announcements", announcement);
    return new Response("", {
      status: 204,
      headers: CORS_HEADERS,
    });
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", {
      status: 500,
      headers: CORS_HEADERS,
    });
  }
});

app.get("/announcements", async (req: Request) => {
  try {
    const volunteer: Volunteer = await protect(req);
    if (!volunteer) {
      return new Response("Unauthorised, volunteer not verified", {
        status: 401,
        headers: CORS_HEADERS,
      });
    }
    const announcements = (await db.select(["*"], "announcements"))
      .orderBy("Time")
      .getResults();
    for (let announcement of announcements) {
      const announcer = await db.findOne(
        "volunteer",
        "ID",
        announcement.Announcer,
      );
      const fullName = `${announcer.First_Name} ${announcer.Last_Name}`;
      announcement.Announcer = fullName;
    }
    return Response.json(announcements, {
      status: 200,
      headers: CORS_HEADERS,
    });
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", {
      status: 500,
      headers: CORS_HEADERS,
    });
  }
});

app.post("/bookevent", async (req: Request) => {
  try {
    const volunteer: Volunteer = await protect(req);
    if (!volunteer) {
      return new Response("Unauthorised, volunteer not verified", {
        status: 401,
        headers: CORS_HEADERS,
      });
    }

    const { Event } = await parseBody(req);
    const volunteerEvent = await eventVolunteer.create(Event, volunteer.ID);
    await db.insertINTO("events:volunteer", volunteerEvent);
    const content = `
${headers}
<div class="container">
        <div class="header">
            Thank you!
        </div>

        <div class="content">
            <p>Dear ${volunteer.Title} ${volunteer.Last_Name},</p>
            <p>Thank you for signing up to volunteer at our upcoming event! Your help is invaluable, and we’re excited to have you join us.</p>
            <p>Click below to view the event details and manage your signup:</p>
            <a href="https://onehealthls.netlify.app/volunteer/event/${Event.ID}" class="button">View Event</a>
        </div>

        <div class="footer">
            <p>If you have any questions or need assistance, contact us at olifesavers@gmail.com.</p>
            <p>&copy; 2025 OneHealth Life Savers. All rights reserved.</p>
        </div>
    </div>
${close}
`;
    sendHTMLmail(volunteer.Email, "Event Booked Successfully.", content)
      .then(console.log)
      .catch(console.error);
    return new Response("Created successfully", {
      status: 201,
      headers: CORS_HEADERS,
    });
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", {
      status: 500,
      headers: CORS_HEADERS,
    });
  }
});

app.get("/signedevents", async (req: Request) => {
  const volunteer: Volunteer = await protect(req);
  if (volunteer) {
    const preq = (await db.select(["*"], "events:volunteer"))
      .where("volunteer", volunteer.ID)
      .getResults();
    const query = [];
    for (const event of preq) {
      if (event.volunteer == volunteer.ID) {
        let preq = await db.findOne("Events", "ID", event.Event);
        const center = await db.findOne("centre", "ID", preq.Center);
        preq.Center = center;
        query.push(preq);
      }
    }
    if (JSON.stringify(preq) === "[]") {
      return new Response("There are no events", {
        status: 200,
        headers: CORS_HEADERS,
      });
    }
    return Response.json(query, { status: 200, headers: CORS_HEADERS });
  } else {
    return new Response("Not authorised", { status: 401 });
  }
});

app.get("/unsignedevents", async (req: Request) => {
  try {
    const volunteer: Volunteer = await protect(req);

    // Fetch all events associated with the volunteer
    const preq = (await db.select(["*"], "events:volunteer"))
      .where("volunteer", volunteer.ID)
      .getResults();

    // Extract the IDs of events associated with the volunteer
    const volunteerEventIds = preq.map((ev) => ev.Event);

    // Fetch all events from the Events table
    const allEvents = (await db.select(["*"], "Events")).getResults();
    for (let event of allEvents) {
      const center = await db.findOne("centre", "ID", event.Center);
      event.Center = center;
    }

    // Filter out events that are associated with the volunteer's ID
    const query = allEvents.filter(
      (event) => !volunteerEventIds.includes(event.ID),
    );

    if (query.length === 0) {
      return new Response("There are no events available", {
        status: 200,
        headers: CORS_HEADERS,
      });
    }

    return Response.json(query, { status: 200, headers: CORS_HEADERS });
  } catch (error) {
    console.error(error);
    return new Response("Not authorized or an error occurred", { status: 401 });
  }
});

app.get("/upcomingevent", async (req: Request) => {
  const volunteer: Volunteer = await protect(req);
  if (volunteer) {
    const preq = (await db.select(["*"], "events:volunteer"))
      .where("volunteer", volunteer.ID)
      .getResults();
    if (JSON.stringify(preq) === "[]") {
      return new Response("1", {
        status: 200,
        headers: CORS_HEADERS,
      });
    }

    let query = [];
    for (const event of preq) {
      if (event.volunteer == volunteer.ID) {
        let prequery = await db.findOne("Events", "ID", event.Event);
        const center = await db.findOne("centre", "ID", prequery.Center);
        prequery.Center = center;
        query.push(prequery);
      }
    }
    query = quickSort(query, "Date");
    return Response.json(query[0], { status: 200, headers: CORS_HEADERS });
  } else {
    return new Response("Not authorised", {
      status: 401,
      headers: CORS_HEADERS,
    });
  }
});

app.get("/event", async (req: Request) => {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    let event = await db.findOne("Events", "ID", id);
    const center = await db.findOne("centre", "ID", event.Center);
    event.Center = center;
    return Response.json(event, { status: 200, headers: CORS_HEADERS });
  } catch (error) {
    return new Response("Errror while fetching appointment" + error, {
      status: 500,
    });
  }
});

app.post("/sendmessage", async (req: Request) => {
  const volunteer = await protect(req);
  if (!volunteer) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { subject, message } = await parseBody(req);

  if (!subject || !message) {
    return new Response("Subject and message are required", { status: 400 });
  }

  const htmlContent = `
    <h1 style="color: #FE767F;">New Message from ${volunteer.Email} ${volunteer.ID}</h1>
    <p><strong>Subject:</strong> ${subject}</p>
    <p>${message}</p>
  `;

  try {
    await sendHTMLmail(
      "olifesavers@gmail.com",
      subject,
      htmlContent,
      volunteer.Email,
    );
    return new Response("Message sent successfully", {
      status: 200,
      headers: CORS_HEADERS,
    });
  } catch (error) {
    console.error("Error sending message:", error);
    return new Response("Failed to send message", {
      status: 500,
      headers: CORS_HEADERS,
    });
  }
});

//@ts-ignore
app.delete("/cancelevent", async (req: Request) => {
  const volunteer: VolunteerType = await protect(req);
  if (volunteer) {
    try {
      const url = new URL(req.url);
      const id = url.searchParams.get("id");
      const event = await db.findOne("Events", "ID", id);

      if (!id) {
        return new Response("No ID provided", {
          status: 401,
          headers: CORS_HEADERS,
        });
      }
      const evarray = (await db.select(["*"], "events:volunteer"))
        .where("Event", id)
        .getResults();
      //@ts-ignore
      const ev: eventVolunteerType =
        evarray[binarySearch(evarray, "volunteer", volunteer.ID)];
      await db.delete("events:volunteer", "ID", ev.ID);
      const date = new Date(event.Date);
      const content = `
${headers}
    <div class="container">
        <div class="header">
            We're Sorry to See You Go
        </div>
        <div class="content">
            <p>Hi ${volunteer.First_Name},</p>
            <p>We’re sorry to hear that you’ve cancelled your participation for <strong>${event.Name}</strong> on <strong>${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}</strong>. Your support means the world to us, and we’ll definitely feel your absence.</p>
            <p>If you’d ever like to volunteer with us again in the future, we’d love to have you back. Every pair of hands makes a difference, and yours has always been appreciated.</p>
            <p>Thank you again for everything, and we hope to see you soon!</p>
        </div>
        <div class="footer">
            <p>If you have any questions, reach out at <a href="mailto:olifesavers@gmail.com">olifesavers@gmail.com</a></p>
            <p>&copy; 2025 OneHealth Lifesavers. All rights reserved.</p>
        </div>
    </div>

${close}
`;
      sendHTMLmail(volunteer.Email, "We understand 😔", content)
        .then(console.log)
        .catch(console.error);

      return new Response("event deleted", {
        status: 200,
        headers: CORS_HEADERS,
      });
    } catch (error) {
      console.error("An error occured", error);
    }
  } else {
    return new Response("Unauthorised", { status: 401, headers: CORS_HEADERS });
  }
});

app.post("/donorrequest", async (req: Request) => {
  const donor: Donor = await protect(req);
  if (!donor) {
    return new Response("Unauthorized", { status: 401 });
  }
  const donors = (await db.select(["*"], "Donors")).getResults();

  const { pints, type, location, contact } = await parseBody(req);

  if (!pints || !type || !location || !contact) {
    return new Response("Subject and message are required", { status: 400 });
  }
  const subject = "ALERT! EMERGENCY DONOR NEEDED!!!";

  try {
    for (const donorToEmail of donors) {
      const htmlContent = `
${headers}
<div class="container">
    <h1 style="color: #FE767F;">New Message from ${donor.Email} </h1>
<div class="header">
    <p><strong> ${subject}</strong></p>
</div>
<div class="content">
    <p>Dear ${donorToEmail.FirstName}</p>
    <p>We would like to seek your help in saving a life today<br/> We have a patient in need of a donor and you could help either by notifiying someone you know that could donate or by donating your self.</p>
<p>Here are the details</p>
<h3>Number of pints needed: ${pints}</h3>
<h3>Blood Type: ${type}</h3>
<h3>Location: ${location}</h3>
<h3>Contact: ${contact}</h3>
<p>If you are available and fit, please kindly help to save a life.</p>
<p>Donors will be compensated.</p>
</div>
<div class="footer">
<p>If you have any questions, reach out at <a href="mailto:olifesavers@gmail.com">olifesavers@gmail.com</a></p>
<p>&copy; 2025 OneHealth Lifesavers. All rights reserved.</p>
</div>
</div>

${close}
  `;
      await sendHTMLmail(
        donorToEmail.Email,
        subject,
        htmlContent,
        "olifesavers@gmail.com",
      );
    }
    return new Response("", {
      status: 204,
      headers: CORS_HEADERS,
    });
  } catch (error) {
    console.error("Error sending message:", error);
    return new Response("Failed to send message", {
      status: 500,
      headers: CORS_HEADERS,
    });
  }
});

app.put("/dforgotpassword", async (req: Request) => {
  try {
    const { email, password } = await parseBody(req);

    if (!email || !password) {
      return new Response("Please fill all fields", {
        status: 400,
        headers: CORS_HEADERS,
      });
    }

    const donor = await db.findOne("donors", "Email", email);
    if (!donor) {
      return new Response("Donor not found", {
        status: 400,
        headers: CORS_HEADERS,
      });
    }

    await db.update(
      "donors",
      "ID",
      donor.ID,
      ["Password"],
      [sha256.sign(password)],
    );

    const content = `
${headers}
<div class="container">
  <div class="header">Password Reset Successful</div>
  <div class="content">
    <p>Hi ${donor.FirstName},</p>
    <p>Your password for OneHealth Lifesavers donor portal has been reset successfully.</p>
    <p>If you did not request this reset, please contact our support team immediately.</p>
  </div>
  <div class="footer">
    <p>Need help? Email <a href="mailto:olifesavers@gmail.com">olifesavers@gmail.com</a></p>
    <p>&copy; 2025 OneHealth Lifesavers</p>
  </div>
</div>
${close}
    `;

    sendHTMLmail(donor.Email, "Password Reset Confirmation", content)
      .then(console.log)
      .catch(console.error);

    return new Response("Password reset successful", {
      status: 200,
      headers: CORS_HEADERS,
    });
  } catch (err) {
    console.error("Error in /dforgotpassword:", err);
    return new Response("Internal Server Error", {
      status: 500,
      headers: CORS_HEADERS,
    });
  }
});

app.put("/vforgotpassword", async (req: Request) => {
  try {
    const { email, password } = await parseBody(req);

    if (!email || !password) {
      return new Response("Please fill all fields", {
        status: 400,
        headers: CORS_HEADERS,
      });
    }

    const volunteer = await db.findOne("volunteer", "Email", email);
    if (!volunteer) {
      return new Response("Volunteer not found", {
        status: 404,
        headers: CORS_HEADERS,
      });
    }

    await db.update(
      "volunteer",
      "ID",
      volunteer.ID,
      ["Password"],
      [sha256.sign(password)],
    );

    const content = `
${headers}
<div class="container">
  <div class="header">Password Reset Successful</div>
  <div class="content">
    <p>Hi ${volunteer.First_Name},</p>
    <p>Your password for OneHealth Lifesavers volunteer portal has been reset successfully.</p>
    <p>If you did not request this reset, please contact our team immediately.</p>
  </div>
  <div class="footer">
    <p>Need help? Email <a href="mailto:olifesavers@gmail.com">olifesavers@gmail.com</a></p>
    <p>&copy; 2025 OneHealth Lifesavers</p>
  </div>
</div>
${close}
    `;

    sendHTMLmail(volunteer.Email, "Password Reset Confirmation", content)
      .then(console.log)
      .catch(console.error);

    return new Response("Password reset successful", {
      status: 200,
      headers: CORS_HEADERS,
    });
  } catch (err) {
    console.error("Error in /vforgotpassword:", err);
    return new Response("Internal Server Error", {
      status: 500,
      headers: CORS_HEADERS,
    });
  }
});

//@ts-ignore
app.listen(port);
