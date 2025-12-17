/**
 * Essay Agent Service
 * AI-powered essay analysis, feedback, and idea generation
 * 
 * This service now calls backend endpoints which handle token consumption
 * and Cerebras API integration.
 */

import axios from 'axios';
import { API_CONFIG, API_ENDPOINTS } from './config';

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
  user_profile_id: number;
  topic: string;
  cogins1?: string;
  cogins2?: string;
  keyExperiences?: string;
  tags?: string[];
}

// Note: Direct Cerebras API calls are now handled by the backend.
// The helper function below is kept for getWritingSuggestions which may still use it.
// Helper function to make Cerebras API calls (legacy - used only for getWritingSuggestions)
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
 * Consumes tokens: essay_feedback (25 tokens)
 */
export async function analyzeEssay(
  user_profile_id: number,
  essayText: string,
  essayType: string
): Promise<EssayFeedbackResponse> {
  try {
    const response = await axios.post(
      `${API_CONFIG.baseURL}${API_ENDPOINTS.ESSAY.ANALYZE}`,
      {
        user_profile_id,
        essay_text: essayText,
        essay_type: essayType,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 60000, // 60 seconds
      }
    );

    return response.data as EssayFeedbackResponse;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 402) {
        throw new Error('Insufficient tokens. Please purchase more tokens to analyze essays.');
      }
      if (error.response?.status === 400) {
        throw new Error(error.response.data?.error || 'Invalid request. Please check your input.');
      }
      throw new Error(error.response?.data?.error || `Failed to analyze essay: ${error.message}`);
    }
    console.error('Essay analysis error:', error);
    throw error;
  }
}

/**
 * Generate essay ideas based on user input
 * Consumes tokens: essay_brainstorm (10 tokens)
 */
export async function generateEssayIdeas(
  request: EssayIdeaRequest
): Promise<GeneratedIdea[]> {
  try {
    const response = await axios.post(
      `${API_CONFIG.baseURL}${API_ENDPOINTS.ESSAY.GENERATE_IDEAS}`,
      {
        user_profile_id: request.user_profile_id,
        topic: request.topic,
        cogins1: request.cogins1,
        cogins2: request.cogins2,
        key_experiences: request.keyExperiences,
        tags: request.tags,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 60000, // 60 seconds
      }
    );

    return response.data.ideas as GeneratedIdea[];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 402) {
        throw new Error('Insufficient tokens. Please purchase more tokens to generate essay ideas.');
      }
      if (error.response?.status === 400) {
        throw new Error(error.response.data?.error || 'Invalid request. Please check your input.');
      }
      throw new Error(error.response?.data?.error || `Failed to generate ideas: ${error.message}`);
    }
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

