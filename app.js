// Register Global GSAP Plugins
gsap.registerPlugin(ScrollTrigger);

// ==========================================
// 1. LIFECYCLE COVER ENTRY INITIALIZATION
// ==========================================
window.addEventListener('DOMContentLoaded', () => {
    // Gracefully transition landing cover text elements into view on launch
    gsap.to(".init-fade", { 
        opacity: 1, 
        y: 0, 
        duration: 1.2, 
        stagger: 0.25, 
        ease: "power3.out" 
    });
});

// ==========================================
// 2. COUNTDOWN TIMER ENGINE CONFIGURATION
// ==========================================
const targetDate = new Date("May 2, 2026 00:00:00").getTime();

const countdownInterval = setInterval(() => {
    const now = new Date().getTime();
    const timeRemaining = targetDate - now;

    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

    document.getElementById("days").innerText = days < 10 ? "0" + days : days;
    document.getElementById("hours").innerText = hours < 10 ? "0" + hours : hours;
    document.getElementById("minutes").innerText = minutes < 10 ? "0" + minutes : minutes;
    document.getElementById("seconds").innerText = seconds < 10 ? "0" + seconds : seconds;

    if (timeRemaining <= 0) {
        clearInterval(countdownInterval);
        const openBtn = document.getElementById("open-gift-btn");
        openBtn.removeAttribute("disabled");
        openBtn.innerText = "Open Your Gift 💖";
        openBtn.className = "bg-gradient-to-r from-rose-500 to-pink-600 text-white font-medium px-8 py-3.5 rounded-full shadow-lg cursor-pointer animate-pulse";
    }
}, 1000);

// DEV OVERRIDE MODE: Keeps it unlocked for testing locally right now
document.getElementById("open-gift-btn").removeAttribute("disabled");

// ==========================================
// 3. TIMELINE MEMORIES DATA MATRIX ARRAY
// ==========================================
const myMemoryGallery = [
    { src: "images/image1.jpg", title: "I'm the Best One", subtitle: "~ Our First Real Trip Together", x: -280, y: -140, reaction: "Oh wow, I remember how hard it was to take this! 😂" },
    { src: "images/image2.jpg", title: "Meeting Deckard", subtitle: "~ Vegas Date Night Stand-off", x: 300, y: -220, reaction: "You looked so completely handsome this night! 🥰" },
    { src: "images/image3.jpg", title: "A Child Was Born", subtitle: "~ Discovering Absolute Happiness", x: -320, y: 160, reaction: "Look at us! We look like babies here! 🥺❤️" },
    { src: "images/image4.jpg", title: "Joi's Billboard", subtitle: "~ The Harsh Reality of Long Distance", x: 280, y: 100, reaction: "I miss hugging you so much looking at this. 💕" },
    { src: "images/image5.jpg", title: "Drowning Bottle", subtitle: "~ K vs Luv Climax Date", x: -250, y: -260, reaction: "We ate so much good food right after this! 🍕" },
    { src: "images/image6.jpg", title: "Pale Fire Rhythm", subtitle: "~ Synchronizing Our Hearts Forever", x: 320, y: -80, reaction: "My absolute favorite memory of us. Period. 👩‍❤️‍👨" },
    { src: "images/image7.jpg", title: "Sea Wall Drift", subtitle: "~ Fighting Through Everything", x: -200, y: -40, reaction: "No matter what happens, I choose you every single time." }
];

// ==========================================
// 4. MOTION ROUTER SETUP TRIGGER
// ==========================================
document.getElementById('open-gift-btn').addEventListener('click', () => {
    confetti({ particleCount: 60, spread: 50, origin: { y: 0.6 } });

    document.getElementById('main-content').classList.remove('hidden');
    setTimeout(() => { 
        document.getElementById('main-content').classList.remove('opacity-0'); 
        document.getElementById('character-guide').classList.remove('opacity-0');
        initEngineEffects();
        ScrollTrigger.refresh();
    }, 100);

    setTimeout(() => {
        document.getElementById('proposal').scrollIntoView({ behavior: 'smooth' });
    }, 400);
});

