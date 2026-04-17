import { importModuleCached } from "../utils/lazy-module-loader.js";

const calculateButton = document.querySelector("[data-action='calculate-age']");
const resetButton = document.querySelector("[data-action='reset-age']");

if (calculateButton) {
  calculateButton.addEventListener("click", async () => {
    const module = await importModuleCached("../calculators/age-calculator.js");
    if (typeof module.calculateAge === "function") {
      module.calculateAge();
    }
  });
}

if (resetButton) {
  resetButton.addEventListener("click", async () => {
    const module = await importModuleCached("../calculators/age-calculator.js");
    if (typeof module.resetAge === "function") {
      module.resetAge();
    }
  });
}

