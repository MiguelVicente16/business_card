(function () {
    // Resolve the repo root from this script's own URL so the banner image
    // works whether the page is at the site root or in a /slug/ folder.
    const scriptUrl = new URL(document.currentScript.src);
    const ROOT = new URL('../', scriptUrl);
    const bannerUrl = new URL('banner.jpg', ROOT).href;

    // Miguel's card is shown when a page defines no person and has no params.
    const DEFAULTS = {
        name: "Miguel Vicente",
        title: "COO",
        phone: "+351 962130104",
        email: "general@matchlytics.ai",
        linkedin: "https://www.linkedin.com/in/miguel-mendes-vicente/"
    };

    const ICONS = {
        email: '<path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>',
        phone: '<path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>',
        linkedin: '<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>',
        website: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm6.93 6h-2.95a15.65 15.65 0 0 0-1.38-3.56A8.03 8.03 0 0 1 18.92 8zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56A7.99 7.99 0 0 1 5.08 16zm2.95-8H5.08a7.99 7.99 0 0 1 4.33-3.56A15.65 15.65 0 0 0 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2 0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95a8.03 8.03 0 0 1-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z"/>'
    };

    // Fixed company website shown on every card and saved to the contact.
    const WEBSITE = { url: 'https://matchlytics.ai', display: 'matchlytics.ai' };
    const COMPANY = 'Matchlytics';

    const clean = (v) => (v == null ? '' : String(v)).trim();

    const esc = (s) => clean(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');

    // Decide whose card to render: an explicit window.CARD (per-person page),
    // else URL query params, else Miguel's defaults.
    function resolvePerson() {
        if (window.CARD && typeof window.CARD === 'object') {
            return { person: window.CARD, isDefault: false };
        }
        const params = new URLSearchParams(location.search);
        if ([...params.keys()].length > 0) {
            return {
                person: {
                    name: params.get('n'),
                    title: params.get('t'),
                    phone: params.get('p'),
                    email: params.get('e'),
                    linkedin: params.get('l')
                },
                isDefault: false
            };
        }
        return { person: DEFAULTS, isDefault: true };
    }

    const linkedinDisplay = (url) =>
        clean(url).replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');

    function buildVCard(p) {
        const lines = ['BEGIN:VCARD', 'VERSION:3.0'];
        if (clean(p.name)) lines.push('FN:' + clean(p.name) + ' - ' + COMPANY);
        lines.push('ORG:' + COMPANY);
        if (clean(p.title)) lines.push('TITLE:' + clean(p.title));
        if (clean(p.phone)) lines.push('TEL;TYPE=CELL:' + clean(p.phone));
        if (clean(p.email)) lines.push('EMAIL:' + clean(p.email));
        if (clean(p.linkedin)) lines.push('URL:' + clean(p.linkedin));
        lines.push('URL:' + WEBSITE.url);
        lines.push('END:VCARD');
        return lines.join('\n');
    }

    function row(iconPath, label, valueHtml) {
        return `<div class="contact-item">
            <span class="contact-icon-wrap"><svg class="contact-icon" viewBox="0 0 24 24">${iconPath}</svg></span>
            <div class="contact-details">
                <div class="contact-label">${label}</div>
                <div class="contact-value">${valueHtml}</div>
            </div>
        </div>`;
    }

    function render() {
        const { person, isDefault } = resolvePerson();
        const name = clean(person.name) || 'Matchlytics';
        const title = clean(person.title);
        const email = clean(person.email);
        const phone = clean(person.phone);
        const linkedin = clean(person.linkedin);

        document.title = name + ' — Matchlytics';

        let rows = '';
        if (email) {
            rows += row(ICONS.email, 'Email',
                `<a href="mailto:${esc(email)}">${esc(email)}</a>`);
        }
        if (phone) {
            const tel = phone.replace(/[^\d+]/g, '');
            rows += row(ICONS.phone, 'Phone / WhatsApp',
                `<a href="tel:${esc(tel)}">${esc(phone)}</a>`);
        }
        if (linkedin) {
            rows += row(ICONS.linkedin, 'LinkedIn',
                `<a href="${esc(linkedin)}" target="_blank" rel="noopener">${esc(linkedinDisplay(linkedin))}</a>`);
        }
        rows += row(ICONS.website, 'Website',
            `<a href="${esc(WEBSITE.url)}" target="_blank" rel="noopener">${esc(WEBSITE.display)}</a>`);

        document.getElementById('card-root').innerHTML = `
            <div class="container">
                <div class="main-card">
                    <div class="contact-section">
                        <div class="company-banner">
                            <img src="${bannerUrl}" alt="Matchlytics" class="company-logo">
                        </div>
                        <div class="profile-section">
                            <div class="name">${esc(name)}</div>
                            ${title ? `<div class="title">${esc(title)}</div>` : ''}
                        </div>
                        <div class="contact-items">${rows}</div>
                    </div>
                    <div class="qr-section">
                        <div class="qr-title">Save Contact</div>
                        <div class="qr-subtitle">Scan to add ${isDefault ? 'my' : 'this'} contact to your phone</div>
                        <div class="qr-code-container"><div id="qrcode"></div></div>
                        <div class="action-buttons">
                            <button class="btn btn-primary" id="downloadBtn">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M5 20h14v-2H5v2zM19 9h-4V3H9v6H5l7 7 7-7z"/></svg>
                                Download Contact
                            </button>
                        </div>
                    </div>
                </div>
            </div>`;

        const vcard = buildVCard(person);
        const qr = qrcode(0, 'M');
        qr.addData(vcard);
        qr.make();
        document.getElementById('qrcode').innerHTML = qr.createImgTag(3, 2);

        document.getElementById('downloadBtn').addEventListener('click', () => {
            const blob = new Blob([vcard], { type: 'text/vcard' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = name.replace(/\s+/g, '_') + '_contact.vcf';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', render);
    } else {
        render();
    }
})();