function initEngineEffects() {
    // Proposal Section Fade-in text animation
    gsap.from(".proposal-animate", {
        scrollTrigger: { trigger: "#proposal", start: "top 70%" },
        opacity: 0, y: 30, duration: 1, stagger: 0.2
    });

    const stage3D = document.getElementById('gallery-3d');
    const headerTitle = document.getElementById('active-title');
    const headerSubtitle = document.getElementById('active-subtitle');
    const bgBlurImage = document.getElementById('tunnel-bg-blur');
    const bubble = document.getElementById('char-bubble');

    if (stage3D) {
        stage3D.innerHTML = ""; // Clear safe sandbox pool content out

        myMemoryGallery.forEach((photo, index) => {
            const card = document.createElement('div');
            card.className = "photo-card-3d w-64 h-80 md:w-72 md:h-96 bg-white p-3 pb-12 shadow-2xl rounded-xs border border-slate-100 cursor-pointer";
            card.innerHTML = `
                <div class="w-full h-full bg-slate-900 overflow-hidden rounded-xs">
                    <img src="${photo.src}" class="w-full h-full object-cover block">
                </div>
                <p class="font-serif italic text-slate-700 text-sm mt-3 text-center">${photo.title}</p>
            `;
            stage3D.appendChild(card);

            // Compute staggered distance depths natively
            const startZ = index * -650; 

            gsap.set(card, {
                x: photo.x,
                y: photo.y,
                z: startZ + "px",
                opacity: 0
            });

            // Bind depth displacement animation right to scroll scrubbing
            gsap.to(card, {
                scrollTrigger: {
                    trigger: "#perspective-stage",
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 0.2
                },
                z: (startZ + 2200) + "px", // Pushes the images past the lens view plane border
                
                modifiers: {
                    opacity: (value, target) => {
                        // 🌟 THE BULLETPROOF FIX: Native Hardware computed 3D matrix extraction parser
                        const computedStyle = window.getComputedStyle(target);
                        const matrix = computedStyle.transform || computedStyle.webkitTransform;
                        let currentZ = startZ; // Dynamic calculation fallback baseline

                        if (matrix && matrix !== 'none') {
                            const matrixValues = matrix.split('(')[1].split(')')[0].split(',');
                            // Check for 3D Matrix configurations array length (16 elements layout matrix)
                            if (matrixValues.length === 16) {
                                currentZ = parseFloat(matrixValues[14]); // Index index position 14 holds true computed Z depth values
                            }
                        }

                        // Background Depth foggy visibility range maps
                        if (currentZ < -1300) return 0; // Keeping ultra deep background elements hidden
                        if (currentZ >= -1300 && currentZ < -600) {
                            return gsap.utils.mapRange(-1300, -600, 0, 1, currentZ); // Silk-smooth materialization fade in
                        }
                        if (currentZ > 350) {
                            return gsap.utils.mapRange(350, 700, 1, 0, currentZ); // Smooth exit fade out right before clipping views
                        }
                        return 1; // Complete solid opacity rendering sweet-spot focus area
                    }
                }
            });

            // Sync frame click events to her character guide box updates
            card.addEventListener('click', () => {
                if (bubble) {
                    bubble.innerText = photo.reaction;
                    gsap.to("#char-bubble", { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(1.5)" });
                    gsap.to("#interactive-char", { y: -15, duration: 0.12, yoyo: true, repeat: 1 });
                }
            });
        });

        // ==========================================
        // DYNAMIC CAPTION TEXT & BACKDROP CROSSFADER
        // ==========================================
        ScrollTrigger.create({
            trigger: "#perspective-stage",
            start: "top top",
            end: "bottom bottom",
            scrub: true,
            onUpdate: (self) => {
                const progress = self.progress;
                const targetIndex = Math.min(
                    myMemoryGallery.length - 1,
                    Math.floor(progress * myMemoryGallery.length)
                );
                
                const activePhoto = myMemoryGallery[targetIndex];
                
                if (headerTitle.innerText !== activePhoto.title) {
                    // Smoothly shift backdrop ambient tracking image view source
                    if (bgBlurImage) {
                        bgBlurImage.src = activePhoto.src;
                    }

                    // Perform typography flash transitions updates
                    gsap.to([headerTitle, headerSubtitle], { opacity: 0, y: -5, duration: 0.15, onComplete: () => {
                        headerTitle.innerText = activePhoto.title;
                        headerSubtitle.innerText = activePhoto.subtitle;
                        gsap.to([headerTitle, headerSubtitle], { opacity: 1, y: 0, duration: 0.2 });
                    }});
                }
            }
        });
    }

    // ==========================================
    // 5. DESTINATION CLIMAX SHOWER EXPLOSION
    // ==========================================
    let hasClimaxFired = false;
    ScrollTrigger.create({
        trigger: "#anniversary-climax",
        start: "top 30%",
        onEnter: () => {
            if (!hasClimaxFired) {
                hasClimaxFired = true;
                
                const end = Date.now() + (3.5 * 1000); 
                (function heartShower() {
                    confetti({ particleCount: 6, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#f43f5e', '#ec4899', '#fda4af'] });
                    confetti({ particleCount: 6, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#f43f5e', '#ec4899', '#fda4af'] });
                    if (Date.now() < end) requestAnimationFrame(heartShower);
                }());
            }
        },
        onLeaveBack: () => { hasClimaxFired = false; }
    });

    // Bento Grid Parallax Mouse Tilting
    const bentoElements = gsap.utils.toArray('.tilt-element');
    bentoElements.forEach((box) => {
        box.addEventListener('mousemove', (e) => {
            const rect = box.getBoundingClientRect();
            const x = e.clientX - rect.left - (rect.width / 2);
            const y = e.clientY - rect.top - (rect.height / 2);
            gsap.to(box, { rotationY: x * 0.04, rotationX: -y * 0.04, transformPerspective: 600, ease: "power1.out", duration: 0.3 });
        });
        box.addEventListener('mouseleave', () => {
            gsap.to(box, { rotationY: 0, rotationX: 0, duration: 0.5, ease: "power2.out" });
        });
    });

    // Love Letter Reveal Trigger
    gsap.to(".letter-animate", {
        scrollTrigger: { trigger: "#letter", start: "top 75%" },
        opacity: 1, y: 0, duration: 1.2
    });
}