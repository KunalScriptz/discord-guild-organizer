import { Client } from 'discord.js-selfbot-v13';
import { logger } from '../utils/logger';

export const createDiscordClient = () => {
    const client = new Client();

    client.on('error', (err) => logger.error('Discord client error:', err));

    return client;
};

export async function loginClient(client: Client, token: string) {
    try {
        await client.login(token);
    } catch (err) {
        logger.error('Failed to login:', err);
        process.exit(1);
    }
}
