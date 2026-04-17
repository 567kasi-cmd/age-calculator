import { importModuleCached } from "../utils/lazy-module-loader.js";

const form = document.getElementById("bmiForm");

if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const module = await importModuleCached("../calculators/bmi-calculator.js");
    if (typeof module.calculateBMI === "function") {
      module.calculateBMI();
    }
  });
}

