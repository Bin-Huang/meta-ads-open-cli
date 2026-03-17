import { Command } from "commander";
import { loadCredentials } from "../auth.js";
import { callApi } from "../api.js";
import { output, fatal } from "../utils.js";

export function registerAccountCommands(program: Command): void {
  program
    .command("me")
    .description("Get the authenticated user or system user info")
    .action(async () => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const data = await callApi({
          creds,
          path: "me",
          params: { fields: "id,name,email" },
        });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });

  program
    .command("ad-accounts")
    .description("List ad accounts the authenticated user has access to")
    .option("--limit <n>", "Number of results (default 100)", "100")
    .option("--after <cursor>", "Pagination cursor")
    .action(async (opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const params: Record<string, string> = {
          fields: "id,name,account_id,account_status,currency,timezone_name,business,amount_spent,balance,spend_cap",
          limit: opts.limit,
        };
        if (opts.after) params.after = opts.after;
        const data = await callApi({ creds, path: "me/adaccounts", params });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });

  program
    .command("ad-account <account-id>")
    .description("Get a specific ad account (use act_XXXXX format or just the numeric ID)")
    .action(async (accountId: string) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const actId = accountId.startsWith("act_") ? accountId : `act_${accountId}`;
        const data = await callApi({
          creds,
          path: actId,
          params: {
            fields: "id,name,account_id,account_status,currency,timezone_name,business,amount_spent,balance,spend_cap,funding_source,created_time,end_advertiser,media_agency,partner",
          },
        });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });

  program
    .command("account-users <account-id>")
    .description("List users with access to an ad account")
    .option("--limit <n>", "Number of results (default 100)", "100")
    .action(async (accountId: string, opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const actId = accountId.startsWith("act_") ? accountId : `act_${accountId}`;
        const params: Record<string, string> = {
          fields: "id,name,tasks",
          limit: opts.limit,
        };
        const data = await callApi({ creds, path: `${actId}/assigned_users`, params });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });

  program
    .command("businesses")
    .description("List businesses the authenticated user has access to")
    .option("--limit <n>", "Number of results (default 100)", "100")
    .action(async (opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const params: Record<string, string> = {
          fields: "id,name,created_time,primary_page,timezone_id,verification_status",
          limit: opts.limit,
        };
        const data = await callApi({ creds, path: "me/businesses", params });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });
}
