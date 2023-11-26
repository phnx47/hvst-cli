import Harvest from "./harvest.js";
//import Slack from "./slack.js"

if (!process.env.HARVEST_ACCESS_TOKEN)
  throw new Error("Environment variable 'HARVEST_ACCESS_TOKEN' is not defined");

if (!process.env.HARVEST_ACCOUNT_ID)
  throw new Error("Environment variable 'HARVEST_ACCOUNT_ID' is not defined");

if (!process.env.SLACK_WEBHOOK_URL)
  throw new Error("Environment variable 'SLACK_WEBHOOK_URL' is not defined");

const harvest = new Harvest(process.env.HARVEST_ACCESS_TOKEN, process.env.HARVEST_ACCOUNT_ID);
//const slack = new Slack(process.env.SLACK_WEBHOOK_URL)

harvest
  .getCurrentWeek()
  .then(report => {
    const txt = report.getText();
    console.log(txt);
    //slack.push(txt);
  })
  .catch(err => {
    console.error(err);
  });
