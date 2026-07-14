/* ==================================================
   MT.KADAM TOURS — MAIN JS
   ================================================== */

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

  /* ---------- NEWSLETTER FORM ---------- */
  const newsletterForm = document.querySelector(".newsletter-form");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const email = this.querySelector("input");
      const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!pattern.test(email.value.trim())) {
        alert("Please enter a valid email address.");
        return;
      }
      alert("Thank you for subscribing!");
      email.value = "";
    });
  }

  /* ---------- CONTACT FORM (Formspree) ---------- */
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
        const response = await fetch(contactForm.action, {
          method: "POST",
          body: new FormData(contactForm),
          headers: { "Accept": "application/json" }
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

  /* ---------- BOOKING FORM + LIVE SUMMARY (Formspree) ---------- */
  const bookingForm = document.getElementById("bookingForm");
  if (bookingForm) {
    const packageSelect = document.getElementById("packageSelect");
    const travelersInput = document.getElementById("travelers");
    const sumPackage = document.getElementById("sumPackage");
    const sumTravelers = document.getElementById("sumTravelers");
    const sumTotal = document.getElementById("sumTotal");
    const sumTotalField = document.getElementById("sumTotalField");

    function updateSummary() {
      const opt = packageSelect.options[packageSelect.selectedIndex];
      const price = parseInt(opt.dataset.price || "0", 10);
      const travelers = parseInt(travelersInput.value || "1", 10);
      const total = price * travelers;
      sumPackage.textContent = opt.value ? opt.text.split(" — ")[0] : "—";
      sumTravelers.textContent = travelers;
      sumTotal.textContent = "$" + total.toLocaleString();
      if (sumTotalField) sumTotalField.value = "$" + total.toLocaleString();
    }
    packageSelect.addEventListener("change", updateSummary);
    travelersInput.addEventListener("input", updateSummary);
    updateSummary();

    bookingForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      const submitBtn = bookingForm.querySelector("button[type='submit']");
      const successBox = document.getElementById("bookingSuccess");
      const errorBox = document.getElementById("bookingError");
      const originalLabel = submitBtn.textContent;

      errorBox.style.display = "none";
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending...";

      try {
        const response = await fetch(bookingForm.action, {
          method: "POST",
          body: new FormData(bookingForm),
          headers: { "Accept": "application/json" }
        });

        if (response.ok) {
          successBox.classList.add("show");
          bookingForm.reset();
          updateSummary();
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

});