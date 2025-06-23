// Timer Variables
let timerInterval;
let timerTime = 0;

function startTimer() {
  const timerInput = document.getElementById('timerInput').value;
  if (timerInput <= 0 || isNaN(timerInput)) {
    alert("Please enter a valid number.");
    return;
  }
  timerTime = timerInput;
  updateTimerDisplay();
  timerInterval = setInterval(function() {
    if (timerTime > 0) {
      timerTime--;
      updateTimerDisplay();
    } else {
      clearInterval(timerInterval);
      alert("Timer finished!");
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function resetTimer() {
  clearInterval(timerInterval);
  timerTime = 0;
  updateTimerDisplay();
}

function updateTimerDisplay() {
  const minutes = Math.floor(timerTime / 60);
  const seconds = timerTime % 60;
  document.getElementById('timerDisplay').textContent = `${formatTime(minutes)}:${formatTime(seconds)}`;
}

function formatTime(time) {
  return time < 10 ? '0' + time : time;
}

// Stopwatch Variables
let stopwatchInterval;
let stopwatchTime = 0;

function startStopwatch() {
  stopwatchInterval = setInterval(function() {
    stopwatchTime++;
    updateStopwatchDisplay();
  }, 1000);
}

function stopStopwatch() {
  clearInterval(stopwatchInterval); // Correctly clearing the interval
}

function resetStopwatch() {
  clearInterval(stopwatchInterval);
  stopwatchTime = 0;
  updateStopwatchDisplay();
}

function updateStopwatchDisplay() {
  const hours = Math.floor(stopwatchTime / 3600);
  const minutes = Math.floor((stopwatchTime % 3600) / 60);
  const seconds = stopwatchTime % 60;
  document.getElementById('stopwatchDisplay').textContent = `${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`;
}
