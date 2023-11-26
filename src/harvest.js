import axios from "axios";
import Report from "./report.js";

export default class Harvest {
  constructor(accessToken, accountId) {
    this.accessToken = accessToken;
    this.accountId = accountId;

    this.api = axios.create({
      baseURL: "https://api.harvestapp.com/api/v2",
      headers: {
        "User-Agent": "harvest-report",
        "Authorization": `Bearer ${this.accessToken}`,
        "Harvest-Account-Id": this.accountId,
        "Content-Type": "application/json",
      },
    });
  }

  async getCurrentWeek() {
    const curr = new Date();
    const first = new Date(curr.setDate(curr.getDate() - curr.getDay() + 1));
    const from = first.toISOString().slice(0, 10);
    const to = new Date(curr.setDate(first.getDate() + 4)).toISOString().slice(0, 10);

    return this.api.get(`/time_entries?from=${from}&to=${to}`).then(response => {
      return Promise.resolve(Report.parseHarvest(from, to, response.data));
    }).catch(err => {
      if (err.response) {
        return Promise.reject({
          status: err.response.status,
          message: err.response.statusText,
        });
      } else {
        return Promise.reject({
          message: err.message,
        });
      }
    });
  }
}
