
import Anthropic from '@anthropic-ai/sdk';
import { env } from "./env";

const anthropic = new Anthropic({
  apiKey: env.ANTHROPIC_API_KEY || 'dummy-key-for-dev'
});

export async function generateSQL(
  prompt: string, 
  schema: string, 
  context?: string,
  relationships?: string,
  constraints?: string
) {
  console.log("Generating SQL with prompt:", prompt);
  
  let systemPrompt = `You are a SQL query generator. 
Given a user's natural language request and database schema, generate a SQL query that fulfills the request.
Always respond with valid JSON in the following format:
{
  "sql": "the SQL query",
  "explanation": "brief explanation of what the query does",
  "performance": {
    "indices_used": ["list of indices that would be used"],
    "estimated_rows": "estimated number of rows returned",
    "complexity": "a rating from 1-5 where 5 is most complex"
  },
  "improvements": [
    "suggestions for query optimization"
  ]
}`;

  if (relationships) {
    systemPrompt += `\n\nThe database has the following relationships: ${relationships}`;
  }

  if (constraints) {
    systemPrompt += `\n\nThe database has the following constraints: ${constraints}`;
  }

  const userMessage = `${context ? 'Context: ' + context + '\n\n' : ''}
Schema:
${schema}

Request: ${prompt}

Generate a SQL query for this request.`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 4000,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    });

    return parseAnthropicResponse(response);
  } catch (error: any) {
    console.error("Error generating SQL:", error);
    throw new Error(`Failed to generate SQL: ${error.message}`);
  }
}

export async function validateSQL(
  sql: string, 
  schema: string,
  relationships?: string,
  constraints?: string
) {
  console.log("Validating SQL:", sql);
  
  let systemPrompt = `You are a SQL validator. 
Given a SQL query and database schema, validate if the query is correct and will run without errors.
Always respond with valid JSON in the following format:
{
  "is_valid": true/false,
  "errors": ["list of errors if any"],
  "suggestions": ["suggestions for improvement"]
}`;

  if (relationships) {
    systemPrompt += `\n\nThe database has the following relationships: ${relationships}`;
  }

  if (constraints) {
    systemPrompt += `\n\nThe database has the following constraints: ${constraints}`;
  }

  const userMessage = `Schema:
${schema}

SQL Query:
${sql}

Validate this SQL query against the provided schema.`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 4000,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    });

    return parseAnthropicResponse(response);
  } catch (error: any) {
    console.error("Error validating SQL:", error);
    throw new Error(`Failed to validate SQL: ${error.message}`);
  }
}

export async function generateQueryTemplate(category: string, purpose: string) {
  console.log("Generating query template:", category, purpose);
  
  const systemPrompt = `You are a SQL template generator.
Given a category and purpose, generate a template SQL query.
Always respond with valid JSON in the following format:
{
  "name": "name of the template",
  "description": "what the template does",
  "template": "the SQL template with placeholders",
  "placeholders": [
    {
      "name": "placeholder name",
      "description": "what this placeholder represents"
    }
  ]
}`;

  const userMessage = `Category: ${category}
Purpose: ${purpose}

Generate a SQL query template for this category and purpose.`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 4000,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    });

    return parseAnthropicResponse(response);
  } catch (error: any) {
    console.error("Error generating query template:", error);
    throw new Error(`Failed to generate query template: ${error.message}`);
  }
}

function parseAnthropicResponse(response: any) {
  if (!response.content || response.content.length === 0) {
    throw new Error('Empty response from API');
  }

  const content = response.content[0];
  if ('text' in content) {
    // Handle potential code block markers in the response
    let textContent = content.text.trim();
    console.log("Raw API response:", textContent);

    // First, try to extract JSON from markdown code blocks
    let jsonMatch = textContent.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch && jsonMatch[1]) {
      textContent = jsonMatch[1].trim();
    } else {
      // If no code blocks found, remove any potential markdown code block syntax 
      textContent = textContent.replace(/```json\s*/g, '')
                               .replace(/```\s*/g, '')
                               .trim();
    }

    // Further cleanup to ensure valid JSON - replace any invalid control characters
    textContent = textContent.replace(/[\x00-\x1F\x7F]/g, ' ').trim();

    try {
      console.log("Cleaned JSON for parsing:", textContent);
      return JSON.parse(textContent);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      console.error('Response Text:', textContent);

      // Last resort - try to extract anything that looks like JSON with more aggressive regex
      try {
        // Look for content between curly braces, including nested braces
        const fullMatch = textContent.match(/(\{(?:[^{}]|(?:\{(?:[^{}]|(?:\{[^{}]*\}))*\}))*\})/);
        if (fullMatch && fullMatch[0]) {
          console.log("Attempting regex JSON extraction with full match");
          return JSON.parse(fullMatch[0]);
        }
      } catch (regexError) {
        console.error('Regex extraction failed:', regexError);
      }

      // If all parsing attempts fail
      throw new Error('Failed to parse API response as JSON. Response was: ' + 
                      textContent.substring(0, 100) + '...');
    }
  }
  
  throw new Error('Invalid response format from API');
}

// Add this function for code snippet generation
export async function generateCodeSnippet(sql: string, language: string, framework: string) {
  console.log("Generating code snippet:", language, framework);
  
  const systemPrompt = `You are a code generator.
Given a SQL query, programming language, and framework, generate code that executes the query.
Always respond with valid JSON in the following format:
{
  "code": "the code snippet",
  "explanation": "brief explanation of what the code does"
}`;

  const userMessage = `SQL Query:
${sql}

Programming Language: ${language}
Framework: ${framework}

Generate code that executes this SQL query.`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 4000,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    });

    return parseAnthropicResponse(response);
  } catch (error: any) {
    console.error("Error generating code snippet:", error);
    throw new Error(`Failed to generate code snippet: ${error.message}`);
  }
}
