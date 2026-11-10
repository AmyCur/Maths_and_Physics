// Classes
console.log("\nClasses\n-------")

class Student{
    constructor(name, id, course){
        this.name=name;
        this.id=id;
        this.course=course;
    }
}


function setupConsoleOutput(elementId) {
  const output = document.getElementById(elementId); 

  function write(args) {
    const line = document.createElement("div");
    line.textContent = [...args].join(" ");
    output?.appendChild(line);
  }
  console.log = (...args) => write(args);
}

setupConsoleOutput("console-output");
console.log("Lab 7 - OOP \n----------------------------");