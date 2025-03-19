let currentSlide = 1;
const totalSlides = 3;

const selectedTags = {
  location: new Set(),
  property: new Set(),
  amenities: new Set(),
};

function openModal() {
  document.getElementById("registerModal").style.display = "block";
}

function closeModal() {
  document.getElementById("registerModal").style.display = "none";
}

function nextSlide() {
  if (currentSlide < totalSlides) {
    // Hide current slide
    const currentSlideElement = document.getElementById(`slide${currentSlide}`);
    currentSlideElement.classList.remove("active");

    // Increment slide counter
    currentSlide++;

    // Show next slide
    const nextSlideElement = document.getElementById(`slide${currentSlide}`);
    nextSlideElement.classList.add("active");

    // Update progress bar
    updateProgressBar();
  }
}

function updateProgressBar() {
  const steps = document.querySelectorAll(".progress-step");
  steps.forEach((step, index) => {
    if (index < currentSlide) {
      step.classList.add("active");
    } else {
      step.classList.remove("active");
    }
  });
}

// Close modal when clicking outside
window.onclick = function (event) {
  const modal = document.getElementById("registerModal");
  if (event.target == modal) {
    closeModal();
  }
};

function addTag(type) {
  const select = document.getElementById(`${type}Select`);
  const value = select.value;

  if (value && !isTagExists(type, value)) {
    const tagsContainer = document.getElementById(`${type}Tags`);

    const tag = document.createElement("div");
    tag.className = "tag";
    tag.innerHTML = `
        ${value}
        <span class="tag-remove" onclick="removeTag(this, '${type}', '${value}')">×</span>
    `;

    tagsContainer.appendChild(tag);
    select.value = ""; // Reset select
  }
}

function isTagExists(type, value) {
  const tagsContainer = document.getElementById(`${type}Tags`);
  const existingTags = tagsContainer.getElementsByClassName("tag");
  for (let tag of existingTags) {
    if (tag.textContent.includes(value)) {
      return true;
    }
  }
  return false;
}

function removeTag(element, type, value) {
  element.parentElement.remove();
}

function storeFormData() {
  const formData = {
    locations: getTagValues("locationTags"),
    properties: getTagValues("propertyTags"),
    budget: document.getElementById("budget").value,
    timeframe: document.getElementById("timeframe").value,
  };

  // Store in localStorage or state management system
  localStorage.setItem("propertyFormData", JSON.stringify(formData));
}

function getTagValues(containerId) {
  const container = document.getElementById(containerId);
  const tags = container.getElementsByClassName("tag");
  return Array.from(tags).map((tag) => tag.textContent.replace("×", "").trim());
}

// For amenities in slide 3
function toggleAmenity(element) {
  element.classList.toggle("selected");

  // Update the icon based on selection state
  const icon = element.querySelector(".icon");
  if (element.classList.contains("selected")) {
    icon.textContent = "×";
  } else {
    icon.textContent = "+";
  }
}

// Initialize amenities on page load
document.addEventListener("DOMContentLoaded", () => {
  const amenityTags = document.querySelectorAll(".amenity-tag");

  amenityTags.forEach((tag) => {
    tag.addEventListener("click", () => toggleAmenity(tag));

    // Set initial icon based on selection state
    const icon = tag.querySelector(".icon");
    icon.textContent = tag.classList.contains("selected") ? "×" : "+";
  });
});

// Optional: Function to get all selected values
function getSelectedValues() {
  return {
    locations: Array.from(selectedTags.location),
    propertyTypes: Array.from(selectedTags.property),
    amenities: Array.from(selectedTags.amenities),
  };
}

function finishProcess() {
  // Store final data if needed
  const formData = {
    // Collect all form data here
    amenities: getSelectedAmenities(),
  };

  // You can either close the modal or show a success message
  alert("Thank you for your preferences!");
  closeModal();
}

function getSelectedAmenities() {
  const selectedAmenities = document.querySelectorAll(".amenity-tag.selected");
  return Array.from(selectedAmenities).map((amenity) => amenity.textContent);
}

// Initialize when page loads
document.addEventListener("DOMContentLoaded", () => {
  // Show first slide
  document.getElementById("slide1").classList.add("active");

  // Load any saved data if exists
  const savedData = localStorage.getItem("propertyFormData");
  if (savedData) {
    const data = JSON.parse(savedData);
    // Populate form with saved data if needed
  }

  // Set initial state for pre-selected amenities
  const preSelected = ["Yoga studio", "Gym centre", "Parking area", "Dog runs"];

  document.querySelectorAll(".amenity-tag").forEach((tag) => {
    const amenityName = tag.textContent.trim().replace(/[×+]/, "").trim();
    if (preSelected.includes(amenityName)) {
      tag.classList.add("selected");
      tag.querySelector(".remove-icon").style.display = "inline";
      tag.querySelector(".add-icon").style.display = "none";
    } else {
      tag.querySelector(".add-icon").style.display = "inline";
      tag.querySelector(".remove-icon").style.display = "none";
    }
  });
});
