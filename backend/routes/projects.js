// Third-party packages.
const express = require("express");
const router = express.Router();
// Import mongoose models.
const { Project } = require("../models/index");

/* Get all projects. */
router.get("/", (req, res) => {
  Project.find()
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
      console.err(err);
    });
});

/* Add a new project. */
router.post("/", (req, res) => {
  const project = new Project({
    title: req.body.title
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
      console.error(err);
    });
});

/* Update an existing project. */
router.put("/:id", (req, res) => {
  Project.findOneAndUpdate({ _id: req.params.id }, { $set: req.body })
    .then(() => {
      res.status(200).json({
        message: "Project updated."
      });
    })
    .catch(err => {
      console.error(err);
    });
});

/* Delete an existing project. */
router.delete("/:id", (req, res) => {
  Project.findOneAndDelete({ _id: req.params.id })
    .then(removedProject => {
      res.status(200).json({
        message: "Project removed.",
        removedProject: removedProject
      });
    })
    .catch(err => {
      console.error(err);
    });
});

module.exports = router;