/* ============================================
   Password Tool — check + generate + copy
   ============================================ */

const passwordInput  = document.getElementById("password-input");
const passwordToggle = document.getElementById("password-toggle");
const strengthFill   = document.getElementById("strength-fill");
const strengthText   = document.getElementById("strength-text");
const strengthRules  = document.getElementById("strength-rules");

const passwordOutput = document.getElementById("password-output");
const passwordCopy   = document.getElementById("password-copy");
const generateButton = document.getElementById("password-generate");

/* ---- Show / hide checked password ---- */
passwordToggle.addEventListener("click", () => {
    const hidden = passwordInput.type === "password";
    passwordInput.type = hidden ? "text" : "password";
    passwordToggle.innerHTML = hidden
        ? '<i class="bi bi-eye-slash"></i>'
        : '<i class="bi bi-eye"></i>';
});

/* ---- Rules ---- */
const rules = {
    length: (v) => v.length >= 12,
    upper:  (v) => /[A-Z]/.test(v),
    lower:  (v) => /[a-z]/.test(v),
    number: (v) => /[0-9]/.test(v),
    symbol: (v) => /[^A-Za-z0-9]/.test(v),
};

function evaluatePassword(value) {
    let passed = 0;
    Object.entries(rules).forEach(([key, test]) => {
        const li = strengthRules.querySelector(`[data-rule="${key}"]`);
        const ok = test(value);
        li.classList.toggle("rule-passed", ok);
        li.querySelector("i").className = ok
            ? "bi bi-check-circle"
            : "bi bi-x-circle";
        if (ok) passed++;
    });
    return passed;
}

function renderStrength(value) {
    if (!value) {
        strengthFill.style.width = "0%";
        strengthFill.style.backgroundColor = "var(--accent-red)";
        strengthText.textContent = "—";
        strengthText.style.color = "var(--default)";
        return;
    }

    const passed = evaluatePassword(value);
    strengthFill.style.width = `${(passed / 5) * 100}%`;

    let label, color;
    if (passed <= 1)       { label = "Very Weak";   color = "var(--accent-red)"; }
    else if (passed === 2) { label = "Weak";        color = "var(--accent-red)"; }
    else if (passed === 3) { label = "Fair";        color = "var(--accent-yellow)"; }
    else if (passed === 4) { label = "Strong";      color = "var(--accent-blue)"; }
    else                   { label = "Very Strong"; color = "var(--accent-blue)"; }

    strengthFill.style.backgroundColor = color;
    strengthText.textContent = label;
    strengthText.style.color = color;
}

passwordInput.addEventListener("input", (e) => renderStrength(e.target.value));

/* ---- Generate ---- */
function generatePassword(length = 16) {
    const upper   = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lower   = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()-_=+[]{};:,.<>?";
    const all = upper + lower + numbers + symbols;

    const required = [
        upper[Math.floor(Math.random() * upper.length)],
        lower[Math.floor(Math.random() * lower.length)],
        numbers[Math.floor(Math.random() * numbers.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
    ];

    const remaining = Array.from({ length: length - required.length }, () =>
        all[Math.floor(Math.random() * all.length)]
    );

    const password = [...required, ...remaining];
    for (let i = password.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [password[i], password[j]] = [password[j], password[i]];
    }
    return password.join("");
}

generateButton.addEventListener("click", () => {
    passwordOutput.value = generatePassword(16);
    passwordCopy.classList.remove("copied");
    passwordCopy.innerHTML = '<i class="bi bi-clipboard"></i><span>Copy</span>';
});

/* ---- Copy ---- */
passwordCopy.addEventListener("click", async () => {
    if (!passwordOutput.value) return;

    try {
        await navigator.clipboard.writeText(passwordOutput.value);
    } catch {
        passwordOutput.select();
        document.execCommand("copy");
    }

    passwordCopy.classList.add("copied");
    passwordCopy.innerHTML = '<i class="bi bi-check2"></i><span>Copied</span>';

    setTimeout(() => {
        passwordCopy.classList.remove("copied");
        passwordCopy.innerHTML = '<i class="bi bi-clipboard"></i><span>Copy</span>';
    }, 1500);
});