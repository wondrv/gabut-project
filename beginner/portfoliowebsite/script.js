// Dark Mode Toggle
const themeSwitch = document.getElementById("theme-switch");

// Load theme from local storage
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  themeSwitch.checked = true;
}

// Toggle dark mode
themeSwitch.addEventListener("change", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
});

// Dynamic Project Loading
const projectContainer = document.querySelector(".project-list");

function loadProjects() {
  fetch("https://api.github.com/users/your-username/repos")
    .then(response => response.json())
    .then(repos => {
      projectContainer.innerHTML = repos.slice(0, 6).map(repo => `
        <div class="project">
          <h3>${repo.name}</h3>
          <p>${repo.description || "No description available."}</p>
          <a href="${repo.html_url}" target="_blank">View Repository</a>
        </div>
      `).join("");
    })
    .catch(error => console.error("Error fetching repositories:", error));
}

loadProjects();

// Form Submission
const contactForm = document.getElementById("contact-form");
contactForm.addEventListener("submit", (e) => {
  e.preventDefault();
  alert("Thank you for reaching out! I'll respond soon.");
  contactForm.reset();
});
