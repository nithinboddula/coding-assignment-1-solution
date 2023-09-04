const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const format = require("date-fns/format");
const isValid = require("date-fns/isValid");

const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "todoApplication.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

// Query middle ware function

const checkQueryInvalids = (request, response, next) => {
  const { priority, status, category, date, search_q } = request.query;
  if (status !== undefined) {
    const possibleStatus = ["TO DO", "IN PROGRESS", "DONE"];
    const isStatusValid = possibleStatus.includes(status);
    if (isStatusValid) {
      next();
    } else {
      response.status(400);
      response.send("Invalid Todo Status");
    }
  } else if (priority !== undefined) {
    const possiblePriority = ["HIGH", "MEDIUM", "LOW"];
    const isPriorityValid = possiblePriority.includes(priority);
    if (isPriorityValid) {
      next();
    } else {
      response.status(400);
      response.send("Invalid Todo Priority");
    }
  } else if (category !== undefined) {
    const possibleCategory = ["WORK", "HOME", "LEARNING"];
    const isCategoryValid = possibleCategory.includes(category);
    if (isCategoryValid) {
      next();
    } else {
      response.status(400);
      response.send("Invalid Todo Category");
    }
  } else if (date !== undefined) {
    const dateObj = new Date(date);
    const isValidDueDate = isValid(dateObj);
    if (isValidDueDate) {
      next();
    } else {
      response.status(400);
      response.send("Invalid Due Date");
    }
  } else {
    next();
  }
};

//

// put request body middle ware function

const checkRequestBodyPutInvalids = (request, response, next) => {
  const { priority, status, category, dueDate, search_q } = request.body;
  if (status !== undefined) {
    const possibleStatus = ["TO DO", "IN PROGRESS", "DONE"];
    const isStatusValid = possibleStatus.includes(status);
    if (isStatusValid) {
      next();
    } else {
      response.status(400);
      response.send("Invalid Todo Status");
    }
  } else if (priority !== undefined) {
    const possiblePriority = ["HIGH", "MEDIUM", "LOW"];
    const isPriorityValid = possiblePriority.includes(priority);
    if (isPriorityValid) {
      next();
    } else {
      response.status(400);
      response.send("Invalid Todo Priority");
    }
  } else if (category !== undefined) {
    const possibleCategory = ["WORK", "HOME", "LEARNING"];
    const isCategoryValid = possibleCategory.includes(category);
    if (isCategoryValid) {
      next();
    } else {
      response.status(400);
      response.send("Invalid Todo Category");
    }
  } else if (dueDate !== undefined) {
    const dateObj = new Date(dueDate);
    const isValidDueDate = isValid(dateObj);
    if (isValidDueDate) {
      next();
    } else {
      response.status(400);
      response.send("Invalid Due Date");
    }
  } else {
    next();
  }
};

//

// request body middle ware function

const checkRequestBodyInvalids = (request, response, next) => {
  const { priority, status, category, dueDate } = request.body;

  const possibleStatus = ["TO DO", "IN PROGRESS", "DONE"];
  const isStatusValid = possibleStatus.includes(status);

  const possiblePriority = ["HIGH", "MEDIUM", "LOW"];
  const isPriorityValid = possiblePriority.includes(priority);

  const possibleCategory = ["WORK", "HOME", "LEARNING"];
  const isCategoryValid = possibleCategory.includes(category);

  const dateObj = new Date(dueDate);
  const isValidDueDate = isValid(dateObj);

  if (isStatusValid === false) {
    response.status(400);
    response.send("Invalid Todo Status");
  } else if (isPriorityValid === false) {
    response.status(400);
    response.send("Invalid Todo Priority");
  } else if (isCategoryValid === false) {
    response.status(400);
    response.send("Invalid Todo Category");
  } else if (isValidDueDate === false) {
    response.status(400);
    response.send("Invalid Due Date");
  } else {
    next();
  }
};

//

const requestOfStatus = (requestQuery) => {
  return requestQuery.status !== undefined;
};

const requestOfPriority = (requestQuery) => {
  return requestQuery.priority !== undefined;
};

const requestOfCategory = (requestQuery) => {
  return requestQuery.category !== undefined;
};

const requestOfPriorityAndStatus = (requestQuery) => {
  return (
    requestQuery.priority !== undefined && requestQuery.status !== undefined
  );
};

const requestOfCategoryAndStatus = (requestQuery) => {
  return (
    requestQuery.category !== undefined && requestQuery.status !== undefined
  );
};

const requestOfCategoryAndPriority = (requestQuery) => {
  return (
    requestQuery.priority !== undefined && requestQuery.category !== undefined
  );
};

// API 1

