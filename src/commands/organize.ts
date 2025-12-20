import { Client } from 'discord.js-selfbot-v13';
import { logger } from '../utils/logger';
import { categorizeGuilds } from '../services/ai';
import { FOLDER_BASE_ID } from '../utils/constants';

export async function runOrganize(client: Client) {
    logger.success(`Logged in as ${logger.bold(logger.cyan(client.user?.tag || 'Unknown'))}!`);

    const guilds = client.guilds.cache.map((g) => ({
        id: g.id,
        name: g.name,
    }));

    logger.info(`Fetched ${logger.bold(guilds.length)} guilds.`);

    if (guilds.length === 0) {
        logger.warn('No guilds found.');
        return;
    }

    logger.step('Categorizing guilds with AI...');
    try {
        const categories = await categorizeGuilds(guilds);

        if (Object.keys(categories).length === 0) {
            logger.error('AI categorization failed or returned no categories.');
            return;
        }

        logger.header('Suggested Folder Structure');

        const folders = Object.entries(categories).map(([folderName, serverNames], index) => {
            const guild_ids = (serverNames as string[])
                .map((name) => guilds.find((g) => g.name === name)?.id)
                .filter((id): id is string => !!id);

            logger.folder(folderName);
            (serverNames as string[]).forEach(name => {
                const found = guilds.some(g => g.name === name);
                logger.guild(name, found);
            });

            return {
                name: folderName,
                guild_ids,
                id: (index + FOLDER_BASE_ID).toString(),
                color: 0,
            };
        });

        console.log('');

        if (process.env.APPLY === 'true') {
            logger.info('Applying folders to Discord...');
            await (client.settings as any).edit({
                guild_folders: folders
            });
            logger.success(logger.bold('Folders applied successfully!'));
        } else {
            logger.info(logger.bold('DRY RUN MODE'));
            logger.dim('To apply these changes, set APPLY=true in your .env or run:');
            logger.highlight('APPLY=true bun run start');
        }
    } catch (error) {
        logger.error('Error during organization process:', error);
    }
}
