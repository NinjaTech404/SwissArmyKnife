/* ============================================
   Public IP Info Tool
   ============================================ */

const ipInputZone   = document.getElementById('ip-input-zone');
const ipResultsZone = document.getElementById('ip-results-zone');
const ipQueryInput  = document.getElementById('ip-query-input');
const ipLookupBtn   = document.getElementById('ip-lookup-btn');
const ipStatus      = document.getElementById('ip-status');
const ipResultAddr  = document.getElementById('ip-result-address');
const ipResultLabel = document.getElementById('ip-result-label');
const ipCardBody    = document.getElementById('ip-card-body');
const ipResetBtn    = document.getElementById('ip-reset-btn');

/* ---- Lookup ---- */
async function performLookup(query) {
    ipLookupBtn.disabled = true;
    ipStatus.textContent = 'Looking up...';
    ipStatus.style.color = 'var(--accent-blue)';

    try {
        // ip-api.com supports JSON with CORS. If query is empty, it returns the caller's IP.
        const url = query
            ? `http://ip-api.com/json/${encodeURIComponent(query)}?fields=status,message,continent,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,mobile,proxy,hosting,query`
            : `http://ip-api.com/json/?fields=status,message,continent,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,mobile,proxy,hosting,query`;

        const res = await fetch(url);
        const data = await res.json();

        if (data.status === 'fail') {
            throw new Error(data.message || 'Lookup failed');
        }

        // Hide input, show results
        ipInputZone.style.display = 'none';
        ipResultsZone.style.display = 'flex';

        ipResultAddr.textContent = data.query || 'Unknown';
        ipResultLabel.textContent = query ? 'Queried IP' : 'Your Public IP';
        ipCardBody.innerHTML = '';

        renderIpSections(data);
    } catch (err) {
        ipStatus.textContent = err.message || 'Failed to fetch IP info';
        ipStatus.style.color = 'var(--accent-red)';
    } finally {
        ipLookupBtn.disabled = false;
    }
}

/* ---- Render sections into the single card ---- */
function renderIpSections(data) {
    const sections = [];

    // 1. Geolocation
    const geoRows = [];
    if (data.continent)   geoRows.push({ key: 'Continent',    value: data.continent });
    if (data.country)     geoRows.push({ key: 'Country',      value: data.country });
    if (data.countryCode) geoRows.push({ key: 'Country Code', value: data.countryCode });
    if (data.regionName)  geoRows.push({ key: 'Region',       value: data.regionName });
    if (data.city)        geoRows.push({ key: 'City',         value: data.city });
    if (data.zip)         geoRows.push({ key: 'ZIP',          value: data.zip });
    if (data.lat !== undefined && data.lon !== undefined) {
        geoRows.push({ key: 'Coordinates', value: `${data.lat}, ${data.lon}` });
    }
    if (geoRows.length) {
        sections.push({ title: 'Geolocation', icon: 'bi-geo-alt', rows: geoRows });
    }

    // 2. Network
    const netRows = [];
    if (data.isp)      netRows.push({ key: 'ISP',          value: data.isp });
    if (data.org)      netRows.push({ key: 'Organization', value: data.org });
    if (data.as)       netRows.push({ key: 'AS Number',    value: data.as });
    if (data.timezone) netRows.push({ key: 'Timezone',     value: data.timezone });
    if (netRows.length) {
        sections.push({ title: 'Network', icon: 'bi-diagram-3', rows: netRows });
    }

    // 3. Security / Flags
    const secRows = [];
    if (data.mobile !== undefined) {
        secRows.push({ key: 'Mobile Connection', value: data.mobile, isBadge: true, badgeType: data.mobile ? 'yes' : 'no' });
    }
    if (data.proxy !== undefined) {
        secRows.push({ key: 'Proxy / VPN / Tor', value: data.proxy, isBadge: true, badgeType: data.proxy ? 'yes' : 'no' });
    }
    if (data.hosting !== undefined) {
        secRows.push({ key: 'Hosting / Data Center', value: data.hosting, isBadge: true, badgeType: data.hosting ? 'yes' : 'no' });
    }
    if (secRows.length) {
        sections.push({ title: 'Security', icon: 'bi-shield-check', rows: secRows });
    }

    // Render
    sections.forEach(section => {
        const secEl = document.createElement('div');
        secEl.className = 'ip-section';

        const header = document.createElement('div');
        header.className = 'ip-section-header';
        header.innerHTML = `<i class="bi ${section.icon}"></i><span>${section.title}</span>`;
        secEl.appendChild(header);

        const rowsEl = document.createElement('div');
        rowsEl.className = 'ip-section-rows';

        section.rows.forEach(row => {
            const rowEl = document.createElement('div');
            rowEl.className = 'ip-row';

            const k = document.createElement('span');
            k.className = 'ip-key';
            k.textContent = row.key;

            const v = document.createElement('span');
            v.className = 'ip-value';

            if (row.isBadge) {
                const badge = document.createElement('span');
                badge.className = `ip-badge ${row.badgeType}`;
                badge.textContent = row.value ? 'Yes' : 'No';
                v.appendChild(badge);
            } else if (!row.value) {
                v.textContent = '—';
                v.classList.add('ip-empty');
            } else {
                v.textContent = row.value;
            }

            rowEl.append(k, v);
            rowsEl.appendChild(rowEl);
        });

        secEl.appendChild(rowsEl);
        ipCardBody.appendChild(secEl);
    });
}

/* ---- Event listeners ---- */
ipLookupBtn.addEventListener('click', () => {
    const query = ipQueryInput.value.trim();
    performLookup(query);
});

ipQueryInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        ipLookupBtn.click();
    }
});

ipResetBtn.addEventListener('click', () => {
    ipResultsZone.style.display = 'none';
    ipInputZone.style.display = 'flex';
    ipQueryInput.value = '';
    ipStatus.textContent = '';
    ipCardBody.innerHTML = '';
});

// Auto-lookup on page load (uses the user's own IP)
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to let the page settle, then fetch silently
    setTimeout(() => performLookup(''), 100);
});