app.get("/todos/", checkQueryInvalids, async (request, response) => {
  const { priority, status, category, search_q = "" } = request.query;
  let getTodoQuery = "";

  switch (true) {
    case requestOfPriorityAndStatus(request.query):
      getTodoQuery = `SELECT id, todo, priority, status, category, due_date AS dueDate
        FROM 
            todo
        WHERE
            priority = '${priority}' AND status = '${status}' ; `;
      break;
    case requestOfCategoryAndStatus(request.query):
      getTodoQuery = `SELECT id, todo, priority, status, category, due_date AS dueDate
        FROM 
            todo
        WHERE
            category = '${category}' AND status = '${status}' ; `;
      break;
    case requestOfCategoryAndPriority(request.query):
      getTodoQuery = `SELECT id, todo, priority, status, category, due_date AS dueDate
        FROM 
            todo
        WHERE
            priority = '${priority}' AND category = '${category}' ; `;
      break;
    case requestOfStatus(request.query):
      getTodoQuery = `SELECT id, todo, priority, status, category, due_date AS dueDate
        FROM 
            todo
        WHERE
            status = '${status}' ; `;
      break;
    case requestOfPriority(request.query):
      getTodoQuery = `SELECT id, todo, priority, status, category, due_date AS dueDate
        FROM 
            todo
        WHERE
            priority = '${priority}' ; `;
      break;
    case requestOfCategory(request.query):
      getTodoQuery = `SELECT id, todo, priority, status, category, due_date AS dueDate
        FROM 
            todo
        WHERE
            category = '${category}' ; `;
      break;

    default:
      getTodoQuery = `SELECT id, todo, priority, status, category, due_date AS dueDate
        FROM 
            todo
        WHERE
            todo LIKE '%${search_q}%' ; `;
      break;
  }

  const data = await db.all(getTodoQuery);
  response.send(data);
});

// API 2
app.get("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const getTodoArrayQuery = `SELECT id, todo, priority, status, category, due_date AS dueDate
    FROM 
        todo
    WHERE 
        id = ${todoId}; `;

  const todoDetails = await db.get(getTodoArrayQuery);
  response.send(todoDetails);
});

// API 3 Agenda
app.get("/agenda/", checkQueryInvalids, async (request, response) => {
  const { date } = request.query;
  const dateObj = new Date(date);
  const formattedDate = format(dateObj, "yyyy-MM-dd");
  console.log(formattedDate);
  const getTodoArrayQuery = `SELECT id, todo, priority, status, category, due_date AS dueDate
    FROM 
        todo
    WHERE 
        due_date LIKE "%${formattedDate}%" ; `;

  const todoDetails = await db.all(getTodoArrayQuery);
  console.log(todoDetails);
  response.send(todoDetails);
});

// API 4

app.post("/todos/", checkRequestBodyInvalids, async (request, response) => {
  const { id, todo, priority, status, category, dueDate } = request.body;
  //   console.log(priority);
  const postQuery = `
    INSERT INTO 
        todo (id, todo, priority, status, category, due_date )
    VALUES (${id}, '${todo}', '${priority}', '${status}', '${category}', '${dueDate}');`;
  await db.run(postQuery);
  response.send("Todo Successfully Added");
});

//
const updateStatus = (status) => {
  return status !== undefined;
};

const updatePriority = (priority) => {
  return priority !== undefined;
};

const updateTodo = (todo) => {
  return todo !== undefined;
};

const updateCategory = (category) => {
  return category !== undefined;
};

const updateDueDate = (dueDate) => {
  return dueDate !== undefined;
};

// API 5

app.put(
  "/todos/:todoId/",
  checkRequestBodyPutInvalids,
  async (request, response) => {
    const { status, priority, todo, category, dueDate } = request.body;
    const { todoId } = request.params;
    let updateQuery = "";
    let message = "";
    switch (true) {
      case updateStatus(status):
        updateQuery = `
            UPDATE
                todo
            SET 
                status = '${status}'
            WHERE 
                id = ${todoId};`;
        message = "Status Updated";
        break;
      case updatePriority(priority):
        updateQuery = `
            UPDATE
                todo
            SET 
                priority = '${priority}'
            WHERE 
                id = ${todoId}    ;`;
        message = "Priority Updated";
        break;
      case updateTodo(todo):
        updateQuery = `
            UPDATE
                todo
            SET 
                todo = '${todo}'
            WHERE 
                id = ${todoId};`;
        message = "Todo Updated";
        break;
      case updateCategory(category):
        updateQuery = `
            UPDATE
                todo
            SET 
                category = '${category}'
            WHERE 
                id = ${todoId};`;
        message = "Category Updated";
        break;
      case updateDueDate(dueDate):
        updateQuery = `
            UPDATE
                todo
            SET 
                due_date = '${dueDate}'
            WHERE 
                id = ${todoId};`;
        message = "Due Date Updated";
    }

    await db.run(updateQuery);
    response.send(message);
  }
);

//API 6

app.delete("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const deleteQuery = `
    DELETE FROM
        todo
    WHERE
        id = ${todoId} ;`;
  await db.run(deleteQuery);
  response.send("Todo Deleted");
});

module.exports = app;
