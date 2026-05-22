const express = require("express");
const router = express.Router();
const Todo = require("../models/Todo");
const authenticationToken = require("../middleware/auth");

// Get all todos for the current user
router.get("/", authenticationToken, async (req, res) => {
  try {
    const todos = (await Todo.find({ userId: req.user.userId })).sort({
      createdAt: -1,
    });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single todo by ID
router.get("/:id", authenticationToken, async (req, res) => {
  try {
    const todo = await Todo.findOne({
      _id: req.params.id,
      userId: req.user.userId, // Ensure the todo belongs to the authenticated user
    });

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.json(todo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new todo
router.post("/", authenticationToken, async (req, res) => {
  try {
    const { title, description, priority } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const todo = new Todo({
      userId: req.user.userId,
      title: req.body.title,
      description: req.body.description || "",
      proiority: req.body.priority || "medium",
      dueDate: req.body.dueDate || null,
    });

    const newTodo = await todo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a todo
router.put("/:id", authenticationToken, async (req, res) => {
  try {
    const { title, description, isCompleted, priority, dueDate } = req.body;

    let todo = await Todo.findOne({
      _id: req.params.id,
      userId: req.user.userId, // Ensure the todo belongs to the authenticated user
    });

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    if (title !== undefined) {
      todo.title = title;
    }
    if (description !== undefined) {
      todo.description = description;
    }
    if (isCompleted !== undefined) {
      todo.isCompleted = isCompleted;
    }
    if (priority !== undefined) {
      todo.priority = priority;
    }
    if (dueDate !== undefined) {
      todo.dueDate = dueDate;
    }

    const updatedTodo = await todo.save();
    res.json(updatedTodo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", authenticationToken, async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId, // Ensure the todo belongs to the authenticated user
    });
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.json({ message: "Todo Deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
