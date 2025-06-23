const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("nav-links");
const navLinkItems = document.querySelectorAll(".nav-link");

// Toggle nav menu for small screens
hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

// Highlight the active link
window.addEventListener("scroll", () => {
  const sections = document.querySelectorAll("section");
  let currentSectionId = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 70; // Adjust for navbar height
    if (window.scrollY >= sectionTop) {
      currentSectionId = section.getAttribute("id");
    }
  });

  navLinkItems.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${currentSectionId}`) {
      link.classList.add("active");
    }
  });
});
