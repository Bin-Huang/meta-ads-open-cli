# meta-ads-open-cli

Meta Ads CLI for AI agents. Read-only access to Meta Marketing API for managing ads across Facebook, Instagram, Messenger, and Audience Network.

## Installation

```bash
npm install -g meta-ads-open-cli
```

## How it works

- All output is JSON to stdout (machine-readable)
- Errors go to stderr as `{"error": "..."}`
- Exit code 0 = success, non-zero = failure
- Uses Meta Graph API v22.0

## Setup

### Option 1: Environment variable

```bash
export META_ADS_ACCESS_TOKEN="your_access_token"
```

### Option 2: Credentials file

Create `~/.config/meta-ads-open-cli/credentials.json`:

```json
{
  "access_token": "your_access_token"
}
```

### Option 3: Per-command credentials

```bash
meta-ads-open-cli ad-accounts --credentials /path/to/creds.json
```

### Getting an access token

Create a [Meta Developer App](https://developers.facebook.com/apps/) and request the following permissions:
- `ads_read` -- Read ad accounts and campaigns
- `ads_management` -- Required for some read endpoints
- `pages_read_engagement` -- Read Pages data
- `leads_retrieval` -- Read lead gen form submissions
- `business_management` -- Read business accounts

## Entity hierarchy

Meta Ads uses this hierarchy:

```
Business Manager
 └── Ad Account (act_XXXXX)
      ├── Campaign
      │    └── Ad Set
      │         └── Ad → Creative
      ├── Custom Audience
      ├── Meta Pixel
      └── Custom Conversion
```

Ad account IDs use the `act_` prefix (e.g., `act_123456789`). This CLI accepts both `act_XXXXX` and plain numeric IDs.

## Monetary values

All monetary values (spend, budget, bid amounts) are in the ad account's currency, expressed as **cents** (or the smallest currency unit). Divide by 100 for the actual amount.

## Usage

All commands output pretty-printed JSON by default. Use `--format compact` for single-line JSON.

Pagination uses cursor-based `--after` values from the `paging.cursors.after` in the response.

### me

Get the authenticated user or system user info.

```bash
meta-ads-open-cli me
```

### ad-accounts

List ad accounts the authenticated user has access to.

```bash
meta-ads-open-cli ad-accounts
```

Options:
- `--limit <n>` -- results per page (default 100)
- `--after <cursor>` -- pagination cursor

### ad-account

Get a specific ad account.

```bash
meta-ads-open-cli ad-account act_123456789
meta-ads-open-cli ad-account 123456789
```

### account-users

List users with access to an ad account.

```bash
meta-ads-open-cli account-users 123456789
```

Options:
- `--limit <n>` -- results per page (default 100)

### businesses

List businesses the authenticated user has access to.

```bash
meta-ads-open-cli businesses
```

Options:
- `--limit <n>` -- results per page (default 100)

### campaigns

List campaigns for an ad account.

```bash
meta-ads-open-cli campaigns 123456789
meta-ads-open-cli campaigns 123456789 --status ACTIVE
```

Options:
- `--limit <n>` -- results per page (default 100)
- `--after <cursor>` -- pagination cursor
- `--status <status>` -- filter by effective_status: ACTIVE, PAUSED, ARCHIVED, DELETED

### campaign

Get a specific campaign.

```bash
meta-ads-open-cli campaign 23851234567890
```

### adsets

List ad sets for an ad account.

```bash
meta-ads-open-cli adsets 123456789
meta-ads-open-cli adsets 123456789 --campaign 23851234567890
```

Options:
- `--limit <n>` -- results per page (default 100)
- `--after <cursor>` -- pagination cursor
- `--campaign <id>` -- filter by campaign ID
- `--status <status>` -- filter by effective_status: ACTIVE, PAUSED, ARCHIVED, DELETED

### adset

Get a specific ad set.

```bash
meta-ads-open-cli adset 23851234567891
```

### ads

List ads for an ad account.

```bash
meta-ads-open-cli ads 123456789
meta-ads-open-cli ads 123456789 --adset 23851234567891
```

Options:
- `--limit <n>` -- results per page (default 100)
- `--after <cursor>` -- pagination cursor
- `--adset <id>` -- filter by ad set ID
- `--status <status>` -- filter by effective_status: ACTIVE, PAUSED, ARCHIVED, DELETED

### ad

Get a specific ad.

```bash
meta-ads-open-cli ad 23851234567892
```

### creatives

List ad creatives for an ad account.

```bash
meta-ads-open-cli creatives 123456789
```

Options:
- `--limit <n>` -- results per page (default 100)
- `--after <cursor>` -- pagination cursor

### creative

Get a specific ad creative.

```bash
meta-ads-open-cli creative 23851234567893
```

### insights

Get performance insights for an account, campaign, ad set, or ad.

```bash
meta-ads-open-cli insights act_123456789 --date-preset last_30d
meta-ads-open-cli insights 23851234567890 --date-preset last_7d --time-increment 1
meta-ads-open-cli insights act_123456789 --date-preset last_30d --level campaign --breakdowns age,gender
```

Options:
- `--date-preset <preset>` -- date range **required**: today, yesterday, last_7d, last_14d, last_28d, last_30d, last_90d, this_month, last_month, this_year, lifetime
- `--level <level>` -- breakdown level: account, campaign, adset, ad
- `--breakdowns <breakdowns>` -- breakdown dimensions (comma-separated): age, gender, country, region, platform_position, publisher_platform, device_platform
- `--fields <fields>` -- metric fields (comma-separated)
- `--time-increment <inc>` -- time granularity: 1 (daily), 7, 14, monthly, all_days
- `--limit <n>` -- results per page (default 100)
- `--after <cursor>` -- pagination cursor

Default metrics: impressions, reach, clicks, cpc, cpm, ctr, spend, actions, cost_per_action_type, conversions, conversion_values, frequency

### insights-date

Get insights with a custom date range.

```bash
meta-ads-open-cli insights-date act_123456789 --start 2026-01-01 --end 2026-01-31
```

Options: same as `insights`, but uses `--start` and `--end` instead of `--date-preset`.

### custom-audiences

List custom audiences for an ad account.

```bash
meta-ads-open-cli custom-audiences 123456789
```

Options:
- `--limit <n>` -- results per page (default 100)
- `--after <cursor>` -- pagination cursor

### custom-audience

Get a specific custom audience.

```bash
meta-ads-open-cli custom-audience 23851234567894
```

### saved-audiences

List saved audiences for an ad account.

```bash
meta-ads-open-cli saved-audiences 123456789
```

Options:
- `--limit <n>` -- results per page (default 100)
- `--after <cursor>` -- pagination cursor

### reach-estimate

Get reach estimate for targeting specs.

```bash
meta-ads-open-cli reach-estimate 123456789 --targeting '{"geo_locations":{"countries":["US"]},"age_min":25,"age_max":45}'
```

Options:
- `--targeting <json>` -- targeting spec as JSON string **required**

### pixels

List Meta Pixels for an ad account.

```bash
meta-ads-open-cli pixels 123456789
```

Options:
- `--limit <n>` -- results per page (default 100)

### pixel-events

List events received by a Meta Pixel.

```bash
meta-ads-open-cli pixel-events 123456789012
```

### custom-conversions

List custom conversions for an ad account.

```bash
meta-ads-open-cli custom-conversions 123456789
```

Options:
- `--limit <n>` -- results per page (default 100)

### pages

List Facebook Pages the user manages.

```bash
meta-ads-open-cli pages
```

Options:
- `--limit <n>` -- results per page (default 100)

### page

Get a specific Facebook Page.

```bash
meta-ads-open-cli page 123456789
```

### instagram-accounts

Get Instagram business account linked to a Facebook Page.

```bash
meta-ads-open-cli instagram-accounts 123456789
```

### lead-forms

List lead gen forms for a Facebook Page.

```bash
meta-ads-open-cli lead-forms 123456789
```

Options:
- `--limit <n>` -- results per page (default 100)

### leads

List leads (submissions) for a lead gen form.

```bash
meta-ads-open-cli leads 987654321
```

Options:
- `--limit <n>` -- results per page (default 100)
- `--after <cursor>` -- pagination cursor

## Error output

All errors are JSON to stderr:

```json
{"error": "No credentials found. Set META_ADS_ACCESS_TOKEN env var..."}
```

## API Reference

- [Meta Marketing API Overview](https://developers.facebook.com/docs/marketing-apis/)
- [Ad Insights API](https://developers.facebook.com/docs/marketing-api/insights/)
- [Custom Audiences API](https://developers.facebook.com/docs/marketing-api/audiences/)
- [Lead Ads API](https://developers.facebook.com/docs/marketing-api/guides/lead-ads/)

## Related

- [google-ads-open-cli](https://github.com/Bin-Huang/google-ads-open-cli) -- Google Ads CLI
- [tiktok-ads-cli](https://github.com/Bin-Huang/tiktok-ads-cli) -- TikTok Ads CLI
- [linkedin-ads-cli](https://github.com/Bin-Huang/linkedin-ads-cli) -- LinkedIn Ads CLI
- [snapchat-ads-cli](https://github.com/Bin-Huang/snapchat-ads-cli) -- Snapchat Ads CLI
- [pinterest-ads-cli](https://github.com/Bin-Huang/pinterest-ads-cli) -- Pinterest Ads CLI
- [reddit-ads-cli](https://github.com/Bin-Huang/reddit-ads-cli) -- Reddit Ads CLI

## License

Apache-2.0
