import { Command } from "commander";
import { loadCredentials } from "../auth.js";
import { callApi } from "../api.js";
import { output, fatal } from "../utils.js";

export function registerAudienceCommands(program: Command): void {
  program
    .command("custom-audiences <account-id>")
    .description("List custom audiences for an ad account")
    .option("--limit <n>", "Number of results (default 100)", "100")
    .option("--after <cursor>", "Pagination cursor")
    .action(async (accountId: string, opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const actId = accountId.startsWith("act_") ? accountId : `act_${accountId}`;
        const params: Record<string, string> = {
          fields: "id,name,description,subtype,approximate_count_lower_bound,approximate_count_upper_bound,time_created,time_updated,delivery_status,operation_status",
          limit: opts.limit,
        };
        if (opts.after) params.after = opts.after;
        const data = await callApi({ creds, path: `${actId}/customaudiences`, params });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });

  program
    .command("custom-audience <audience-id>")
    .description("Get a specific custom audience")
    .action(async (audienceId: string) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const data = await callApi({
          creds,
          path: audienceId,
          params: {
            fields: "id,name,description,subtype,approximate_count_lower_bound,approximate_count_upper_bound,time_created,time_updated,delivery_status,operation_status,rule,lookalike_spec,retention_days",
          },
        });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });

  program
    .command("saved-audiences <account-id>")
    .description("List saved audiences for an ad account")
    .option("--limit <n>", "Number of results (default 100)", "100")
    .option("--after <cursor>", "Pagination cursor")
    .action(async (accountId: string, opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const actId = accountId.startsWith("act_") ? accountId : `act_${accountId}`;
        const params: Record<string, string> = {
          fields: "id,name,description,approximate_count_lower_bound,approximate_count_upper_bound,targeting,run_status",
          limit: opts.limit,
        };
        if (opts.after) params.after = opts.after;
        const data = await callApi({ creds, path: `${actId}/saved_audiences`, params });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });

  program
    .command("reach-estimate <account-id>")
    .description("Get reach estimate for targeting specs")
    .requiredOption("--targeting <json>", "Targeting spec as JSON string")
    .action(async (accountId: string, opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const actId = accountId.startsWith("act_") ? accountId : `act_${accountId}`;
        const params: Record<string, string> = {
          targeting_spec: opts.targeting,
        };
        const data = await callApi({ creds, path: `${actId}/reachestimate`, params });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });
}
