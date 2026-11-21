/* ============================================
   Encoder / Decoder Tool
   ============================================ */

/* ---- Live encode/decode on input + mode toggle ---- */
document.querySelectorAll('.codec-card').forEach(card => {
    const codec = card.querySelector('.codec-tab').dataset.codec;
    const input = card.querySelector('.codec-input');
    const output = card.querySelector('.codec-output');
    const shiftInput = card.querySelector('.codec-shift');

    function run() {
        const mode = card.querySelector('.codec-tab.active').dataset.mode;
        const value = input.value;
        if (!value) { output.value = ''; return; }

        try {
            output.value = codecProcess(codec, mode, value, shiftInput ? shiftInput.value : 3);
        } catch (e) {
            output.value = 'Error: invalid input';
        }
    }

    input.addEventListener('input', run);
    if (shiftInput) shiftInput.addEventListener('input', run);

    card.querySelectorAll('.codec-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            card.querySelectorAll('.codec-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            run();
        });
    });
});

/* ---- Copy buttons ---- */
document.querySelectorAll('.codec-copy').forEach(btn => {
    btn.addEventListener('click', async () => {
        const target = document.getElementById(btn.dataset.target);
        if (!target.value) return;
        try {
            await navigator.clipboard.writeText(target.value);
        } catch {
            target.select();
            document.execCommand('copy');
        }
        btn.classList.add('copied');
        btn.innerHTML = '<i class="bi bi-check2"></i>';
        setTimeout(() => {
            btn.classList.remove('copied');
            btn.innerHTML = '<i class="bi bi-clipboard"></i>';
        }, 1500);
    });
});

/* ---- Core codec dispatcher ---- */
function codecProcess(codec, mode, input, shift) {
    switch (codec) {
        case 'base64': return mode === 'encode' ? b64Encode(input) : b64Decode(input);
        case 'base32': return mode === 'encode' ? b32Encode(input) : b32Decode(input);
        case 'hex':    return mode === 'encode' ? hexEncode(input) : hexDecode(input);
        case 'caesar': return caesarCipher(input, mode === 'encode' ? +shift : -shift);
        case 'rot13':  return caesarCipher(input, 13); // ROT13 is symmetric
        case 'url':    return mode === 'encode' ? encodeURIComponent(input) : decodeURIComponent(input);
        default: return '';
    }
}

/* ---- Base64 ---- */
function b64Encode(str) {
    return btoa(unescape(encodeURIComponent(str)));
}
function b64Decode(str) {
    return decodeURIComponent(escape(atob(str.trim())));
}

/* ---- Base32 ---- */
const B32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

function b32Encode(str) {
    const bytes = new TextEncoder().encode(str);
    let bits = 0, value = 0, output = '';
    for (const byte of bytes) {
        value = (value << 8) | byte;
        bits += 8;
        while (bits >= 5) {
            output += B32_ALPHABET[(value >>> (bits - 5)) & 31];
            bits -= 5;
        }
    }
    if (bits > 0) output += B32_ALPHABET[(value << (5 - bits)) & 31];
    while (output.length % 8 !== 0) output += '=';
    return output;
}

function b32Decode(str) {
    const clean = str.trim().replace(/=+$/, '').toUpperCase();
    let bits = 0, value = 0;
    const bytes = [];
    for (const char of clean) {
        const idx = B32_ALPHABET.indexOf(char);
        if (idx === -1) throw new Error('Invalid Base32');
        value = (value << 5) | idx;
        bits += 5;
        if (bits >= 8) {
            bytes.push((value >>> (bits - 8)) & 255);
            bits -= 8;
        }
    }
    return new TextDecoder().decode(new Uint8Array(bytes));
}

/* ---- Hex ---- */
function hexEncode(str) {
    return Array.from(new TextEncoder().encode(str))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}
function hexDecode(str) {
    const clean = str.trim().replace(/\s+/g, '');
    if (clean.length % 2 !== 0 || /[^0-9a-fA-F]/.test(clean)) throw new Error('Invalid hex');
    const bytes = new Uint8Array(clean.length / 2);
    for (let i = 0; i < bytes.length; i++) {
        bytes[i] = parseInt(clean.substr(i * 2, 2), 16);
    }
    return new TextDecoder().decode(bytes);
}

/* ---- Caesar / ROT ---- */
function caesarCipher(str, shift) {
    shift = ((shift % 26) + 26) % 26;
    return str.replace(/[a-z]/gi, (ch) => {
        const base = ch <= 'Z' ? 65 : 97;
        return String.fromCharCode(((ch.charCodeAt(0) - base + shift) % 26) + base);
    });
}