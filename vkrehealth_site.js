import { Analytics } from "@vercel/analytics/next"


document.addEventListener("DOMContentLoaded", () => {
    const themeToggle = document.getElementById("theme-toggle");
    const navLinksContainer = document.querySelector(".nav-links");
    const menuToggle = document.createElement("button");
    const body = document.body;

    // Add mobile navigation toggle button
    menuToggle.classList.add("menu-toggle");
    menuToggle.setAttribute("aria-label", "Toggle navigation menu");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.innerHTML = "<i class='fas fa-bars'></i>";
    
    const navElement = document.querySelector("header .container nav");
    if (navElement) {
        // Prepend to nav, so it appears before UL but still within the nav landmark
        navElement.prepend(menuToggle); 
    } else {
        // Fallback if nav structure is different, place it near the links
        navLinksContainer.parentElement.insertBefore(menuToggle, navLinksContainer);
    }
    
    menuToggle.addEventListener("click", () => {
        navLinksContainer.classList.toggle("visible");
        menuToggle.classList.toggle("open");
        const isExpanded = navLinksContainer.classList.contains("visible");
        menuToggle.setAttribute("aria-expanded", isExpanded.toString());

        if (menuToggle.classList.contains("open")) {
            menuToggle.innerHTML = "<i class='fas fa-times'></i>";
        } else {
            menuToggle.innerHTML = "<i class='fas fa-bars'></i>";
        }
    });

    // Apply theme from localStorage
    const currentTheme = localStorage.getItem("theme");
    if (currentTheme) {
        body.classList.add(currentTheme);
        if (currentTheme === "dark") {
            themeToggle.checked = true;
        }
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        // Optional: Set default theme based on OS preference if no localStorage theme
        body.classList.add("dark");
        themeToggle.checked = true;
        localStorage.setItem("theme", "dark");
    }


    themeToggle.addEventListener("change", () => {
        if (themeToggle.checked) {
            body.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            body.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    });

    // Smooth scrolling and active link highlighting
    const navLinks = document.querySelectorAll(".nav-item");
    const sections = document.querySelectorAll("main section[id]");

    function changeActiveLink() {
        let index = sections.length;

        while(--index && window.scrollY + 100 < sections[index].offsetTop) {} // 100 is an offset
        
        navLinks.forEach((link) => link.classList.remove("active"));
        // Ensure the link exists before trying to add 'active' class
        if (sections[index]) {
            const activeLink = document.querySelector(`.nav-item[href="#${sections[index].id}"]`);
            if (activeLink) {
                activeLink.classList.add("active");
            }
        }
    }

    // Initial call if page loaded on a section
    if (sections.length > 0) {
        changeActiveLink();
    }
    window.addEventListener("scroll", changeActiveLink);


    navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            const targetId = link.getAttribute("href");

            if (targetId && targetId.startsWith("#")) {
                e.preventDefault();
                const targetElement = document.getElementById(targetId.substring(1));
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: "smooth" });
                }
                // Close mobile menu after click
                if (navLinksContainer.classList.contains("visible")) {
                    navLinksContainer.classList.remove("visible");
                    menuToggle.classList.remove("open");
                    menuToggle.setAttribute("aria-expanded", "false");
                    menuToggle.innerHTML = "<i class='fas fa-bars'></i>";
                }
            }
            // If it's a full URL (not starting with #), default behavior will handle it
        });
    });

    // Update copyright year dynamically
    const copyrightElement = document.getElementById("copyright");
    if (copyrightElement) {
        const currentYear = new Date().getFullYear();
        copyrightElement.textContent = copyrightElement.textContent.replace(/© \d{4}/, `© ${currentYear}`);
    }
});
