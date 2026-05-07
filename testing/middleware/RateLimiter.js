import Redis from 'ioredis';
const redis = new Redis();

const ratelimiter = async (req, res , next) =>{
    const key = `rate:${req.ip}`; 
    const limit = 5;
    const window = 60; //seconds

    const current = await redis.incr(key);

    if(current === 1){
        await redis.expire(key , window);

    }
    if (current > limit) {
        return res.status(429).json({error: "too many requests"});
        
    }
}