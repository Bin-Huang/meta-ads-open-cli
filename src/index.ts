#!/usr/bin/env node
import { Command } from "commander";
import { registerAccountCommands } from "./commands/accounts.js";
import { registerCampaignCommands } from "./commands/campaigns.js";
import { registerAdCommands } from "./commands/ads.js";
import { registerInsightsCommands } from "./commands/insights.js";
import { registerAudienceCommands } from "./commands/audiences.js";
import { registerPixelCommands } from "./commands/pixels.js";
import { registerPageCommands } from "./commands/pages.js";
import { registerLeadCommands } from "./commands/leads.js";

const program = new Command();

program
  .name("meta-ads-open-cli")
  .description("Meta Ads CLI for AI agents (Facebook, Instagram, Messenger, Audience Network)")
  .version("1.0.0")
  .option("--format <format>", "Output format", "json")
  .option("--credentials <path>", "Path to credentials JSON file")
  .addHelpText(
    "after",
    "\nDocs: https://github.com/Bin-Huang/meta-ads-open-cli"
  );

program.configureOutput({
  writeErr: (str: string) => {
    const msg = str.replace(/^error: /i, "").trim();
    if (msg) process.stderr.write(JSON.stringify({ error: msg }) + "\n");
  },
  writeOut: (str: string) => {
    process.stdout.write(str);
  },
});

program.showHelpAfterError(false);

program.hook("preAction", () => {
  const format = program.opts().format;
  if (format !== "json" && format !== "compact") {
    process.stderr.write(
      JSON.stringify({ error: "Format must be 'json' or 'compact'." }) + "\n"
    );
    process.exit(1);
  }
});

registerAccountCommands(program);
registerCampaignCommands(program);
registerAdCommands(program);
registerInsightsCommands(program);
registerAudienceCommands(program);
registerPixelCommands(program);
registerPageCommands(program);
registerLeadCommands(program);

program.on("command:*", (operands) => {
  process.stderr.write(
    JSON.stringify({ error: `Unknown command: ${operands[0]}. Run --help for available commands.` }) + "\n"
  );
  process.exit(1);
});

if (process.argv.length <= 2) {
  program.outputHelp();
  process.exit(0);
}

program.parse();
