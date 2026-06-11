const yearElement = document.querySelector("#year");
if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

const filterButtons = Array.from(document.querySelectorAll(".filter-button"));
const projectCards = Array.from(document.querySelectorAll(".project-card"));
const emptyState = document.querySelector("#empty-state");

function applyFilter(filter) {
  let visibleCount = 0;

  projectCards.forEach((card) => {
    const categories = card.dataset.category.split(" ");
    const isVisible = filter === "all" || categories.includes(filter);
    card.hidden = !isVisible;
    if (isVisible) {
      visibleCount += 1;
    }
  });

  if (emptyState) {
    emptyState.hidden = visibleCount > 0;
  }
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((item) => {
      item.classList.remove("active");
      item.setAttribute("aria-pressed", "false");
    });

    button.classList.add("active");
    button.setAttribute("aria-pressed", "true");
    applyFilter(button.dataset.filter);
  });
});

const canvas = document.querySelector("#hero-canvas");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (canvas && !reduceMotion) {
  const context = canvas.getContext("2d");
  const colors = ["#0d7464", "#f0b429", "#d9654a", "#356ac3"];
  let width = 0;
  let height = 0;
  let points = [];

  function resizeCanvas() {
    const ratio = window.devicePixelRatio || 1;
    width = canvas.offsetWidth;
    height = canvas.offsetHeight;
    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);

    const count = Math.max(22, Math.floor(width / 54));
    points = Array.from({ length: count }, (_, index) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.28,
      vy: (Math.random() - 0.5) * 0.28,
      size: 2 + Math.random() * 3,
      color: colors[index % colors.length]
    }));
  }

  function draw() {
    context.clearRect(0, 0, width, height);

    points.forEach((point, index) => {
      point.x += point.vx;
      point.y += point.vy;

      if (point.x < -20) point.x = width + 20;
      if (point.x > width + 20) point.x = -20;
      if (point.y < -20) point.y = height + 20;
      if (point.y > height + 20) point.y = -20;

      for (let nextIndex = index + 1; nextIndex < points.length; nextIndex += 1) {
        const nextPoint = points[nextIndex];
        const distance = Math.hypot(point.x - nextPoint.x, point.y - nextPoint.y);

        if (distance < 160) {
          context.strokeStyle = `rgba(13, 116, 100, ${0.12 * (1 - distance / 160)})`;
          context.lineWidth = 1;
          context.beginPath();
          context.moveTo(point.x, point.y);
          context.lineTo(nextPoint.x, nextPoint.y);
          context.stroke();
        }
      }

      context.fillStyle = point.color;
      context.globalAlpha = 0.55;
      context.fillRect(point.x, point.y, point.size, point.size);
      context.globalAlpha = 1;
    });

    window.requestAnimationFrame(draw);
  }

  resizeCanvas();
  draw();
  window.addEventListener("resize", resizeCanvas);
}
