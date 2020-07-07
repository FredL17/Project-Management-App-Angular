const express = require("express");
const router = express.Router();
// Import mongoose models.
const { Task } = require("../models/index");

/* Get all tasks from the specified project. */
router.get("/:projectId/tasks", (req, res) => {
  Task.find({ _projectId: req.params.projectId })
    .then(tasks => {
      const taskList = tasks.map(task => {
        return {
          id: task._id,
          projectId: task._projectId,
          title: task.title,
          completed: task.completed
        };
      });
      res.status(200).json({
        message: "Fetched tasks successfully.",
        taskList: taskList
      });
    })
    .catch(err => {
      res.status(400).json({
        message: "Unable to fetch projects.",
        error: err
      });
    });
});

/* Add a new task to the specified project. */
router.post("/:projectId/tasks", (req, res) => {
  const task = new Task({
    title: req.body.title,
    _projectId: req.params.projectId,
    completed: true
  });
  task
    .save()
    .then(task => {
      res.status(201).json({
        message: "Task created successfully.",
        task: task
      });
    })
    .catch(err => {
      res.status(400).json({
        message: "Unable to create this task.",
        error: err
      });
    });
});

/* Update an existing task in the specified project. */
router.put("/:projectId/tasks/:taskId", (req, res) => {
  Task.findByIdAndUpdate(
    {
      _id: req.params.taskId,
      _projectId: req.params.projectId
    },
    { $set: req.body }
  )
    .then(() => {
      res.status(200).json({
        message: "Task updated successfully."
      });
    })
    .catch(err => {
      res.status(400).json({
        message: "Unable to update this task.",
        error: err
      });
    });
});

/* Delete an existing task in the specified project. */
router.delete("/:projectId/tasks/:taskId", (req, res) => {
  Task.findByIdAndDelete({
    _id: req.params.taskId,
    _projectId: req.params.projectId
  })
    .then(removedTask => {
      res.status(200).json({
        message: "Task removed successfully.",
        removedTask: removedTask
      });
    })
    .catch(err => {
      res.status(400).json({
        message: "Unable to delete this task.",
        error: err
      });
    });
});

module.exports = router;
