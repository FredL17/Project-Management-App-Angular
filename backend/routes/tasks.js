const express = require("express");
const router = express.Router();
// Import mongoose models.
const { Task } = require("../models/index");

/* Get all tasks from the specified project. */
router.get("/:projectId/tasks", (req, res) => {
  Task.find({ _projectId: req.params.projectId })
    .then(tasks => {
      res.status(200).json(tasks);
    })
    .catch(err => {
      console.error(err);
    });
});

/* Add a new task to the specified project. */
router.post("/:projectId/tasks", (req, res) => {
  const task = new Task({
    title: req.body.title,
    _projectId: req.params.projectId
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
      console.error(err);
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
        message: "Task updated."
      });
    })
    .catch(err => {
      console.error(err);
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
        message: "Task removed.",
        removedTask: removedTask
      });
    })
    .catch(err => {
      console.error(err);
    });
});

module.exports = router;
