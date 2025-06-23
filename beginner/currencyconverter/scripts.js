document.getElementById('convert-btn').addEventListener('click', convertCurrency);

function convertCurrency() {
  const amount = document.getElementById('amount').value;
  const fromCurrency = document.getElementById('from-currency').value;
  const toCurrency = document.getElementById('to-currency').value;

  if (!amount || isNaN(amount)) {
    alert('Please enter a valid amount.');
    return;
  }

  const apiKey = 'e635585e526aede498b4131b'; // Replace with your ExchangeRate-API key
  const apiURL = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${fromCurrency}`;

  fetch(apiURL)
    .then(response => response.json())
    .then(data => {
      if (data.result === 'error') {
        alert('Error fetching exchange rates. Please try again.');
        return;
      }

      const conversionRate = data.conversion_rates[toCurrency];
      const convertedAmount = (amount * conversionRate).toFixed(2);

      document.getElementById('result').textContent = `${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}`;
    })
    .catch(error => {
      alert('Something went wrong. Please try again.');
    });
}
