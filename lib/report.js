export default class Report {
  constructor(from, to, timeEntries) {
    this.from = from;
    this.to = to;
    this.tasks = [];
    timeEntries.forEach(entry => {
      if (entry.notes) {
        const task = this.tasks.find(x => x.id === entry.task.id);
        if (!task) {
          this.tasks.push({
            id: entry.task.id,
            notes: [entry.notes],
            name: entry.task.name
          });
        } else {
          if (task && !task.notes.some(t => t === entry.notes)) {
            task.notes.push(entry.notes);
          }
        }
      }
    });
    this.tasks = this.tasks.sort((a, b) => a.id - b.id);
  }

  generate() {
    let text = `Report from *${this.from}* to *${this.to}* \n\n`;
    this.tasks.forEach(task => {
      text = text + `*${task.name}*\n`;
      task.notes.forEach(note => {
        text = text + `- ${note}\n`;
      });
    });
    return text;
  }
}
