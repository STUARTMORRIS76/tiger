    
function generateCode() {
  const character = {
    endurance: document.getElementById("endurance").dataset.value,
    innerForce: document.getElementById('innerForce').dataset.value,
    shurikens: document.getElementById('shurikens').dataset.value,
    fate: document.getElementById('fate').dataset.value,
    location: document.getElementById('locationRange').value,
    ninjatools: document.getElementById('ninjatools').value,
    punch: document.getElementById("punch").dataset.value,
    kick: document.getElementById('kick').dataset.value,
    _throw: document.getElementById('_throw').dataset.value,
    items: document.getElementById('items').value,
    notes: document.getElementById('notes').value
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
  container.innerHTML = "";

  // Determine if defaultValue is explicitly set (including 0)
  const hasDefault = defaultValue !== null && defaultValue !== undefined && defaultValue !== "";

  // Set initial data-value
  container.setAttribute("data-value", hasDefault ? defaultValue : "");

  // Create the dropdown toggle button
  const button = document.createElement("button");
  button.className = "btn btn-warning dropdown-toggle";
  button.type = "button";
  button.setAttribute("data-bs-toggle", "dropdown");
  button.setAttribute("aria-expanded", "false");

  const displayValue = hasDefault ? defaultValue : "--";
  button.innerHTML = `<span id="${id}Value">${displayValue}</span>`;

  // Create the dropdown menu
  const ul = document.createElement("ul");
  ul.className = "dropdown-menu";

  for (let i = min; i <= max; i++) {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.className = "dropdown-item";
    a.href = "#";
    a.textContent = i;
    a.onclick = function (e) {
      e.preventDefault(); // Prevent page jump
      document.getElementById(`${id}Value`).textContent = i;
      container.setAttribute("data-value", i); // Store value for later use
    };
    li.appendChild(a);
    ul.appendChild(li);
  }

  // Wrap button and menu in a dropdown container
  const dropdownDiv = document.createElement("div");
  dropdownDiv.className = "dropdown";
  dropdownDiv.appendChild(button);
  dropdownDiv.appendChild(ul);

  // Append to the target container
  container.appendChild(dropdownDiv);
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

  document.getElementById('ninjatools').value = data.ninjatools || "";
  document.getElementById('items').value = data.items || "";
  document.getElementById('notes').value = data.notes || "";

  const dropdownFields = ['punch', 'kick', '_throw','endurance','innerForce','fate','shurikens'];
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

