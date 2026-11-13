/**
 * checkout.js — X2: checkout dimostrativo
 * Sembra un vero acquisto, ma è dichiarato finto dal primo istante:
 * nessun pagamento, nessun dato raccolto (i campi sono precompilati e bloccati, niente viene inviato).
 * Alla fine: ricevuta RECLAIM in PNG, salvata con il menu di condivisione (mobile) o scaricata.
 */
(function () {
    const PRICE = 249;
    const SHIPPING = 0;
    const ORDER = '#RX-0421';
    const ITEMS = ['RECLAIMX', 'SPRAY CAN', 'STENCIL', 'AMMUNITIONS', 'BEGINNER BADGE', 'BROCHURE'];
    const eur = (n) => '€ ' + n.toFixed(2).replace('.', ',');

    let qty = 1;
    let step = 0;
    let root, lastFocus, receiptBlob, hideTimer;

    const html = () => `
<div class="checkout" id="checkout" role="dialog" aria-modal="true" aria-labelledby="co-title" hidden>
    <div class="co-band" role="note">DEMO — SPECULATIVE DESIGN — NO REAL PURCHASE, NO DATA COLLECTED</div>
    <div class="co-body">
        <header class="co-head">
            <h2 id="co-title">CHECKOUT</h2>
            <button type="button" class="co-close" data-act="close">CLOSE [X]</button>
        </header>
        <ol class="co-steps" aria-label="Steps">
            <li data-s="0">01 ORDER</li><li data-s="1">02 SHIPPING</li><li data-s="2">03 PAYMENT</li>
        </ol>

        <section class="co-step" data-s="0">
            <div class="co-item">
                <img src="asset/web/kit_close-1000.webp" alt="" width="1000" height="649">
                <div>
                    <h3>RECLAIM KIT</h3>
                    <p class="co-contents">${ITEMS.join(' · ')}</p>
                    <div class="co-qty" role="group" aria-label="Quantity">
                        <button type="button" data-act="minus" aria-label="One less">−</button>
                        <output id="co-qty" aria-live="polite">1</output>
                        <button type="button" data-act="plus" aria-label="One more">+</button>
                    </div>
                </div>
                <span class="co-price" id="co-line">${eur(PRICE)}</span>
            </div>
            <dl class="co-sum">
                <div><dt>SUBTOTAL</dt><dd class="js-sub"></dd></div>
                <div><dt>SHIPPING</dt><dd>FREE FOR CITIZENS</dd></div>
                <div class="co-total"><dt>TOTAL</dt><dd class="js-total"></dd></div>
            </dl>
            <button type="button" class="cta-button co-next" data-act="next">/CONTINUE</button>
        </section>

        <section class="co-step" data-s="1" hidden>
            <p class="co-lock">DEMO DATA — FIELDS ARE LOCKED. NOTHING YOU SEE HERE IS STORED OR SENT.</p>
            <div class="co-fields">
                <label>NAME<input value="CITIZEN 0421" readonly tabindex="-1"></label>
                <label>ADDRESS<input value="VIA DEL RECLAIM 0" readonly tabindex="-1"></label>
                <label>CITY<input value="YOUR CITY" readonly tabindex="-1"></label>
                <label>POSTCODE<input value="00000" readonly tabindex="-1"></label>
                <label class="co-wide">EMAIL<input value="citizen@reclaim.demo" readonly tabindex="-1"></label>
            </div>
            <div class="co-nav">
                <button type="button" class="co-back" data-act="back">/BACK</button>
                <button type="button" class="cta-button co-next" data-act="next">/CONTINUE</button>
            </div>
        </section>

        <section class="co-step" data-s="2" hidden>
            <p class="co-lock">DEMO CARD — NO PAYMENT WILL BE MADE.</p>
            <div class="co-fields">
                <label class="co-wide">CARD NUMBER<input value="4242 •••• DEMO" readonly tabindex="-1"></label>
                <label>EXPIRY<input value="--/--" readonly tabindex="-1"></label>
                <label>CVC<input value="•••" readonly tabindex="-1"></label>
            </div>
            <dl class="co-sum"><div class="co-total"><dt>TOTAL</dt><dd class="js-total"></dd></div></dl>
            <div class="co-nav">
                <button type="button" class="co-back" data-act="back">/BACK</button>
                <button type="button" class="cta-button co-next" data-act="pay">/PAY <span class="js-total"></span> (DEMO)</button>
            </div>
        </section>

        <section class="co-step co-done" data-s="3" hidden aria-live="polite">
            <p class="co-processing">PROCESSING<span>...</span></p>
            <div class="co-result" hidden>
                <h3>ORDER NOT PROCESSED</h3>
                <p>RECLAIM IS A SPECULATIVE DESIGN PROJECT. NOTHING WAS CHARGED, NO DATA WAS COLLECTED, NO KIT WILL BE SHIPPED. KEEP THE RECEIPT AS A SOUVENIR.</p>
                <img class="co-receipt" alt="Reclaim receipt ${ORDER}, marked not processed">
                <div class="co-nav">
                    <button type="button" class="cta-button" data-act="save">/SAVE RECEIPT</button>
                    <button type="button" class="co-back" data-act="close">/BACK TO THE SITE</button>
                </div>
            </div>
        </section>
    </div>
</div>`;

    function totals() {
        const t = eur(PRICE * qty + SHIPPING);
        root.querySelector('#co-qty').textContent = qty;
        root.querySelector('#co-line').textContent = eur(PRICE * qty);
        root.querySelectorAll('.js-sub').forEach(e => { e.textContent = eur(PRICE * qty); });
        root.querySelectorAll('.js-total').forEach(e => { e.textContent = t; });
    }

    function go(s) {
        step = s;
        root.querySelectorAll('.co-step').forEach(sec => { sec.hidden = Number(sec.dataset.s) !== s; });
        root.querySelectorAll('.co-steps li').forEach(li => {
            li.classList.toggle('on', Number(li.dataset.s) === s);
            li.classList.toggle('done', Number(li.dataset.s) < s);
        });
        root.querySelector('.co-steps').hidden = s === 3;
        root.querySelector('.co-body').scrollTop = 0;
        const first = root.querySelector(`.co-step[data-s="${s}"] button`);
        if (first) first.focus({ preventScroll: true });
    }

    function open(e) {
        if (e) e.preventDefault();
        if (!root) {
            document.body.insertAdjacentHTML('beforeend', html());
            root = document.getElementById('checkout');
            root.addEventListener('click', onClick);
            root.addEventListener('keydown', trap);
        }
        clearTimeout(hideTimer);
        lastFocus = document.activeElement;
        qty = 1;
        totals();
        root.querySelector('.co-processing').hidden = false;
        root.querySelector('.co-result').hidden = true;
        root.hidden = false;
        requestAnimationFrame(() => root.classList.add('open'));
        document.body.classList.add('modal-open', 'checkout-open');
        go(0);
    }

    function close() {
        root.classList.remove('open');
        document.body.classList.remove('modal-open', 'checkout-open');
        clearTimeout(hideTimer);
        hideTimer = setTimeout(() => { root.hidden = true; }, 300);
        if (lastFocus) lastFocus.focus({ preventScroll: true });
    }

    function trap(e) {
        if (e.key === 'Escape') { close(); return; }
        if (e.key !== 'Tab') return;
        const f = Array.from(root.querySelectorAll('button')).filter(b => b.offsetParent);
        if (!f.length) return;
        const [a, z] = [f[0], f[f.length - 1]];
        if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
        else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
    }

    function onClick(e) {
        const b = e.target.closest('[data-act]');
        if (!b) return;
        const act = b.dataset.act;
        if (act === 'close') close();
        if (act === 'plus') { qty = Math.min(5, qty + 1); totals(); }
        if (act === 'minus') { qty = Math.max(1, qty - 1); totals(); }
        if (act === 'next') go(step + 1);
        if (act === 'back') go(step - 1);
        if (act === 'pay') pay();
        if (act === 'save') save();
    }

    function pay() {
        go(3);
        makeReceipt().then(blob => {
            receiptBlob = blob;
            root.querySelector('.co-receipt').src = URL.createObjectURL(blob);
            setTimeout(() => {
                root.querySelector('.co-processing').hidden = true;
                root.querySelector('.co-result').hidden = false;
                root.querySelector('[data-act="save"]').focus({ preventScroll: true });
            }, 1400);
        });
    }

    async function save() {
        if (!receiptBlob) return;
        const name = 'reclaim-receipt-RX-0421.png';
        const file = new File([receiptBlob], name, { type: 'image/png' });
        // mobile: menu di condivisione (Salva immagine, AirDrop...), altrimenti download
        if (window.matchMedia('(hover: none)').matches && navigator.canShare && navigator.canShare({ files: [file] })) {
            try { await navigator.share({ files: [file], title: 'Reclaim receipt' }); return; }
            catch (err) { if (err.name === 'AbortError') return; }
        }
        const a = document.createElement('a');
        a.href = URL.createObjectURL(receiptBlob);
        a.download = name;
        document.body.appendChild(a);
        a.click();
        a.remove();
    }

    /* --- Ricevuta in PNG (verticale, 1080×1920) ---------------------------- */
    async function makeReceipt() {
        const W = 1080, H = 1920, M = 90;
        const c = document.createElement('canvas');
        c.width = W; c.height = H;
        const g = c.getContext('2d');
        const MONO = '"cofo-sans-mono-variable", "Necto Mono", monospace';
        try { await document.fonts.load(`40px ${MONO}`); await document.fonts.load('40px Codeink'); } catch (e) { /* font di sistema */ }

        g.fillStyle = '#ededed';
        g.fillRect(0, 0, W, H);
        g.fillStyle = '#000';
        g.textBaseline = 'alphabetic';

        const logo = await new Promise(res => {
            const i = new Image();
            i.onload = () => res(i);
            i.onerror = () => res(null);
            i.src = 'asset/loghi/logo.svg';
        });
        if (logo) g.drawImage(logo, M, M, 120, 120);
        g.font = `96px Codeink, ${MONO}`;
        g.fillText('RECLAIM', M + 150, M + 92);

        const line = (y) => { g.fillRect(M, y, W - 2 * M, 2); };
        const row = (l, r, y, size = 34) => {
            g.font = `${size}px ${MONO}`;
            g.textAlign = 'left'; g.fillText(l, M, y);
            g.textAlign = 'right'; g.fillText(r, W - M, y);
            g.textAlign = 'left';
        };

        const now = new Date();
        const pad = (n) => String(n).padStart(2, '0');
        const date = `${pad(now.getDate())}.${pad(now.getMonth() + 1)}.${now.getFullYear()}`;
        const time = `${pad(now.getHours())}:${pad(now.getMinutes())}`;

        let y = 330;
        row('RECEIPT', ORDER, y, 44); y += 60;
        row('DATE', `${date}  ${time}`, y); y += 40;
        line(y); y += 80;

        row(`RECLAIM KIT  × ${qty}`, eur(PRICE * qty), y, 40); y += 60;
        g.font = `30px ${MONO}`;
        ITEMS.forEach(it => { g.fillText('— ' + it, M + 20, y); y += 46; });
        y += 30; line(y); y += 70;
        row('SUBTOTAL', eur(PRICE * qty), y); y += 56;
        row('SHIPPING', 'FREE FOR CITIZENS', y); y += 56;
        row('PAYMENT', '4242 •••• DEMO', y); y += 40;
        line(y); y += 90;
        row('TOTAL', eur(PRICE * qty + SHIPPING), y, 56); y += 50;

        // timbro arancione NOT PROCESSED
        g.save();
        g.translate(W / 2, 1420);
        g.rotate(-0.16);
        g.strokeStyle = '#ff3c01';
        g.fillStyle = '#ff3c01';
        g.lineWidth = 10;
        g.strokeRect(-380, -110, 760, 220);
        g.lineWidth = 3;
        g.strokeRect(-360, -90, 720, 180);
        // la scritta deve stare dentro il riquadro interno (720px, margine 40)
        let fs = 92;
        g.font = `${fs}px Codeink, ${MONO}`;
        const tw = g.measureText('NOT PROCESSED').width;
        if (tw > 640) { fs = Math.floor(fs * 640 / tw); g.font = `${fs}px Codeink, ${MONO}`; }
        g.textAlign = 'center';
        g.textBaseline = 'middle';
        g.fillText('NOT PROCESSED', 0, 6);
        g.restore();

        g.fillStyle = '#000';
        g.textAlign = 'left';
        g.textBaseline = 'alphabetic';
        g.font = `28px ${MONO}`;
        ['SPECULATIVE DESIGN PROJECT.', 'NO REAL PURCHASE. NO DATA COLLECTED.', 'NOTHING WAS CHARGED.'].forEach((t, i) => g.fillText(t, M, 1700 + i * 42));
        g.font = `28px ${MONO}`;
        g.textAlign = 'right';
        g.fillText('LEAVE YOUR MARK', W - M, 1826);

        return new Promise(res => c.toBlob(res, 'image/png'));
    }

    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('[data-checkout], a[href="#checkout"]').forEach(a => a.addEventListener('click', open));
        if (location.hash === '#checkout') open();
    });
})();
