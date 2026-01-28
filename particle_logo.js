/**
 * Particle Assembly Effect - Ultra Refined v3 (Wavy & Sparse)
 * Creative Developer: Antigravity
 */

const LOGO_BASE64 = `PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNDguMjggMTQ4LjU0Ij48cGF0aCBmaWxsPSIjZmYzYzAxIiBkPSJNMTQ2LjY4LDY3LjY3Yy0uNjUtLjc4LTEuNDYtMS40My0yLjM3LTEuODUtLjM2LS4xNi0uNzItLjI5LTEuMDQtLjQ2LS4wMywwLS4wNy0uMDMtLjEtLjAzLTkuNTMtMy45LTE4LjM3LTkuMS0yNi4zNC0xNS4zOC02LjgzLTUuNDMtMTMuMDEtMTEuNjEtMTguNDQtMTguNDQtNi4yOC03Ljk3LTExLjQ4LTE2LjgxLTE1LjM4LTI2LjM0LS4wMy0uMDMtLjAzLS4wNy0uMDMtLjA3LS4xNi0uMzYtLjI5LS43Mi0uNDYtMS4wNywwLS4xLS4wNi0uMTYtLjEtLjIzLS40Ni0uODUtMS4wNC0xLjU2LTEuNzYtMi4xNS0xLjI3LTEuMDQtMi44OS0xLjY2LTQuNjItMS42NmgtMy45M2MtMS43MiwwLTMuMzUuNjItNC41OCwxLjY2LS42OC41NS0xLjI0LDEuMi0xLjY5LDEuOTUtLjAzLjA2LS4wNy4xMy0uMS4yLS4xOS41Mi0uMzksMS4wNC0uNjIsMS41My0zLjksOS40Ni05LjEsMTguMjQtMTUuMzIsMjYuMTgtNS40Myw2LjgzLTExLjQ0LDEzLjA0LTE4LjQ3LDE4LjQ3LTcuOTcsNi4yNC0xNi44MSwxMS40NS0yNi4zNCwxNS4zOC0uMjkuMS0uNTUuMi0uODEuMzNoLS4wM2MtMS4wMS40Ni0xLjg5LDEuMTQtMi41NywxLjk4LS45OCwxLjItMS41OSwyLjc2LTEuNTksNC40NXY0LjIzYzAsMS42OS42MiwzLjI1LDEuNTksNC40NS42OC44NSwxLjU2LDEuNTMsMi41NywxLjk4LjI2LjEzLjU1LjIzLjg1LjMzLDkuNTMsMy45MywxOC4zNyw5LjE0LDI2LjM0LDE1LjM4LDYuODMsNS40MywxMy4wNCwxMS42NCwxOC40NywxOC40Nyw2LjIxLDcuOSwxMS4zOCwxNi42OCwxNS4zMiwyNi4xMS4yMy41OS40OSwxLjIuNzIsMS43OXYuMDNjLjQ2Ljc1LDEuMDEsMS40MywxLjY5LDEuOTgsMS4yNywxLjA0LDIuODksMS42Niw0LjYyLDEuNjZoMy45YzEuNzIsMCwzLjM1LS42Miw0LjYyLTEuNjYuNzItLjYyLDEuMy0xLjMzLDEuNzYtMi4xOHYuMDNjLjE5LS40Mi4zNi0uODUuNTUtMS4yNywwLS4wMy4wMy0uMTAsLjAzLS4xMywzLjkzLTkuNDksOS4xNC0xOC4zNCwxNS4zOC0yNi4zMSw1LjQzLTYuODMsMTEuNjEtMTMuMDEsMTguNDQtMTguNDQsNy45Ny02LjI4LDE2LjgxLTExLjQ4LDI2LjM0LTE1LjM4LjAzLDAsLjA3LS4wMy4xLS4wMy4zMy0uMTYuNjgtLjI5LDEuMDQtLjQ2LjkxLS40MiwxLjcyLTEuMDcsMi4zNy0xLjg1Ljk4LTEuMjQsMS41OS0yLjgwLDEuNTktNC40OXYtNC4xNmMwLTEuNjktLjYyLTMuMjUtMS41OS00LjQ5Wk02Ny41NCwxMDguMmMwLDQuODQtMy45Miw4Ljc2LTguNzYsOC43NmgwYy0xLjUzLDAtMy0uNjEtNC4wOS0xLjY5bC0yMC43NC0yMC43NGMtLjc4LS41Mi0xLjQ2LTEuMi0yLjAyLTIuMDItLjIzLS4zMy0uNDItLjY4LS41OS0xLjA3LS40Mi0uOTQtLjY4LTIuMDItLjY4LTMuMTJzLjI2LTIuMTguNjgtMy4xMmMxLjE3LTIuNiwzLjc3LTQuMzksNi44My00LjM5aDIwLjZjNC44NCwwLDguNzYsMy45Miw4Ljc2LDguNzZ2MTguNjRaTTY3LjU0LDU4LjkxYzAsNC44NC0zLjkyLDguNzYtOC43Niw4Ljc2aC0yMC42Yy0zLjA2LDAtNS42Ni0xLjc5LTYuODMtNC4zOS0uNDItLjk0LS42OC0yLjAyLS42OC0zLjEycy4yNi0yLjE4LjY4LTMuMTJjLjE2LS4zOS4zNi0uNzUuNTktMS4wNy41NS0uODEsMS4yNC0xLjUsMi4wMi0yLjAybDIwLjc0LTIwLjc0YzEuMDgtMS4wOCwyLjU1LTEuNjksNC4wOS0xLjY5aDBjNC44NCwwLDguNzYsMy45Miw4Ljc2LDguNzZ2MTguNjRaTTExNi44Myw5MS4yNGMtLjI2LjYyLS42MiwxLjItMS4wMSwxLjcybC0uMS4xMy0xLjAxLDEuMDEtLjEzLjEtMjEuMDcsMjEuMDdjLTEuMDgsMS4wOC0yLjU1LDEuNjktNC4wOSwxLjY5aDBjLTQuODQsMC04Ljc2LTMuOTItOC43Ni04Ljc2di0xOC42NGMwLTQuODQsMy45Mi04Ljc2LDguNzYtOC43NmgyMC40N2MzLjEyLDAsNS43OSwxLjg5LDYuOTMsNC41OC4zNi44OC41OSwxLjg5LjU5LDIuOTNzLS4yMywyLjA1LS41OSwyLjkzWk0xMTYuODMsNjMuMDhjLTEuMTQsMi43LTMuOCw0LjU4LTYuOTMsNC41OGgtMjAuNDdjLTQuODQsMC04Ljc2LTMuOTItOC43Ni04Ljc2di0xOC42NGMwLTQuODQsMy45Mi04Ljc2LDguNzYtOC43NmgwYzEuNTMsMCwzLC42MSw0LjA5LDEuNjlsMjEuMDcsMjEuMDdjLjQyLjM2Ljg1Ljc4LDEuMjQsMS4yNC4zOS41Mi43NSwxLjExLDEuMDEsMS43Mi4zNi44OC41OSwxLjg5LjU5LDIuOTNzLS4yMywyLjA1LS41OSwyLjkzWiIvPjwvc3ZnPg==`;

