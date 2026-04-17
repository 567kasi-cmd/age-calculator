export function calculateBMI() {
  const weightInput = document.getElementById("weight");
  const heightInput = document.getElementById("height");
  const result = document.getElementById("result");

  if (!weightInput || !heightInput || !result) {
    return;
  }

  const weight = parseFloat(weightInput.value);
  const height = parseFloat(heightInput.value) / 100;

  if (!weight || !height || weight <= 0 || height <= 0) {
    result.innerHTML = "Please enter valid weight and height.";
    return;
  }

  const bmi = (weight / (height * height)).toFixed(1);
  let category = "";

  if (bmi < 18.5) {
    category = "Underweight";
  } else if (bmi < 24.9) {
    category = "Normal weight";
  } else if (bmi < 29.9) {
    category = "Overweight";
  } else {
    category = "Obese";
  }

  result.innerHTML = `Your BMI is <b>${bmi}</b> (${category})`;
}

export function init() {
  calculateBMI();
}

