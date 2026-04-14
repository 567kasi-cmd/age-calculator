document.getElementById("emiForm")?.addEventListener("submit", function(e) {
  e.preventDefault();

  let P = parseFloat(document.getElementById("amount").value);
  let R = parseFloat(document.getElementById("rate").value);
  let N = parseInt(document.getElementById("months").value);

  if (!P || !R || !N) {
    document.getElementById("result").innerText = "Please fill all fields correctly.";
    return;
  }

  let monthlyRate = R / 12 / 100;
  let emi = (P * monthlyRate * Math.pow(1 + monthlyRate, N)) / (Math.pow(1 + monthlyRate, N) - 1);

  document.getElementById("result").innerText = `Your Monthly EMI: ₹${emi.toFixed(2)}`;

});
