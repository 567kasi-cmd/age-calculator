export function calculateDateDifference() {
  const date1Input = document.getElementById("date1");
  const date2Input = document.getElementById("date2");
  const result = document.getElementById("result");

  if (!date1Input || !date2Input || !result) {
    return;
  }

  const date1 = new Date(date1Input.value);
  const date2 = new Date(date2Input.value);

  if (Number.isNaN(date1.getTime()) || Number.isNaN(date2.getTime())) {
    result.innerHTML = "Please select both dates.";
    return;
  }

  const diffTime = Math.abs(date2 - date1);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const diffYears = Math.floor(diffDays / 365);
  const diffMonths = Math.floor(diffDays / 30);

  result.innerHTML = `Difference: <b>${diffDays}</b> days<br>
    ~= ${diffMonths} months<br>
    ~= ${diffYears} years`;
}

export function init() {
  calculateDateDifference();
}

