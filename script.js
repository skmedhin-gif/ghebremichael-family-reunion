const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#site-navigation");

function closeMenu({ returnFocus = false } = {}) {
  navigation.classList.remove("is-open");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Open navigation menu");
  if (returnFocus) menuButton.focus();
}

menuButton.addEventListener("click", () => {
  const isOpen = navigation.classList.toggle("is-open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
});

navigation.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => closeMenu());
});

const countdown = document.querySelector(".countdown");
const reunionStart = new Date("2027-01-16T00:00:00-06:00").getTime();
let countdownInterval;

function updateCountdown() {
  const timeRemaining = Math.max(0, reunionStart - Date.now());
  const totalSeconds = Math.floor(timeRemaining / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  document.querySelector("#countdown-days").textContent = String(days).padStart(3, "0");
  document.querySelector("#countdown-hours").textContent = String(hours).padStart(2, "0");
  document.querySelector("#countdown-minutes").textContent = String(minutes).padStart(2, "0");
  document.querySelector("#countdown-seconds").textContent = String(seconds).padStart(2, "0");

  if (timeRemaining === 0) {
    clearInterval(countdownInterval);
    countdown.classList.add("countdown-complete");
    countdown.removeAttribute("role");
    countdown.removeAttribute("aria-label");
    countdown.setAttribute("aria-live", "polite");
    countdown.textContent = "The Reunion Weekend Is Here!";
    return false;
  }

  return true;
}

if (countdown) {
  const isCountingDown = updateCountdown();
  if (isCountingDown) countdownInterval = setInterval(updateCountdown, 1000);
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && navigation.classList.contains("is-open")) {
    closeMenu({ returnFocus: true });
  }
});

document.addEventListener("click", (event) => {
  if (
    navigation.classList.contains("is-open") &&
    !navigation.contains(event.target) &&
    !menuButton.contains(event.target)
  ) {
    closeMenu();
  }
});

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealItems = document.querySelectorAll(".reveal");

if (reducedMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );

  revealItems.forEach((item) => observer.observe(item));
}
