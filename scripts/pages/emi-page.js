import { importModuleCached } from "../utils/lazy-module-loader.js";

const form = document.getElementById("emiForm");

if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const module = await importModuleCached("../calculators/emi-calculator.js");
    if (typeof module.calculateEmi === "function") {
      module.calculateEmi();
    }
  });
}

