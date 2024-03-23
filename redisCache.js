import redis from "redis";

const DEFAULT_EXPIRATION = 3600;

// Create Redis client
const redisClient = redis.createClient({
  host: "127.0.0.1", // Use localhost address
  port: 6379, // Redis server port
  legacyMode: true,
});
(async () => {
  await redisClient.connect();
})();
redisClient.on("connect", () => console.log("Redis Client Connected"));
redisClient.on("error", (err) =>
  console.log("Redis Client Connection Error", err)
);

function getOrSetCache(key, callBackfn) {
  return new Promise((resolve, reject) => {
    redisClient.get(key, async (err, data) => {
      if (err) return reject(err);
      if (data != null) return resolve(JSON.parse(data));

      const freshData = await callBackfn();
      redisClient.setEx(key, DEFAULT_EXPIRATION, JSON.stringify(freshData));
      resolve(freshData);
    });
  });
}
export default getOrSetCache;
