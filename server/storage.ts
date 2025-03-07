import type { 
  Message, 
  InsertMessage, 
  SampleSchema, 
  InsertSchema, 
  SavedQuery, 
  InsertSavedQuery,
  QueryTemplate,
  InsertQueryTemplate,
  QueryOptimization,
  InsertQueryOptimization
} from "@shared/schema";

export interface IStorage {
  getMessages(): Promise<Message[]>;
  addMessage(message: InsertMessage): Promise<Message>;
  getSampleSchemas(): Promise<SampleSchema[]>;
  addSampleSchema(schema: InsertSchema): Promise<SampleSchema>;
  getSavedQueries(): Promise<SavedQuery[]>;
  addSavedQuery(query: InsertSavedQuery): Promise<SavedQuery>;
  getQueryTemplates(): Promise<QueryTemplate[]>;
  addQueryTemplate(template: InsertQueryTemplate): Promise<QueryTemplate>;
  getQueryOptimizations(): Promise<QueryOptimization[]>;
  addQueryOptimization(optimization: InsertQueryOptimization): Promise<QueryOptimization>;
  exportData(format: string, data: any): Promise<any>;
}

export class MemStorage implements IStorage {
  private messages: Map<number, Message>;
  private schemas: Map<number, SampleSchema>;
  private queries: Map<number, SavedQuery>;
  private templates: Map<number, QueryTemplate>;
  private optimizations: Map<number, QueryOptimization>;
  private messageId: number;
  private schemaId: number;
  private queryId: number;
  private templateId: number;
  private optimizationId: number;

  constructor() {
    this.messages = new Map();
    this.schemas = new Map();
    this.queries = new Map();
    this.templates = new Map();
    this.optimizations = new Map();
    this.messageId = 1;
    this.schemaId = 1;
    this.queryId = 1;
    this.templateId = 1;
    this.optimizationId = 1;

    // Add sample schema with relationships and constraints
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
      },
      relationships: {
        "orders.user_id": "users.id"
      },
      constraints: {
        "products.price": "CHECK (price >= 0)",
        "products.stock": "CHECK (stock >= 0)"
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

  async getSavedQueries(): Promise<SavedQuery[]> {
    return Array.from(this.queries.values());
  }

  async addSavedQuery(query: InsertSavedQuery): Promise<SavedQuery> {
    const id = this.queryId++;
    const timestamp = new Date();
    const newQuery = { 
      ...query, 
      id, 
      timestamp,
      rating: null,
      feedback: null,
      performance: null,
      annotations: [],
      shared: false,
      creator: "system",
      tags: []
    };
    this.queries.set(id, newQuery);
    return newQuery;
  }

  async getQueryTemplates(): Promise<QueryTemplate[]> {
    return Array.from(this.templates.values());
  }

  async addQueryTemplate(template: InsertQueryTemplate): Promise<QueryTemplate> {
    const id = this.templateId++;
    const timestamp = new Date();
    const newTemplate = { ...template, id, timestamp, usageCount: 0 };
    this.templates.set(id, newTemplate);
    return newTemplate;
  }

  async getQueryOptimizations(): Promise<QueryOptimization[]> {
    return Array.from(this.optimizations.values());
  }

  async addQueryOptimization(optimization: InsertQueryOptimization): Promise<QueryOptimization> {
    const id = this.optimizationId++;
    const timestamp = new Date();
    const newOptimization = { ...optimization, id, timestamp };
    this.optimizations.set(id, newOptimization);
    return newOptimization;
  }

  async exportData(format: string, data: any): Promise<any> {
    switch (format) {
      case 'csv':
        return this.exportToCSV(data);
      case 'json':
        return this.exportToJSON(data);
      case 'sql':
        return this.exportToSQL(data);
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  }

  private exportToCSV(data: any[]): string {
    if (!data.length) return '';
    const headers = Object.keys(data[0]);
    const rows = data.map(item => headers.map(header => item[header]));
    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  }

  private exportToJSON(data: any): string {
    return JSON.stringify(data, null, 2);
  }

  private exportToSQL(data: any[]): string {
    if (!data.length) return '';
    const tableName = 'exported_data';
    const headers = Object.keys(data[0]);
    const createTable = `CREATE TABLE ${tableName} (\n${headers.map(h => `  ${h} TEXT`).join(',\n')}\n);`;
    const insertData = data.map(row => 
      `INSERT INTO ${tableName} (${headers.join(', ')}) VALUES (${headers.map(h => `'${row[h]}'`).join(', ')});`
    ).join('\n');
    return `${createTable}\n\n${insertData}`;
  }
}

export const storage = new MemStorage();