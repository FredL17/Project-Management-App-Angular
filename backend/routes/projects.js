// Libraries.
const express = require("express");
// DB models.
const { Project } = require("../models/index");
const { Task } = require("../models/index");
// Middleware.
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

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
      res.status(200).json({
        message: "Fetched projects successfully.",
        projects: projectList
      });
    })
    .catch(err => {
      res.status(400).json({
        message: "Unable to fetch projects.",
        error: err
      });
    });
});

/* Update an existing project. */
router.put("/:id", checkAuth, (req, res) => {
  Project.findOneAndUpdate(
    { _id: req.params.id, creator: req.userData.userId },
    { $set: req.body },
    { new: true }
  )
    .then(updatedDoc => {
      const updatedProject = {
        id: updatedDoc._id,
        title: updatedDoc.title,
        creator: updatedDoc.creator
      };
      res.status(200).json({
        message: "Project updated successfully.",
        updatedProject: updatedProject
      });
    })
    .catch(err => {
      res.status(400).json({
        message: "Project updated failed.",
        error: err
      });
    });
});

/* Delete an existing project and all of its tasks. */
router.delete("/:id", checkAuth, (req, res) => {
  Task.deleteMany({ _projectId: req.params.id })
    .then(() => {
      Project.findOneAndDelete({
        _id: req.params.id,
        creator: req.userData.userId
      })
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
    })
    .catch(err => {
      res.status(400).json({
        message: "Project removed failed: can't remove its tasks.",
        error: err
      });
    });
});

module.exports = router;
