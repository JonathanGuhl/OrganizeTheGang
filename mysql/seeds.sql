INSERT INTO department (d_name)
    VALUES ('Engineering'),
           ('Finance'),
           ('Legal'),
           ('Sales');

INSERT INTO role (title, salary, department_id)
    VALUES ("Lead Engineer", 150000, 1),
           ("Software Engineer", 120000, 1),
           ("Account Manager", 150000, 2),
           ("Accountant", 125000, 2),
           ("Legal Team Lead", 250000, 3),
           ("Lawyer", 190000, 3),
           ("Sales Lead", 100000, 4),
           ("Salesperson", 80000, 4),
           ("Accountants", 129000, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
    VALUES ("Olga", "Petit", 5, NULL),
           ("Eric", "Stephen", 1, NULL),
           ("Jon", "Guhl", 2, 2),
           ("Mateo", "Xavier", 6, 1),
           ("Chris", "Davidson", 2, 3),
           ("Aaron", "Joseph", 7, NULL);

