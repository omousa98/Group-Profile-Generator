const manager = require("./Develop/lib/Manager");
const engineer = require("./Develop/lib/Engineer");
const intern = require("./Develop/lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const Manager = require("./Develop/lib/Manager");
const Engineer = require("./Develop/lib/Engineer");

//Write your app here
const employees = [];

const createEmployee = () => {
  inquirer
    .prompt([
      {
        type: "name",
        message: "Enter Employee's Name: \n",
        name: "title",
      },
      {
        type: "number",
        message: "Enter Employee ID: \n",
        name: "id",
      },
      {
        type: "input",
        message: "Enter employee email: \n",
        name: "email",
      },
      {
        type: "list",
        message: "Choose the employee titles you wish to add!: \n",
        choices: ["Manager", "Engineer", "Intern"],
        name: "choices",
      },
    ])
    .then((response) => {
      inquirer
        .prompt([
          {
            when: () => response.choices === "Manager",
            type: "number",
            message: "Enter Employee office number: \n",
            name: "officeNum",
          },
          {
            when: () => response.choices === "Intern",
            type: "input",
            message: "Enter School Name: \n",
            name: "school",
          },
          {
            when: () => response.choices === "Engineer",
            type: "input",
            message: "Enter Github Username: \n",
            name: "github",
          },
          {
            type: "confirm",
            message: "Would you like to add another employee? \n",
            name: "addEmployee",
          },
        ])
        .then((results) => {
          let newEmployees;
          switch (response.choices) {
            case "Manager":
              newEmployees = new Manager(
                response.title,
                response.id,
                response.email,
                results.officeNum
              );
              break;
            case "Intern":
              newEmployees = new intern(
                response.title,
                response.id,
                response.email,
                results.school
              );
              break;
            case "Engineer":
              newEmployees = new Engineer(
                response.title,
                response.id,
                response.email,
                results.github
              );
          }
          employees.push(newEmployees);
          if (results.addEmployee === true) {
            createEmployee();
          } else {
            const htmlDoc = `
                <!DOCTYPE html>
                <html lang="en">
<head>
<meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
    <title>Team Profile!</title>
    </head>
<body>
        <section>
        <div class="container">
        <h1 class="text-center">Group Profile Generator</h1>
             <div class="row justify-content-evenly mt-5">
             ${employees.map((value) => {
               return `
                <div class="card" style="width: 18rem;">
                <div class="card-body">
                    <h3> Name: ${value.name}</h3>
                    <h6>  Role: ${value.getRole()} </h6>
                    <p> ID: ${value.id} </p>
                    <p> Email: ${value.email} </p>
                ${(() => {
                  if (value.getRole() === "Manager") {
                    return `<p>Office Number: ${value.getOfficeNum()}</p>`;
                  } else if (value.getRole() === "Engineer") {
                    return `<a href="https://github.com/${value.getGithub()}" target="_blank" ><p class="github">Github</p> </a>`;
                } else if (value.getRole() === "Intern") {
                    return `<p>School: ${value.getSchool()}</p>`;
                } else {
                    return "";
                }
                })()}  
                </div>
                </div>
                `;
             })}
            </div>
            </div>
            </section>
    </body>
    </html>
                `;
            fs.writeFileSync("index.html", htmlDoc);
          }
        });
    });
};
createEmployee();
