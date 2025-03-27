#!/usr/bin/env node

import "dotenv/config";
import meow from "meow";
import { getWeeklyReport } from "./src/report.js";
import { sendToSlack } from "./src/slack.js";
import { sendEmail } from "./src/mail.js";

const helpText = `
Usage:
  hvst [options]

Options:
  --slack, -s  Send the generated report to Slack
  --mail, -s  Send the generated report to Email
`;

const options = {
  importMeta: import.meta,
  flags: {
    slack: {
      type: "boolean",
      shortFlag: "s",
    },
    mail: {
      type: "boolean",
      shortFlag: "m",
    },
  },
};

const cli = meow(helpText, options);
const { subject, text } = await getWeeklyReport();

console.log(text);

if (cli.flags.slack) {
  await sendToSlack(text);
}

if (cli.flags.mail) {
  await sendEmail({ subject, text });
}
