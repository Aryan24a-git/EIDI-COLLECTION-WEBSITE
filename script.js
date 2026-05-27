document.addEventListener("DOMContentLoaded", () => {
    
    // --- Slider Logic ---
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    let currentSlide = 0;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            if (i === index) slide.classList.add('active');
            else slide.classList.remove('active');
        });
    }

    prevBtn.addEventListener('click', () => {
        currentSlide = (currentSlide > 0) ? currentSlide - 1 : slides.length - 1;
        showSlide(currentSlide);
    });

    nextBtn.addEventListener('click', () => {
        currentSlide = (currentSlide < slides.length - 1) ? currentSlide + 1 : 0;
        showSlide(currentSlide);
    });

    const sendEidiBtn = document.querySelector('.send-eidi-btn');
    if (sendEidiBtn) {
        sendEidiBtn.addEventListener('click', () => {
            currentSlide = 2; // Section 3
            showSlide(currentSlide);
        });
    }

    // --- Audio Logic & Modal Consent ---
    const bgMusic = document.getElementById("bg-music");
    const soundBtn = document.getElementById("sound-btn");
    const musicModal = document.getElementById("music-modal");
    const musicYesBtn = document.getElementById("music-yes-btn");
    const musicNoBtn = document.getElementById("music-no-btn");
    let isPlaying = false;

    // Helper to close modal
    function closeModal() {
        if (musicModal) {
            musicModal.classList.add("fade-out");
            setTimeout(() => {
                musicModal.style.display = "none";
            }, 500);
        }
    }

    // Modal YES Button (Play Music)
    if (musicYesBtn) {
        musicYesBtn.addEventListener("click", () => {
            bgMusic.play().then(() => {
                isPlaying = true;
                soundBtn.innerHTML = '🔇 Turn Off Sound';
            }).catch(err => {
                console.log("Audio play blocked even after user gesture: ", err);
            });
            closeModal();
        });
    }

    // Modal NO Button (Keep Silent)
    if (musicNoBtn) {
        musicNoBtn.addEventListener("click", () => {
            isPlaying = false;
            soundBtn.innerHTML = '🔊 Turn On Sound';
            closeModal();
        });
    }

    soundBtn.addEventListener("click", () => {
        if (isPlaying) {
            bgMusic.pause();
            soundBtn.innerHTML = '🔊 Turn On Sound';
            isPlaying = false;
        } else {
            bgMusic.play().then(() => {
                isPlaying = true;
                soundBtn.innerHTML = '🔇 Turn Off Sound';
            }).catch(err => {
                console.log("Playback failed: ", err);
            });
        }
    });

    // --- Dynamic Progress Bar (Section 3) ---
    const TOTAL_EIDI_GOAL = 49990;
    let currentEidiCollected = 4670; 
    const goalFill = document.getElementById("goal-progress-fill");
    const mainFill = document.getElementById("main-progress-fill");
    const goalPercentText = document.getElementById("goal-percent-text");
    const amountText = document.getElementById("amount-text");
    const totalReceivedText = document.getElementById("total-received-text");

    function updateProgress() {
        let percentage = (currentEidiCollected / TOTAL_EIDI_GOAL) * 100;
        if (percentage > 100) percentage = 100;
        const formattedCurrent = currentEidiCollected.toLocaleString('en-IN');
        const formattedGoal = TOTAL_EIDI_GOAL.toLocaleString('en-IN');
        
        setTimeout(() => {
            goalFill.style.width = `${percentage}%`;
            mainFill.style.width = `${percentage}%`;
        }, 500);

        goalPercentText.innerText = `${Math.round(percentage)}%`;
        amountText.innerText = `₹${formattedCurrent} / ₹${formattedGoal}`;
        totalReceivedText.innerText = `₹${formattedCurrent}`;
    }
    updateProgress();

    // --- Reactions & Toasts ---
    const toastMessages = {
        default: ['Mashallah! ✨', 'May Allah bless you! 💚', 'Eid Mubarak! 🌙', 'So sweet of you! ❤️'],
        cute: ['Aww so cute na! 🥺', 'The sheep says shukria! 🐑'],
        qr: ['Section 3 mein QR hai habibi 👀💸', 'Click Next button... 😏'],
        goat: ['🐐 GOAT APPROVED! The official Eid mascot blesses you!'],
        masha: ['Mashallah! May Allah bless you abundantly! ✨🌙'],
        broke: ['Haha same energy 😂 but check next section anyway!']
    };

    function showToast(msg) {
        const toast = document.getElementById('toast');
        toast.textContent = msg;
        toast.style.transform = 'translateX(-50%) translateY(0)';
        clearTimeout(window._toastTimer);
        window._toastTimer = setTimeout(() => {
            toast.style.transform = 'translateX(-50%) translateY(100px)';
        }, 3500);
    }

    function createFloatingEmoji(emoji, btn) {
        const el = document.createElement('div');
        el.className = 'floating-reaction-emoji';
        el.textContent = emoji;

        const rect = btn.getBoundingClientRect();
        const slide = document.getElementById('slide-1');
        const slideRect = slide.getBoundingClientRect();

        // Calculate position relative to Slide 1
        const left = rect.left - slideRect.left + rect.width / 2;
        const top = rect.top - slideRect.top;

        el.style.left = `${left}px`;
        el.style.top = `${top}px`;

        const offsetX = (Math.random() - 0.5) * 40;
        el.style.setProperty('--offset-x', `${offsetX}px`);
        el.style.fontSize = `${20 + Math.random() * 16}px`;

        slide.appendChild(el);

        setTimeout(() => {
            if (el.parentNode) el.parentNode.removeChild(el);
        }, 2000);
    }

    document.querySelectorAll('.react-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const type = btn.getAttribute('data-type');
            const emoji = btn.querySelector('.emoji').textContent;
            let msgs = Object.prototype.hasOwnProperty.call(toastMessages, type) ? toastMessages[type] : toastMessages.default;
            const msg = msgs[Math.floor(Math.random() * msgs.length)];
            showToast(emoji + ' ' + msg);

            createFloatingEmoji(emoji, btn);

            btn.style.transform = 'scale(1.3) translateY(-12px)';
            setTimeout(() => btn.style.transform = '', 400);
        });
    });

    document.querySelectorAll('.option-card').forEach(card => {
        card.addEventListener('click', () => {
            const type = card.getAttribute('data-type');
            const msgs = {
                eidi: '💸 Jazakallah! May Allah bless you! Go to Next Slide for QR! 🎉',
                broke: '😭 Even ₹10 builds character habibi! But the QR is still there... 👀',
                negotiate: '🤝 Discount not available! But installments accepted 😂',
                dua: '🙏 Dua accepted! Check Section 3 below My Dua! ❤️'
            };
            showToast(Object.prototype.hasOwnProperty.call(msgs, type) ? msgs[type] : '❤️ Eid Mubarak!');

            if (type === 'dua') {
                const box = document.getElementById('dua-accepted-box');
                if (box) {
                    box.classList.add('highlight-glow');
                    setTimeout(() => {
                        box.classList.remove('highlight-glow');
                    }, 4000);
                }
            }
        });
    });

    // --- Star Canvas ---
    const canvas = document.getElementById('starCanvas');
    const ctx = canvas.getContext('2d');
    let stars = [];
    let W, H;
    function resize() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
        stars = [];
        const count = Math.floor(W * H / 8000);
        for (let i = 0; i < count; i++) {
            stars.push({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.8 + 0.3, a: Math.random(), speed: Math.random() * 0.02 + 0.005, phase: Math.random() * Math.PI * 2 });
        }
    }
    function drawStars(t) {
        ctx.clearRect(0, 0, W, H);
        stars.forEach(s => {
            const a = (Math.sin(t * s.speed + s.phase) * 0.5 + 0.5) * 0.8 + 0.2;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,240,180,${a})`;
            ctx.fill();
        });
        requestAnimationFrame(drawStars);
    }
    window.addEventListener('resize', resize);
    resize();
    drawStars(0);

    // --- SVG String Lights (Section 1) ---
    const bulbs = document.querySelectorAll('.bulb');
    let bt = 0;
    function animBulbs() {
        bt += 0.05;
        bulbs.forEach((b, i) => {
            const bright = (Math.sin(bt + i * 0.5) * 0.3 + 0.7);
            b.style.opacity = bright;
        });
        requestAnimationFrame(animBulbs);
    }
    animBulbs();

    // --- Money Rain (Section 2) ---
    const moneyCanvas2 = document.getElementById('moneyCanvas');
    if (moneyCanvas2) {
        const ctx2 = moneyCanvas2.getContext('2d');
        let bills2 = [];
        let w2, h2;
        function resize2() { w2 = moneyCanvas2.width = moneyCanvas2.offsetWidth; h2 = moneyCanvas2.height = moneyCanvas2.offsetHeight; }
        function createBill2() { return { x: Math.random() * w2, y: -60, w: 50 + Math.random() * 20, h: 25, speed: 0.5 + Math.random() * 0.8, rot: (Math.random() - 0.5) * 0.4, angle: (Math.random() - 0.5) * 0.3, opacity: 0.7 + Math.random() * 0.3, color: Math.random() > 0.5 ? '#4CAF50' : '#2a8a1a' }; }
        function drawBill2(b) {
            ctx2.save(); ctx2.translate(b.x + b.w/2, b.y + b.h/2); ctx2.rotate(b.angle); ctx2.globalAlpha = b.opacity;
            ctx2.fillStyle = b.color; ctx2.beginPath(); ctx2.roundRect(-b.w/2, -b.h/2, b.w, b.h, 3); ctx2.fill();
            ctx2.strokeStyle = 'rgba(255,255,255,0.3)'; ctx2.stroke();
            ctx2.fillStyle = 'rgba(255,255,255,0.8)'; ctx2.font = `bold ${b.h*0.6}px serif`; ctx2.textAlign = 'center'; ctx2.textBaseline = 'middle'; ctx2.fillText('$', 0, 0);
            ctx2.restore();
        }
        let fc2 = 0;
        function animate2() {
            if(currentSlide === 1) { // Only animate when active
                ctx2.clearRect(0, 0, w2, h2);
                fc2++;
                if (fc2 % 30 === 0) bills2.push(createBill2());
                if (bills2.length > 20) bills2.shift();
                bills2.forEach(b => { b.y += b.speed; b.angle += b.rot * 0.01; if (b.y > h2 + 80) b.y = -60; drawBill2(b); });
            }
            requestAnimationFrame(animate2);
        }
        window.addEventListener('resize', resize2);
        resize2();
        animate2();
    }

    // --- Money Rain (Section 3 - Targeted) ---
    const moneyCanvas3 = document.getElementById('moneyCanvas3');
    if (moneyCanvas3) {
        const ctx3 = moneyCanvas3.getContext('2d');
        let bills3 = [];
        let w3, h3;
        function resize3() { w3 = moneyCanvas3.width = moneyCanvas3.offsetWidth; h3 = moneyCanvas3.height = moneyCanvas3.offsetHeight; }
        function createBill3() { return { x: w3 * 0.65 + Math.random() * w3 * 0.35, y: -60, w: 40 + Math.random() * 18, h: 22, speed: 0.4 + Math.random() * 0.6, rot: (Math.random() - 0.5) * 0.3, angle: (Math.random() - 0.5) * 0.3, opacity: 0.6 + Math.random() * 0.3, wobble: Math.random() * Math.PI * 2, wobbleSpeed: 0.03 + Math.random() * 0.02 }; }
        function drawBill3(b) {
            ctx3.save(); ctx3.translate(b.x + Math.sin(b.wobble) * 8 + b.w/2, b.y + b.h/2); ctx3.rotate(b.angle); ctx3.globalAlpha = b.opacity;
            ctx3.fillStyle = '#2d7a1a'; ctx3.beginPath(); ctx3.roundRect(-b.w/2, -b.h/2, b.w, b.h, 3); ctx3.fill();
            ctx3.fillStyle = 'rgba(255,255,200,0.9)'; ctx3.font = `bold ${b.h*0.55}px serif`; ctx3.textAlign = 'center'; ctx3.textBaseline = 'middle'; ctx3.fillText('₹', 0, 1);
            ctx3.restore();
        }
        let fc3 = 0;
        function animate3() {
            if(currentSlide === 2) {
                ctx3.clearRect(0, 0, w3, h3);
                fc3++;
                if (fc3 % 45 === 0) bills3.push(createBill3());
                if (bills3.length > 12) bills3.shift();
                bills3.forEach(b => { b.y += b.speed; b.angle += b.rot * 0.008; b.wobble += b.wobbleSpeed * 0.6; drawBill3(b); });
            }
            requestAnimationFrame(animate3);
        }
        window.addEventListener('resize', resize3);
        resize3();
        animate3();
    }

    // --- Fake QR Code Canvas ---
    const qrCanvas = document.getElementById('qrCanvas');
    if (qrCanvas) {
        const qctx = qrCanvas.getContext('2d');
        const sz = 170; const cells = 21; const cell = sz / cells;
        function seeded(i, j) { return ((i * 31 + j * 17 + i*j) % 7) < 3; }
        qctx.fillStyle = 'white'; qctx.fillRect(0, 0, sz, sz);
        for (let i = 0; i < cells; i++) {
            for (let j = 0; j < cells; j++) {
                const inCorner = (i < 7 && j < 7) || (i < 7 && j >= cells-7) || (i >= cells-7 && j < 7);
                if (inCorner) {
                    const ci = i < 7 ? i : (i >= cells-7 ? i-(cells-7) : i);
                    const cj = j < 7 ? j : (j >= cells-7 ? j-(cells-7) : j);
                    if (ci === 0 || ci === 6 || cj === 0 || cj === 6) qctx.fillStyle = '#111';
                    else if (ci >= 2 && ci <= 4 && cj >= 2 && cj <= 4) qctx.fillStyle = '#111';
                    else qctx.fillStyle = 'white';
                } else if (seeded(i, j)) qctx.fillStyle = '#111';
                else qctx.fillStyle = 'white';
                qctx.fillRect(j * cell + 2, i * cell + 2, cell - 1, cell - 1);
            }
        }
        qctx.fillStyle = 'white'; qctx.fillRect(sz/2 - 18, sz/2 - 18, 36, 36);
        qctx.fillStyle = '#1A5C30'; qctx.font = 'bold 22px serif'; qctx.textAlign = 'center'; qctx.textBaseline = 'middle'; qctx.fillText('☪', sz/2, sz/2 + 1);
    }

    // --- Sparkles (Section 3) ---
    const s3 = document.getElementById('sparkle-container');
    if (s3) {
        let sparkles = [];
        setInterval(() => {
            if(currentSlide !== 2) return;
            const el = document.createElement('div');
            el.className = 'sparkle';
            el.textContent = ['✨','⭐','🌟','💫'].at(Math.floor(Math.random()*4));
            el.style.left = (Math.random() * 100) + '%';
            el.style.top = (10 + Math.random() * 80) + '%';
            el.style.animationDuration = (3 + Math.random() * 4) + 's';
            s3.appendChild(el);
            sparkles.push(el);
            if (sparkles.length > 20) {
                const old = sparkles.shift();
                if(old.parentNode) old.parentNode.removeChild(old);
            }
        }, 600);
    }

    // --- Tears Generator (Section 2) ---
    const tearsContainer = document.getElementById('tears-container');
    if (tearsContainer) {
        setInterval(() => {
            if(currentSlide !== 1) return;
            const tear = document.createElement('div');
            tear.classList.add('tear');
            const isLeftEye = Math.random() > 0.5;
            tear.style.left = isLeftEye ? (20 + Math.random() * 10) + '%' : (70 + Math.random() * 10) + '%';
            tear.style.animationDuration = (1 + Math.random()) + 's';
            tearsContainer.appendChild(tear);
            setTimeout(() => { if(tear.parentNode) tear.parentNode.removeChild(tear); }, 1500);
        }, 600);
    }

    // --- Confetti (Section 1) ---
    const confettiContainer = document.getElementById('confetti-container');
    if (confettiContainer) {
        const colors = ['#FFD700','#FF6B6B','#66FF99','#66CCFF','#FF99FF','#FFE066'];
        const shapes = ['★','♦','●','▲'];
        for (let i = 0; i < 18; i++) {
            const el = document.createElement('div');
            el.className = 'confetti';
            el.textContent = shapes.at(Math.floor(Math.random() * shapes.length));
            el.style.cssText = `left: ${Math.random() * 100}%; top: ${Math.random() * 100}%; color: ${colors.at(Math.floor(Math.random() * colors.length))}; font-size: ${8 + Math.random() * 12}px; animation: confettiFloat ${4 + Math.random() * 4}s ease-in-out ${Math.random() * 4}s infinite alternate; opacity: ${0.4 + Math.random() * 0.5};`;
            confettiContainer.appendChild(el);
        }
        if (!document.getElementById('confettiStyle')) {
            const style = document.createElement('style');
            style.id = 'confettiStyle';
            style.textContent = `@keyframes confettiFloat { from { transform: translateY(0) rotate(0deg); } to { transform: translateY(-30px) rotate(180deg); } }`;
            document.head.appendChild(style);
        }
    }
});
