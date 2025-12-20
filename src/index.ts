import { createDiscordClient, loginClient } from './services/discord';
import { runOrganize } from './commands/organize';
import { logger } from './utils/logger';
import { HEADER_MAIN, HEADER_COMPLETE } from './utils/constants';
import dotenv from 'dotenv';

dotenv.config();

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;

logger.header(HEADER_MAIN);

if (!DISCORD_TOKEN) {
    logger.error('Missing DISCORD_TOKEN in .env file');
    process.exit(1);
}

const client = createDiscordClient();

client.on('ready', async () => {
    await runOrganize(client);
    logger.header(HEADER_COMPLETE);
    process.exit(0);
});

loginClient(client, DISCORD_TOKEN);
