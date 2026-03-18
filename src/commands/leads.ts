import { Command } from "commander";
import { loadCredentials } from "../auth.js";
import { callApi } from "../api.js";
import { output, fatal } from "../utils.js";

export function registerLeadCommands(program: Command): void {
  program
    .command("lead-forms <page-id>")
    .description("List lead gen forms for a Facebook Page")
    .option("--limit <n>", "Number of results (default 100)", "100")
    .action(async (pageId: string, opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const params: Record<string, string> = {
          fields: "id,name,status,created_time,expired_leads_count,leads_count,locale,page",
          limit: opts.limit,
        };
        const data = await callApi({ creds, path: `${pageId}/leadgen_forms`, params });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });

  program
    .command("leads <form-id>")
    .description("List leads (submissions) for a lead gen form")
    .option("--limit <n>", "Number of results (default 100)", "100")
    .option("--after <cursor>", "Pagination cursor")
    .action(async (formId: string, opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const params: Record<string, string> = {
          fields: "id,created_time,field_data,ad_id,campaign_id,form_id",
          limit: opts.limit,
        };
        if (opts.after) params.after = opts.after;
        const data = await callApi({ creds, path: `${formId}/leads`, params });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });
}
