import express from "express";
const app = express();
const PORT = 5000;

import cors from "cors";
import bodyParser from "body-parser";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const createTask = async (title, deadline) => {
  if (!deadline) {
    deadline = new Date();
    deadline.setDate(deadline.getDate() + 7); // give one week time to finish task
  }

  await prisma.task.create({
    data: {
      title: title,
      created: new Date(),
      deadline: new Date(deadline),
    },
  });
};

const getTasks = async () => {
  const tasks = await prisma.task.findMany();
  return tasks;
};

const getTasksByDeadline = async (deadline) => {
  const tasks = await prisma.task.findMany({
    where: {
      deadline: {
        lte: new Date(deadline),
      },
    },
  });
  return tasks;
};

const getTaskById = async (id) => {
  const task = await prisma.task.findUnique({
    where: {
      id: parseInt(id),
    },
  });
  return task;
};

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use((req, res, next) => {
  console.log(req.method, req.ip, req.path, res.statusCode);
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/tasks", (req, res) => {
  getTasks()
    .then((tasks) => {
      res.status(200);
      res.json(tasks);
    })
    .catch((err) => console.log(err));
});

app.get("/tasks/:id", (req, res) => {
  getTaskById(parseInt(req.params.id))
    .then((task) => {
      res.status(200);
      res.json(task);
    })
    .catch((err) => {
      console.log(err);
      res.status(404);
    });
});

app.post("/tasks/new", async (req, res) => {
  const { title, deadline } = req.body;
  await createTask(title, deadline)
    .then(async () => {
      getTasks()
        .then((tasks) => res.json(tasks))
        .catch((err) => console.log(err));
      await prisma.$disconnect();
    })
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
    });
});

app.get("/tasks/deadline/:deadline", (req, res) => {
  const { deadline } = req.params;
  getTasksByDeadline(deadline)
    .then((tasks) => {
      res.status(200);
      res.json(tasks);
    })
    .catch((err) => {
      console.log(err);
      res.status(500);
    });
});

app.get("/tasks/deadline/today", (req, res) => {
  const today = new Date();
  getTasksByDeadline(today)
    .then((tasks) => {
      res.status(200);
      res.json(tasks);
    })
    .catch((err) => {
      console.log(err);
      res.status(500);
    });
});

app.listen(PORT, () => {
  console.log("Server is running at", PORT);
});
