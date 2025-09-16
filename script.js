function generateCode() {
  // Collect checked ninja skills
  const selectedSkills = Array.from(document.querySelectorAll('input[name="skill"]:checked'))
    .map(cb => cb.value);

  const character = {
    endurance: document.getElementById("endurance").dataset.value,
    innerForce: document.getElementById('innerForce').dataset.value,
    shurikens: document.getElementById('shurikens').dataset.value,
    fate: document.getElementById('fate').dataset.value,
    location: document.getElementById('locationRange').value,
    ninjatools: Array.from(document.querySelectorAll('input[name="tool"]:checked')).map(cb => cb.value),
    punch: document.getElementById("punch").dataset.value,
    kick: document.getElementById('kick').dataset.value,
    _throw: document.getElementById('_throw').dataset.value,
    items: document.getElementById('items').value,
    notes: document.getElementById('notes').value,
    skills: selectedSkills // ✅ Add ninja skills here
  };

  const ninjaWords = ["shadow", "flame", "lotus", "dragon", "mist", "claw", "echo", "strike", "moon", "venom"];
  const password = Array.from({ length: 3 }, () => ninjaWords[Math.floor(Math.random() * ninjaWords.length)]).join("-");

  localStorage.setItem(`ninja-${password}`, JSON.stringify(character));
  document.getElementById('codeOutput').textContent = password;
}


function rollBothDice() {
  const die1 = document.getElementById("die1");
  const die2 = document.getElementById("die2");

  const faces = ["one", "two", "three", "four", "five", "six"];

  let rollCount = 0;
  const maxRolls = 10;
  const interval = setInterval(() => {
    const temp1 = faces[Math.floor(Math.random() * 6)];
    const temp2 = faces[Math.floor(Math.random() * 6)];
    die1.className = `fas fa-dice-${temp1} dice-icon`;
    die2.className = `fas fa-dice-${temp2} dice-icon`;
    rollCount++;
    if (rollCount >= maxRolls) {
      clearInterval(interval);
      const final1 = faces[Math.floor(Math.random() * 6)];
      const final2 = faces[Math.floor(Math.random() * 6)];
      die1.className = `fas fa-dice-${final1} dice-icon`;
      die2.className = `fas fa-dice-${final2} dice-icon`;
    }
  }, 80);
}

// Make dice clickable
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("die1").addEventListener("click", rollBothDice);
  document.getElementById("die2").addEventListener("click", rollBothDice);

  const locationSlider = document.getElementById("locationRange");
  const locationDisplay = document.getElementById("locationValue");
  locationSlider.addEventListener("input", () => {
    locationDisplay.textContent = locationSlider.value;
  });
});

function createBootstrapDropdown(id, min, max, defaultValue = "") {
  const container = document.getElementById(id);
  if (!container) {
    console.error(`Element with id "${id}" not found.`);
    return;
  }

  container.innerHTML = "";

  const hasDefault = defaultValue !== null && defaultValue !== undefined && defaultValue !== "";
  const currentValue = hasDefault ? parseInt(defaultValue) : 0;
  container.setAttribute("data-value", currentValue);

  // Create the dropdown toggle button
  const button = document.createElement("button");
  button.className = "btn btn-warning dropdown-toggle zoomable-button zoomable-text";
  button.style.fontSize = "1.4em";
  button.style.width = "240px";
  button.style.padding = "10px 20px";
  button.type = "button";
  button.setAttribute("data-bs-toggle", "dropdown");
  button.setAttribute("aria-expanded", "false");

  const valueSpan = document.createElement("span");
  valueSpan.id = `${id}Value`;
  valueSpan.className = "zoomable-text";

  if (id === "shurikens") {
    valueSpan.innerHTML = generateShurikenGrid(currentValue);
  } else {
    valueSpan.textContent = hasDefault ? defaultValue : "--";
  }

  button.appendChild(valueSpan);

  // Create the dropdown menu
  const ul = document.createElement("ul");
  ul.className = "dropdown-menu zoomable-dropdown";

  for (let i = min; i <= max; i++) {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.className = "dropdown-item zoomable-text";
    a.href = "#";
    a.textContent = i;
    a.onclick = function (e) {
      e.preventDefault();
      container.setAttribute("data-value", i);
      if (id === "shurikens") {
        valueSpan.innerHTML = generateShurikenGrid(i);
      } else {
        valueSpan.textContent = i;
      }
    };
    li.appendChild(a);
    ul.appendChild(li);
  }

  const dropdownDiv = document.createElement("div");
  dropdownDiv.className = "dropdown";
  dropdownDiv.appendChild(button);
  dropdownDiv.appendChild(ul);

  container.appendChild(dropdownDiv);

  // Helper function to generate 3x3 shuriken grid
  function generateShurikenGrid(value) {
    let html = '<div class="shuriken-grid">';
    for (let i = 0; i < 9; i++) {
      const filled = i < value;
      html += `<i class="fa-${filled ? 'solid' : 'regular'} fa-star shuriken-icon"></i>`;
      if ((i + 1) % 3 === 0) html += "<br>";
    }
    html += "</div>";
    return html;
  }
}


