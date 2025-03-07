import Anthropic from '@anthropic-ai/sdk';

// the newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function generateSQL(
  prompt: string, 
  schema: Record<string, any>, 
  context: string[] = []
): Promise<string> {
  const schemaStr = JSON.stringify(schema, null, 2);
  const contextStr = context.join("\n");

  const systemPrompt = `You are an expert SQL query generator. Given a database schema and natural language query, generate the corresponding SQL query. Only return the SQL query without any explanation.

Schema:
${schemaStr}

Previous context:
${contextStr}`;

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

    return response.content[0].text;
  } catch (error: any) {
    console.error('Anthropic API Error:', error);
    throw new Error(`Failed to generate SQL: ${error?.message || 'Unknown error'}`);
  }
}

export async function validateSQL(
  sql: string,
  schema: Record<string, any>
): Promise<{ isValid: boolean; error?: string }> {
  const schemaStr = JSON.stringify(schema, null, 2);

  const systemPrompt = `You are an expert SQL validator. Given a database schema and SQL query, validate if the query is correct and would execute successfully. Return a JSON response with "isValid" boolean and optional "error" string.

Schema:
${schemaStr}`;

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

    return JSON.parse(response.content[0].text);
  } catch (error: any) {
    console.error('Anthropic API Error:', error);
    return {
      isValid: false,
      error: `Failed to validate SQL: ${error?.message || 'Unknown error'}`
    };
  }
}