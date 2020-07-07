// Libraries.
const express = require("express");
const router = express.Router();
// DB models.
const { Project } = require("../models/index");
const checkAuth = require("../middleware/check-auth");

/* Get all projects. */
router.get("/", checkAuth, (req, res) => {
  Project.find({ creator: req.userData.userId })
    .then(projects => {
      const projectList = projects.map(project => {
        return {
          id: project._id,
          title: project.title
        };
      });
      res.status(200).json(projectList);
    })
    .catch(err => {
      res.status(400).json({
        message: "Unable to get projects.",
        error: err
      });
    });
});

/* Add a new project. */
router.post("/", checkAuth, (req, res) => {
  const project = new Project({
    title: req.body.title,
    creator: req.userData.userId
  });
  project
    .save()
    .then(project => {
      res.status(201).json({
        message: "Project added successfully.",
        project: project
      });
    })
    .catch(err => {
      res.status(400).json({
        message: "Unable to add this project.",
        error: err
      });
    });
});

/* Update an existing project. */
router.put("/:id", checkAuth, (req, res) => {
  Project.findOneAndUpdate(
    { _id: req.params.id, creator: req.userData.userId },
    { $set: req.body }
  )
    .then(() => {
      res.status(200).json({
        message: "Project updated successfully."
      });
    })
    .catch(err => {
      res.status(400).json({
        message: "Project updated failed.",
        error: err
      });
    });
});

/* Delete an existing project. */
router.delete("/:id", checkAuth, (req, res) => {
  Project.findOneAndDelete({ _id: req.params.id, creator: req.userData.userId })
    .then(removedProject => {
      res.status(200).json({
        message: "Project removed successfully.",
        removedProject: removedProject
      });
    })
    .catch(err => {
      res.status(400).json({
        message: "Project removed failed.",
        error: err
      });
    });
});

module.exports = router;
