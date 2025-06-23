let countdownTimer;
let targetDate;

function startCountdown() {
  const countdownInput = document.getElementById('countdown-time').value;
  
  // Validate if the input is empty or invalid
  if (!countdownInput) {
    alert("Please select a valid date and time for the countdown.");
    return;
  }

  // Set target date and time
  targetDate = new Date(countdownInput);

  // Start the countdown
  countdownTimer = setInterval(updateCountdown, 1000);
}

function updateCountdown() {
  const currentDate = new Date();
  const timeRemaining = targetDate - currentDate;

  if (timeRemaining <= 0) {
    clearInterval(countdownTimer);
    document.getElementById('countdown-display').textContent = "Countdown Finished!";
  } else {
    const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

    // Format time to always show two digits
    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    document.getElementById('countdown-display').textContent = `Time Remaining: ${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  }
}

function stopCountdown() {
  clearInterval(countdownTimer);
  document.getElementById('countdown-display').textContent = "Countdown Stopped";
}

function resetCountdown() {
  clearInterval(countdownTimer);
  document.getElementById('countdown-display').textContent = "Time Remaining: 00:00:00";
  document.getElementById('countdown-time').value = "";
}
