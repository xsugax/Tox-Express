document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".grid-4 .card");
  cards.forEach((card, index) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(12px)";
    card.style.transition = "opacity 360ms ease, transform 360ms ease";

    setTimeout(() => {
      card.style.opacity = "1";
      card.style.transform = "translateY(0)";
    }, 100 * (index + 1));
  });
});
