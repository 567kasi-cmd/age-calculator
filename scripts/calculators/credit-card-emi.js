export function calculateCreditCardEmi() {
  const amountInput = document.getElementById("amount");
  const rateInput = document.getElementById("rate");
  const monthsInput = document.getElementById("months");
  const resultDiv = document.getElementById("result");

  if (!amountInput || !rateInput || !monthsInput || !resultDiv) {
    return;
  }

  const principal = parseFloat(amountInput.value);
  const monthlyRate = parseFloat(rateInput.value) / 12 / 100;
  const months = parseFloat(monthsInput.value);

  if (Number.isNaN(principal) || Number.isNaN(monthlyRate) || Number.isNaN(months) || months <= 0) {
    resultDiv.innerHTML = "<p>Please enter valid values for all fields.</p>";
    return;
  }

  if (monthlyRate === 0) {
    const emiNoInterest = principal / months;
    const totalPaymentNoInterest = emiNoInterest * months;
    resultDiv.innerHTML = `
      <h3>Results</h3>
      <p><strong>Monthly EMI:</strong> Rs ${emiNoInterest.toFixed(2)}</p>
      <p><strong>Total Interest:</strong> Rs 0.00</p>
      <p><strong>Total Payment:</strong> Rs ${totalPaymentNoInterest.toFixed(2)}</p>
    `;
    return;
  }

  const emi =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1);
  const totalPayment = emi * months;
  const totalInterest = totalPayment - principal;

  resultDiv.innerHTML = `
    <h3>Results</h3>
    <p><strong>Monthly EMI:</strong> Rs ${emi.toFixed(2)}</p>
    <p><strong>Total Interest:</strong> Rs ${totalInterest.toFixed(2)}</p>
    <p><strong>Total Payment:</strong> Rs ${totalPayment.toFixed(2)}</p>
  `;
}

export function init() {
  calculateCreditCardEmi();
}

