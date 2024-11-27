#!/usr/bin/env node

import "dotenv/config";
import meow from "meow";
import { getWeeklyReport } from "./src/report.js";
import { sendToSlack } from "./src/slack.js";

const helpText = `
Usage:
  hvst [options]

Options:
  --slack, -s  Send the generated report to Slack
`;

const options = {
  importMeta: import.meta,
  flags: {
    slack: {
      type: "boolean",
      shortFlag: "s",
    },
  },
};

const cli = meow(helpText, options);
const report = await getWeeklyReport();
console.log(report);

if (cli.flags.slack) {
  await sendToSlack(report);
}
