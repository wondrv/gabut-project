const quotes = [
  "The only way to do great work is to love what you do. - Steve Jobs",
  "In the middle of every difficulty lies opportunity. - Albert Einstein",
  "Life is what happens when you're busy making other plans. - John Lennon",
  "Success is not final, failure is not fatal: It is the courage to continue that counts. - Winston Churchill",
  "You miss 100% of the shots you don't take. - Wayne Gretzky",
  "It does not matter how slowly you go as long as you do not stop. - Confucius"
];

function generateQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  document.getElementById('quote').textContent = quotes[randomIndex];
}
