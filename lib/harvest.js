export default class Harvest {
  constructor(accessToken, accountId) {
    this.accessToken = accessToken;
    this.accountId = accountId;
  }

  async getTimeEntries(from, to) {
    const response = await fetch(`https://api.harvestapp.com/api/v2/time_entries?from=${from}&to=${to}`, {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "User-Agent": "harvest-report",
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
