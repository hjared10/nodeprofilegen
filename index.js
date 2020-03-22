const inquirer = require('inquirer');
const fs = require('fs');
const util = require('util');
const rite = util.promisify(fs.writeFile);
const axios = require("axios");
var pdf = require('html-pdf');
var text = fs.readFileSync('./index.html', 'utf8');
var options = { format: 'Letter' };

function ask() {
    return inquirer.prompt([
      {
        type: "input",
        name: "name",
        message: "Please enter desired github username."
      }
    ])};

function gen(res) {
    return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Profile</title>
  </head>
  <body>
    <div>
    <div class="card">
  <img src="${res.data.avatar_url}" alt="UserAvatar" height="42" width="42">
  <div class="container">
    <h4><b>${res.data.login}</b></h4>
    <p>Jared!  Thats me!</p>
    <div>
    User location : ${res.data.location}
    Profile : ${res.data.url}
    Blog: ${res.data.blog}
    Bio: ${res.data.bio}
    Number of public repos: ${res.data.public_repos}
    Followers:${res.data.followers}
    Number of users following:${res.data.following}
    </div>
  </div>
</div>
  </div>
  </body>
  </html>`;
  };

 

  ask()
  .then(function(info) {
      console.log(info.name);
      let name = info.name.toString().replace(/\'/g, "");
      console.log(name);
      axios.get(`https://api.github.com/users/${name}`).then(function(res) {
        console.log(res.data);
        const html = gen(res);
        return rite("index.html", html);
              })
              .then(function() {
                pdf.create(text, options).toFile('./html.pdf', function(err, res) {
                  if (err) return console.log(err);
                  console.log(res);
                });
                console.log("Successfully wrote to index.html");
              })
                .catch(function(err) {
                console.log(err);
                })
                
                  })