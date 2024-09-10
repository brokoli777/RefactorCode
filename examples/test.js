
var count = 0;
var message = "Hello";
var data = "Some random data";

function doSomething() {
  for (var i = 0; i < 10; i++) {
    count++;
    if (i == 5) {
      console.log("Halfway there...");
    }
  }
}

function divide(a, b) {
  console.log("Dividing numbers...");
  return a / b; // No check if b is 0
}

function slowLoop() {
  for (var i = 0; i < data.length; i++) {
    for (var j = 0; j < 100000; j++) {
      // Doing nothing, just wasting time
    }
    console.log(data[i]);
  }
}

doSomething();
console.log("Result:", divide(10, 0));
slowLoop();
