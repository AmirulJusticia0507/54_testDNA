const axios = require('axios');

function getAiConfig() {
  const AI_BASE_URL = process.env.AI_BASE_URL || 'https://griphubrouter.web.id/v1';
  const AI_API_KEY = process.env.AI_API_KEY;
  const AI_MODEL = process.env.AI_MODEL || 'llama-4-scout-17b-16e-instruct';
  const AI_TEMPERATURE = parseFloat(process.env.AI_TEMPERATURE || '0.2');
  const AI_TIMEOUT = parseInt(process.env.AI_TIMEOUT || '60000', 10);
  return { AI_BASE_URL, AI_API_KEY, AI_MODEL, AI_TEMPERATURE, AI_TIMEOUT };
}

function aiHeaders(cfg = getAiConfig()) {
  if (!cfg.AI_API_KEY || cfg.AI_API_KEY === 'YOUR_API_KEY' || cfg.AI_API_KEY === 'your-api-key-here') {
    throw new Error('AI_API_KEY belum diset di .env. Silakan isi AI_API_KEY terlebih dahulu.');
  }
  return {
    'Authorization': `Bearer ${cfg.AI_API_KEY}`,
    'Content-Type': 'application/json',
  };
}

async function chatCompletion({ messages, system, user, model, temperature } = {}) {
  try {
    const payloadMessages = messages ? [...messages] : [];
    if (system) {
      payloadMessages.unshift({ role: 'system', content: system });
    }
    if (user) {
      payloadMessages.push({ role: 'user', content: user });
    }
    if (payloadMessages.length === 0) {
      throw new Error('Minimal 1 pesan (messages/system+user) diperlukan.');
    }
    const cfg = getAiConfig();
    const payload = {
      model: model || cfg.AI_MODEL,
      messages: payloadMessages,
      temperature: typeof temperature === 'number' ? temperature : cfg.AI_TEMPERATURE,
    };
    const res = await axios.post(`${cfg.AI_BASE_URL}/chat/completions`, payload, {
      headers: aiHeaders(cfg),
      timeout: cfg.AI_TIMEOUT,
    });
    const choice = res.data?.choices?.[0];
    const content = choice?.message?.content || choice?.text || '';
    return {
      raw: res.data,
      content: String(content).trim(),
      usage: res.data?.usage || null,
      model: res.data?.model || payload.model,
    };
  } catch (err) {
    console.error('AI service error (chatCompletion):', err.message);
    if (err.response) {
      console.error('AI response status:', err.response.status, 'data:', JSON.stringify(err.response.data));
    }
    throw err;
  }
}

async function generateImage({ prompt, model, size, n } = {}) {
  try {
    if (!prompt) throw new Error('Prompt diperlukan untuk generate image.');
    const cfg = getAiConfig();
    const payload = {
      model: model || 'gpt-image',
      prompt,
      size: size || '1024x1024',
      n: n || 1,
    };
    const imgRes = await axios.post(`${cfg.AI_BASE_URL}/images/generations`, payload, {
      headers: aiHeaders(cfg),
      timeout: cfg.AI_TIMEOUT,
    });
    return {
      raw: res.data,
      data: res.data?.data || [],
    };
  } catch (err) {
    console.error('AI service error (generateImage):', err.message);
    if (err.response) {
      console.error('AI response status:', err.response.status, 'data:', JSON.stringify(err.response.data));
    }
    throw err;
  }
}

module.exports = { chatCompletion, generateImage };