import axios from 'axios';

const MEGALLM_API_KEY = process.env.MEGALLM_API_KEY;
const MEGALLM_API_URL = process.env.MEGALLM_API_URL || 'https://api.megallm.com/v1';

export async function generatePluginCode(prompt, model = 'gpt-4') {
  try {
    const response = await axios.post(
      `${MEGALLM_API_URL}/chat/completions`,
      {
        model: model,
        messages: [
          {
            role: 'system',
            content: 'You are an expert plugin developer. Generate high-quality, well-documented plugin code based on user requirements. Return only the code with comments.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      },
      {
        headers: {
          'Authorization': `Bearer ${MEGALLM_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const generatedCode = response.data.choices[0].message.content;
    const inputLength = prompt.length;
    const outputLength = generatedCode.length;

    return {
      code: generatedCode,
      inputLength,
      outputLength
    };
  } catch (error) {
    console.error('MegaLLM API Error:', error.response?.data || error.message);
    throw new Error('Failed to generate plugin code');
  }
}

export async function improvePluginCode(code, instructions, model = 'gpt-4') {
  try {
    const prompt = `Improve the following plugin code based on these instructions:\n\nInstructions: ${instructions}\n\nCode:\n${code}`;
    
    const response = await axios.post(
      `${MEGALLM_API_URL}/chat/completions`,
      {
        model: model,
        messages: [
          {
            role: 'system',
            content: 'You are an expert code reviewer and improver. Analyze the code and apply the requested improvements. Return only the improved code.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      },
      {
        headers: {
          'Authorization': `Bearer ${MEGALLM_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const improvedCode = response.data.choices[0].message.content;
    const inputLength = prompt.length;
    const outputLength = improvedCode.length;

    return {
      code: improvedCode,
      inputLength,
      outputLength
    };
  } catch (error) {
    console.error('MegaLLM API Error:', error.response?.data || error.message);
    throw new Error('Failed to improve plugin code');
  }
}

export async function fixPluginCode(code, errorDescription, model = 'gpt-4') {
  try {
    const prompt = `Fix the following plugin code. Error/Issue: ${errorDescription}\n\nCode:\n${code}`;
    
    const response = await axios.post(
      `${MEGALLM_API_URL}/chat/completions`,
      {
        model: model,
        messages: [
          {
            role: 'system',
            content: 'You are an expert debugger. Analyze the code, identify issues, and provide a fixed version. Return only the corrected code.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.5,
        max_tokens: 2000
      },
      {
        headers: {
          'Authorization': `Bearer ${MEGALLM_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const fixedCode = response.data.choices[0].message.content;
    const inputLength = prompt.length;
    const outputLength = fixedCode.length;

    return {
      code: fixedCode,
      inputLength,
      outputLength
    };
  } catch (error) {
    console.error('MegaLLM API Error:', error.response?.data || error.message);
    throw new Error('Failed to fix plugin code');
  }
}
