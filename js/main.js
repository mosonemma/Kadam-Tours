/* ==================================================
   MT.KADAM TOURS — MAIN JS
   ================================================== */

const API_BASE_URL = window.MTKADAM_API_BASE_URL || "https://mtkadam-backend.onrender.com/api";

const PACKAGE_ITINERARY_PATHS = {
  "karamoja-exclusive-tour": "karamoja-exclusive-tour.html",
  "mt-kadam-hike-1-day": "mt-kadam-hike.html",
  "mt-kadam-hike-2-days": "mt-kadam-hike.html",
  "karamoja-4-days-safari": "karamoja-4-days-safari.html",
  "karamoja-7-days": "karamoja-7-days.html",
};

function formatPackagePrice(value) {
  const price = Number(value);
  return Number.isFinite(price)
    ? price.toLocaleString("en-US", { maximumFractionDigits: 2 })
    : "—";
}

function createPackageCard(pkg) {
  const article = document.createElement("article");
  article.className = "package-card package-card--tour";

  const media = document.createElement("div");
  media.className = "package-media";
  const image = document.createElement("img");
  image.src = pkg.image_url || "images/safaris/safari to karamoja/IMG_4439.webp";
  image.alt = pkg.title;
  image.width = 800;
  image.height = 500;
  image.loading = "lazy";
  media.appendChild(image);

  const content = document.createElement("div");
  content.className = "package-card-content";

  const meta = document.createElement("div");
  meta.className = "package-meta";
  meta.textContent = `${pkg.duration_days} ${Number(pkg.duration_days) === 1 ? "day" : "days"} · ${pkg.title}`;

  const price = document.createElement("div");
  price.className = "price";
  price.textContent = `From $${formatPackagePrice(pkg.price_usd)}`;

  const title = document.createElement("h3");
  title.textContent = pkg.title;

  const description = document.createElement("p");
  description.className = "package-blurb";
  description.textContent = pkg.description || "";

  const features = document.createElement("ul");
  (Array.isArray(pkg.features) ? pkg.features : []).forEach((feature) => {
    const item = document.createElement("li");
    item.textContent = feature;
    features.appendChild(item);
  });

  const pricingNote = document.createElement("p");
  pricingNote.className = "package-price-note";
  pricingNote.textContent =
    `Per person: 1 guest $${formatPackagePrice(pkg.price_solo_usd || pkg.price_usd)} · ` +
    `2–5 guests $${formatPackagePrice(pkg.price_small_group_usd || pkg.price_usd)} each · ` +
    `6–10 guests $${formatPackagePrice(pkg.price_large_group_usd || pkg.price_usd)} each.`;

  const itineraryLink = document.createElement("a");
  itineraryLink.className = "btn btn-outline btn-block";
  itineraryLink.href = PACKAGE_ITINERARY_PATHS[pkg.slug] || "packages.html";
  itineraryLink.textContent = "View Full Itinerary";

  const bookingLink = document.createElement("a");
  bookingLink.className = "btn btn-primary btn-block";
  bookingLink.href = `booking.html?package=${encodeURIComponent(pkg.slug)}`;
  bookingLink.textContent = "Book This Package";

  content.append(meta, price, title, description, features, pricingNote, itineraryLink, bookingLink);
  article.append(media, content);
  return article;
}

