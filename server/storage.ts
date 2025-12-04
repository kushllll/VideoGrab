import { randomUUID } from "crypto";

export interface IStorage {
  // Storage interface for future extensibility
}

export class MemStorage implements IStorage {
  constructor() {
    // Initialize storage
  }
}

export const storage = new MemStorage();
