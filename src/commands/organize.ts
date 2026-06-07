import fs from 'fs/promises';
import path from 'path';
import { Client } from 'discord.js-selfbot-v13';
import { logger } from '../utils/logger';
import { categorizeGuilds } from '../services/ai';
import { FOLDER_BASE_ID, FOLDER_COLORS, COLOR_NAMES } from '../utils/constants';

export async function runOrganize(client: Client) {
    logger.success(`Logged in as ${logger.bold(logger.cyan(client.user?.tag || 'Unknown'))}!`);

    const guilds = client.guilds.cache.map((g) => ({
        id: g.id,
        name: g.name,
    }));

    logger.info(`Fetched ${logger.bold(guilds.length)} guilds.`);

    // Save guilds to file
    const guildsPath = path.join(process.cwd(), 'guilds.json');
    await fs.writeFile(guildsPath, JSON.stringify(guilds, null, 2), 'utf-8');
    logger.dim(`Saved guilds list to guilds.json`);

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
            // Normalize the AI response into a string array of server names
            // AI can return: array, {servers: [], color: "..."}, or nested {subfolder: [...]}
            let names: string[];
            let aiColor: string | undefined;

            if (Array.isArray(serverNames)) {
                names = serverNames.map((s: any) => typeof s === 'string' ? s : (s?.name || s?.server || String(s)));
            } else if (typeof serverNames === 'object' && serverNames !== null) {
                const obj = serverNames as Record<string, any>;
                // Format: {"servers": [...], "color": "Blue"}
                if (Array.isArray(obj.servers)) {
                    names = obj.servers.map((s: any) => typeof s === 'string' ? s : (s?.name || s?.server || String(s)));
                    aiColor = obj.color;
                } else {
                    // Flatten nested object: treat keys as server names
                    names = Object.keys(obj);
                }
            } else {
                names = [];
            }

            const guild_ids = names
                .map((name) => guilds.find((g) => g.name === name)?.id)
                .filter((id): id is string => !!id);

            // Use AI-suggested color if provided and valid, otherwise cycle
            const colorName = (aiColor && FOLDER_COLORS[aiColor])
                ? aiColor
                : COLOR_NAMES[(index * 3) % COLOR_NAMES.length];
            const color = FOLDER_COLORS[colorName] || FOLDER_COLORS[COLOR_NAMES[index % COLOR_NAMES.length]];

            logger.folder(folderName);
            names.forEach(name => {
                const found = guilds.some(g => g.name === name);
                logger.guild(name, found);
            });

            return {
                name: folderName,
                guild_ids,
                id: (index + FOLDER_BASE_ID).toString(),
                color,
            };
        });

        // Safety check: if most servers weren't found in guild list, AI response is likely broken
        const totalMapped = folders.reduce((sum, f) => sum + f.guild_ids.length, 0);
        if (totalMapped < guilds.length * 0.3) {
            logger.error(`Only ${totalMapped}/${guilds.length} guilds mapped — AI response looks broken. Aborting to prevent bad folder structure.`);
            return;
        }

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
