<div align="center">
  <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Gear.png" alt="Gear" width="120" height="120" />
  <h1>✨ Guild Organizer ✨</h1>
  <p><strong>Intelligent Discord Organization Powered by AI</strong></p>

  <p>
    <img src="https://img.shields.io/badge/Bun-v1.2.23-000000?style=for-the-badge&logo=bun&logoColor=white" alt="Bun Version" />
    <img src="https://img.shields.io/badge/TypeScript-v5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Discord.js--Selfbot-v13-5865F2?style=for-the-badge&logo=discord&logoColor=white" alt="Discord.js" />
    <img src="https://img.shields.io/badge/DeepSeek-AI-orange?style=for-the-badge" alt="DeepSeek" />
  </p>
</div>

---

## 🚀 Overview

**Guild Organizer** is a sophisticated CLI tool designed to help you regain control over your Discord server list. It leverages **DeepSeek AI** to analyze your guilds and suggest a perfectly categorized folder structure, then applies it directly to your account with surgical precision.

### 🌟 Key Features

- 🧠 **AI-Powered Categorization**: Automatically groups servers based on their names and purpose using advanced LLMs.
- 🛡️ **Dry Run Mode**: Preview the suggested organization before applying any changes to your Discord account.
- 🧹 **One-Click Revert**: Not a fan of the new setup? Use the `reset` command to instantly clear all folders and start fresh.
- ⚡ **Built for Speed**: Powered by **Bun**, ensuring lightning-fast execution and minimal overhead.
- 🎨 **Beautiful CLI**: Interactive and colorful logging that makes management a breeze.

---

## 🛠️ Tech Stack

- **Runtime**: [Bun](https://bun.sh)
- **Library**: [discord.js-selfbot-v13](https://github.com/aiko-chan-ai/discord.js-selfbot-v13)
- **AI Proxy**: [LiteLLM](https://github.com/BerriAI/litellm)
- **AI Backend**: [DeepSeek API](https://platform.deepseek.com)
- **Languages**: TypeScript, JavaScript

---

## ⚙️ Setup & Installation

### 1. Prerequisites
Ensure you have [Bun](https://bun.sh) and Python 3 installed on your system.

### 2. Clone & Install
```bash
bun install
pip install litellm
```

### 3. Start LiteLLM Proxy
The tool communicates with DeepSeek through a local LiteLLM proxy. Start it in a separate terminal:

```bash
bun run proxy
```

### 4. Environment Configuration
Create a `.env` file in the root directory and add your credentials:

```dotenv
DISCORD_TOKEN="your_self_token"
DEEPSEEK_API_KEY="sk-..."
APPLY=false
```

> [!WARNING]
> **Self-botting is against Discord's Terms of Service.** Use this tool responsibly and at your own risk.

---

## 📖 Usage Guide

### 📂 Organize Guilds
Analyze and organize your servers into AI-suggested folders.

> Make sure the LiteLLM proxy is running (`bun run proxy` in another terminal).

**Dry Run (Preview):**
```bash
bun run start
```

**Apply Changes:**
```bash
# Method 1: Modify .env (Set APPLY=true)
bun run start

# Method 2: Command line override
APPLY=true bun run start
```

### 🔄 Reset Organization
Instantly undo all AI-suggested organization and move all servers back into a single flat list.

```bash
APPLY=true bun run reset
```

> [!NOTE]
> This command will remove all existing server folders from your account. It is useful if you want to start over or return to Discord's default layout.

---

## 🎨 Customization
You can fine-tune how the AI categorizes your servers by editing the `prompt.txt` file.

- **Modify Categories**: Add or remove specific categories you want the AI to prioritize.
- **Set Style**: Instruct the AI to use specific naming conventions (e.g., "Always use emojis in folder names").
- **Exclusions**: Tell the AI to ignore certain types of servers.

---

## 🧠 How It Works

1. **Fetch**: The tool connects to your Discord account and retrieves a list of all joined guilds.
2. **Analyze**: Guild names are sent to **DeepSeek AI** (via LiteLLM proxy) to identify logical groupings (e.g., Gaming, Dev, Community, Crypto).
3. **Draft**: A folder structure is generated with specific guild mappings and Discord-compatible colors.
4. **Sync**: If `APPLY` is set to `true`, the `client.settings.edit` method is called to synchronize the new structure to your Discord profile.

---

<div align="center">
  <p>Made by <a href="https://x.com/ee3lol">@ee3lol</a></p>
</div>
