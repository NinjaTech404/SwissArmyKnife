/* ============================================
   ExifTool-like Metadata Tool — single card
   ============================================ */

const metaInputZone   = document.getElementById('meta-input-zone');
const metaResultsZone = document.getElementById('meta-results-zone');
const metaDropArea    = document.getElementById('meta-drop-area');
const metaFileInput   = document.getElementById('meta-file-input');
const metaStatus      = document.getElementById('meta-status');
const metaFileName    = document.getElementById('meta-file-name');
const metaFileSize    = document.getElementById('meta-file-size');
const metaCardBody    = document.getElementById('meta-card-body');
const metaResetBtn    = document.getElementById('meta-reset-btn');

/* ---- Input handling ---- */
metaDropArea.addEventListener('click', () => metaFileInput.click());

metaDropArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    metaDropArea.classList.add('dragover');
});

metaDropArea.addEventListener('dragleave', () => {
    metaDropArea.classList.remove('dragover');
});

metaDropArea.addEventListener('drop', (e) => {
    e.preventDefault();
    metaDropArea.classList.remove('dragover');
    if (e.dataTransfer.files[0]) processFile(e.dataTransfer.files[0]);
});

metaFileInput.addEventListener('change', (e) => {
    if (e.target.files[0]) processFile(e.target.files[0]);
});

metaResetBtn.addEventListener('click', () => {
    metaResultsZone.style.display = 'none';
    metaInputZone.style.display = 'flex';
    metaFileInput.value = '';
    metaStatus.textContent = '';
    metaCardBody.innerHTML = '';
});

/* ---- Process file ---- */
async function processFile(file) {
    metaStatus.textContent = 'Extracting metadata...';

    metaInputZone.style.display = 'none';
    metaResultsZone.style.display = 'flex';

    metaFileName.textContent = file.name;
    metaFileSize.textContent = formatFileSize(file.size);
    metaCardBody.innerHTML = '';

    const sections = await extractMetadata(file);
    renderSections(sections);
}

/* ---- Extraction ---- */
async function extractMetadata(file) {
    const sections = [];

    // 1. General
    sections.push({
        title: 'General',
        icon: 'bi-file-earmark',
        rows: [
            { key: 'Name',          value: file.name },
            { key: 'Size',          value: formatFileSize(file.size) },
            { key: 'MIME Type',     value: file.type || 'Unknown' },
            { key: 'Last Modified', value: new Date(file.lastModified).toLocaleString() },
        ]
    });

    const ext = file.name.split('.').pop().toLowerCase();

    // 2. Image EXIF
    if (['jpg','jpeg','png','tiff','webp','heic'].includes(ext) || file.type.startsWith('image/')) {
        try {
            if (!window.exifr) {
                await loadScript('https://cdn.jsdelivr.net/npm/exifr@7.1.3/dist/full.umd.js');
            }
            const data = await window.exifr.parse(file);
            if (data && Object.keys(data).length) {
                const rows = [];
                const keys = ['Make','Model','LensModel','FNumber','ExposureTime','ISO','FocalLength','CreateDate','GPSLatitude','GPSLongitude'];
                keys.forEach(k => {
                    if (data[k] !== undefined) {
                        let v = data[k];
                        if (k === 'GPSLatitude' || k === 'GPSLongitude')
                            v = typeof v === 'number' ? v.toFixed(6) : String(v);
                        if (k === 'ExposureTime')
                            v = v < 1 ? `1/${Math.round(1/v)}s` : `${v}s`;
                        rows.push({ key: formatKey(k), value: String(v) });
                    }
                });
                if (rows.length) sections.push({ title: 'Image EXIF', icon: 'bi-camera', rows });
            }
        } catch (e) { console.warn('EXIF skipped:', e); }
    }

    // 3. PDF
    if (ext === 'pdf') {
        try {
            if (!window.pdfjsLib) {
                await loadScript('https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js');
                window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js';
            }
            const buf = await file.arrayBuffer();
            const pdf = await window.pdfjsLib.getDocument({ data: buf }).promise;
            const meta = await pdf.getMetadata();
            const rows = [{ key: 'Pages', value: String(pdf.numPages) }];
            if (meta.info) {
                if (meta.info.Title)        rows.push({ key: 'Title',    value: meta.info.Title });
                if (meta.info.Author)       rows.push({ key: 'Author',   value: meta.info.Author });
                if (meta.info.Creator)      rows.push({ key: 'Creator',  value: meta.info.Creator });
                if (meta.info.Producer)     rows.push({ key: 'Producer', value: meta.info.Producer });
                if (meta.info.CreationDate) rows.push({ key: 'Created',  value: meta.info.CreationDate });
            }
            sections.push({ title: 'PDF Document', icon: 'bi-file-pdf', rows });
        } catch (e) {
            sections.push({
                title: 'PDF Document', icon: 'bi-file-pdf',
                rows: [{ key: 'Status', value: 'Could not read PDF metadata' }]
            });
        }
    }

    // 4. Audio
    if (['mp3','flac','ogg','wav','m4a'].includes(ext) || file.type.startsWith('audio/')) {
        sections.push({
            title: 'Audio', icon: 'bi-music-note-beamed',
            rows: [
                { key: 'Format', value: ext.toUpperCase() },
                { key: 'Note',   value: 'Full ID3 tags require a dedicated library (music-metadata-browser)' }
            ]
        });
    }

    // 5. Video
    if (['mp4','mkv','avi','mov','webm'].includes(ext) || file.type.startsWith('video/')) {
        sections.push({
            title: 'Video', icon: 'bi-camera-video',
            rows: [
                { key: 'Format', value: ext.toUpperCase() },
                { key: 'Note',   value: 'Full codec info requires a library (mediainfo.js)' }
            ]
        });
    }

    return sections;
}

/* ---- Render into the single card ---- */
function renderSections(sections) {
    metaCardBody.innerHTML = '';

    if (!sections.length) {
        metaCardBody.innerHTML = '<div style="padding:40px;text-align:center;color:#ffffff77;">No metadata found.</div>';
        return;
    }

    sections.forEach(section => {
        const secEl = document.createElement('div');
        secEl.className = 'meta-section';

        const header = document.createElement('div');
        header.className = 'meta-section-header';
        header.innerHTML = `<i class="bi ${section.icon}"></i><span>${section.title}</span>`;
        secEl.appendChild(header);

        const rowsEl = document.createElement('div');
        rowsEl.className = 'meta-section-rows';

        section.rows.forEach(row => {
            const rowEl = document.createElement('div');
            rowEl.className = 'meta-row';

            const k = document.createElement('span');
            k.className = 'meta-key';
            k.textContent = row.key;

            const v = document.createElement('span');
            v.className = 'meta-value';
            if (!row.value) {
                v.textContent = '—';
                v.classList.add('meta-empty');
            } else {
                v.textContent = row.value;
            }

            rowEl.append(k, v);
            rowsEl.appendChild(rowEl);
        });

        secEl.appendChild(rowsEl);
        metaCardBody.appendChild(secEl);
    });
}

/* ---- Helpers ---- */
function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024, sizes = ['B','KB','MB','GB','TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatKey(key) {
    return key.replace(/([A-Z])/g, ' $1').trim();
}

function loadScript(src) {
    return new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = src;
        s.onload = resolve;
        s.onerror = reject;
        document.head.appendChild(s);
    });
}