import { createDiscordClient, loginClient } from './services/discord';
import { runRevert } from './commands/revert';
import { logger } from './utils/logger';
import { HEADER_RESET, HEADER_COMPLETE } from './utils/constants';
import dotenv from 'dotenv';

dotenv.config();

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;

logger.resetHeader(HEADER_RESET);

if (!DISCORD_TOKEN) {
    logger.error('Missing DISCORD_TOKEN in .env file');
    process.exit(1);
}

const client = createDiscordClient();

client.on('ready', async () => {
    await runRevert(client);
    logger.resetHeader(HEADER_COMPLETE);
    process.exit(0);
});

loginClient(client, DISCORD_TOKEN);
