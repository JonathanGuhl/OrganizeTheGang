// Node imports/requirements
const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');
const { printTable } = require("console-table-printer");
// Port
const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json())
// Connect to Database
const establish = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'abc123unme',
        database: 'GangGang_db'
    },
);
// Makes sure user inputs something
function inputValidation(value) {
    if (value == "") {
        return "An input is required."
    } else {
        return true;
    }
};
// Initial Prompt that runs after 'npm start' command
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
                    "Remove a Department",
                    "Exit Application"
                ]
            }
        ])
        .then(promptChoice)
}
// Switch case dependent on users choice in menu
function promptChoice(choice) {
    switch (choice.mainPrompt) {
        case "View All Departments":
            // Line 88
            viewDepartments()
            break
        case "View All Roles":
            // Line 98
            viewRoles()
            break
        case "View All Employees":
            // Line 110
            viewEmployees()
            break
        case "Add a Department":
            // Line 124
            addDepartment()
            break
        case "Add a Role":
            // Line 140
            addRole()
            break
        case "Add an Employee":
            // Line 185
            addEmployee()
            break
        case "Update an Employee Role":
            // Line 253
            updateEmployee()
            break
        case "Remove a Department":
            // 
            removeDepartment()
            break
        case "Exit Application":
            console.log("You have closed Employee Manager")
            process.exit()
    }
}

