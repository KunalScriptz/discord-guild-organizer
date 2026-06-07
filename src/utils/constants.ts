export const LITELLM_API_URL = 'http://localhost:4000/v1/chat/completions';
export const LITELLM_MODEL = 'deepseek-chat';

export const FOLDER_BASE_ID = 100;

// Discord folder colors (name -> int value)
export const FOLDER_COLORS: Record<string, number> = {
    Teal: 1752220,
    Blue: 3447003,
    Purple: 10181046,
    Pink: 15277667,
    Red: 15548997,
    Orange: 15105570,
    Yellow: 16776960,
    Green: 3066993,
    Grey: 9936031,
};

export const COLOR_NAMES = Object.keys(FOLDER_COLORS);

export const HEADER_MAIN = 'Discord Guild Manager';
export const HEADER_RESET = 'Discord Guild Reset';
export const HEADER_COMPLETE = 'Task Complete';
