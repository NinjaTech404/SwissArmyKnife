/* ============================================
   Compression Tool — gzip (native) + zip (JSZip)
   ============================================ */

const compressState = {}; // { format: { file, mode } }

/* ---- Shared file-drop / tab wiring ---- */
document.querySelectorAll('.compress-card').forEach(card => {
    const format = card.querySelector('.compress-tab').dataset.format;
    const drop = card.querySelector('.compress-file-drop');
    const input = card.querySelector('input[type="file"]');
    const info = card.querySelector('.compress-file-info');
    const nameEl = card.querySelector('.compress-file-info > span');
    const clear = card.querySelector('.compress-clear');
    const runBtn = card.querySelector('.compress-run');
    const download = card.querySelector('.compress-download');
    const status = card.querySelector('.compress-status');

    compressState[format] = { file: null, mode: 'compress' };

    // Drop / click
    drop.addEventListener('click', () => input.click());
    drop.addEventListener('dragover', e => { e.preventDefault(); drop.classList.add('dragover'); });
    drop.addEventListener('dragleave', () => drop.classList.remove('dragover'));
    drop.addEventListener('drop', e => {
        e.preventDefault();
        drop.classList.remove('dragover');
        if (e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0]);
    });
    input.addEventListener('change', e => { if (e.target.files[0]) setFile(e.target.files[0]); });

    function setFile(file) {
        compressState[format].file = file;
        nameEl.textContent = file.name;
        info.style.display = 'flex';
        drop.style.display = 'none';
        runBtn.disabled = false;
        download.style.display = 'none';
        status.textContent = '';
    }

    // Clear
    clear.addEventListener('click', e => {
        e.stopPropagation();
        compressState[format].file = null;
        input.value = '';
        info.style.display = 'none';
        drop.style.display = 'flex';
        runBtn.disabled = true;
        download.style.display = 'none';
        status.textContent = '';
    });

    // Mode tabs
    card.querySelectorAll('.compress-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            card.querySelectorAll('.compress-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            compressState[format].mode = tab.dataset.mode;
            download.style.display = 'none';
            status.textContent = '';
        });
    });

    // Run
    runBtn.addEventListener('click', async () => {
        const state = compressState[format];
        if (!state.file) return;

        runBtn.disabled = true;
        status.textContent = 'Working…';

        try {
            let blob, outName;

            if (format === 'gzip') {
                if (state.mode === 'compress') {
                    const stream = state.file.stream().pipeThrough(new CompressionStream('gzip'));
                    blob = await new Response(stream).blob();
                    outName = state.file.name + '.gz';
                } else {
                    const stream = state.file.stream().pipeThrough(new DecompressionStream('gzip'));
                    blob = await new Response(stream).blob();
                    outName = state.file.name.replace(/\.gz$/i, '');
                }
            } else if (format === 'zip') {
                if (state.mode === 'compress') {
                    const zip = new JSZip();
                    zip.file(state.file.name, state.file);
                    blob = await zip.generateAsync({ type: 'blob' });
                    outName = state.file.name.replace(/\.[^.]+$/, '') + '.zip';
                } else {
                    const zip = await JSZip.loadAsync(state.file);
                    const first = Object.values(zip.files).find(f => !f.dir);
                    if (!first) throw new Error('No files in zip');
                    blob = await first.async('blob');
                    outName = first.name;
                }
            } else {
                throw new Error('This format requires a WASM library (e.g., libarchive.js)');
            }

            const url = URL.createObjectURL(blob);
            download.href = url;
            download.download = outName;
            download.style.display = 'flex';
            status.textContent = 'Done — ' + outName;
        } catch (err) {
            status.textContent = 'Error: ' + err.message;
        } finally {
            runBtn.disabled = false;
        }
    });
});