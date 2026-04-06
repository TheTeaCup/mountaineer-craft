import fs from "fs";
import crypto from "crypto";
import { EmbedBuilder, TextBasedChannel } from "discord.js";

const RULES_PATH = "./src/data/rules.txt";
const HASH_PATH = "./src/data/hash.txt";
const DATA_PATH = "./src/data/rulesMessage.json";

interface RulesData {
  channelId: string;
  messageId?: string;
}

// Load rules from file
export function loadRules(): string {
  return fs.readFileSync(RULES_PATH, "utf8");
}

// Generate hash
export function getHash(content: string): string {
  return crypto.createHash("sha256").update(content).digest("hex");
}

// Read stored hash
export function readHash(): string | null {
  if (!fs.existsSync(HASH_PATH)) return null;
  return fs.readFileSync(HASH_PATH, "utf8");
}

// Write hash
export function writeHash(hash: string): void {
  fs.writeFileSync(HASH_PATH, hash);
}

// Load rules.json
export function loadData(): RulesData {
  return JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));
}

// Save rules.json
export function saveData(data: RulesData): void {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

// Build embed
export function buildRulesEmbed(rules: string): EmbedBuilder {
  return new EmbedBuilder()
    .setTitle("📜 Server Rules")
    .setDescription(rules)
    .setColor(0xffb81c)
    .setFooter({ text: `Last updated` })
    .setTimestamp();
}

// Main updater
export async function updateRulesMessage(channel: TextBasedChannel) {
  const rules = loadRules();
  const newHash = getHash(rules);
  const oldHash = readHash();

  const data = loadData();

  let message;

  try {
    if (data.messageId) {
      message = await channel.messages.fetch(data.messageId);
    }
  } catch {
    message = null;
  }

  if (!channel.isSendable()) return;

  // If no message exists → create one
  if (!message) {
    const msg = await channel.send({
      embeds: [buildRulesEmbed(rules)],
    });

    data.messageId = msg.id;
    saveData(data);
    writeHash(newHash);

    console.log("Created new rules message.");
    return;
  }

  // If changed → update
  if (oldHash !== newHash) {
    await message.edit({
      embeds: [buildRulesEmbed(rules)],
    });

    writeHash(newHash);
    console.log("Updated rules message.");
  } else {
    console.log("Rules unchanged.");
  }
}
