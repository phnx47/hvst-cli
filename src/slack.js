const { SLACK_WEBHOOK_URL } = process.env;

export async function sendToSlack(text) {
  if (!SLACK_WEBHOOK_URL)
    throw new Error("Environment variable 'SLACK_WEBHOOK_URL' is not defined");

  const response = await fetch(SLACK_WEBHOOK_URL, {
    method: "POST",
    body: JSON.stringify({ text }),
  });

  if (response.ok) {
    console.log("Report sent to Slack");
  } else {
    console.log(`Failed to send report to Slack: ${response.status} '${await response.text()}'`);
  }
}
