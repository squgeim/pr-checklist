class Checklist {
  list: string[] = [];

  push(line: string) {
    this.list.push(line);
  }

  getList() {
    return this.list.map(item => `- [ ] ${item}`).join('\n');
  }
}

export default Checklist;
