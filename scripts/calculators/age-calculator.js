function getElements() {
  const dobInput = document.getElementById("dob");
  const result = document.getElementById("result");

  if (!dobInput || !result) {
    return null;
  }

  return { dobInput, result };
}

export function calculateAge() {
  const elements = getElements();
  if (!elements) {
    return;
  }

  const now = new Date();
  const dobValue = elements.dobInput.value;

    if (!dobValue) {
      elements.result.innerHTML = "Please select your birth date.";
      return;
    }

    const dob = new Date(dobValue);

    if (Number.isNaN(dob.getTime())) {
      elements.result.innerHTML = "Please enter a valid date.";
      return;
    }

    if (dob > now) {
      elements.result.innerHTML = "Birth date cannot be in the future.";
      return;
    }

    if (
      dob.getDate() === now.getDate() &&
      dob.getMonth() === now.getMonth() &&
      dob.getFullYear() === now.getFullYear()
    ) {
      elements.result.innerHTML = "You entered today's date.";
      return;
    }

    const diffMs = now - dob;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    let years = now.getFullYear() - dob.getFullYear();
    let months = now.getMonth() - dob.getMonth();
    let days = now.getDate() - dob.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const nextBirthday = new Date(now.getFullYear(), dob.getMonth(), dob.getDate());
    if (nextBirthday < now) {
      nextBirthday.setFullYear(now.getFullYear() + 1);
    }

    const daysUntilNextBirthday = Math.ceil((nextBirthday - now) / (1000 * 60 * 60 * 24));
    const isBirthday = dob.getDate() === now.getDate() && dob.getMonth() === now.getMonth();
    const birthdayMessage = isBirthday
      ? "Happy Birthday!"
      : `Days until your next birthday: ${daysUntilNextBirthday} days`;

  elements.result.innerHTML = `
      ${birthdayMessage}<br><br>
      You are <b>${years}</b> years, <b>${months}</b> months, and <b>${days}</b> days old.<br><br>
      That's approximately:<br>
      <b>${diffDays.toLocaleString()}</b> days<br>
      <b>${diffHours.toLocaleString()}</b> hours<br>
      <b>${diffMins.toLocaleString()}</b> minutes
    `;
}

export function resetAge() {
  const elements = getElements();
  if (!elements) {
    return;
  }

  elements.dobInput.value = "";
  elements.result.innerHTML = "";
}

