const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#site-navigation");
const countdown = document.querySelector(".countdown");
const timeParts = {
  days: document.querySelector("#days"),
  hours: document.querySelector("#hours"),
  minutes: document.querySelector("#minutes"),
  seconds: document.querySelector("#seconds"),
};

menuButton.addEventListener("click", () => {
  const isOpen = navigation.classList.toggle("is-open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.setAttribute(
    "aria-label",
    isOpen ? "Close navigation menu" : "Open navigation menu",
  );
});

navigation.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navigation.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation menu");
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && navigation.classList.contains("is-open")) {
    navigation.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation menu");
    menuButton.focus();
  }
});

document.addEventListener("click", (event) => {
  const clickedOutsideMenu =
    navigation.classList.contains("is-open") &&
    !navigation.contains(event.target) &&
    !menuButton.contains(event.target);

  if (clickedOutsideMenu) {
    navigation.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation menu");
  }
});

// Change the data-reunion-date value in index.html when the final date is confirmed.
const reunionDate = new Date(countdown.dataset.reunionDate).getTime();

function updateCountdown() {
  if (Number.isNaN(reunionDate)) {
    countdown.setAttribute("aria-label", "The reunion date needs to be updated");
    Object.values(timeParts).forEach((part) => {
      part.textContent = "--";
    });
    return;
  }

  const distance = Math.max(reunionDate - Date.now(), 0);
  const dayInMilliseconds = 1000 * 60 * 60 * 24;
  const hourInMilliseconds = 1000 * 60 * 60;
  const minuteInMilliseconds = 1000 * 60;

  timeParts.days.textContent = String(Math.floor(distance / dayInMilliseconds)).padStart(3, "0");
  timeParts.hours.textContent = String(
    Math.floor((distance % dayInMilliseconds) / hourInMilliseconds),
  ).padStart(2, "0");
  timeParts.minutes.textContent = String(
    Math.floor((distance % hourInMilliseconds) / minuteInMilliseconds),
  ).padStart(2, "0");
  timeParts.seconds.textContent = String(
    Math.floor((distance % minuteInMilliseconds) / 1000),
  ).padStart(2, "0");

  if (distance === 0) {
    countdown.setAttribute("aria-label", "The reunion date has arrived");
  }
}

updateCountdown();
setInterval(updateCountdown, 1000);

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
