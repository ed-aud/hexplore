document.addEventListener("DOMContentLoaded", function () {
  function autoResize(textarea) {
    textarea.style.height = "auto"; // Reset height to recalculate
    textarea.style.height = textarea.scrollHeight + "px"; // Set new height
  }

  const textareas = document.querySelectorAll(".auto-expand");

  textareas.forEach(textarea => {
    autoResize(textarea); // Adjust on load
    textarea.addEventListener("input", () => autoResize(textarea)); // Adjust on input
  });
});
