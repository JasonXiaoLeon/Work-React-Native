const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  task: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  deadline: {
    type: Date,
    required: true,
  },
});

const Todo = mongoose.model('Todo', todoSchema, 'todoList');

module.exports = { Todo };