class Particle {
    constructor(effect, x, y, isStatic = false) {
        this.effect = effect;
        this.x = Math.random() * this.effect.width;
        this.y = Math.random() * this.effect.height;
        this.originX = x;
        this.originY = y;
        this.color = '#ff3c01';
        this.size = this.effect.gap;
        this.vx = (Math.random() - 0.5) * 5.8; // Increased for faster dispersion
        this.vy = (Math.random() - 0.5) * 5.8; // Increased for faster dispersion
        this.ease = 0.035; // Slower aggregation (-15% from 0.042)
        this.friction = 0.8;
        this.isStatic = isStatic;

        // Jitter per contorni meno definiti (+30%: da 6 a 7.8)
        this.jitterX = (Math.random() - 0.5) * 7.8;
        this.jitterY = (Math.random() - 0.5) * 7.8;

        this.randomX = (Math.random() - 0.5) * 5.8;
        this.randomY = (Math.random() - 0.5) * 5.8;
    }

    draw(context) {
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.size, this.size);
    }

    update() {
        if (this.effect.mouse.active && !this.isStatic) {
            // Rimosso l'ondeggiatura (wave) - mantenuta solo la dispersione leggera (jitter + float)
            // Movimenti aumentati del 30% (da 2.5 a 3.25)
            const hoverFloatX = Math.sin(Date.now() * 0.0015 + this.originX) * 3.25 + this.jitterX;
            const hoverFloatY = Math.cos(Date.now() * 0.0015 + this.originY) * 3.25 + this.jitterY;

            let dx = (this.originX + hoverFloatX) - this.x;
            let dy = (this.originY + hoverFloatY) - this.y;
            this.x += dx * this.ease;
            this.y += dy * this.ease;
        } else {
            // Moto delle singole particelle a riposo aumentato del 30%
            this.x += Math.sin(Date.now() * 0.00195 + this.originX) * 0.78 + this.randomX * 0.52;
            this.y += Math.cos(Date.now() * 0.00195 + this.originY) * 0.78 + this.randomY * 0.52;

            this.vx *= 0.98;
            this.vy *= 0.98;
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0) this.x = this.effect.width;
            if (this.x > this.effect.width) this.x = 0;
            if (this.y < 0) this.y = this.effect.height;
            if (this.y > this.effect.height) this.y = 0;
        }
    }
}

