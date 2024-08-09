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

const today = new Date();
const firstDay = new Date(today.setDate(today.getDate() - today.getDay() + 1));
const lastDay = new Date(today.setDate(today.getDate() - today.getDay() + 5));

const from = new Date(firstDay.getTime() - (firstDay.getTimezoneOffset() * 60000)).toISOString().slice(0, 10);
const to = new Date(lastDay.getTime() - (lastDay.getTimezoneOffset() * 60000)).toISOString().slice(0, 10);

const harvest = new Harvest();
const timeEntries = await harvest.getTimeEntries(from, to);

const report = new Report(from, to, timeEntries);
const txt = report.generate();
console.log(txt);

if (cli.flags.slack) {
  const slack = new Slack();
  await slack.push(txt);
}

