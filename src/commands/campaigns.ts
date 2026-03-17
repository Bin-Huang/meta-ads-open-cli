import { Command } from "commander";
import { loadCredentials } from "../auth.js";
import { callApi } from "../api.js";
import { output, fatal } from "../utils.js";

export function registerCampaignCommands(program: Command): void {
  program
    .command("campaigns <account-id>")
    .description("List campaigns for an ad account")
    .option("--limit <n>", "Number of results (default 100)", "100")
    .option("--after <cursor>", "Pagination cursor")
    .option("--status <status>", "Filter by effective_status: ACTIVE, PAUSED, ARCHIVED, DELETED")
    .action(async (accountId: string, opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const actId = accountId.startsWith("act_") ? accountId : `act_${accountId}`;
        const params: Record<string, string> = {
          fields: "id,name,objective,status,effective_status,buying_type,bid_strategy,budget_remaining,daily_budget,lifetime_budget,created_time,updated_time,start_time,stop_time",
          limit: opts.limit,
        };
        if (opts.after) params.after = opts.after;
        if (opts.status) params["filtering"] = JSON.stringify([{ field: "effective_status", operator: "IN", value: [opts.status] }]);
        const data = await callApi({ creds, path: `${actId}/campaigns`, params });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });

  program
    .command("campaign <campaign-id>")
    .description("Get a specific campaign")
    .action(async (campaignId: string) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const data = await callApi({
          creds,
          path: campaignId,
          params: {
            fields: "id,name,objective,status,effective_status,buying_type,bid_strategy,budget_remaining,daily_budget,lifetime_budget,created_time,updated_time,start_time,stop_time,special_ad_categories",
          },
        });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });

  program
    .command("adsets <account-id>")
    .description("List ad sets for an ad account")
    .option("--limit <n>", "Number of results (default 100)", "100")
    .option("--after <cursor>", "Pagination cursor")
    .option("--campaign <id>", "Filter by campaign ID")
    .option("--status <status>", "Filter by effective_status: ACTIVE, PAUSED, ARCHIVED, DELETED")
    .action(async (accountId: string, opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const actId = accountId.startsWith("act_") ? accountId : `act_${accountId}`;
        const params: Record<string, string> = {
          fields: "id,name,campaign_id,status,effective_status,daily_budget,lifetime_budget,bid_amount,bid_strategy,billing_event,optimization_goal,targeting,start_time,end_time,created_time,updated_time",
          limit: opts.limit,
        };
        if (opts.after) params.after = opts.after;
        const filtering: Array<Record<string, unknown>> = [];
        if (opts.status) filtering.push({ field: "effective_status", operator: "IN", value: [opts.status] });
        if (opts.campaign) filtering.push({ field: "campaign.id", operator: "EQUAL", value: opts.campaign });
        if (filtering.length > 0) params.filtering = JSON.stringify(filtering);
        const data = await callApi({ creds, path: `${actId}/adsets`, params });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });

  program
    .command("adset <adset-id>")
    .description("Get a specific ad set")
    .action(async (adsetId: string) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const data = await callApi({
          creds,
          path: adsetId,
          params: {
            fields: "id,name,campaign_id,status,effective_status,daily_budget,lifetime_budget,bid_amount,bid_strategy,billing_event,optimization_goal,targeting,start_time,end_time,created_time,updated_time,promoted_object",
          },
        });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });
}
