// Third-party packages.
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
// Import express routers.
const projectsRouter = require("./backend/routes/projects");
const tasksRouter = require("./backend/routes/tasks");

const app = express();
app.use(bodyParser.json());

// Remove all mongoose deprecation warnings.
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);
// Connect to MongoDB database.
mongoose
  .connect(
    "mongodb+srv://Fred:1wyRlxYuLUCvEqjp@cluster0-zankb.mongodb.net/project-management?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log("database connected.");
  });

app.use("/projects", projectsRouter);
app.use("/projects", tasksRouter);

app.listen(3000, () => {
  console.log("server is now running");
});
