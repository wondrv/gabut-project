// Register form submission
document.getElementById('register').addEventListener('submit', registerUser);
document.getElementById('login').addEventListener('submit', loginUser);

// Register function
function registerUser(e) {
  e.preventDefault();
  
  const username = document.getElementById('register-username').value;
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;
  const confirmPassword = document.getElementById('register-confirm-password').value;

  if (password !== confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  fetch('http://localhost:3000/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      alert('Registration successful!');
    } else {
      alert(data.message || 'Error registering user');
    }
  })
  .catch(error => alert('Error: ' + error));
}

// Login function
function loginUser(e) {
  e.preventDefault();

  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  fetch('http://localhost:3000/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      alert('Login successful!');
    } else {
      alert(data.message || 'Error logging in');
    }
  })
  .catch(error => alert('Error: ' + error));
}
