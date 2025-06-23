// Initialize EmailJS
(function() {
    emailjs.init("YOUR_USER_ID");  // Replace with your EmailJS User ID
  })();
  
  document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting the usual way
  
    // Get form values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();
  
    // Basic validation
    if (name === '' || email === '' || subject === '' || message === '') {
      showStatus('All fields are required!', 'error');
      return;
    }
  
    // Email validation
    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    if (!email.match(emailPattern)) {
      showStatus('Please enter a valid email address.', 'error');
      return;
    }
  
    // Send the form data to EmailJS
    const templateParams = {
      from_name: name,
      from_email: email,
      subject: subject,
      message: message
    };
  
    emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
      .then(function(response) {
        showStatus('Your message has been sent successfully!', 'success');
        document.getElementById('contact-form').reset();
      }, function(error) {
        showStatus('Oops, something went wrong. Please try again.', 'error');
      });
  });
  
  // Function to show status messages
  function showStatus(message, type) {
    const statusElement = document.getElementById('form-status');
    statusElement.textContent = message;
    statusElement.className = 'form-status ' + type;
  }
  