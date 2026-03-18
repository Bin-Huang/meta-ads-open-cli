import { Command } from "commander";
import { loadCredentials } from "../auth.js";
import { callApi } from "../api.js";
import { output, fatal } from "../utils.js";

export function registerAdCommands(program: Command): void {
  program
    .command("ads <account-id>")
    .description("List ads for an ad account")
    .option("--limit <n>", "Number of results (default 100)", "100")
    .option("--after <cursor>", "Pagination cursor")
    .option("--adset <id>", "Filter by ad set ID")
    .option("--status <status>", "Filter by effective_status: ACTIVE, PAUSED, ARCHIVED, DELETED")
    .action(async (accountId: string, opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const actId = accountId.startsWith("act_") ? accountId : `act_${accountId}`;
        const params: Record<string, string> = {
          fields: "id,name,adset_id,campaign_id,status,effective_status,creative,created_time,updated_time",
          limit: opts.limit,
        };
        if (opts.after) params.after = opts.after;
        const filtering: Array<Record<string, unknown>> = [];
        if (opts.status) filtering.push({ field: "effective_status", operator: "IN", value: [opts.status] });
        if (opts.adset) filtering.push({ field: "adset.id", operator: "EQUAL", value: opts.adset });
        if (filtering.length > 0) params.filtering = JSON.stringify(filtering);
        const data = await callApi({ creds, path: `${actId}/ads`, params });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });

  program
    .command("ad <ad-id>")
    .description("Get a specific ad")
    .action(async (adId: string) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const data = await callApi({
          creds,
          path: adId,
          params: {
            fields: "id,name,adset_id,campaign_id,status,effective_status,creative,created_time,updated_time,tracking_specs",
          },
        });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });

  program
    .command("creatives <account-id>")
    .description("List ad creatives for an ad account")
    .option("--limit <n>", "Number of results (default 100)", "100")
    .option("--after <cursor>", "Pagination cursor")
    .action(async (accountId: string, opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const actId = accountId.startsWith("act_") ? accountId : `act_${accountId}`;
        const params: Record<string, string> = {
          fields: "id,name,title,body,image_url,thumbnail_url,object_type,object_story_spec,url_tags,call_to_action_type,link_url",
          limit: opts.limit,
        };
        if (opts.after) params.after = opts.after;
        const data = await callApi({ creds, path: `${actId}/adcreatives`, params });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });

  program
    .command("creative <creative-id>")
    .description("Get a specific ad creative")
    .action(async (creativeId: string) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const data = await callApi({
          creds,
          path: creativeId,
          params: {
            fields: "id,name,title,body,image_url,thumbnail_url,object_type,object_story_spec,url_tags,call_to_action_type,link_url,asset_feed_spec",
          },
        });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });
}
