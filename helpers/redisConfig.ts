import redis from "redis";

export const redisClient = redis.createClient({
     url: "redis://localhost:6379"
})

redisClient.on("error",(err)=>{
    console.log("Redis Error", err);
})


export const connectRedis =  async()=>{
    if (!redisClient.isOpen) {
    await redisClient.connect();
    console.log("Redis connected");
    }
}