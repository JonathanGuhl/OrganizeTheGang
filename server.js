const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');
const { printTable } = require("console-table-printer");

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json())

const establish = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'abc123unme',
      database: 'GangGang_db'
    },
  );

function inputValidation(value) {
    if (value == "") {
        return "An input is required."
    } else {
        return true;
    }
};

function mainPrompt() {
    inquirer
        .prompt([
        {
            type: "list",
            message: "What would you like to do?",
            name: "mainPrompt",
            choices: [
                "View All Departments",
                "View All Roles",
                "View All Employees",
                "Add a Department",
                "Add a Role",
                "Add an Employee",
                "Update an Employee Role",
                "Exit Application"
            ]
        }
    ])
    .then(promptChoice)
}

function promptChoice(choice) {
    switch (choice.mainPrompt){
        case "View All Departments":
        // Line 83
            viewDepartments()
            break
        case "View All Roles":
            viewRoles()
            break
        case "View All Employees":
            viewEmployees()
            break
        case "Add a Department":
            addDeparment()
            break
        case "Add a Role":
            addRole()
            break
        case "Add an Employee":
            addEmployee()
            break
        case "Update an Employee Role":
            updateEmployee()
            break
        case "Exit Application":
            exitApp()
            break
            }
}

mainPrompt();

function viewDepartments() {
    const sql = 'SELECT id AS ID, d_name AS Departments FROM department';
    establish.promise().query(sql)
        .then(([rows, fields]) => {
        printTable(rows);
      })
      .catch(console.log)
      .then(() => mainPrompt())
    }

function viewRoles() {
    const sql = 'SELECT role.id, title, salary, d_name AS Department \
                    FROM role \
                    LEFT JOIN department ON role.department_id = department.id';
    establish.promise().query(sql)
        .then(([rows, fields]) => {
        printTable(rows);
      })
      .catch(console.log)
      .then(() => mainPrompt())
    }

function viewEmployees() {
    const sql = 'SELECT employee.id, employee.first_name AS `First Name`, employee.last_name AS `Last Name`, role.title AS `Title`, role.salary AS `Salary`, d_name AS Department, CONCAT(manager.first_name," ", manager.last_name) AS `Manager` \
                     FROM employee \
                     LEFT JOIN employee manager ON employee.manager_id = manager.id \
                     INNER JOIN role ON employee.role_id = role.id \
                     INNER JOIN department ON role.department_id = department.id';
                     
    establish.promise().query(sql)
        .then(([rows, fields]) => {
        printTable(rows);
        })
        .catch(console.log)
        .then(() => mainPrompt())
    }


app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);