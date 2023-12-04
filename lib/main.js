import Harvest from "./harvest.js";
import Report from "./report.js";
// import Slack from "./slack.js";

if (!process.env.HARVEST_ACCESS_TOKEN)
    throw new Error("Environment variable 'HARVEST_ACCESS_TOKEN' is not defined");

if (!process.env.HARVEST_ACCOUNT_ID)
    throw new Error("Environment variable 'HARVEST_ACCOUNT_ID' is not defined");

const harvest = new Harvest(process.env.HARVEST_ACCESS_TOKEN, process.env.HARVEST_ACCOUNT_ID);

const now = new Date();
const first = new Date(now.setDate(now.getDate() - now.getDay() + 1));
const from = first.toISOString().slice(0, 10);
const to = new Date(now.setDate(first.getDate() + 4)).toISOString().slice(0, 10);

const timeEntries = await harvest.getTimeEntries(from, to);

const report = Report.parseHarvest(from, to, timeEntries);
const txt = report.generateText();
console.log(txt);

// if (!process.env.SLACK_WEBHOOK_URL)
//   throw new Error("Environment variable 'SLACK_WEBHOOK_URL' is not defined");
// const slack = new Slack(process.env.SLACK_WEBHOOK_URL);

//await slack.push(txt);
