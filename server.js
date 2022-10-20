import express from "express";
const app = express();
const PORT = 5000;

const tasks = [
  {
    id: 1,
    title: "Task One",
    description: "Description of task one",
  },
  {
    id: 2,
    title: "Task Two",
    description: "Description of task two",
  },
  {
    id: 3,
    title: "Task Three",
    description: "Description of task three",
  },
];

app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/tasks", (req, res) => {
  res.json(tasks);
});

app.post("/tasks", async (req, res) => {
  const { title, description } = req.body;
  tasks.push({
    id: tasks.length + 1,
    title: title,
    description: description,
  });
  res.redirect("/tasks");
});

app.listen(PORT, () => {
  console.log("Server is running at", PORT);
});
