const express = require('express')
const router = express.Router()
const Task = require('../models/Task')
const protect = require('../middleware/authMiddleware')

// Get all tasks for logged in user
router.get('/', protect, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id })
    res.json(tasks)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// Create a task
router.post('/', protect, async (req, res) => {
  const { title } = req.body
  try {
    const task = await Task.create({ title, userId: req.user.id })
    res.status(201).json(task)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// Update a task (mark complete / edit title)
router.put('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    )
    res.json(task)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// Delete a task
router.delete('/:id', protect, async (req, res) => {
  try {
    await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id })
    res.json({ message: 'Task deleted' })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router