/**
 * Cerebras Essay Agent Service
 * AI-powered essay analysis, feedback, and idea generation using Cerebras.ai
 * 
 * To use this service, you need:
 * 1. A Cerebras API key from https://cloud.cerebras.ai
 * 2. Set VITE_CEREBRAS_API_KEY in your .env file
 */

import axios from 'axios';

// Cerebras API Configuration
// Docs: https://inference-docs.cerebras.ai/
const CEREBRAS_API_URL = 'https://api.cerebras.ai/v1/chat/completions';
const CEREBRAS_MODEL = 'llama3.1-8b'; // Available models: llama3.1-8b, llama3.1-70b

// Get API key from environment
const getApiKey = (): string => {
  const apiKey = import.meta.env.VITE_CEREBRAS_API_KEY;
  if (!apiKey) {
    console.warn('Cerebras API key not found. Set VITE_CEREBRAS_API_KEY in your .env file');
  }
  return apiKey || '';
};

// Types
export interface EssayFeedbackItem {
  id: string;
  type: 'strength' | 'improvement' | 'suggestion' | 'insight';
  text: string;
}

export interface EssayFeedbackResponse {
  overallScore: number;
  items: EssayFeedbackItem[];
}

export interface GeneratedIdea {
  id: string;
  text: string;
}

export interface EssayIdeaRequest {
  topic: string;
  cogins1?: string;
  cogins2?: string;
  keyExperiences?: string;
  tags?: string[];
}

// Helper function to make Cerebras API calls
async function callCerebrasAPI(messages: { role: string; content: string }[]): Promise<string> {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    throw new Error('Cerebras API key not configured. Please add VITE_CEREBRAS_API_KEY to your .env file.');
  }

  try {
    const response = await axios.post(
      CEREBRAS_API_URL,
      {
        model: CEREBRAS_MODEL,
        messages,
        max_tokens: 2000,
        temperature: 0.7,
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.choices[0]?.message?.content || '';
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error('Invalid Cerebras API key. Please check your VITE_CEREBRAS_API_KEY.');
      }
      if (error.response?.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }
      throw new Error(`Cerebras API error: ${error.response?.data?.error?.message || error.message}`);
    }
    throw error;
  }
}

/**
 * Analyze an essay and provide comprehensive feedback
 */
export async function analyzeEssay(
  essayText: string,
  essayType: string
): Promise<EssayFeedbackResponse> {
  const systemPrompt = `You are an expert college admissions essay coach with years of experience helping students craft compelling personal statements. 
  
Analyze the following ${essayType} essay and provide detailed feedback. Your response MUST be valid JSON in this exact format:
{
  "overallScore": <number 0-100>,
  "items": [
    {"id": "1", "type": "strength", "text": "<specific strength>"},
    {"id": "2", "type": "strength", "text": "<another strength>"},
    {"id": "3", "type": "improvement", "text": "<area needing improvement>"},
    {"id": "4", "type": "improvement", "text": "<another improvement area>"},
    {"id": "5", "type": "suggestion", "text": "<actionable suggestion>"},
    {"id": "6", "type": "suggestion", "text": "<another suggestion>"},
    {"id": "7", "type": "insight", "text": "<admissions insight>"},
    {"id": "8", "type": "insight", "text": "<another insight>"}
  ]
}

Evaluate on:
- Opening hook and engagement
- Authenticity and personal voice
- Structure and flow
- Specific examples and storytelling
- Grammar and word choice
- Connection to the essay prompt/type
- Overall impact for admissions`;

  const userPrompt = `Please analyze this ${essayType} essay:\n\n${essayText}`;

  try {
    const response = await callCerebrasAPI([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ]);

    // Parse the JSON response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]) as EssayFeedbackResponse;
      return parsed;
    }

    // Fallback if parsing fails
    throw new Error('Failed to parse AI response');
  } catch (error) {
    console.error('Essay analysis error:', error);
    throw error;
  }
}

/**
 * Generate essay ideas based on user input
 */
export async function generateEssayIdeas(
  request: EssayIdeaRequest
): Promise<GeneratedIdea[]> {
  const systemPrompt = `You are a creative college admissions essay brainstorming coach. Generate unique, compelling essay ideas based on the student's input.

Your response MUST be valid JSON in this exact format:
{
  "ideas": [
    {"id": "1", "text": "<detailed essay idea with angle and approach>"},
    {"id": "2", "text": "<another unique essay idea>"},
    {"id": "3", "text": "<creative alternative approach>"},
    {"id": "4", "text": "<unexpected angle on the topic>"},
    {"id": "5", "text": "<personal growth focused idea>"}
  ]
}

Each idea should be 2-3 sentences explaining the concept, angle, and how to make it compelling.`;

  let userPrompt = `Generate essay ideas based on:\n`;
  if (request.topic) userPrompt += `\nTopic/Theme: ${request.topic}`;
  if (request.cogins1) userPrompt += `\nContext 1: ${request.cogins1}`;
  if (request.cogins2) userPrompt += `\nContext 2: ${request.cogins2}`;
  if (request.keyExperiences) userPrompt += `\nKey Experiences: ${request.keyExperiences}`;
  if (request.tags?.length) userPrompt += `\nThemes to incorporate: ${request.tags.join(', ')}`;

  try {
    const response = await callCerebrasAPI([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ]);

    // Parse the JSON response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]) as { ideas: GeneratedIdea[] };
      return parsed.ideas;
    }

    throw new Error('Failed to parse AI response');
  } catch (error) {
    console.error('Idea generation error:', error);
    throw error;
  }
}

/**
 * Get quick writing suggestions for improving specific text
 */
export async function getWritingSuggestions(
  text: string,
  context: string = 'college essay'
): Promise<string[]> {
  const systemPrompt = `You are a writing coach. Provide 3-5 specific, actionable suggestions to improve the given text for a ${context}.

Your response MUST be valid JSON:
{"suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"]}`;

  try {
    const response = await callCerebrasAPI([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Improve this text:\n\n${text}` },
    ]);

    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]) as { suggestions: string[] };
      return parsed.suggestions;
    }

    return [];
  } catch (error) {
    console.error('Writing suggestions error:', error);
    throw error;
  }
}

// Export service object
export const cerebrasEssayService = {
  analyzeEssay,
  generateEssayIdeas,
  getWritingSuggestions,
};

export default cerebrasEssayService;

