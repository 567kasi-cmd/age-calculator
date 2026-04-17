export function calculateEmi() {
  const amountInput = document.getElementById("amount");
  const rateInput = document.getElementById("rate");
  const monthsInput = document.getElementById("months");
  const result = document.getElementById("result");

  if (!amountInput || !rateInput || !monthsInput || !result) {
    return;
  }

  const principal = parseFloat(amountInput.value);
  const annualRate = parseFloat(rateInput.value);
  const months = parseInt(monthsInput.value, 10);

  if (!principal || !annualRate || !months) {
    result.innerText = "Please fill all fields correctly.";
    return;
  }

  const monthlyRate = annualRate / 12 / 100;

  if (monthlyRate === 0) {
    const emiWithoutInterest = principal / months;
    result.innerText = `Your Monthly EMI: Rs ${emiWithoutInterest.toFixed(2)}`;
    return;
  }

  const emi =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1);

  result.innerText = `Your Monthly EMI: Rs ${emi.toFixed(2)}`;
}

export function init() {
  calculateEmi();
}

