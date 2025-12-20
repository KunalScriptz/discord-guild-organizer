import { Client } from 'discord.js-selfbot-v13';
import { logger } from '../utils/logger';

export async function runRevert(client: Client) {
    logger.success(`Logged in as ${logger.bold(logger.cyan(client.user?.tag || 'Unknown'))}!`);

    const guilds = client.guilds.cache;
    logger.info(`Managing organization for ${logger.bold(guilds.size)} guilds.`);

    try {
        logger.warn('Action: Clear all server folders.');
        logger.dim('This will move all servers out of folders and into a flat list.');

        if (process.env.APPLY === 'true') {
            logger.info('Applying folders to Discord...');
            await (client.settings as any).edit({
                guild_folders: []
            });
            logger.success(logger.bold('Folders cleared successfully!'));
        } else {
            logger.info(logger.bold('DRY RUN MODE'));
            logger.dim('To execute this action, set APPLY=true in your .env or run:');
            logger.highlight('APPLY=true bun run mess');
        }
    } catch (error) {
        logger.error('Error clearing folders:', error);
    }
}
