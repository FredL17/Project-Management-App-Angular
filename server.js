// Third-party packages.
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
// Express routers.
const projectsRouter = require("./backend/routes/projects");
const tasksRouter = require("./backend/routes/tasks");
const authRouter = require("./backend/routes/auth");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Remove all mongoose deprecation warnings.
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);

// Connect to MongoDB database.
mongoose
  .connect(
    `mongodb+srv://Fred:${process.env.MONGO_ATLAS_PASSWORD}@cluster0-zankb.mongodb.net/project-management?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log("database connected.");
    app.use((req, res, next) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header(
        "Access-Control-Allow-Headers",
        "Authorization, Origin, X-Requested-With, X-Custom-Header, Content-Type, Accept"
      );
      res.header(
        "Access-Control-Allow-Methods",
        "OPTIONS, GET, POST, PATCH, PUT, DELETE"
      );
      next();
    });

    app.use("/projects", tasksRouter);
    app.use("/projects", projectsRouter);

    app.use(authRouter);

    port = process.env.PORT || "3000";

    app.listen(port, () => {
      console.log(`server is running on port ${port}.`);
    });
  });