function loadCode() {
  const password = document.getElementById('saveCode').value.trim();
  const data = JSON.parse(localStorage.getItem(`ninja-${password}`));

  if (!data) {
    alert("Invalid ninja password or no saved data found.");
    return;
  }

  document.getElementById('locationRange').value = data.location || 1;
  document.getElementById('locationValue').textContent = data.location || 1;

document.querySelectorAll('input[name="tool"]').forEach(cb => {
  cb.checked = Array.isArray(data.ninjatools) && data.ninjatools.includes(cb.value);
});

  document.getElementById('items').value = data.items || "";
  document.getElementById('notes').value = data.notes || "";

  const dropdownFields = ['punch', 'kick', '_throw', 'endurance', 'innerForce', 'fate', 'shurikens'];
  dropdownFields.forEach(id => {
    const container = document.getElementById(id);
    const value = data[id];
    if (value !== undefined) {
      container.setAttribute("data-value", value);
      const display = document.getElementById(`${id}Value`);
      if (display) {
        display.textContent = value;
      }
    }
  });

  // ✅ Restore ninja skills checkboxes
  document.querySelectorAll('input[name="skill"]').forEach(cb => {
    cb.checked = Array.isArray(data.skills) && data.skills.includes(cb.value);
  });

  alert("Character loaded");
}


document.addEventListener("DOMContentLoaded", () => {
  const zoomSlider = document.getElementById("zoomControl");
  const zoomDisplay = document.getElementById("zoomValue");
  const scrollContainer = document.querySelector(".scroll-inner");
  const diceIcons = document.querySelectorAll(".zoomable-dice");
  const zoomableSlider = document.querySelector(".zoomable-slider");

  zoomSlider.addEventListener("input", () => {
    const zoom = zoomSlider.value;
    zoomDisplay.textContent = `${zoom}%`;

    // Scale text and controls
    scrollContainer.style.fontSize = `${zoom * 0.01}em`;

    // Scale dice icons
    diceIcons.forEach(die => {
      die.style.fontSize = `${zoom * 0.6}px`;
    });

    // Scale location slider
    zoomableSlider.style.width = `${zoom * 3.6}px`;  // base width = 360px
    zoomableSlider.style.height = `${zoom * 0.28}px`; // base height = 28px
  });

  // Dice click handlers
  document.getElementById("die1").addEventListener("click", rollBothDice);
  document.getElementById("die2").addEventListener("click", rollBothDice);

  // Location slider sync
  const locationSlider = document.getElementById("locationRange");
  const locationDisplay = document.getElementById("locationValue");
  locationSlider.addEventListener("input", () => {
    locationDisplay.textContent = locationSlider.value;
  });
});

