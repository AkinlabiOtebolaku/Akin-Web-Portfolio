const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const typingText = document.getElementById("typing-text");
const messages = ["building software...", "exploring engineering...", "learning through projects...", "ready for 2027."];
let messageIndex = 0;
let characterIndex = 0;
let deleting = false;
let typingTimer;

function typeMessage() {
    if (!typingText || reducedMotion.matches) return;
    const current = messages[messageIndex];
    characterIndex += deleting ? -1 : 1;
    typingText.textContent = current.slice(0, characterIndex);
    let delay = deleting ? 40 : 75;
    if (characterIndex === current.length) {
        deleting = true;
        delay = 1500;
    } else if (characterIndex === 0) {
        deleting = false;
        messageIndex = (messageIndex + 1) % messages.length;
    }
    typingTimer = setTimeout(typeMessage, delay);
}
function updateMotion() {
    clearTimeout(typingTimer);
    if (!typingText) return;
    if (reducedMotion.matches) typingText.textContent = "Software. Engineering. Ready to learn.";
    else typeMessage();
}
reducedMotion.addEventListener("change", updateMotion);
updateMotion();

// Reveal individual items, so long sections remain visible on small screens.
if ("IntersectionObserver" in window && !reducedMotion.matches) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08 });
    document.querySelectorAll(".about-grid, .project-card, .experience-item, .skill-card, .contact-card").forEach((element) => {
        element.classList.add("reveal");
        observer.observe(element);
    });
}
const pageSections = document.querySelectorAll("#about, #projects, #experience, #skills, #contact");
const navigationLinks = document.querySelectorAll(".nav-links a");
function updateActiveNavigation() {
    let current = "";
    pageSections.forEach((section) => {
        if (window.scrollY >= section.offsetTop - 180) current = section.id;
    });
    navigationLinks.forEach((link) => {
        const active = link.getAttribute("href") === "#" + current;
        link.classList.toggle("active", active);
        if (active) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
    });
}
window.addEventListener("scroll", updateActiveNavigation, { passive: true });
updateActiveNavigation();
const menuButton = document.getElementById("menu-button");
const navLinksContainer = document.getElementById("primary-navigation");
function setMenu(open) {
    menuButton.classList.toggle("open", open);
    navLinksContainer.classList.toggle("open", open);
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
}
menuButton.addEventListener("click", () => setMenu(menuButton.getAttribute("aria-expanded") !== "true"));
navigationLinks.forEach((link) => link.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
        setMenu(false);
        menuButton.focus();
    }
});
window.matchMedia("(min-width: 761px)").addEventListener("change", () => setMenu(false));