mainPrompt();
// Shows all departments in order of their id 
function viewDepartments() {
    const sql = 'SELECT id AS ID, d_name AS Departments FROM department';
    establish.promise().query(sql)
        .then(([rows, fields]) => {
            printTable(rows);
        })
        .catch(console.log)
        .then(() => mainPrompt())
}
// Displays role id(for job title), job title, salary and department name in the console in order of their id
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
// Displays employees id, first name, last name, job title, salary, department and manager in the console in order of their id
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
// User inputs name, name gets INSERTED INTO department
function addDepartment() {
    inquirer
        .prompt({
            type: "input",
            message: "What's the name of the department you would like to add?",
            name: "newDepartment",
            validate: inputValidation
        })
        .then((data) => {
            const sql = 'INSERT INTO department (d_name) VALUES (?);'
            const newDepartment = [data.newDepartment];
            establish.promise().query(sql, newDepartment)
                .then(console.log(`Added ${newDepartment} to departments`))
                .then(() => mainPrompt())
        })
}
// User inputs name for role, then selects departments its going to be in based off of id
function addRole() {
    const sql = 'SELECT * FROM department';
    establish.promise().query(sql)
        .then(([rows, fields]) => {
            let departments = rows.map((department) => {
                return department.d_name
            })
            inquirer
                .prompt([
                    {
                        type: "input",
                        message: "What is the name of the role?",
                        name: "newRole",
                        validate: inputValidation
                    },
                    {
                        type: "input",
                        message: "What's the salary for the position?",
                        name: "newSalary",
                        validate: inputValidation
                    },
                    {
                        type: "list",
                        message: "What department would you like to add the role to?",
                        name: 'existingDepartments',
                        choices: departments
                    }
                ])
                .then((data) => {
                    for (var i = 0; i < rows.length; i++) {
                        if (data.existingDepartments == rows[i].d_name) {
                            var deptId = rows[i].id;
                        }
                    }
                    const sql = 'INSERT INTO role (title, salary, department_id) VALUES (?,?,?)'
                    const newRole = [data.newRole, data.newSalary, deptId];
                    establish.promise().query(sql, newRole)
                        .then(console.log(`Added ${data.newRole} to ${data.existingDepartments}`))
                        .then(() => mainPrompt());
                })
        });
}
// Queries for roles and all employees, uses them in prompt choices, then filters choices based off of title and first name and inserts into proper table
function addEmployee() {
    const sql = 'SELECT * FROM role;'
    establish.promise().query(sql)
        .then(([rows, fields]) => {
            var roles = rows.map((roles) => {
                return roles.title
            })
            var roleId = rows
            const sql = 'SELECT * FROM employee;'
            establish.promise().query(sql)
                .then(([rows, fields]) => {
                    var managers = rows.map((employee) => {
                        return `${employee.first_name} ${employee.last_name}`
                    })
                    inquirer
                        .prompt([
                            {
                                type: "input",
                                message: "What is the employee's first name?",
                                name: "firstName",
                                validate: inputValidation
                            },
                            {
                                type: "input",
                                message: "What is the employee's last name?",
                                name: "lastName",
                                validate: inputValidation
                            },
                            {
                                type: "list",
                                message: "What is the role?",
                                name: "roleChoice",
                                choices: roles
                            },
                            {
                                type: "list",
                                message: "Who is their manager?",
                                name: "managerChoice",
                                // adding a choice of "None" into managers array
                                choices: managers.concat(["None"])
                            }])
                        .then((data) => {
                            if (data.managerChoice == "None") {
                                var manager = null
                            } else {
                                // splitting data up to be able to compare something for id
                                var choiceFilter = data.managerChoice.split(" ")
                                for (let i = 0; i < rows.length; i++) {
                                    if (choiceFilter[0] == rows[i].first_name) {
                                        var manager = rows[i].id
                                    }
                                }
                            }
                            for (var i = 0; i < roleId.length; i++) {
                                if (data.roleChoice == roleId[i].title) {
                                    var role = roleId[i].id
                                }
                            }
                            const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?);`
                            const newEmployee = [data.firstName, data.lastName, role, manager]
                            establish.promise().query(sql, newEmployee)
                                .then(() => console.log(`Added ${data.firstName} ${data.lastName} to your employees`))
                                .then(() => mainPrompt())
                        })
                })
        })
}
// Pretty much the same functionality as addEmployee() *LINE 185* but replaces role for an employee via UPDATE sql query
function updateEmployee() {
    const sql = 'SELECT * FROM role;'
    establish.promise().query(sql)
        .then(([rows, fields]) => {
            var roles = rows.map((roles) => {
                return roles.title
            })
            var roleId = rows
            const sql = 'SELECT * FROM employee;'
            establish.promise().query(sql)
                .then(([rows, fields]) => {
                    var employees = rows.map((employee) => {
                        return `${employee.first_name} ${employee.last_name}`
                    })
                    inquirer
                        .prompt([
                            {
                                type: "list",
                                message: "Who are we assigning a new role to?",
                                name: "employee",
                                choices: employees
                            },
                            {
                                type: "list",
                                message: "What will their new role be?",
                                name: "updateRole",
                                choices: roles
                            }])
                        .then((data) => {
                            var employeeFilter = data.employee.split(" ")
                            for (let i = 0; i < rows.length; i++) {
                                if (employeeFilter[0] == rows[i].first_name) {
                                    var employee = rows[i].id
                                }
                            }

                            for (var i = 0; i < roleId.length; i++) {
                                if (data.updateRole == roleId[i].title) {
                                    var role = roleId[i].id
                                }
                            }
                            const sql = 'UPDATE employee SET role_id=? WHERE id = ?'
                            const roleUpdate = [role, employee]
                            establish.promise().query(sql, roleUpdate)
                                .then(() => console.log(`${data.employee} is now a ${data.updateRole}`))
                                .then(() => mainPrompt())
                        })
                })
        })
}

function removeDepartment() {
    const sql = 'SELECT * FROM department'
    establish.promise().query(sql)
    .then(([rows, fields]) => {
        var departments = rows.map((department) =>{
            return department.d_name
        })
        inquirer
            .prompt([
                {
                   type: "list",
                   message: "What department are you wanting to remove?",
                   name: "department",
                   choices: departments 
                }])
                .then((data) => {
                    const sql = 'DELETE FROM department WHERE d_name=?'
                    const delDeparment = [data.department];
                    establish.promise().query(sql, delDeparment)
                    .then(() => console.log(`${data.department} has been deleted`))
                    .then(() => mainPrompt())
                })

    })
}

app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT} 🚀`)
);