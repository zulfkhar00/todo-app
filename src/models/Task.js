class Task {
  constructor(id, text, completed, category, priority, dueDate, notes = "") {
    this.id = id;
    this.text = text;
    this.completed = completed;
    this.category = category;
    this.priority = priority;
    this.dueDate = dueDate;
    this.notes = notes;
  }

  toggleCompleted() {
    this.completed = !this.completed;
  }

  updatePriority(newPriority) {
    this.priority = newPriority;
  }

  updateDueDate(newDueDate) {
    this.dueDate = newDueDate;
  }

  toJson() {
    return {
      id: this.id,
      text: this.text,
      completed: this.completed,
      category: this.category,
    };
  }
}

module.exports = { Task };
