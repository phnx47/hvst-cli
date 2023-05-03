import { HarvestReport } from './harvestTypes';

export default class Report {
  private readonly from: string;
  private readonly to: string;
  private tasks: Task[];

  private constructor(from: string, to: string) {
    this.from = from;
    this.to = to
    this.tasks = [];
  }

  getText(): string {
    let text = `Report from *${this.from}* to *${this.to}* \n\n`;
    this.tasks.forEach((task) => {
      text = text + `*${task.name}*\n`;
      task.notes.forEach((note) => {
        text = text + `- ${note}\n`;
      })
    });
    return text;
  }

  static parseHarvest(from: string, to: string, harvestReport: HarvestReport): Report {
    const report: Report = new Report(from, to);
    harvestReport.time_entries.forEach((entry) => {
      const task = report.tasks.find(x => x.id === entry.task.id);
      if (!task && entry.notes) {
        report.tasks.push({
          id: entry.task.id,
          notes: [entry.notes],
          name: entry.task.name
        });
      } else {
        if (task && !task.notes.some(t => t === entry.notes)) {
          task.notes.push(entry.notes);
        }
      }
    });
    report.sortTasks();
    return report;
  }

  private sortTasks() {
    this.tasks = this.tasks.sort((a, b) => a.id - b.id);
  }
}

type Task = {
  id: number,
  name: string;
  notes: string[];
}
