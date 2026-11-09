export interface RateLimitBucket {
  agentId: string;
  tokens: number;
  lastRefillMs: number;
  throttledCount: number;
}

export interface RateLimitDecision {
  allowed: boolean;
  remainingTokens: number;
  retryAfterMs: number;
}

export class AgentRateLimiter {
  private readBuckets = new Map<string, RateLimitBucket>();
  private writeBuckets = new Map<string, RateLimitBucket>();

  constructor(
    private readonly maxReadPerMin = 10,
    private readonly maxWritePerMin = 4
  ) {}

  public checkLimit(
    agentId: string,
    mode: "read" | "write",
    nowMs = Date.now()
  ): RateLimitDecision {
    const store = mode === "read" ? this.readBuckets : this.writeBuckets;
    const capacity = mode === "read" ? this.maxReadPerMin : this.maxWritePerMin;
    const refillRatePerMs = capacity / 60_000;

    let bucket = store.get(agentId);
    if (!bucket) {
      bucket = {
        agentId,
        tokens: capacity,
        lastRefillMs: nowMs,
        throttledCount: 0,
      };
      store.set(agentId, bucket);
    }

    const elapsedMs = Math.max(0, nowMs - bucket.lastRefillMs);
    bucket.tokens = Math.min(capacity, bucket.tokens + elapsedMs * refillRatePerMs);
    bucket.lastRefillMs = nowMs;

    if (bucket.tokens >= 1) {
      bucket.tokens -= 1;
      return {
        allowed: true,
        remainingTokens: Math.floor(bucket.tokens),
        retryAfterMs: 0,
      };
    }

    bucket.throttledCount += 1;
    const missingTokens = 1 - bucket.tokens;
    const retryAfterMs = Math.ceil(missingTokens / refillRatePerMs);

    return {
      allowed: false,
      remainingTokens: 0,
      retryAfterMs,
    };
  }

  public getBucketStats(agentId: string, mode: "read" | "write"): RateLimitBucket | undefined {
    const store = mode === "read" ? this.readBuckets : this.writeBuckets;
    return store.get(agentId);
  }
}
