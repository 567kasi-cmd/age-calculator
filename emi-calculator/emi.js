(function () {
  const form = document.getElementById("emiForm");
  if (!form) {
    return;
  }

  let modulePromise;

  const getModule = function () {
    if (!modulePromise) {
      modulePromise = import("/scripts/calculators/emi-calculator.js");
    }

    return modulePromise;
  };

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const module = await getModule();
    if (typeof module.calculateEmi === "function") {
      module.calculateEmi();
    }
  });

  ["focusin", "pointerdown", "touchstart"].forEach(function (eventName) {
    form.addEventListener(eventName, getModule, { once: true });
  });
})();
