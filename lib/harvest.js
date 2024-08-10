export default class Harvest {
  constructor() {
    if (!process.env.HARVEST_ACCESS_TOKEN) throw new Error("Environment variable 'HARVEST_ACCESS_TOKEN' is not defined");
    if (!process.env.HARVEST_ACCOUNT_ID) throw new Error("Environment variable 'HARVEST_ACCOUNT_ID' is not defined");
    this.accessToken = process.env.HARVEST_ACCESS_TOKEN;
    this.accountId = process.env.HARVEST_ACCOUNT_ID;
    this.clientId = process.env.HARVEST_CLIENT_ID;
  }
  async getTimeEntries(from, to) {
    let url = `https://api.harvestapp.com/api/v2/time_entries?from=${from}&to=${to}`;
    if (this.clientId) {
      url += `&client_id=${this.clientId}`;
    }
    const response = await fetch(url, {
      method: "GET",
      headers: {
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
