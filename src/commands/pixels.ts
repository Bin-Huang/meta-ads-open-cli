import { Command } from "commander";
import { loadCredentials } from "../auth.js";
import { callApi } from "../api.js";
import { output, fatal } from "../utils.js";

export function registerPixelCommands(program: Command): void {
  program
    .command("pixels <account-id>")
    .description("List Meta Pixels for an ad account")
    .option("--limit <n>", "Number of results (default 100)", "100")
    .action(async (accountId: string, opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const actId = accountId.startsWith("act_") ? accountId : `act_${accountId}`;
        const params: Record<string, string> = {
          fields: "id,name,code,creation_time,last_fired_time,is_created_by_business",
          limit: opts.limit,
        };
        const data = await callApi({ creds, path: `${actId}/adspixels`, params });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });

  program
    .command("pixel-events <pixel-id>")
    .description("List events received by a Meta Pixel")
    .action(async (pixelId: string) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const data = await callApi({
          creds,
          path: `${pixelId}/stats`,
          params: {
            fields: "data",
          },
        });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });

  program
    .command("custom-conversions <account-id>")
    .description("List custom conversions for an ad account")
    .option("--limit <n>", "Number of results (default 100)", "100")
    .action(async (accountId: string, opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const actId = accountId.startsWith("act_") ? accountId : `act_${accountId}`;
        const params: Record<string, string> = {
          fields: "id,name,description,pixel,rule,default_conversion_value,custom_event_type,creation_time,last_fired_time",
          limit: opts.limit,
        };
        const data = await callApi({ creds, path: `${actId}/customconversions`, params });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });
}
