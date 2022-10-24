import express from "express";
const app = express();
const PORT = 5000;

import cors from "cors";
import bodyParser from "body-parser";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const createTask = async (title) => {
  await prisma.task.create({
    data: {
      title: title,
      created: new Date(),
      deadline: new Date(),
    },
  });
};

const getTasks = async () => {
  const tasks = await prisma.task.findMany();
  return tasks;
};

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/tasks", (req, res) => {
  getTasks()
    .then((tasks) => res.json(tasks))
    .catch((err) => console.log(err));
});

app.post("/tasks", async (req, res) => {
  const { title } = req.body;
  await createTask(title)
    .then(async () => {
      getTasks()
        .then((tasks) => res.json(tasks))
        .catch((err) => console.log(err));
      await prisma.$disconnect();
    })
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });
});

app.get()

app.listen(PORT, () => {
  console.log("Server is running at", PORT);
});
