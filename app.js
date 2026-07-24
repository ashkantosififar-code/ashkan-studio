document.addEventListener("DOMContentLoaded", () => {

  // سال جاری در فوتر
  document.getElementById("year").textContent = new Date().getFullYear();

  // منوی موبایل
  const navToggle = document.getElementById("navToggle");
  const nav = document.querySelector(".nav");
  navToggle.addEventListener("click", () => {
    nav.classList.toggle("open");
  });
  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => nav.classList.remove("open"));
  });

  // افکت تایپ در نوار آدرس ماکت مرورگر
  const typedUrlEl = document.getElementById("typedUrl");
  const urls = [
    "فروشگاه-اینترنتی.ir",
    "سایت-شرکتی.ir",
    "لندینگ-پیج.ir",
    "وبلاگ-شخصی.ir"
  ];

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReducedMotion) {
    typedUrlEl.textContent = urls[0];
  } else {
    let urlIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function typeLoop() {
      const current = urls[urlIndex];

      if (!deleting) {
        charIndex++;
        typedUrlEl.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          deleting = true;
          setTimeout(typeLoop, 1400);
          return;
        }
      } else {
        charIndex--;
        typedUrlEl.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          urlIndex = (urlIndex + 1) % urls.length;
        }
      }

      setTimeout(typeLoop, deleting ? 45 : 75);
    }

    typeLoop();
  }

  // نمایش نرم کارت‌ها هنگام اسکرول
  const revealTargets = document.querySelectorAll(
    ".service-card, .work-card, .steps li"
  );
  if ("IntersectionObserver" in window && !prefersReducedMotion) {
    revealTargets.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(14px)";
      el.style.transition = "opacity 0.5s ease, transform 0.5s ease";
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    revealTargets.forEach((el) => observer.observe(el));
  }

  // فرم تماس: درخواست مستقیم به واتساپ ارسال می‌شود (سایت بدون بک‌اند است)
  const form = document.getElementById("contactForm");
  const formNote = document.getElementById("formNote");
  const WHATSAPP_NUMBER = "989153730687";

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const contact = form.contact.value.trim();
    const message = form.message.value.trim();

    const text =
      "درخواست پروژه جدید از سایت:" +
      "\nنام: " + name +
      "\nراه تماس: " + contact +
      "\nتوضیح پروژه: " + (message || "—");

    const waUrl =
      "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(text);

    formNote.textContent = "در حال انتقال به واتساپ... پیام رو از اونجا ارسال کنید.";
    window.open(waUrl, "_blank");
    form.reset();
  });
});

// ثبت Service Worker برای قابلیت نصب روی اندروید (نیاز به میزبانی با HTTPS دارد)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js").catch((err) => {
      console.warn("Service worker registration failed:", err);
    });
  });
}
