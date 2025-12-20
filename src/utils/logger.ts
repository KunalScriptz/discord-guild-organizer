import chalk from 'chalk';

export const logger = {
    info: (message: string, ...args: any[]) => console.log(chalk.blue('ℹ'), message, ...args),
    success: (message: string, ...args: any[]) => console.log(chalk.green('✔'), message, ...args),
    warn: (message: string, ...args: any[]) => console.log(chalk.yellow('⚠'), message, ...args),
    error: (message: string, ...args: any[]) => console.log(chalk.red('✖'), message, ...args),
    step: (message: string, ...args: any[]) => console.log(chalk.magenta('✦'), message, ...args),
    header: (message: string) => console.log(chalk.bold.blue(`\n--- ${message} ---\n`)),
    resetHeader: (message: string) => console.log(chalk.bold.red(`\n--- ${message} ---\n`)),
    folder: (name: string) => console.log(chalk.bold.yellow(`📁 ${name}`)),
    guild: (name: string, exists: boolean) => console.log(`  ${exists ? chalk.green('✓') : chalk.red('?')} ${name}`),
    bold: (message: string | number) => chalk.bold(message),
    cyan: (message: string | number) => chalk.cyan(message),
    dim: (message: string | number) => chalk.dim(message),
    highlight: (message: string | number) => chalk.bold.white(message),
};
