import express from "express";
import cors from "cors";
import axios from "axios";
// import redis from "redis";
import getOrSetCache from "./redisCache.js";

// const DEFAULT_EXPIRATION = 3600;
// // Listen for the 'connect' event
// redisClient.on("connect", function () {
//   console.log("Connected to Redis server");
//   // Send PING command to Redis server
//   redisClient.ping(function (err, reply) {
//     if (err) {
//       console.error("Error sending PING command:", err);
//     } else {
//       console.log("Received PONG reply from Redis server:", reply);
//     }

//     // Close the connection
//     redisClient.quit();
//   });
// });

// // Listen for the 'error' event
// redisClient.on("error", function (err) {
//   console.error("Error connecting to Redis server:", err);
// });

const app = express();
app.use(cors());

// app.get("/photos", async (req, res) => {
//   const albumId = req.query.albumId;
//   redisClient.get(`photos?albumId=${albumId}`, async (err, photos) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).json({ error: "Internal Server Error" });
//     }
//     if (photos != null) {
//       console.log("Data retrieved from Redis");
//       return res.json(JSON.parse(photos));
//     } else {
//       console.log("Data not found in Redis, retrieving from API");
//       try {
//         const { data } = await axios.get(
//           "https://jsonplaceholder.typicode.com/photos",
//           { params: { albumId } }
//         );
//         redisClient.setEx(
//           `photos?albumId=${albumId}`,
//           DEFAULT_EXPIRATION,
//           JSON.stringify(data),
//           (err, reply) => {
//             if (err) {
//               console.error("Error storing data in Redis:", err);
//             } else {
//               console.log("Data stored in Redis successfully:", reply);
//             }
//           }
//         );
//         return res.json(data);
//       } catch (error) {
//         console.error("Error fetching data from API:", error);
//         return res.status(500).json({ error: "Internal Server Error" });
//       }
//     }
//   });
// });

app.get("/photos", async (req, res) => {
  const albumId = req.query.albumId;
  const photos = await getOrSetCache(`photos?albumId=${albumId}`, async () => {
    const { data } = await axios.get(
      "https://jsonplaceholder.typicode.com/photos",
      { params: { albumId } }
    );
    return data;
  });
  res.json(photos);
});

app.get("/photos/:id", async (req, res) => {
  const id = req.params.id;
  const data = await getOrSetCache(`photos/${id}`, async () => {
    const { data } = await axios.get(
      `https://jsonplaceholder.typicode.com/photos/${id}`
    );
    return data;
  });
  res.json(data);
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
