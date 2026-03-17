import { Command } from "commander";
import { loadCredentials } from "../auth.js";
import { callApi } from "../api.js";
import { output, fatal } from "../utils.js";

export function registerPageCommands(program: Command): void {
  program
    .command("pages")
    .description("List Facebook Pages the user manages")
    .option("--limit <n>", "Number of results (default 100)", "100")
    .action(async (opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const params: Record<string, string> = {
          fields: "id,name,category,fan_count,link,verification_status",
          limit: opts.limit,
        };
        const data = await callApi({ creds, path: "me/accounts", params });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });

  program
    .command("page <page-id>")
    .description("Get a specific Facebook Page")
    .action(async (pageId: string) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const data = await callApi({
          creds,
          path: pageId,
          params: {
            fields: "id,name,category,fan_count,link,about,description,website,phone,emails,location,verification_status,instagram_business_account",
          },
        });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });

  program
    .command("instagram-accounts <page-id>")
    .description("Get Instagram business account linked to a Facebook Page")
    .action(async (pageId: string) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const data = await callApi({
          creds,
          path: pageId,
          params: {
            fields: "instagram_business_account{id,name,username,profile_picture_url,followers_count,media_count}",
          },
        });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });
}
