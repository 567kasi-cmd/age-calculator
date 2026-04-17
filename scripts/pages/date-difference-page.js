import { importModuleCached } from "../utils/lazy-module-loader.js";

const form = document.getElementById("dateDifferenceForm");

if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const module = await importModuleCached("../calculators/date-difference.js");
    if (typeof module.calculateDateDifference === "function") {
      module.calculateDateDifference();
    }
  });
}

