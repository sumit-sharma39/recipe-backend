class LeakyBucket {
    constructor({ capacity, leakRate }) {
        this.capacity = capacity;
        this.leakRate = leakRate;
        this.buckets  = new Map();
    }

    _leak(entry) {
        const now     = Date.now();
        const elapsed = (now - entry.lastLeak) / 1000;
        const leaked  = Math.floor(elapsed * this.leakRate);
        if (leaked > 0) {
        entry.count    = Math.max(0, entry.count - leaked);
        entry.lastLeak = now;
        }
    }

    add(key) {
        if (!this.buckets.has(key)) {
        this.buckets.set(key, { count: 0, lastLeak: Date.now() });
        }
        const entry = this.buckets.get(key);
        this._leak(entry);
        if (entry.count < this.capacity) {
        entry.count++;
        return true;
        }
        return false;
    }

    remaining(key) {
        if (!this.buckets.has(key)) return this.capacity;
        const entry = this.buckets.get(key);
        this._leak(entry);
        return this.capacity - entry.count;
    }

    cleanup(maxAgeMs = 60_000) {
        const cutoff = Date.now() - maxAgeMs;
        for (const [key, entry] of this.buckets) {
        if (entry.lastLeak < cutoff) this.buckets.delete(key);
        }
    }
    }

    const recipeBucket = new LeakyBucket({ capacity: 20, leakRate: 2 });
    const authBucket   = new LeakyBucket({ capacity: 5,  leakRate: 1 });

    setInterval(() => {
    recipeBucket.cleanup();
    authBucket.cleanup();
    }, 5 * 60_000);

    function createLimiter(bucket, message) {
    return (req, res, next) => {
        const key = req.ip;
        if (bucket.add(key)) {
        res.setHeader('X-RateLimit-Remaining', bucket.remaining(key));
        return next();
        }
        return res.status(429).json({ error: message, retryIn: '1 second' });
    };
}

const recipeRateLimiter = createLimiter(recipeBucket, 'Too many requests — slow down!');
const authRateLimiter   = createLimiter(authBucket,   'Too many login attempts.');

module.exports = { recipeRateLimiter, authRateLimiter };