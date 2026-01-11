// Initialize Lucide Icons
lucide.createIcons();

// Mouse Tracking Logic for Glow Effect
document.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.glow-effect');
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});

// Intersection Observer for Scroll Animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            // Optional: Stop observing once visible to run only once
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.reveal-on-scroll').forEach((element) => {
        observer.observe(element);
    });

    // --- 2. Decryption Text Effect Logic ---
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
    document.querySelectorAll('.decrypt-text').forEach(item => {
        let interval = null;
        item.addEventListener('mouseover', event => {
            let iteration = 0;
            clearInterval(interval);

            interval = setInterval(() => {
                event.target.innerText = event.target.innerText
                    .split("")
                    .map((letter, index) => {
                        if (index < iteration) {
                            return event.target.dataset.value[index];
                        }
                        return letters[Math.floor(Math.random() * 26)];
                    })
                    .join("");

                if (iteration >= event.target.dataset.value.length) {
                    clearInterval(interval);
                }

                iteration += 1 / 3;
            }, 30);
        });
    });

    // --- 3. Holographic 3D Tilt Logic ---
    document.querySelectorAll('.glow-effect').forEach(card => {
        // Add necessary classes for 3D context
        card.classList.add('tilt-card');

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Calculate rotation based on cursor position
            // Middle is 0,0
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -5; // Max 5 deg tilt
            const rotateY = ((x - centerX) / centerX) * 5;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });

    // --- 4. AI Terminal Typing Logic ---
    const terminal = document.getElementById('ai-terminal');
    const messages = [
        "Initializing Neural Core...",
        "Loading Data Modules...",
        "Optimizing Algorithms...",
        "Scanning for Threats...",
        "System Secure.",
        "Workflow Active."
    ];
    let msgIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeTerminal() {
        if (!terminal) return;
        const currentMsg = messages[msgIndex];

        if (isDeleting) {
            terminal.innerText = currentMsg.substring(0, charIndex - 1);
            charIndex--;
        } else {
            terminal.innerText = currentMsg.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = 50;

        if (!isDeleting && charIndex === currentMsg.length) {
            typeSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            msgIndex = (msgIndex + 1) % messages.length;
            typeSpeed = 500;
        }

        setTimeout(typeTerminal, typeSpeed);
    }


    // Start the typing loop
    typeTerminal();



    // --- 6. Neural Particle Background Logic ---
    const canvas = document.getElementById('neural-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];
        const particleCount = 60; // Adjust density
        const connectionDistance = 150;

        function resize() {
            width = canvas.width = canvas.offsetWidth;
            height = canvas.height = canvas.offsetHeight;
        }

        window.addEventListener('resize', resize);
        resize();

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 2 + 1;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(249, 115, 22, 0.5)'; // Orange
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, width, height);

            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();

                for (let j = i; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.hypot(dx, dy);

                    if (distance < connectionDistance) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(249, 115, 22, ${0.1 * (1 - distance / connectionDistance)})`;
                        ctx.lineWidth = 1;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animateParticles);
        }

        initParticles();
        animateParticles();
    }
});

// --- 7. Force Scroll to Top on Refresh ---
if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
}
window.onload = function () {
    window.scrollTo(0, 0);
};

// Preloader Logic
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
        }, 500);
    }
});

// --- Mobile Menu Logic ---
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

function toggleMobileMenu() {
    if (mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.remove('hidden');
        mobileMenuBtn.innerHTML = '<i data-lucide="x" class="w-6 h-6"></i>';
    } else {
        mobileMenu.classList.add('hidden');
        mobileMenuBtn.innerHTML = '<i data-lucide="menu" class="w-6 h-6"></i>';
    }
    lucide.createIcons();
}

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
}

// Cookie Banner Logic
const cookieBanner = document.getElementById('cookie-banner');
if (cookieBanner && !localStorage.getItem('cookiesAccepted')) {
    setTimeout(() => {
        cookieBanner.classList.add('show');
    }, 2000); // Delay appearance
}

function acceptCookies() {
    const banner = document.getElementById('cookie-banner');
    if (banner) banner.classList.remove('show');
    localStorage.setItem('cookiesAccepted', 'true');
}

// --- Contact Form AJAX Logic ---
const form = document.getElementById('contact-form');

if (form) {
    form.addEventListener("submit", async function (event) {
        event.preventDefault();
        const status = document.getElementById("form-status");
        const submitBtn = document.getElementById("submit-btn");
        const originalBtnText = submitBtn.innerText;
        const data = new FormData(event.target);

        submitBtn.disabled = true;
        submitBtn.innerText = "Sending...";

        fetch(event.target.action, {
            method: form.method,
            body: data,
            headers: {
                'Accept': 'application/json'
            }
        }).then(response => {
            if (response.ok) {
                form.classList.add('hidden');
                status.classList.remove('hidden');
                status.classList.add('block'); // Ensure it displays

                // Re-initialize icons if the success message has them (it does)
                lucide.createIcons();

                form.reset();
            } else {
                response.json().then(data => {
                    if (Object.hasOwn(data, 'errors')) {
                        alert(data["errors"].map(error => error["message"]).join(", "));
                    } else {
                        alert("Oops! There was a problem submitting your form");
                    }
                })
            }
        }).catch(error => {
            alert("Oops! There was a problem submitting your form");
        }).finally(() => {
            submitBtn.disabled = false;
            submitBtn.innerText = originalBtnText;
        });
    });
}

// --- Smooth Scroll without URL Hash Update ---
// --- Smooth Scroll without URL Hash Update ---
document.querySelectorAll('a[href^="#"], a[data-scroll-to]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.dataset.scrollTo || this.getAttribute('href').substring(1);
        if (!targetId) return; // ignore empty hash or top

        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Update mobile menu if needed
            if (typeof mobileMenu !== 'undefined' && mobileMenu && !mobileMenu.classList.contains('hidden')) {
                toggleMobileMenu();
            }
        }
    });
});
