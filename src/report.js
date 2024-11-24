const HARVEST_URL = "https://api.harvestapp.com";
const { HARVEST_ACCOUNT_ID, HARVEST_ACCESS_TOKEN, HARVEST_CLIENT_ID } = process.env;

if (!HARVEST_ACCESS_TOKEN) {
  throw new Error("Environment variable 'HARVEST_ACCESS_TOKEN' is not defined");
}
if (!HARVEST_ACCOUNT_ID) {
  throw new Error("Environment variable 'HARVEST_ACCOUNT_ID' is not defined");
}

const headers = {
  "Authorization": `Bearer ${HARVEST_ACCESS_TOKEN}`,
  "Harvest-Account-Id": HARVEST_ACCOUNT_ID,
  "Content-Type": "application/json",
};

export function getWeeklyReport() {
  const date = new Date();
  const tzOffsetMilliseconds = date.getTimezoneOffset() * 60000;

  const fromDate = new Date(date.setDate(date.getDate() - date.getDay() + 1));
  const toDate = new Date(date.setDate(date.getDate() - date.getDay() + 5));

  const from = new Date(fromDate.getTime() - tzOffsetMilliseconds).toISOString().slice(0, 10);
  const to = new Date(toDate.getTime() - tzOffsetMilliseconds).toISOString().slice(0, 10);

  return getReport(from, to);
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

  throw new Error(`status=${response.status}, message='${await response.text()}'`);
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
