const { HARVEST_ACCOUNT_ID, HARVEST_ACCESS_TOKEN, HARVEST_CLIENT_ID } = process.env;

const HARVEST_URL = "https://api.harvestapp.com";
const MS_PER_MINUTE = 60_000;
const MS_PER_DAY = 86_400_000;

if (!HARVEST_ACCESS_TOKEN)
  throw new Error("Environment variable 'HARVEST_ACCESS_TOKEN' is not defined");
if (!HARVEST_ACCOUNT_ID)
  throw new Error("Environment variable 'HARVEST_ACCOUNT_ID' is not defined");

const headers = {
  "Authorization": `Bearer ${HARVEST_ACCESS_TOKEN}`,
  "Harvest-Account-Id": HARVEST_ACCOUNT_ID,
  "Content-Type": "application/json",
};

export async function getWeeklyReport() {
  const date = new Date();
  const tzOffset = date.getTimezoneOffset() * MS_PER_MINUTE;

  const monday = new Date(date.setDate(date.getDate() - date.getDay() + 1));
  const friday = new Date(date.setDate(date.getDate() - date.getDay() + 5));

  const from = new Date(monday.getTime() - tzOffset).toISOString().slice(0, 10);
  const to = new Date(friday.getTime() - tzOffset).toISOString().slice(0, 10);
  const week = Math.floor((monday - new Date(monday.getFullYear(), 0, 1)) / MS_PER_DAY / 7) + 1;

  const subject = `Week ${week} of ${monday.getFullYear()}`;
  const text = await getReport(from, to);

  return { subject, text };
}

async function getReport(from, to) {
  let url = `${HARVEST_URL}/api/v2/time_entries?from=${from}&to=${to}`;
  if (HARVEST_CLIENT_ID) {
    url += `&client_id=${HARVEST_CLIENT_ID}`;
  }
  const response = await fetch(url, {
    method: "GET",
    headers: headers,
  });

  if (response.status === 200) {
    const data = await response.json();
    return formatTimeEntries(from, to, data.time_entries);
  }

  throw new Error(`Failed to get Harvest report: ${response.status} '${await response.text()}'`);
}

function formatTimeEntries(from, to, timeEntries) {
  let result = `Report from *${from}* to *${to}* \n\n`;
  const tasks = [];
  timeEntries.forEach((entry) => {
    if (entry.notes) {
      const task = tasks.find((x) => x.id === entry.task.id);
      if (!task) {
        tasks.push({
          id: entry.task.id,
          notes: [entry.notes],
          name: entry.task.name,
        });
      } else {
        if (task && !task.notes.some((t) => t === entry.notes)) {
          task.notes.push(entry.notes);
        }
      }
    }
  });

  tasks
    .sort((a, b) => a.id - b.id)
    .forEach((task) => {
      result = result + `*${task.name}*\n`;
      task.notes.forEach((note) => {
        result = result + `- ${note}\n`;
      });
    });
  return result;
}