class Effect {
    constructor(canvas, context) {
        this.canvas = canvas;
        this.context = context;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.particles = [];
        this.gap = 4;
        this.mouse = {
            x: 0,
            y: 0,
            active: false
        };

        this.image = new Image();
        this.image.src = "data:image/svg+xml;base64," + LOGO_BASE64;
        this.image.onload = () => {
            this.init();
        };

        window.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;

            if (this.mouse.x > 0 && this.mouse.x < this.width &&
                this.mouse.y > 0 && this.mouse.y < this.height) {
                this.mouse.active = true;
            } else {
                this.mouse.active = false;
            }
        });
    }

    init() {
        this.particles = [];
        const centerX = this.width / 2;
        const centerY = this.height / 2;

        const maxW = this.width * 0.8;
        const maxH = this.height * 0.8;
        let imgW = 148;
        let imgH = 148;
        const ratio = Math.min(maxW / imgW, maxH / imgH);
        imgW *= ratio;
        imgH *= ratio;

        const x = centerX - imgW / 2;
        const y = centerY - imgH / 2;

        this.context.clearRect(0, 0, this.width, this.height);
        this.context.drawImage(this.image, x, y, imgW, imgH);

        try {
            const imageData = this.context.getImageData(0, 0, this.width, this.height);
            const pixels = imageData.data;
            this.context.clearRect(0, 0, this.width, this.height);

            // Particle count decreased by 15% (keep rate lowered to ~30%)
            for (let y = 0; y < this.height; y += this.gap) {
                for (let x = 0; x < this.width; x += this.gap) {
                    const index = (y * this.width + x) * 4;
                    const alpha = pixels[index + 3];
                    if (alpha > 50) {
                        if (Math.random() > 0.73) { // Decreased by 10% (from 0.30 to 0.27 keep rate)
                            this.particles.push(new Particle(this, x, y, false));
                        }
                    }
                }
            }

            // Noise particles aumentate a 200
            for (let i = 0; i < 200; i++) {
                this.particles.push(new Particle(this, Math.random() * this.width, Math.random() * this.height, true));
            }
        } catch (e) {
            console.error("Pixel access failed:", e);
        }
    }

    draw() {
        this.particles.forEach(particle => particle.draw(this.context));
    }

    update() {
        this.particles.forEach(particle => particle.update());
    }

    resize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.width = width;
        this.height = height;
        this.init();
    }
}

window.addEventListener('load', function () {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;

    const container = canvas.parentElement;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    function setupCanvas() {
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
    }

    setupCanvas();
    const effect = new Effect(canvas, ctx);

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        effect.update();
        effect.draw();
        requestAnimationFrame(animate);
    }
    animate();

    window.addEventListener('resize', () => {
        setupCanvas();
        effect.resize(canvas.width, canvas.height);
    });
});
