/*
const fs = require("fs"); //file system module in NodeJS

// fs.readFile("text.txt", "utf8", (err, data) => {
//   if(err) {
//     console.error(err);
//     return;
//   }

//   console.log(data);
// });

const content = "Lorem ipsum!";
// fs.writeFile("text.txt", content, err => {
//   if(err) console.error(err);
// })

fs.appendFile("text.txt", content, err => {
  if(err) console.error(err);
})
*/


function test({id, email, phone, pass}) {
  console.log(id, email, phone, pass);
}

test(
  {
    email: "1",
    phone: "2",
    pass: "#",
  }
)