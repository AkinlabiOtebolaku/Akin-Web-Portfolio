const typingText = document.getElementById("typing-text");

const messages = ["initialising portfolio...",
    "loading data projects...",
    "connecting to GitHub...",
    "ready to build."];

let messageIndex = 0;
let characterIndex = 0;
let deleting = false;

function typeMessage() {const currentMessage = messages[messageIndex];
if (!deleting) 
{typingText.textContent = currentMessage.substring(0, characterIndex + 1);

        characterIndex++;

        if (characterIndex === currentMessage.length) {
            deleting = true;
            setTimeout(typeMessage, 1500);
            return;
        }
    } else {
        typingText.textContent = currentMessage.substring(
            0,
            characterIndex - 1
        );

        characterIndex--;

        if (characterIndex === 0) {
            deleting = false;
            messageIndex = (messageIndex + 1) % messages.length;
        }
    }

    setTimeout(typeMessage, deleting ? 40 : 75);
}

typeMessage();

const revealElements = document.querySelectorAll(
    ".about, .projects, .experience, .skills, .contact, " +
    ".project-card, .experience-item, .skill-card"
);

revealElements.forEach((element) => {
    element.classList.add("reveal");
});

const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                revealObserver.unobserve(entry.target);
            }
        });
    },
    {
        threshold: 0.12
    }
);

revealElements.forEach((element) => {
    revealObserver.observe(element);
});

const pageSections = document.querySelectorAll(
    "#about, #projects, #experience, #skills, #github, #contact"
);

const navigationLinks = document.querySelectorAll(".nav-links a");

function updateActiveNavigation() {
    let currentSection = "";

    pageSections.forEach((section) => {
        const sectionTop = section.offsetTop - 180;
        const sectionHeight = section.offsetHeight;

        if (
            window.scrollY >= sectionTop &&
            window.scrollY < sectionTop + sectionHeight
        ) {
            currentSection = section.id;
        }
    });

    navigationLinks.forEach((link) => {
        link.classList.remove("active");

        if (link.getAttribute("href") === `#${currentSection}`) {
            link.classList.add("active");
        }
    });
}

window.addEventListener("scroll", updateActiveNavigation);

updateActiveNavigation();

const menuButton = document.getElementById("menu-button");
const navLinksContainer = document.querySelector(".nav-links");
const mobileNavLinks = document.querySelectorAll(".nav-links a");

menuButton.addEventListener("click", () => {
    menuButton.classList.toggle("open");
    navLinksContainer.classList.toggle("open");
});

mobileNavLinks.forEach((link) => {
    link.addEventListener("click", () => {
        menuButton.classList.remove("open");
        navLinksContainer.classList.remove("open");
    });
});

/* GitHub integration */

const githubUsername = "AkinlabiOtebolaku";

const approvedRepositories = {
    "Medic-AI-Poster-Competition-": {
        title: "Cardiovascular AI Prototype",
        description:
            "A web-based prototype exploring how artificial intelligence could support cardiovascular health awareness and early identification."
    },

    "Data-Analysis-Project": {
        title: "Data Analysis Portfolio",
        description:
            "A collection of SQL, Excel and Power BI projects involving data cleaning, analysis, dashboards and business recommendations."
    }
};

const githubGrid = document.getElementById("github-grid");
const githubProfileLink = document.getElementById(
    "github-profile-link"
);

githubProfileLink.href =
    `https://github.com/${githubUsername}`;

githubProfileLink.target = "_blank";
githubProfileLink.rel = "noopener noreferrer";

async function loadGitHubRepositories() {
    try {
        const response = await fetch(
            `https://api.github.com/users/${githubUsername}/repos?sort=updated`
        );

        if (!response.ok) {
            throw new Error("GitHub repositories could not be loaded.");
        }

        const repositories = await response.json();

        const selectedRepositories = repositories.filter((repository) =>
            Object.prototype.hasOwnProperty.call(
                approvedRepositories,
                repository.name
            )
        );

        githubGrid.innerHTML = "";

        selectedRepositories.forEach((repository) => {
            const customInformation =
                approvedRepositories[repository.name];

            const repositoryCard = document.createElement("article");

            repositoryCard.className = "github-card";

            repositoryCard.innerHTML = `
                <div class="github-card-top">
                    <span class="github-folder">⌁</span>
                    <span>
                        ${new Date(
                            repository.updated_at
                        ).toLocaleDateString("en-GB")}
                    </span>
                </div>

                <h3>${customInformation.title}</h3>

                <p class="github-card-description">
                    ${customInformation.description}
                </p>

                <div class="github-card-bottom">
                    <span class="github-language">
                        ${repository.language || "Multiple file types"}
                    </span>

                    <a
                        href="${repository.html_url}"
                        class="github-card-link"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        View repository ↗
                    </a>
                </div>
            `;

            githubGrid.appendChild(repositoryCard);
        });

        if (selectedRepositories.length === 0) {
            githubGrid.innerHTML = `
                <div class="github-loading">
                    <p>No selected repositories were found.</p>
                </div>
            `;
        }
    } catch (error) {
        console.error(error);

        githubGrid.innerHTML = `
            <div class="github-loading">
                <p>
                    GitHub projects are temporarily unavailable.
                    Please visit my GitHub profile instead.
                </p>
            </div>
        `;
    }
}

loadGitHubRepositories();