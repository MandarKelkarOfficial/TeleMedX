// import express from "express"
// import cors from 'cors'
// import 'dotenv/config'
// import connectDB from "./config/mongodb.js"
// import connectCloudinary from "./config/cloudinary.js"
// import userRouter from "./routes/userRoute.js"
// import doctorRouter from "./routes/doctorRoute.js"
// import adminRouter from "./routes/adminRoute.js"

// // app config
// const app = express()
// const port = process.env.PORT || 4000
// connectDB()
// connectCloudinary()

// // middlewares
// app.use(express.json())
// app.use(cors())

// // api endpoints
// app.use("/api/user", userRouter)
// app.use("/api/admin", adminRouter)
// app.use("/api/doctor", doctorRouter)

// app.get("/", (req, res) => {
//   res.send("API Working")
// });

// app.listen(port, () => console.log(`Server started on PORT:${port}`))

import express from "express";
import assert from "assert";
import cors from "cors";
import session from "express-session";
import crypto from "crypto";
import { google } from "googleapis";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import doctorRouter from "./routes/doctorRoute.js";
import adminRouter from "./routes/adminRoute.js";

// Use CommonJS require instead of import
import fs from 'fs/promises';

const credentials = JSON.parse(await fs.readFile(new URL('./creds.json', import.meta.url), 'utf-8'));

const { client_secret, client_id, redirect_uris } = credentials.web;

console.log(client_id); // Test if it works



const allowedOrigins = ["http://localhost:3000", "http://localhost:5173","http://localhost:5174"];

// App config
const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(
  session({
    secret: crypto.randomBytes(32).toString("hex"),
    resave: false,
    saveUninitialized: true,
  })
);

// Google OAuth Client
const oAuth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  redirect_uris[2]
);

// Google Fit API Scopes
const SCOPES = [
  "https://www.googleapis.com/auth/fitness.activity.read",
  "https://www.googleapis.com/auth/fitness.heart_rate.read",
  "https://www.googleapis.com/auth/userinfo.profile",
];

// 🔹 API Endpoints
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);

app.get("/", (req, res) => {
  res.send("API Working");
});

// 🔹 Step 1: Redirect to Google OAuth
app.get("/auth/google", (req, res) => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
  res.json({ authUrl });
  console.log("Google OAuth URL: Success!!!");
});

// 🔹 Step 2: Handle Google OAuth Callback
app.get("/auth/google/callback", async (req, res) => {
  const { code } = req.query;
  try {
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);
    req.session.tokens = tokens;

    // Fetch user profile
    const people = google.people({ version: "v1", auth: oAuth2Client });
    const profile = await people.people.get({
      resourceName: "people/me",
      personFields: "names,photos",
    });

    req.session.userProfile = {
      displayName: profile.data.names[0].displayName,
      profilePhotoUrl: profile.data.photos[0].url,
    };

    res.redirect("http://localhost:5173/my-health"); // Redirect to React app
  } catch (error) {
    console.error("Error retrieving access token:", error);
    res.redirect("/error");
  }
});

// 🔹 Step 3: Check if User is Authenticated
app.get("/check-auth", (req, res) => {
  if (req.session.tokens) {
    res.json({ loggedIn: true, userProfile: req.session.userProfile });
    console.log("User is authenticated");
  } else {
    res.json({ loggedIn: false });
  }
});

// 🔹 Step 4: Fetch Google Fit Data
app.get("/fetch-steps", async (req, res) => {
  if (!req.session.tokens) {
    return res.status(401).json({ error: "User not authenticated" });
  }

  oAuth2Client.setCredentials(req.session.tokens);
  const fitness = google.fitness({ version: "v1", auth: oAuth2Client });

  try {
    const endTimeMillis = new Date().setHours(23, 59, 59, 999);
    const startTimeMillis = endTimeMillis - 6 * 24 * 60 * 60 * 1000; // Last 7 days

    const response = await fitness.users.dataset.aggregate({
      userId: "me",
      requestBody: {
        aggregateBy: [{ dataTypeName: "com.google.step_count.delta" }],
        bucketByTime: { durationMillis: 86400000 },
        startTimeMillis,
        endTimeMillis,
      },
    });

    const weeklySteps = response.data.bucket.map((bucket) => {
      const date = new Date(parseInt(bucket.startTimeMillis));
      return {
        date: date.toISOString().slice(0, 10), // YYYY-MM-DD
        stepCount: bucket.dataset[0]?.point[0]?.value[0]?.intVal || 0,
      };
    });

    res.json(weeklySteps);
    console.log("Steps data fetched:", weeklySteps);
  } catch (error) {
    console.error("Error fetching fitness data:", error);
    res.status(500).json({ error: "Failed to fetch fitness data" });
  }
});

app.get("/fetch-heartrate", async (req, res) => {
  if (!req.session.tokens) {
    return res.status(401).json({ error: "User not authenticated" });
  }

  oAuth2Client.setCredentials(req.session.tokens);
  const fitness = google.fitness({ version: "v1", auth: oAuth2Client });

  try {
    const endTimeMillis = new Date().setHours(23, 59, 59, 999);
    const startTimeMillis = endTimeMillis - 6 * 24 * 60 * 60 * 1000; // Last 7 days

    const response = await fitness.users.dataset.aggregate({
      userId: "me",
      requestBody: {
        aggregateBy: [{ dataTypeName: "com.google.heart_rate.bpm" }],
        bucketByTime: { durationMillis: 86400000 },
        startTimeMillis,
        endTimeMillis,
      },
    });

    const heartRateData = response.data.bucket.map((bucket) => {
      const date = new Date(parseInt(bucket.startTimeMillis));
      return {
        date: date.toISOString().slice(0, 10),
        heartRate: bucket.dataset[0]?.point[0]?.value[0]?.fpVal || 0,
      };
    });

    res.json(heartRateData);
    console.log("Heart rate data fetched:", heartRateData);
  } catch (error) {
    console.error("Error fetching heart rate data:", error);
    res.status(500).json({ error: "Failed to fetch heart rate data" });
  }
});

// Start server
app.listen(port, () => console.log(`Server started on PORT:${port}`));
