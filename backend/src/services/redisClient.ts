class MockRedisClient {
  private store = new Map<string, string>();
  public isOpen = true;

  async set(key: string, value: string): Promise<void> {
    this.store.set(key, value);
  }

  async get(key: string): Promise<string | null> {
    return this.store.get(key) || null;
  }

  async connect(): Promise<void> {}
  on(event: string, cb: any) {}
}

export const redisClient = new MockRedisClient();

console.log('Mock Redis initialized (In-Memory Fallback for Local Dev).');