document.addEventListener("DOMContentLoaded", () => {

  /* ---------- MOBILE MENU ---------- */
  const menuBtn = document.getElementById("menu-btn");
  const navLinks = document.querySelector(".nav-links");

  if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", () => {
      navLinks.classList.toggle("active");
      const icon = menuBtn.querySelector("i");
      icon.classList.toggle("fa-bars");
      icon.classList.toggle("fa-times");
    });

    document.querySelectorAll(".nav-links a").forEach(link => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        const icon = menuBtn.querySelector("i");
        icon.classList.remove("fa-times");
        icon.classList.add("fa-bars");
      });
    });
  }

  /* ---------- STICKY HEADER ---------- */
  const header = document.querySelector(".header");
  function stickyHeader() {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 40);
  }
  stickyHeader();
  window.addEventListener("scroll", stickyHeader);

  /* ---------- PAGE HERO SLIDESHOWS ---------- */
  document.querySelectorAll(".hero[data-hero-images], .page-header[data-hero-images]").forEach(hero => {
    const images = hero.dataset.heroImages.split("|").map(image => image.trim()).filter(Boolean);
    if (!images.length) return;

    const requestedStart = Number.parseInt(hero.dataset.startSlide || "0", 10);
    let slideIndex = Number.isInteger(requestedStart) && requestedStart >= 0 && requestedStart < images.length
      ? requestedStart
      : 0;
    const layers = [document.createElement("div"), document.createElement("div")];
    layers.forEach(layer => {
      layer.className = "hero-slide-layer";
      layer.setAttribute("aria-hidden", "true");
      hero.prepend(layer);
    });
    hero.classList.add("has-hero-slides");
    let activeLayer = 0;
    layers[activeLayer].style.backgroundImage = `url("${images[slideIndex]}")`;
    layers[activeLayer].classList.add("is-active");

    if (images.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    window.setInterval(() => {
      slideIndex = (slideIndex + 1) % images.length;
      activeLayer = 1 - activeLayer;
      layers[activeLayer].style.backgroundImage = `url("${images[slideIndex]}")`;
      layers[activeLayer].classList.add("is-active");
      layers[1 - activeLayer].classList.remove("is-active");
    }, 6500);
  });

  /* ---------- COUNTER ANIMATION ---------- */
  const statsSection = document.querySelector(".stats");
  if (statsSection) {
    let started = false;
    const counters = statsSection.querySelectorAll("h3[data-count]");
    const animate = (el) => {
      const target = parseInt(el.dataset.count, 10) || 0;
      const suffix = el.dataset.suffix || "";
      let count = 0;
      const increment = Math.max(1, Math.ceil(target / 80));
      const step = () => {
        count += increment;
        if (count >= target) {
          el.textContent = target.toLocaleString() + suffix;
        } else {
          el.textContent = count.toLocaleString() + suffix;
          requestAnimationFrame(step);
        }
      };
      step();
    };
    new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !started) {
          started = true;
          counters.forEach(animate);
        }
      });
    }, { threshold: 0.4 }).observe(statsSection);
  }

  /* ---------- SCROLL REVEAL ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------- TESTIMONIAL SLIDER ---------- */
  const slides = document.querySelectorAll(".testimonial-slider .testimonial");
  const dotsWrap = document.querySelector(".slider-dots");
  if (slides.length) {
    let idx = 0;
    if (dotsWrap) {
      slides.forEach((_, i) => {
        const dot = document.createElement("button");
        if (i === 0) dot.classList.add("active");
        dot.addEventListener("click", () => show(i));
        dotsWrap.appendChild(dot);
      });
    }
    function show(i) {
      slides.forEach(s => s.classList.remove("active"));
      slides[i].classList.add("active");
      if (dotsWrap) {
        [...dotsWrap.children].forEach((d, di) => d.classList.toggle("active", di === i));
      }
      idx = i;
    }
    show(0);
    setInterval(() => show((idx + 1) % slides.length), 5500);
  }

  /* ---------- DESTINATION SEARCH ---------- */
  const searchInput = document.getElementById("destinationSearch");
  const destinationItems = document.querySelectorAll(".destination-item");
  if (searchInput && destinationItems.length) {
    searchInput.addEventListener("keyup", function () {
      const value = this.value.toLowerCase();
      destinationItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(value) ? "" : "none";
      });
    });
  }

  /* ---------- FAQ ACCORDION ---------- */
  document.querySelectorAll(".faq-item").forEach(item => {
    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");
    question.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");
      document.querySelectorAll(".faq-item.open").forEach(open => {
        if (open !== item) {
          open.classList.remove("open");
          open.querySelector(".faq-answer").style.maxHeight = null;
        }
      });
      item.classList.toggle("open", !isOpen);
      answer.style.maxHeight = !isOpen ? answer.scrollHeight + "px" : null;
    });
  });

  /* ---------- FAQ CATEGORY FILTER ---------- */
  const faqCats = document.querySelectorAll(".faq-cat");
  const faqItems = document.querySelectorAll(".faq-item");
  if (faqCats.length) {
    faqCats.forEach(cat => {
      cat.addEventListener("click", () => {
        faqCats.forEach(c => c.classList.remove("active"));
        cat.classList.add("active");
        const group = cat.dataset.cat;
        faqItems.forEach(item => {
          item.style.display = (group === "all" || item.dataset.cat === group) ? "" : "none";
        });
      });
    });
  }

  /* ---------- GALLERY FILTER ---------- */
  const galleryFilters = document.querySelectorAll(".gallery-filters button");
  const galleryItems = document.querySelectorAll(".gallery-item");
  if (galleryFilters.length) {
    galleryFilters.forEach(btn => {
      btn.addEventListener("click", () => {
        galleryFilters.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        const cat = btn.dataset.filter;
        galleryItems.forEach(item => {
          item.style.display = (cat === "all" || item.dataset.cat === cat) ? "" : "none";
        });
      });
    });
  }

  /* ---------- LIGHTBOX ---------- */
  const lightbox = document.querySelector(".lightbox");
  if (lightbox && galleryItems.length) {
    const lightboxImg = lightbox.querySelector("img");
    const imgList = [...galleryItems].map(i => i.querySelector("img").src);
    let current = 0;

    const open = (i) => {
      current = i;
      lightboxImg.src = imgList[current];
      lightbox.classList.add("open");
    };
    galleryItems.forEach((item, i) => item.addEventListener("click", () => open(i)));

    lightbox.querySelector(".lightbox-close").addEventListener("click", () => lightbox.classList.remove("open"));
    lightbox.addEventListener("click", (e) => { if (e.target === lightbox) lightbox.classList.remove("open"); });
    lightbox.querySelector(".lightbox-prev").addEventListener("click", () => open((current - 1 + imgList.length) % imgList.length));
    lightbox.querySelector(".lightbox-next").addEventListener("click", () => open((current + 1) % imgList.length));
    document.addEventListener("keydown", (e) => {
      if (!lightbox.classList.contains("open")) return;
      if (e.key === "Escape") lightbox.classList.remove("open");
      if (e.key === "ArrowRight") open((current + 1) % imgList.length);
      if (e.key === "ArrowLeft") open((current - 1 + imgList.length) % imgList.length);
    });
  }

  /* ---------- NEWSLETTER FORM (Backend API) ---------- */
  document.querySelectorAll(".newsletter-form").forEach((newsletterForm) => {
    const emailInput = newsletterForm.querySelector('input[type="email"]');
    const submitButton = newsletterForm.querySelector("button[type='submit']");
    const status = document.createElement("p");
    status.className = "form-note newsletter-status";
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");
    status.style.color = "var(--cream)";
    newsletterForm.insertAdjacentElement("afterend", status);

    newsletterForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      status.textContent = "";
      submitButton.disabled = true;
      const originalLabel = submitButton.textContent;
      submitButton.textContent = "Subscribing...";

      const url = `${API_BASE_URL}/newsletter`;

      try {
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: emailInput.value.trim() }),
        });

        if (!response.ok) {
          const result = await response.json().catch(() => ({}));
          console.error("Newsletter failed:", url, response.status, result);
          throw new Error(result.error || "Failed to subscribe");
        }

        newsletterForm.reset();
        status.textContent = "Thanks — you're subscribed!";
      } catch (err) {
        console.error("Newsletter subscription failed:", err);
        status.textContent = "Something went wrong. Please try again.";
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = originalLabel;
      }
    });
  });

  /* ---------- CONTACT FORM (Backend API) ---------- */
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      const submitBtn = contactForm.querySelector("button[type='submit']");
      const successBox = document.getElementById("contactSuccess");
      const errorBox = document.getElementById("contactError");
      const originalLabel = submitBtn.textContent;

      errorBox.style.display = "none";
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending...";

      try {
        const formData = new FormData(contactForm);
        const response = await fetch(contactForm.action, {
          method: "POST",
          body: JSON.stringify({
            name: formData.get("name"),
            email: formData.get("email"),
            phone: formData.get("phone"),
            subject: formData.get("subject"),
            message: formData.get("message"),
          }),
          headers: { "Content-Type": "application/json" }
        });

        if (response.ok) {
          successBox.classList.add("show");
          contactForm.reset();
          successBox.scrollIntoView({ behavior: "smooth", block: "center" });
        } else {
          errorBox.style.display = "block";
        }
      } catch (err) {
        errorBox.style.display = "block";
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalLabel;
      }
    });
  }

  /* ---------- BOOKING FORM + LIVE SUMMARY (Backend API) ---------- */
  const bookingForm = document.getElementById("bookingForm");
  let refreshBookingSummary = null;
  if (bookingForm) {
    const packageSelect = document.getElementById("packageSelect");
    const travelersInput = document.getElementById("travelers");
    const sumPackage = document.getElementById("sumPackage");
    const sumTravelers = document.getElementById("sumTravelers");
    const sumTotal = document.getElementById("sumTotal");
    const sumTotalField = document.getElementById("sumTotalField");

    function getPackageRate(opt, travelers) {
      const priceSolo = Number(opt.dataset.priceSolo || 0);
      const priceSmall = Number(opt.dataset.priceSmall || priceSolo);
      const priceLarge = Number(opt.dataset.priceLarge || priceSmall);

      if (travelers === 1) return priceSolo;
      if (travelers >= 2 && travelers <= 5) return priceSmall;
      if (travelers >= 6 && travelers <= 10) return priceLarge;
      return priceLarge;
    }

    function updateSummary() {
      const opt = packageSelect.options[packageSelect.selectedIndex];
      const travelers = parseInt(travelersInput.value || "1", 10);
      const price = getPackageRate(opt, travelers);
      const total = price * travelers;
      const quoteRequired = Boolean(opt.value) && price === 0;
      sumPackage.textContent = opt.value ? opt.text.split(" (quote required)")[0] : "—";
      sumTravelers.textContent = travelers;
      sumTotal.textContent = quoteRequired ? "Quote required" : "$" + total.toLocaleString();
      if (sumTotalField) sumTotalField.value = quoteRequired ? "Quote required" : "$" + total.toLocaleString();
    }
    refreshBookingSummary = updateSummary;
    packageSelect.addEventListener("change", updateSummary);
    travelersInput.addEventListener("input", updateSummary);
    updateSummary();

    // Preselect a package when arriving from a package page (?package=slug)
    const preselect = new URLSearchParams(window.location.search).get("package");
    if (preselect) {
      const match = [...packageSelect.options].find(o => o.dataset.slug === preselect || o.value === preselect);
      if (match) { packageSelect.value = match.value; updateSummary(); }
    }

    bookingForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      const submitBtn = bookingForm.querySelector("button[type='submit']");
      const successBox = document.getElementById("bookingSuccess");
      const errorBox = document.getElementById("bookingError");
      const originalLabel = submitBtn.textContent;

      errorBox.style.display = "none";
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending...";

      // Always send to the backend API, not to the <form action> attribute
      const url = `${API_BASE_URL}/bookings`;

      try {
        const formData = new FormData(bookingForm);
        const payload = {
          package: formData.get("package"),
          name: formData.get("name"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          country: formData.get("country"),
          travelers: formData.get("travelers"),
          start_date: formData.get("start_date"),
          notes: formData.get("notes"),
        };

        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          successBox.classList.add("show");
          bookingForm.reset();
          updateSummary();
          successBox.scrollIntoView({ behavior: "smooth", block: "center" });
        } else {
          const body = await response.text();
          console.error("Booking failed:", url, response.status, body, "Payload:", payload);
          errorBox.style.display = "block";
        }
      } catch (err) {
        console.error("Booking request error:", url, err);
        errorBox.style.display = "block";
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalLabel;
      }
    });
  }

  /* ---------- PACKAGES FROM BACKEND ---------- */
  const packageGrids = document.querySelectorAll("[data-packages-api]");
  const packageSelect = document.getElementById("packageSelect");
  if (packageGrids.length || packageSelect) {
    fetch(`${API_BASE_URL}/packages`)
      .then(async (response) => {
        if (!response.ok) throw new Error(`Package request failed (${response.status})`);
        const packages = await response.json();
        if (!Array.isArray(packages)) throw new Error("Package response was not a list");

        packageGrids.forEach((grid) => {
          grid.replaceChildren(...packages.map(createPackageCard));
          grid.setAttribute("aria-busy", "false");
        });

        if (packageSelect) {
          const selectedPackage = new URLSearchParams(window.location.search).get("package");
          const preselectedSlug = selectedPackage === "mt-kadam-hike"
            ? "mt-kadam-hike-1-day"
            : selectedPackage;
          const placeholder = document.createElement("option");
          placeholder.value = "";
          placeholder.textContent = "Select a package";
          packageSelect.replaceChildren(placeholder);

          packages.forEach((pkg) => {
            const option = document.createElement("option");
            option.value = pkg.slug;
            option.textContent = pkg.title;
            option.dataset.slug = pkg.slug.startsWith("mt-kadam-hike-")
              ? "mt-kadam-hike"
              : pkg.slug;
            option.dataset.priceSolo = pkg.price_solo_usd || pkg.price_usd;
            option.dataset.priceSmall = pkg.price_small_group_usd || pkg.price_usd;
            option.dataset.priceLarge = pkg.price_large_group_usd || pkg.price_usd;
            packageSelect.appendChild(option);
          });

          const match = [...packageSelect.options].find(
            (option) => option.value === preselectedSlug || option.dataset.slug === selectedPackage
          );
          if (match) packageSelect.value = match.value;
          if (refreshBookingSummary) refreshBookingSummary();
        }
      })
      .catch((err) => {
        console.error("Could not load tour packages:", err);
        packageGrids.forEach((grid) => {
          grid.setAttribute("aria-busy", "false");
          const status = document.createElement("p");
          status.className = "form-note";
          status.setAttribute("role", "status");
          status.textContent = "Could not load current package details. Displayed prices may be outdated.";
          grid.insertAdjacentElement("afterend", status);
        });

        const packageLoadError = document.getElementById("packageLoadError");
        if (packageLoadError) {
          packageLoadError.textContent = "Could not load current package prices. Please refresh or contact us.";
          packageLoadError.style.display = "block";
        }
      });
  }

  /* ---------- ITINERARY: EXPAND / COLLAPSE ALL ---------- */
  const toggleAll = document.getElementById("toggleDays");
  const dayItems = document.querySelectorAll(".kp-day");
  if (toggleAll && dayItems.length) {
    toggleAll.addEventListener("click", () => {
      const anyClosed = [...dayItems].some(d => !d.open);
      dayItems.forEach(d => { d.open = anyClosed; });
      toggleAll.textContent = anyClosed ? "Collapse all days" : "Expand all days";
      toggleAll.setAttribute("aria-expanded", String(anyClosed));
    });
  }

  /* ---------- BACK TO TOP ---------- */
  const backToTop = document.createElement("button");
  backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
  backToTop.classList.add("back-to-top");
  backToTop.setAttribute("aria-label", "Back to top");
  Object.assign(backToTop.style, {
    position: "fixed", bottom: "100px", right: "25px", width: "52px", height: "52px",
    border: "none", borderRadius: "50%", cursor: "pointer", display: "none", zIndex: "999",
    fontSize: "16px", background: "#2B241D", color: "#FBF7EE", boxShadow: "0 10px 25px rgba(0,0,0,.25)"
  });
  document.body.appendChild(backToTop);
  window.addEventListener("scroll", () => {
    backToTop.style.display = window.scrollY > 400 ? "block" : "none";
  });
  backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  /* ---------- LEGAL MODAL ---------- */
  const policyContent = {
    privacy: {
      title: "Privacy Policy",
      subtitle: "Data Protection and Privacy Act, 2019 (Uganda)",
      paragraphs: [
        "Mt. Kadam Tours respects the privacy of every visitor and processes personal data in accordance with the Data Protection and Privacy Act, 2019 of the Republic of Uganda and applicable data protection principles.",
        "We collect personal data when you contact us, submit a booking inquiry, subscribe to updates, request a quote, or use our website. This may include your name, email address, phone number, country of residence, trip preferences, travel dates, and booking-related information.",
        "We use this information to respond to enquiries, prepare itinerary proposals, confirm bookings, coordinate travel arrangements, communicate updates, and provide support before, during, and after travel. We may also use it to maintain records, improve customer service, and comply with our legal and contractual obligations.",
        "We do not sell personal data. We may share information with trusted third parties only where necessary to deliver our services, such as booking systems, payment processors, communication tools, and local service providers involved in transportation, accommodation, or activity arrangements.",
        "We apply reasonable administrative, technical, and organisational safeguards to protect personal information against unauthorised access, misuse, loss, or disclosure. However, no electronic system can be completely secure, and we encourage users to exercise care when sharing information online.",
        "You have the right to access, update, correct, or request deletion of your personal data where applicable, and to withdraw consent for marketing communications. You may also request information about how your data is used. Please contact us using the details in the contact section of our website if you wish to exercise these rights.",
        "We may retain personal data only for as long as necessary for the purposes for which it was collected, to fulfil legal obligations, to resolve disputes, and to maintain business records."
      ]
    },
    cookie: {
      title: "Cookie Policy",
      subtitle: "Small files stored in the visitor’s browser",
      paragraphs: [
        "Cookies are small text files stored on a visitor's browser or device when they access a website. They help websites remember preferences, improve performance, and understand how users interact with the site.",
        "At Mt. Kadam Tours, we may use cookies to remember visitor preferences, keep forms and booking settings consistent, improve website performance, support booking functionality, and understand website traffic. We also use cookies to help review the effectiveness of marketing campaigns and measure visits to our site.",
        "We may use cookies for analytics services such as Google Analytics to understand traffic patterns, the pages that are visited most often, referral sources, and general user behaviour. This helps us improve the website and make it easier to use.",
        "Some cookies are strictly necessary for website operations and booking features. Others are optional and may be used for analytical, marketing, or functional purposes. We may also use cookies to support advertising and campaign tracking, where such use is permitted by law and disclosed to the visitor.",
        "Visitors can manage or disable cookies through their browser settings. Please note that disabling some cookies may impact features such as saved preferences, booking workflows, or website analytics."
      ]
    },
    terms: {
      title: "Terms & Conditions",
      subtitle: "Booking terms for tours and travel arrangements",
      paragraphs: [
        "By using the Mt. Kadam Tours website or making a booking, you agree to these Terms & Conditions. These terms apply to tour packages, safari itineraries, cultural tours, hiking experiences, and any other travel services arranged by us.",
        "Tour prices are based on the itinerary, package, and group size selected at the time of booking. Prices may vary according to the number of travellers and the final itinerary agreed in writing. Unless otherwise stated, prices are per person and subject to availability.",
        "Bookings are confirmed only after written confirmation from Mt. Kadam Tours or when an agreed deposit and itinerary have been accepted. Availability may change and is subject to the final confirmation issued to the client.",
        "Changes to dates, accommodation, transport, or itinerary details may be requested and are subject to availability. Additional costs may apply where changes require rebooking, different transport arrangements, or revised local services. Mt. Kadam Tours will communicate any such changes where practical.",
        "Participants are responsible for ensuring they hold valid travel documents, including passports, visas, and any required health or immigration documents. We strongly recommend that travellers arrange appropriate travel insurance covering cancellation, interruption, medical needs, and personal baggage.",
        "Mt. Kadam Tours will make reasonable efforts to provide the services described in the itinerary, but some aspects may be affected by weather, road conditions, local regulations, permits, security concerns, or other circumstances outside our control. We reserve the right to change or postpone activities where necessary for safety or operational reasons.",
        "We are not liable for losses, delays, accidents, injuries, or damages arising from third-party providers, weather, acts of God, local conditions, or other factors outside our reasonable control. Our responsibility is limited to the services we directly supply and the terms set out in the final booking confirmation.",
        "Cancellation and refund policies are determined by the agreed booking terms and final quotation. Clients are encouraged to review the relevant itinerary and confirmation carefully before making payment.",
        "If you have questions regarding your reservation, itinerary, pricing, or these terms, please contact Mt. Kadam Tours through the booking or contact channels on our website."
      ]
    }
  };

  const policyModal = document.createElement("div");
  policyModal.className = "policy-modal";
  policyModal.setAttribute("aria-hidden", "true");
  policyModal.innerHTML = `
    <div class="policy-modal-backdrop" data-policy-close="true"></div>
    <div class="policy-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="policyModalTitle">
      <button class="policy-close" type="button" aria-label="Close legal policy">&times;</button>
      <div class="policy-modal-header">
        <h3 id="policyModalTitle"></h3>
        <p id="policyModalSubtitle"></p>
      </div>
      <div class="policy-modal-body" id="policyModalBody"></div>
      <div class="policy-modal-actions">
        <button type="button" class="btn btn-outline policy-close-btn">Close</button>
        <button type="button" class="btn btn-primary policy-accept-btn">Accept Cookies</button>
      </div>
    </div>
  `;
  document.body.appendChild(policyModal);

  const policyTitle = document.getElementById("policyModalTitle");
  const policySubtitle = document.getElementById("policyModalSubtitle");
  const policyBody = document.getElementById("policyModalBody");
  const acceptCookiesBtn = policyModal.querySelector(".policy-accept-btn");
  const closeButtons = policyModal.querySelectorAll("[data-policy-close='true'], .policy-close, .policy-close-btn");

  function renderPolicy(type) {
    const content = policyContent[type] || policyContent.privacy;
    policyTitle.textContent = content.title;
    policySubtitle.textContent = content.subtitle;
    policyBody.innerHTML = content.paragraphs.map(p => `<p>${p}</p>`).join("");
    acceptCookiesBtn.style.display = type === "cookie" ? "inline-flex" : "none";
  }

  function openPolicy(type) {
    renderPolicy(type);
    policyModal.classList.add("is-open");
    policyModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closePolicy() {
    policyModal.classList.remove("is-open");
    policyModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  closeButtons.forEach(button => button.addEventListener("click", closePolicy));
  policyModal.addEventListener("click", (event) => {
    if (event.target.classList.contains("policy-modal-backdrop") || event.target.classList.contains("policy-modal")) {
      closePolicy();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && policyModal.classList.contains("is-open")) {
      closePolicy();
    }
  });

  acceptCookiesBtn.addEventListener("click", () => {
    try {
      document.cookie = "mtkadam_cookie_consent=accepted; max-age=3153600; path=/; SameSite=Lax; Secure";
    } catch (e) {
      // ignore storage issues
    }
    closePolicy();
  });

  document.querySelectorAll("[data-policy]").forEach(link => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      openPolicy(link.dataset.policy);
    });
  });

});