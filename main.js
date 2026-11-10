import { Mat4 } from "./maths.js";

function Main() {
  console.log("Lab 8 - Matrices \n----------------------------");

  const A = new Mat4().set([
    1, 2, 3, 4,
    5, 6, 7, 8,
    9, 10, 11, 12,
    13, 14, 15, 16
  ]);
  const B = new Mat4().set([
    17, 18, 19, 20,
    21, 22, 23, 24,
    25, 26, 27, 28,
    29, 30, 31, 32
  ]);

  const AB = new Mat4().copy(A).multiply(B);
  const C = new Mat4().set([
    1, 3, 2, 1,
    1, 1, 2, 2,
    1, 3, 3, 2,
    3, 1, 3, 2
  ]);
  const invC = new Mat4().copy(C).inverse();

  console.log("\nC =\n" + C);
  console.log("\ninv(C) =\n" + invC);
  console.log("\ninv(C)C =\n" + invC?.multiply(C));
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
Main();