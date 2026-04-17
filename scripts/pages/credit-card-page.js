import { importModuleCached } from "../utils/lazy-module-loader.js";

const form = document.getElementById("emiForm");

if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const module = await importModuleCached("../calculators/credit-card-emi.js");
    if (typeof module.calculateCreditCardEmi === "function") {
      module.calculateCreditCardEmi();
    }
  });
}

