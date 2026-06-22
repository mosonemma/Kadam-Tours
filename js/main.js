/* ==================================================
   KADAM TOURS
   MAIN JAVASCRIPT FILE
   ================================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ==========================================
       MOBILE MENU
       ========================================== */

    const menuBtn = document.getElementById("menu-btn");
    const navLinks = document.querySelector(".nav-links");

    if (menuBtn && navLinks) {

        menuBtn.addEventListener("click", () => {
            navLinks.classList.toggle("active");

            const icon = menuBtn.querySelector("i");

            if (navLinks.classList.contains("active")) {
                icon.classList.remove("fa-bars");
                icon.classList.add("fa-times");
            } else {
                icon.classList.remove("fa-times");
                icon.classList.add("fa-bars");
            }
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

    /* ==========================================
       STICKY NAVBAR
       ========================================== */

    const header = document.querySelector(".header");

    function stickyNavbar() {

        if (!header) return;

        if (window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    }

    stickyNavbar();

    window.addEventListener("scroll", stickyNavbar);

    /* ==========================================
       ACTIVE NAVIGATION LINK
       ========================================== */

    const sections = document.querySelectorAll("section");
    const navItems = document.querySelectorAll(".nav-links a");

    window.addEventListener("scroll", () => {

        let current = "";

        sections.forEach(section => {

            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.clientHeight;

            if (window.scrollY >= sectionTop) {
                current = section.getAttribute("id");
            }
        });

        navItems.forEach(link => {

            link.classList.remove("active");

            if (
                current &&
                link.getAttribute("href").includes(current)
            ) {
                link.classList.add("active");
            }
        });
    });

    /* ==========================================
       TESTIMONIAL SLIDER
       ========================================== */

    const testimonials =
        document.querySelectorAll(".testimonial");

    let testimonialIndex = 0;

    function showTestimonial(index) {

        testimonials.forEach(item => {
            item.classList.remove("active");
        });

        if (testimonials[index]) {
            testimonials[index].classList.add("active");
        }
    }

    if (testimonials.length > 0) {

        showTestimonial(0);

        setInterval(() => {

            testimonialIndex++;

            if (testimonialIndex >= testimonials.length) {
                testimonialIndex = 0;
            }

            showTestimonial(testimonialIndex);

        }, 5000);
    }

    /* ==========================================
       COUNTER ANIMATION
       ========================================== */

    const counters =
        document.querySelectorAll(".stat h3");

    let counterStarted = false;

    function animateCounter(counter) {

        const target =
            parseInt(counter.textContent.replace(/\D/g, "")) || 0;

        let count = 0;

        const increment = Math.ceil(target / 100);

        const updateCounter = () => {

            count += increment;

            if (count >= target) {

                counter.textContent =
                    target.toLocaleString() + "+";

            } else {

                counter.textContent =
                    count.toLocaleString() + "+";

                requestAnimationFrame(updateCounter);
            }
        };

        updateCounter();
    }

    const statsSection = document.querySelector(".stats");

    if (statsSection) {

        const statsObserver =
            new IntersectionObserver(entries => {

                entries.forEach(entry => {

                    if (
                        entry.isIntersecting &&
                        !counterStarted
                    ) {

                        counterStarted = true;

                        counters.forEach(counter => {
                            animateCounter(counter);
                        });
                    }
                });

            }, {
                threshold: 0.4
            });

        statsObserver.observe(statsSection);
    }

    /* ==========================================
       SCROLL REVEAL ANIMATION
       ========================================== */

    const revealElements = document.querySelectorAll(
        ".feature-card, .destination-card, .package-card, .section-header, .testimonial"
    );

    revealElements.forEach(element => {

        element.style.opacity = "0";
        element.style.transform = "translateY(40px)";
        element.style.transition =
            "all 0.8s ease";
    });

    const revealObserver =
        new IntersectionObserver(entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.style.opacity = "1";
                    entry.target.style.transform =
                        "translateY(0)";

                    revealObserver.unobserve(entry.target);
                }
            });

        }, {
            threshold: 0.15
        });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    /* ==========================================
       SMOOTH SCROLL
       ========================================== */

    document
        .querySelectorAll('a[href^="#"]')
        .forEach(anchor => {

            anchor.addEventListener("click", function (e) {

                const target =
                    document.querySelector(
                        this.getAttribute("href")
                    );

                if (target) {

                    e.preventDefault();

                    target.scrollIntoView({
                        behavior: "smooth"
                    });
                }
            });
        });

    /* ==========================================
       NEWSLETTER FORM
       ========================================== */

    const newsletterForm =
        document.querySelector(".newsletter-form");

    if (newsletterForm) {

        newsletterForm.addEventListener(
            "submit",
            function (e) {

                e.preventDefault();

                const email =
                    this.querySelector("input");

                const emailValue =
                    email.value.trim();

                const emailPattern =
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                if (!emailPattern.test(emailValue)) {

                    alert(
                        "Please enter a valid email address."
                    );

                    return;
                }

                alert(
                    "Thank you for subscribing!"
                );

                email.value = "";
            }
        );
    }

    /* ==========================================
       BACK TO TOP BUTTON
       ========================================== */

    const backToTop =
        document.createElement("button");

    backToTop.innerHTML =
        '<i class="fas fa-arrow-up"></i>';

    backToTop.classList.add("back-to-top");

    document.body.appendChild(backToTop);

    backToTop.style.position = "fixed";
    backToTop.style.bottom = "100px";
    backToTop.style.right = "25px";
    backToTop.style.width = "55px";
    backToTop.style.height = "55px";
    backToTop.style.border = "none";
    backToTop.style.borderRadius = "50%";
    backToTop.style.cursor = "pointer";
    backToTop.style.display = "none";
    backToTop.style.zIndex = "999";
    backToTop.style.fontSize = "18px";
    backToTop.style.background = "#10b981";
    backToTop.style.color = "#fff";
    backToTop.style.boxShadow =
        "0 10px 25px rgba(0,0,0,.2)";

    window.addEventListener("scroll", () => {

        if (window.scrollY > 400) {
            backToTop.style.display = "block";
        } else {
            backToTop.style.display = "none";
        }
    });

    backToTop.addEventListener("click", () => {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

    /* ==========================================
       PAGE LOADER EFFECT
       ========================================== */

    window.addEventListener("load", () => {

        document.body.classList.add("loaded");
    });

    /* ==========================================
       PARALLAX HERO EFFECT
       ========================================== */

    const hero = document.querySelector(".hero");

    window.addEventListener("scroll", () => {

        if (hero) {

            let offset = window.pageYOffset;

            hero.style.backgroundPositionY =
                offset * 0.5 + "px";
        }
    });

});