#!/usr/bin/env node

import meow from "meow";
import Harvest from "./lib/harvest.js";
import Report from "./lib/report.js";
import Slack from "./lib/slack.js";

const cli = meow(`
Usage:
  hvst [options]

Options:
  --slack, -s  Send a report to Slack
`, {
  importMeta: import.meta,
  flags: {
    slack: {
      type: "boolean",
      shortFlag: "s"
    }
  }
});

const now = new Date();
const first = new Date(now.setDate(now.getDate() - now.getDay() + 1));
const from = first.toISOString().slice(0, 10);
const to = new Date(now.setDate(first.getDate() + 4)).toISOString().slice(0, 10);

const harvest = new Harvest();
const timeEntries = await harvest.getTimeEntries(from, to);

const report = new Report(from, to, timeEntries);
const txt = report.generate();
console.log(txt);

if (cli.flags.slack) {
  const slack = new Slack();
  await slack.push(txt);
}

