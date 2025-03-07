import type { Message, InsertMessage, SampleSchema, InsertSchema } from "@shared/schema";

export interface IStorage {
  getMessages(): Promise<Message[]>;
  addMessage(message: InsertMessage): Promise<Message>;
  getSampleSchemas(): Promise<SampleSchema[]>;
  addSampleSchema(schema: InsertSchema): Promise<SampleSchema>;
}

export class MemStorage implements IStorage {
  private messages: Map<number, Message>;
  private schemas: Map<number, SampleSchema>;
  private messageId: number;
  private schemaId: number;

  constructor() {
    this.messages = new Map();
    this.schemas = new Map();
    this.messageId = 1;
    this.schemaId = 1;

    // Add sample schema
    this.addSampleSchema({
      name: "E-commerce",
      tables: {
        products: {
          columns: {
            id: "serial primary key",
            name: "text",
            price: "decimal",
            category: "text",
            stock: "integer"
          }
        },
        orders: {
          columns: {
            id: "serial primary key",
            user_id: "integer",
            total: "decimal",
            status: "text",
            created_at: "timestamp"
          }
        }
      }
    });
  }

  async getMessages(): Promise<Message[]> {
    return Array.from(this.messages.values());
  }

  async addMessage(message: InsertMessage): Promise<Message> {
    const id = this.messageId++;
    const timestamp = new Date();
    const newMessage = { ...message, id, timestamp };
    this.messages.set(id, newMessage);
    return newMessage;
  }

  async getSampleSchemas(): Promise<SampleSchema[]> {
    return Array.from(this.schemas.values());
  }

  async addSampleSchema(schema: InsertSchema): Promise<SampleSchema> {
    const id = this.schemaId++;
    const newSchema = { ...schema, id };
    this.schemas.set(id, newSchema);
    return newSchema;
  }
}

export const storage = new MemStorage();
