import Anthropic from '@anthropic-ai/sdk';

// the newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface QueryOptimization {
  sql: string;
  improvements: string[];
  performance: Record<string, any>;
}

interface ValidationResult {
  isValid: boolean;
  error?: string;
  suggestions?: string[];
}

export async function generateSQL(
  prompt: string, 
  schema: Record<string, any>,
  context: string[] = [],
  relationships: Record<string, any> = {},
  constraints: Record<string, any> = {}
): Promise<QueryOptimization> {
  const schemaStr = JSON.stringify(schema, null, 2);
  const relationshipsStr = JSON.stringify(relationships, null, 2);
  const constraintsStr = JSON.stringify(constraints, null, 2);
  const contextStr = context.join("\n");

  const systemPrompt = `You are an expert SQL query optimizer. Given a database schema with relationships and constraints, generate an optimized SQL query.
Consider table relationships, indexes, and query performance.

Schema:
${schemaStr}

Relationships:
${relationshipsStr}

Constraints:
${constraintsStr}

Previous context:
${contextStr}

Return a JSON response with:
- sql: The optimized SQL query
- improvements: Array of optimization explanations
- performance: Expected performance metrics`;

  try {
    const response = await anthropic.messages.create({
      model: "claude-3-7-sonnet-20250219",
      max_tokens: 1024,
      messages: [
        { 
          role: 'user', 
          content: prompt
        }
      ],
      system: systemPrompt
    });

    const content = response.content[0];
    if ('text' in content) {
      return JSON.parse(content.text);
    }
    throw new Error('Unexpected response format from Anthropic API');
  } catch (error: any) {
    console.error('Anthropic API Error:', error);
    throw new Error(`Failed to generate SQL: ${error?.message || 'Unknown error'}`);
  }
}

export async function validateSQL(
  sql: string,
  schema: Record<string, any>,
  relationships: Record<string, any> = {},
  constraints: Record<string, any> = {}
): Promise<ValidationResult> {
  const schemaStr = JSON.stringify(schema, null, 2);
  const relationshipsStr = JSON.stringify(relationships, null, 2);
  const constraintsStr = JSON.stringify(constraints, null, 2);

  const systemPrompt = `You are an expert SQL validator. Given a database schema with relationships and constraints, validate if the query is correct and would execute successfully.
Also suggest potential improvements.

Schema:
${schemaStr}

Relationships:
${relationshipsStr}

Constraints:
${constraintsStr}

Return a JSON response with:
- isValid: boolean
- error: optional error message
- suggestions: array of improvement suggestions`;

  try {
    const response = await anthropic.messages.create({
      model: "claude-3-7-sonnet-20250219",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: sql
        }
      ],
      system: systemPrompt
    });

    const content = response.content[0];
    if ('text' in content) {
      return JSON.parse(content.text);
    }
    throw new Error('Unexpected response format from Anthropic API');
  } catch (error: any) {
    console.error('Anthropic API Error:', error);
    return {
      isValid: false,
      error: `Failed to validate SQL: ${error?.message || 'Unknown error'}`
    };
  }
}

export async function generateCodeSnippet(
  sql: string,
  language: string,
  framework: string
): Promise<string> {
  const systemPrompt = `Generate a code snippet that executes the following SQL query using ${language} and ${framework}.
Include error handling, parameter binding, and best practices.`;

  try {
    const response = await anthropic.messages.create({
      model: "claude-3-7-sonnet-20250219",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: sql
        }
      ],
      system: systemPrompt
    });

    const content = response.content[0];
    if ('text' in content) {
      return content.text;
    }
    throw new Error('Unexpected response format from Anthropic API');
  } catch (error: any) {
    console.error('Anthropic API Error:', error);
    throw new Error(`Failed to generate code snippet: ${error?.message || 'Unknown error'}`);
  }
}

export async function generateQueryTemplate(
  description: string,
  schema: Record<string, any>
): Promise<string> {
  const systemPrompt = `Create a reusable SQL query template based on this description and schema.
Make it parameterized and include comments explaining usage.`;

  try {
    const response = await anthropic.messages.create({
      model: "claude-3-7-sonnet-20250219",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: description
        }
      ],
      system: systemPrompt
    });

    const content = response.content[0];
    if ('text' in content) {
      return content.text;
    }
    throw new Error('Unexpected response format from Anthropic API');
  } catch (error: any) {
    console.error('Anthropic API Error:', error);
    throw new Error(`Failed to generate template: ${error?.message || 'Unknown error'}`);
  }
}