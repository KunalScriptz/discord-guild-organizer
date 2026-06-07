import fs from 'fs/promises';
import path from 'path';
import { logger } from '../utils/logger';
import { LITELLM_API_URL, LITELLM_MODEL } from '../utils/constants';

export async function categorizeGuilds(guilds: { id: string; name: string }[]) {
    const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

    if (!DEEPSEEK_API_KEY) {
        logger.error('Missing DEEPSEEK_API_KEY in .env file');
        return {};
    }

    try {
        const promptBase = await fs.readFile(path.join(process.cwd(), 'prompt.txt'), 'utf-8');
        const prompt = `${promptBase}\n\nServers:\n${guilds.map((g) => g.name).join('\n')}`;

        const response = await fetch(LITELLM_API_URL, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: LITELLM_MODEL,
                max_tokens: 4096,
                messages: [
                    {
                        role: 'system',
                        content: 'You are a Discord organization assistant. You categorize servers into folders. Return ONLY valid JSON. Include EVERY server from the list — do not skip or omit any.',
                    },
                    {
                        role: 'user',
                        content: prompt,
                    },
                ],
                response_format: { type: 'json_object' },
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            logger.error(`LiteLLM/DeepSeek API Error (${response.status}):`, errorText);
            return {};
        }

        const data = await response.json() as any;

        if (data.error) {
            logger.error('API Error Data:', data.error);
            return {};
        }

        const content = data.choices?.[0]?.message?.content;
        if (!content) {
            logger.warn('DeepSeek returned no content.');
            return {};
        }

        const jsonStr = content.replace(/```json/g, '').replace(/```/g, '').trim();
        const cleanedJson = jsonStr.replace(/,(\s*[\]}])/g, '$1');
        const parsed = JSON.parse(cleanedJson);

        // Handle when AI wraps everything in a "folders" or "categories" parent key
        if (typeof parsed === 'object' && parsed !== null) {
            const keys = Object.keys(parsed);
            if (keys.length === 1 && typeof parsed[keys[0]] === 'object' && !Array.isArray(parsed[keys[0]])) {
                return parsed[keys[0]];
            }
        }
        return parsed;
    } catch (error) {
        logger.error('Fetch/FS error in AI service:', error);
        return {};
    }
}
