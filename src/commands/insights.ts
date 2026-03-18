import { Command } from "commander";
import { loadCredentials } from "../auth.js";
import { callApi } from "../api.js";
import { output, fatal } from "../utils.js";

export function registerInsightsCommands(program: Command): void {
  program
    .command("insights <entity-id>")
    .description("Get performance insights for an account, campaign, ad set, or ad (use act_XXXXX for accounts)")
    .requiredOption("--date-preset <preset>", "Date range: today, yesterday, last_3d, last_7d, last_14d, last_28d, last_30d, last_90d, this_week_mon_today, this_week_sun_today, last_week_mon_sun, last_week_sun_sat, this_month, last_month, this_quarter, last_quarter, this_year, last_year, maximum, data_maximum")
    .option("--level <level>", "Breakdown level: account, campaign, adset, ad (default: inferred from entity)")
    .option("--breakdowns <breakdowns>", "Breakdowns: age, gender, country, region, platform_position, publisher_platform, device_platform (comma-separated)")
    .option("--fields <fields>", "Metric fields (comma-separated)")
    .option("--time-increment <inc>", "Time granularity: 1 (daily), 7, 14, monthly, all_days (default all_days)")
    .option("--limit <n>", "Number of results (default 100)", "100")
    .option("--after <cursor>", "Pagination cursor")
    .action(async (entityId: string, opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const params: Record<string, string> = {
          date_preset: opts.datePreset,
          limit: opts.limit,
        };
        if (opts.fields) {
          params.fields = opts.fields;
        } else {
          params.fields = "impressions,reach,clicks,cpc,cpm,ctr,spend,actions,cost_per_action_type,conversions,conversion_values,frequency";
        }
        if (opts.level) params.level = opts.level;
        if (opts.breakdowns) params.breakdowns = opts.breakdowns;
        if (opts.timeIncrement) params.time_increment = opts.timeIncrement;
        if (opts.after) params.after = opts.after;
        const data = await callApi({ creds, path: `${entityId}/insights`, params });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });

  program
    .command("insights-date <entity-id>")
    .description("Get insights with custom date range")
    .requiredOption("--start <date>", "Start date (YYYY-MM-DD)")
    .requiredOption("--end <date>", "End date (YYYY-MM-DD)")
    .option("--level <level>", "Breakdown level: account, campaign, adset, ad")
    .option("--breakdowns <breakdowns>", "Breakdowns (comma-separated)")
    .option("--fields <fields>", "Metric fields (comma-separated)")
    .option("--time-increment <inc>", "Time granularity: 1 (daily), 7, 14, monthly, all_days")
    .option("--limit <n>", "Number of results (default 100)", "100")
    .option("--after <cursor>", "Pagination cursor")
    .action(async (entityId: string, opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const params: Record<string, string> = {
          time_range: JSON.stringify({ since: opts.start, until: opts.end }),
          limit: opts.limit,
        };
        if (opts.fields) {
          params.fields = opts.fields;
        } else {
          params.fields = "impressions,reach,clicks,cpc,cpm,ctr,spend,actions,cost_per_action_type,conversions,conversion_values,frequency";
        }
        if (opts.level) params.level = opts.level;
        if (opts.breakdowns) params.breakdowns = opts.breakdowns;
        if (opts.timeIncrement) params.time_increment = opts.timeIncrement;
        if (opts.after) params.after = opts.after;
        const data = await callApi({ creds, path: `${entityId}/insights`, params });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });
}
