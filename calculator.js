let current = "0";
let previous = "";
let op = null;
let resetNext = false;

const resultEl = document.getElementById("result");
const expressionEl = document.getElementById("expression");

// Update the display screen
function updateDisplay(val) {
  resultEl.textContent = val;

  // Adjust font size based on length
  resultEl.classList.remove("small", "xsmall", "error");
  if (val.length > 12) {
    resultEl.classList.add("xsmall");
  } else if (val.length > 8) {
    resultEl.classList.add("small");
  }
}

// Handle number button clicks
function inputNum(num) {
  if (resetNext) {
    current = num;
    resetNext = false;
  } else {
    if (current.replace("-", "").replace(".", "").length >= 10) return;
    current = current === "0" ? num : current + num;
  }
  updateDisplay(current);
}

// Handle dot/decimal button
function inputDot() {
  if (resetNext) {
    current = "0.";
    resetNext = false;
  } else if (!current.includes(".")) {
    current += ".";
  }
  updateDisplay(current);
}

// Handle operator buttons (+, -, *, /)
function setOperator(newOp) {
  // If there is already a pending operation, calculate first
  if (op && !resetNext) {
    calculate();
  }

  previous = current;
  op = newOp;
  resetNext = true;

  // Show expression at top of display
  const symbols = { "+": "+", "-": "−", "*": "×", "/": "÷" };
  expressionEl.textContent = previous + " " + symbols[op];

  // Highlight active operator using a loop over all operator buttons
  const opBtns = document.querySelectorAll(".operator");
  for (let i = 0; i < opBtns.length; i++) {
    opBtns[i].classList.remove("active");
  }

  // Find and highlight the clicked operator
  const allBtns = document.querySelectorAll(".btn");
  for (let i = 0; i < allBtns.length; i++) {
    if (
      allBtns[i].textContent ===
      { "+": "+", "-": "−", "*": "×", "/": "÷" }[newOp]
    ) {
      allBtns[i].classList.add("active");
    }
  }
}

// Calculate the result
function calculate() {
  if (!op || previous === "") return;

  const a = parseFloat(previous);
  const b = parseFloat(current);
  let result;

  // Use if-else to handle each operation
  if (op === "+") {
    result = a + b;
  } else if (op === "-") {
    result = a - b;
  } else if (op === "*") {
    result = a * b;
  } else if (op === "/") {
    if (b === 0) {
      expressionEl.textContent = previous + " ÷ " + current + " =";
      resultEl.textContent = "Can't divide by 0";
      resultEl.classList.add("error");
      current = "0";
      previous = "";
      op = null;
      resetNext = true;
      return;
    }
    result = a / b;
  }

  // Show full expression
  const symbols = { "+": "+", "-": "−", "*": "×", "/": "÷" };
  expressionEl.textContent =
    previous + " " + symbols[op] + " " + current + " =";

  // Fix floating point issues
  result = parseFloat(result.toPrecision(10));
  current = result.toString();
  op = null;
  previous = "";
  resetNext = true;

  // Remove operator highlights
  const opBtns = document.querySelectorAll(".operator");
  for (let i = 0; i < opBtns.length; i++) {
    opBtns[i].classList.remove("active");
  }

  updateDisplay(current);
}

// Clear everything
function clearAll() {
  current = "0";
  previous = "";
  op = null;
  resetNext = false;
  expressionEl.textContent = "";
  updateDisplay("0");

  const opBtns = document.querySelectorAll(".operator");
  for (let i = 0; i < opBtns.length; i++) {
    opBtns[i].classList.remove("active");
  }
}

// Toggle positive/negative
function toggleSign() {
  if (current === "0") return;
  current = current.startsWith("-") ? current.slice(1) : "-" + current;
  updateDisplay(current);
}

// Percentage
function percent() {
  current = (parseFloat(current) / 100).toString();
  updateDisplay(current);
}

// Keyboard support
document.addEventListener("keydown", function (e) {
  if (e.key >= "0" && e.key <= "9") inputNum(e.key);
  else if (e.key === ".") inputDot();
  else if (e.key === "+") setOperator("+");
  else if (e.key === "-") setOperator("-");
  else if (e.key === "*") setOperator("*");
  else if (e.key === "/") {
    e.preventDefault();
    setOperator("/");
  } else if (e.key === "Enter" || e.key === "=") calculate();
  else if (e.key === "Escape") clearAll();
});
