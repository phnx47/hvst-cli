export default class Harvest {
  constructor() {
    if (!process.env.HARVEST_ACCESS_TOKEN) throw new Error("Environment variable 'HARVEST_ACCESS_TOKEN' is not defined");
    if (!process.env.HARVEST_ACCOUNT_ID) throw new Error("Environment variable 'HARVEST_ACCOUNT_ID' is not defined");
    this.accessToken = process.env.HARVEST_ACCESS_TOKEN;
    this.accountId = process.env.HARVEST_ACCOUNT_ID;
  }

  async getTimeEntries(from, to) {
    const response = await fetch(`https://api.harvestapp.com/api/v2/time_entries?from=${from}&to=${to}`, {
      method: "GET",
      headers: {
        "User-Agent": "hvst",
        "Authorization": `Bearer ${this.accessToken}`,
        "Harvest-Account-Id": this.accountId,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      const data = await response.json();
      return data.time_entries;
    }

    throw Error(`status=${response.status}, message='${await response.text()}'`);
  }
}
