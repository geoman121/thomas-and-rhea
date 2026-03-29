const events = {
  engagement: {
    tag: "Engagement",
    title: "Engagement Invitation",
    subtitle: "Join us as we celebrate the promise of forever.",
    dateISO: "2026-05-10T11:30:00+05:30",
    dateText: "Sunday, 10th May 2026",
    countdownText: "Sunday, 10th May 2026 - 11:30 AM IST",
    ceremony: {
      timeText: "11:30 AM IST",
      venue: "Our Lady of Dolours Forane Church",
      address: "Mundakayam, Kerala, India",
      query: "Our Lady of Dolours Forane Church, Mundakayam, Kerala, India",
    },
    reception: {
      timeText: "12:30 PM IST",
      venue: "St. Mary's Auditorium",
      address: "Podimattom, Kerala, India",
      query: "St. Mary's Auditorium, Podimattom, Kerala, India",
    },
  },
  marriage: {
    tag: "Marriage",
    title: "Marriage Invitation",
    subtitle: "Celebrate our wedding day with love and laughter.",
    dateISO: "2026-05-24T15:00:00+05:30",
    dateText: "Sunday, 24th May 2026",
    countdownText: "Sunday, 24th May 2026 - 3:00 PM IST",
    ceremony: {
      timeText: "3:00 PM IST",
      venue: "St. Mary's Orthodox Cathedral",
      address: "Park Avenue, Ernakulam, Kerala, India",
      query: "St. Mary's Orthodox Cathedral, Park Avenue, Ernakulam, Kerala, India",
    },
    reception: {
      timeText: "6:30 PM IST",
      venue: "Alfa Horizon",
      address: "Vallarpadom, Kochi, Kerala, India",
      query: "Alfa Horizon, Vallarpadom, Kochi, Kerala, India",
    },
  },
};

const buildMapsSearchUrl = (query) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

const buildMapsEmbedUrl = (query) =>
  `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;

const inviteSection = document.getElementById("invite");
const daysEl = document.getElementById("cd-days");
const hoursEl = document.getElementById("cd-hours");
const minutesEl = document.getElementById("cd-minutes");
const secondsEl = document.getElementById("cd-seconds");
const countdownDateEl = document.getElementById("countdown-date");
const tagEl = document.getElementById("event-tag");
const titleEl = document.getElementById("event-title");
const subtitleEl = document.getElementById("event-subtitle");
const dateEl = document.getElementById("event-date");
const ceremonyTimeEl = document.getElementById("ceremony-time");
const ceremonyVenueEl = document.getElementById("ceremony-venue");
const ceremonyAddressEl = document.getElementById("ceremony-address");
const receptionTimeEl = document.getElementById("reception-time");
const receptionVenueEl = document.getElementById("reception-venue");
const receptionAddressEl = document.getElementById("reception-address");
const ceremonyMapLinkEl = document.getElementById("ceremony-map-link");
const receptionMapLinkEl = document.getElementById("reception-map-link");
const ceremonyMapEmbedEl = document.getElementById("ceremony-map-embed");
const receptionMapEmbedEl = document.getElementById("reception-map-embed");
const togglePhoneBtn = document.getElementById("toggle-phone");
const phoneGallery = document.getElementById("gallery-phone");
const galleryActions = document.querySelector(".gallery-actions");
const primaryGallery = document.getElementById("gallery-primary");
const choiceButtons = document.querySelectorAll(".choice-btn");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxClose = document.getElementById("lightbox-close");
const backSection = document.getElementById("back-section");

let countdownTimer = null;

const getCountdownParts = (distance) => {
  const totalSeconds = Math.max(0, Math.floor(distance / 1000));
  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds };
};

const updateCountdownDisplay = ({ days, hours, minutes, seconds }) => {
  daysEl.textContent = String(days).padStart(2, "0");
  hoursEl.textContent = String(hours).padStart(2, "0");
  minutesEl.textContent = String(minutes).padStart(2, "0");
  secondsEl.textContent = String(seconds).padStart(2, "0");
};

const startCountdown = (dateISO) => {
  if (countdownTimer) {
    clearInterval(countdownTimer);
  }

  const target = new Date(dateISO);
  if (!dateISO || Number.isNaN(target.getTime())) {
    updateCountdownDisplay({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    return;
  }

  const tick = () => {
    const now = new Date();
    const distance = target.getTime() - now.getTime();
    updateCountdownDisplay(getCountdownParts(distance));
  };

  tick();
  countdownTimer = setInterval(tick, 1000);
};

const applyEvent = (key) => {
  const event = events[key];
  if (!event) return;

  tagEl.textContent = event.tag;
  titleEl.textContent = event.title;
  subtitleEl.textContent = event.subtitle;
  dateEl.textContent = event.dateText;
  countdownDateEl.textContent = event.countdownText || event.dateText;

  ceremonyTimeEl.textContent = event.ceremony.timeText;
  ceremonyVenueEl.textContent = event.ceremony.venue;
  ceremonyAddressEl.textContent = event.ceremony.address;
  receptionTimeEl.textContent = event.reception.timeText;
  receptionVenueEl.textContent = event.reception.venue;
  receptionAddressEl.textContent = event.reception.address;

  ceremonyMapLinkEl.href = buildMapsSearchUrl(event.ceremony.query);
  receptionMapLinkEl.href = buildMapsSearchUrl(event.reception.query);
  ceremonyMapEmbedEl.src = buildMapsEmbedUrl(event.ceremony.query);
  receptionMapEmbedEl.src = buildMapsEmbedUrl(event.reception.query);
  startCountdown(event.dateISO);

  inviteSection.classList.remove("hidden");
  if (backSection) {
    backSection.classList.remove("hidden");
  }
  inviteSection.scrollIntoView({ behavior: "smooth", block: "start" });
};

choiceButtons.forEach((button) => {
  button.addEventListener("click", () => {
    choiceButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    const key = button.dataset.event;
    applyEvent(key);
  });
});

togglePhoneBtn.addEventListener("click", () => {
  const isOpen = phoneGallery.classList.toggle("is-open");
  togglePhoneBtn.classList.toggle("expanded", isOpen);
  togglePhoneBtn.setAttribute("aria-expanded", String(isOpen));

  if (isOpen) {
    if (phoneGallery.nextSibling) {
      phoneGallery.parentNode.insertBefore(galleryActions, phoneGallery.nextSibling);
    } else {
      phoneGallery.parentNode.appendChild(galleryActions);
    }
  } else {
    phoneGallery.parentNode.insertBefore(galleryActions, phoneGallery);
  }
});

document.querySelectorAll("[data-scroll]").forEach((button) => {
  button.addEventListener("click", () => {
    const targetId = button.dataset.scroll;
    const section = document.getElementById(targetId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

const resetButton = document.getElementById("reset-invite");
if (resetButton) {
  resetButton.addEventListener("click", () => {
    window.location.reload();
  });
}

const openLightbox = (src, alt) => {
  lightboxImg.src = src;
  lightboxImg.alt = alt || "Full size preview";
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");
};

const closeLightbox = () => {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("no-scroll");
};

document.querySelectorAll(".gallery-grid img").forEach((img) => {
  img.addEventListener("click", () => openLightbox(img.src, img.alt));
});

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

lightboxClose.addEventListener("click", closeLightbox);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && lightbox.classList.contains("open")) {
    closeLightbox();
  }
});
