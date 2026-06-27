// ===================== NAVIGATION MENU =====================

var navLinks = document.getElementById('NavLinks');

function ShowMenu() {
    if (navLinks) navLinks.classList.add('open');
}

function HideMenu() {
    if (navLinks) navLinks.classList.remove('open');
}

document.addEventListener('DOMContentLoaded', function() {
    
    // ===================== FORM ELEMENTS =====================
    const form = document.getElementById('userForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const successMessage = document.getElementById('successMessage');
    
    // Check if form exists
    if (!form) {
        console.error("Form not found! Check if form ID is 'userForm'");
        return;
    }
    
    console.log(" Form found, validation ready!");

// ===================== PASSWORD SCANNERS (for line indicators) =====================

const PASSWORD_SCANNERS = [
    { name: "Uppercase Letter", pattern: /[A-Z]/, message: "Uppercase letter", icon: "🔠" },
    { name: "Lowercase Letter", pattern: /[a-z]/, message: "Lowercase letter", icon: "🔡" },
    { name: "Number", pattern: /[0-9]/, message: "Number", icon: "🔢" },
    { name: "Special Character", pattern: /[!@#$%^&*_]/, message: "Special character (!@#$%^&*_)", icon: "✨" },
    { name: "Length", pattern: /.{8,}/, message: "At least 8 characters", icon: "📏" }
];

// ===================== UPDATE PASSWORD STRENGTH LINES =====================

function updatePasswordStrengthLines(password) {
    const line1 = document.getElementById('strengthLine1');
    const line2 = document.getElementById('strengthLine2');
    const line3 = document.getElementById('strengthLine3');
    const line4 = document.getElementById('strengthLine4');
    const line5 = document.getElementById('strengthLine5');
    
    const lines = [line1, line2, line3, line4, line5];
    
    if (password === "") {
        lines.forEach(line => {
            if (line) {
                line.style.backgroundColor = "#e2e8f0";
                line.style.width = "0%";
            }
        });
        return;
    }
    
    let passedCount = 0;
    for (let i = 0; i < PASSWORD_SCANNERS.length; i++) {
        if (PASSWORD_SCANNERS[i].pattern.test(password)) {
            passedCount++;
            if (lines[i]) {
                lines[i].style.backgroundColor = "#10b981";
                lines[i].style.width = "100%";
            }
        } else {
            if (lines[i]) {
                lines[i].style.backgroundColor = "#e2e8f0";
                lines[i].style.width = "0%";
            }
        }
    }
    
    if (passedCount <= 2) {
        lines.forEach(line => {
            if (line && line.style.backgroundColor === "#10b981") {
                line.style.backgroundColor = "#ef4444";
            }
        });
    } else if (passedCount <= 4) {
        lines.forEach(line => {
            if (line && line.style.backgroundColor === "#10b981") {
                line.style.backgroundColor = "#f59e0b";
            }
        });
    }
}

// ===================== VALIDATION FUNCTIONS =====================

function validateEmail(email) {
    if (!email || email.trim() === "") {
        return { valid: false, message: "Email is required" };
    }
    if (!email.includes('@')) {
        return { valid: false, message: "Email must contain '@' symbol" };
    }
    const atIndex = email.indexOf('@');
    const localPart = email.substring(0, atIndex);
    if (localPart.length === 0) {
        return { valid: false, message: "Email must have text before '@'" };
    }
    const domainPart = email.substring(atIndex + 1);
    if (domainPart.length === 0) {
        return { valid: false, message: "Email must have domain after '@'" };
    }
    if (!domainPart.includes('.')) {
        return { valid: false, message: "Email domain must contain a dot (e.g., example.com)" };
    }
    const emailRegex = /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/;
    if (!emailRegex.test(email)) {
        return { valid: false, message: "Enter a valid email address" };
    }
    return { valid: true, message: "✓ Valid email" };
}

function checkEmailTypos(email) {
    if (!email || !email.includes('@')) return null;
    const [localPart, domain] = email.split('@');
    const typoCorrections = {
        'gmial.com': 'gmail.com', 'gmail.co': 'gmail.com', 'gmail.cm': 'gmail.com',
        'yahho.com': 'yahoo.com', 'yaho.com': 'yahoo.com', 'hotmal.com': 'hotmail.com',
        'hotmail.co': 'hotmail.com', 'outlok.com': 'outlook.com', 'gmai.com': 'gmail.com',
        'gnail.com': 'gmail.com'
    };
    const domainLower = domain.toLowerCase();
    if (typoCorrections[domainLower]) {
        return {
            suggested: `${localPart}@${typoCorrections[domainLower]}`,
            message: `Did you mean ${localPart}@${typoCorrections[domainLower]}?`
        };
    }
    return null;
}

function validateName(name) {
    const nameRegex = /^[A-Za-z\s\-']{2,50}$/;
    if (name === "") {
        return { valid: false, message: "Name is required" };
    }
    if (!nameRegex.test(name)) {
        return { valid: false, message: "Name must contain only letters, spaces, hyphens (2-50 characters)" };
    }
    return { valid: true, message: "✓ Valid name" };
}

function validateStrongPassword(password) {
    const results = { isValid: true, passedScanners: [], failedScanners: [], message: "" };
    for (const scanner of PASSWORD_SCANNERS) {
        if (scanner.pattern.test(password)) {
            results.passedScanners.push(scanner);
        } else {
            results.failedScanners.push(scanner);
            results.isValid = false;
        }
    }
    if (results.isValid) {
        results.message = "✅ Strong password!";
    } else {
        const missing = results.failedScanners.map(s => `${s.icon} ${s.message}`).join(", ");
        results.message = `❌ Missing: ${missing}`;
    }
    return results;
}

function validatePassword(password) {
    const result = validateStrongPassword(password);
    if (password === "") {
        return { valid: false, message: "Password is required" };
    }
    if (!result.isValid) {
        const firstMissing = result.failedScanners[0];
        return { valid: false, message: `${firstMissing.message}` };
    }
    return { valid: true, message: "✓ Strong password!" };
}

function validateConfirmPassword(password, confirmPassword) {
    if (confirmPassword === "") {
        return { valid: false, message: "Please confirm your password" };
    }
    if (password !== confirmPassword) {
        return { valid: false, message: "Passwords do not match" };
    }
    return { valid: true, message: "✓ Passwords match" };
}

// ===================== UI HELPER FUNCTIONS =====================

function showError(input, message, errorSpanId = null) {
    let error;
    if (errorSpanId) {
        error = document.getElementById(errorSpanId);
    } else {
        const inputGroup = input.parentElement;
        error = inputGroup.querySelector('.error');
    }
    if (error) {
        error.textContent = message;
        error.style.display = "block";
    }
    input.classList.add('error-border');
    input.classList.remove('success');
}

function showSuccess(input, errorSpanId = null) {
    let error;
    if (errorSpanId) {
        error = document.getElementById(errorSpanId);
    } else {
        const inputGroup = input.parentElement;
        error = inputGroup.querySelector('.error');
    }
    if (error) {
        error.textContent = "";
        error.style.display = "none";
    }
    input.classList.add('success');
    input.classList.remove('error-border');
}

function removeSuccessStyles() {
    const inputs = [nameInput, emailInput, passwordInput, confirmPasswordInput];
    inputs.forEach(input => {
        if (input) {
            input.classList.remove('success', 'error-border');
        }
    });
}

function clearAllErrors() {
    const inputs = [nameInput, emailInput, passwordInput, confirmPasswordInput];
    inputs.forEach(input => {
        if (input) {
            input.classList.remove('error-border', 'success');
        }
    });
    const errorSpans = document.querySelectorAll('.error');
    errorSpans.forEach(span => {
        span.style.display = 'none';
        span.textContent = '';
    });
    const summaryElement = document.getElementById('errorSummary');
    if (summaryElement) {
        summaryElement.style.display = 'none';
    }
}

function showErrorSummary(errors) {
    let summaryElement = document.getElementById('errorSummary');
    if (!summaryElement) {
        summaryElement = document.createElement('div');
        summaryElement.id = 'errorSummary';
        summaryElement.className = 'error-summary';
        form.insertBefore(summaryElement, form.firstChild);
    }
    if (errors.length > 0) {
        summaryElement.innerHTML = `
            <div class="error-summary-header">
                <span class="error-icon">⚠️</span>
                <strong>Please fix the following issues:</strong>
            </div>
            <ul class="error-summary-list">
                ${errors.map(error => `<li>${error}</li>`).join('')}
            </ul>
        `;
        summaryElement.style.display = 'block';
        summaryElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
        summaryElement.style.display = 'none';
    }
}

function preparePayload(userData) {
    return {
        name: userData.name,
        email: userData.email,
        registeredAt: new Date().toISOString(),
        source: 'InduTrain Registration Form'
    };
}

function showSuccessAnimation() {
    const formContainer = document.querySelector('.form-container');
    if (!formContainer) return;
    const successOverlay = document.createElement('div');
    successOverlay.className = 'success-overlay';
    successOverlay.innerHTML = `
        <div class="success-checkmark">
            <div class="check-icon">✓</div>
        </div>
        <p>Registration Successful!</p>
    `;
    formContainer.appendChild(successOverlay);
    setTimeout(() => {
        successOverlay.classList.add('fade-out');
        setTimeout(() => successOverlay.remove(), 500);
    }, 2000);
}

function showToast(message, type = 'success') {
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) existingToast.remove();
    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    let icon = type === 'error' ? '✗' : (type === 'warning' ? '⚠' : (type === 'info' ? 'ℹ' : '✓'));
    toast.innerHTML = `<span class="toast-icon">${icon}</span> ${message}`;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ===================== REAL-TIME VALIDATION =====================

if (nameInput) {
    nameInput.addEventListener('input', function() {
        const result = validateName(nameInput.value);
        if (result.valid) showSuccess(nameInput);
        else showError(nameInput, result.message);
    });
}

if (emailInput) {
    emailInput.addEventListener('input', function() {
        const email = emailInput.value;
        const result = validateEmail(email);
        const typoSuggestion = checkEmailTypos(email);
        let suggestionElement = document.getElementById('emailSuggestion');
        if (typoSuggestion && !result.valid && email.length > 5) {
            if (!suggestionElement) {
                suggestionElement = document.createElement('div');
                suggestionElement.id = 'emailSuggestion';
                suggestionElement.className = 'email-suggestion';
                emailInput.parentElement.appendChild(suggestionElement);
            }
            suggestionElement.innerHTML = `<span class="suggestion-icon">💡</span> ${typoSuggestion.message}<button type="button" class="suggestion-btn" onclick="applyEmailSuggestion('${typoSuggestion.suggested}')">Fix it</button>`;
            suggestionElement.style.display = 'block';
        } else if (suggestionElement) {
            suggestionElement.style.display = 'none';
        }
        if (email === "") showError(emailInput, "Email is required");
        else if (!result.valid) showError(emailInput, result.message);
        else showSuccess(emailInput);
    });
}

window.applyEmailSuggestion = function(suggestedEmail) {
    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.value = suggestedEmail;
        emailInput.dispatchEvent(new Event('input'));
        emailInput.focus();
    }
};

if (passwordInput) {
    passwordInput.addEventListener('input', function() {
        const password = passwordInput.value;
        const result = validateStrongPassword(password);
        
        updatePasswordStrengthLines(password);
        
        const passwordError = document.getElementById('passwordError');
        if (password === "") {
            showError(passwordInput, "Password is required", 'passwordError');
        } else if (!result.isValid) {
            const firstMissing = result.failedScanners[0];
            showError(passwordInput, firstMissing.message, 'passwordError');
        } else {
            showSuccess(passwordInput, 'passwordError');
        }
        
        if (confirmPasswordInput && confirmPasswordInput.value !== "") {
            const confirmResult = validateConfirmPassword(password, confirmPasswordInput.value);
            if (!confirmResult.valid) {
                showError(confirmPasswordInput, confirmResult.message, 'confirmError');
            } else {
                showSuccess(confirmPasswordInput, 'confirmError');
            }
        }
    });
}

if (confirmPasswordInput) {
    confirmPasswordInput.addEventListener('input', function() {
        const password = passwordInput ? passwordInput.value : "";
        const confirmPassword = confirmPasswordInput.value;
        const result = validateConfirmPassword(password, confirmPassword);
        if (!result.valid) {
            showError(confirmPasswordInput, result.message, 'confirmError');
        } else {
            showSuccess(confirmPasswordInput, 'confirmError');
        }
    });
}

// ===================== FORM SUBMIT HANDLER =====================

if (form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("🔍 Validation Started");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        
        clearAllErrors();
        let isValid = true;
        const errors = [];

        // Name Validation
        const nameResult = validateName(nameInput ? nameInput.value : '');
        if (!nameResult.valid) {
            if (nameInput) showError(nameInput, nameResult.message);
            isValid = false;
            errors.push(`❌ Name: ${nameResult.message}`);
            console.log("❌ Name: REJECTED -", nameResult.message);
        } else {
            if (nameInput) showSuccess(nameInput);
            console.log("✅ Name: APPROVED");
        }

        const emailResult = validateEmail(emailInput ? emailInput.value : '');
        if (!emailResult.valid) {
            if (emailInput) showError(emailInput, emailResult.message);
            isValid = false;
            errors.push(`❌ Email: ${emailResult.message}`);
            console.log("❌ Email: REJECTED -", emailResult.message);
        } else {
            if (emailInput) showSuccess(emailInput);
            console.log("✅ Email: APPROVED");
        }

        const passwordResult = validatePassword(passwordInput ? passwordInput.value : '');
        if (!passwordResult.valid) {
            if (passwordInput) showError(passwordInput, passwordResult.message, 'passwordError');
            isValid = false;
            errors.push(`❌ Password: ${passwordResult.message}`);
            console.log("❌ Password: REJECTED -", passwordResult.message);
        } else {
            if (passwordInput) showSuccess(passwordInput, 'passwordError');
            console.log("✅ Password: APPROVED");
        }

        const confirmResult = validateConfirmPassword(
            passwordInput ? passwordInput.value : '',
            confirmPasswordInput ? confirmPasswordInput.value : ''
        );
        if (!confirmResult.valid) {
            if (confirmPasswordInput) showError(confirmPasswordInput, confirmResult.message, 'confirmError');
            isValid = false;
            errors.push(`❌ Confirm Password: ${confirmResult.message}`);
            console.log("❌ Confirm Password: REJECTED -", confirmResult.message);
        } else {
            if (confirmPasswordInput) showSuccess(confirmPasswordInput, 'confirmError');
            console.log("✅ Confirm Password: APPROVED");
        }

        if (!isValid) {
            showErrorSummary(errors);
            if (successMessage) {
                successMessage.textContent = "❌ Please fix the errors above before submitting.";
                successMessage.style.color = "#ef4444";
                successMessage.style.display = "block";
            }
            showToast("Please fix validation errors", 'error');
            setTimeout(() => { if (successMessage) successMessage.style.display = "none"; }, 5000);
        } else {
            console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            console.log("✅ ALL VALIDATIONS PASSED");
            console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            const userName = nameInput ? nameInput.value.trim() : 'User';
            const payload = preparePayload({ name: userName, email: emailInput ? emailInput.value : '' });
            console.log("📤 DATA:", payload);
            if (successMessage) {
                successMessage.textContent = `✅ Registration successful! Welcome, ${userName}!`;
                successMessage.style.color = "#10b981";
                successMessage.style.display = "block";
            }
            showSuccessAnimation();
            showToast(`Welcome ${userName}! Registration successful!`, 'success');
            if (form) form.reset();
            removeSuccessStyles();
            
            // Reset password strength lines
            updatePasswordStrengthLines("");
            
            setTimeout(() => { if (successMessage) successMessage.style.display = "none"; }, 5000);
        }
    });
}

// ===================== DARK MODE TOGGLE =====================

const darkModeToggle = document.createElement('button');
darkModeToggle.innerHTML = '🌙 Dark Mode';
darkModeToggle.className = 'dark-mode-toggle';
darkModeToggle.setAttribute('aria-label', 'Toggle dark mode');

const header = document.querySelector('.header');
if (header) {
    header.insertBefore(darkModeToggle, header.firstChild);
}

if (localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.add('dark-mode');
    darkModeToggle.innerHTML = '☀️ Light Mode';
}

darkModeToggle.addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('darkMode', 'enabled');
        darkModeToggle.innerHTML = '☀️ Light Mode';
        showToast('Dark mode enabled', 'info');
    } else {
        localStorage.setItem('darkMode', 'disabled');
        darkModeToggle.innerHTML = '🌙 Dark Mode';
        showToast('Light mode enabled', 'info');
    }
});

// ===================== TRAINING COUNTER =====================

const trainingSection = document.querySelector('.TrainingSystems');
if (trainingSection) {
    const counterContainer = document.createElement('div');
    counterContainer.className = 'interactive-counter';
    counterContainer.innerHTML = `
        <div class="counter-wrapper">
            <h3>📊 Training Programs Enrolled</h3>
            <div class="counter-controls">
                <button id="decrementBtn" class="counter-btn">-</button>
                <span id="counterValue" class="counter-value">0</span>
                <button id="incrementBtn" class="counter-btn">+</button>
            </div>
            <p id="counterMessage" class="counter-message"></p>
        </div>
    `;
    const trainingHeading = trainingSection.querySelector('h1');
    if (trainingHeading) trainingHeading.insertAdjacentElement('afterend', counterContainer);
    
    let counter = 0;
    const counterValue = document.getElementById('counterValue');
    const decrementBtn = document.getElementById('decrementBtn');
    const incrementBtn = document.getElementById('incrementBtn');
    const counterMessage = document.getElementById('counterMessage');
    
    function updateCounterDisplay() {
        if (counterValue) counterValue.textContent = counter;
        if (counterMessage) {
            if (counter === 0) { counterMessage.textContent = "💡 Start by adding a training program!"; counterMessage.style.color = "#64748b"; }
            else if (counter === 1) { counterMessage.textContent = "🎯 Great! You've started your journey!"; counterMessage.style.color = "#3b82f6"; }
            else if (counter >= 3) { counterMessage.textContent = "🌟 Excellent! You're building a strong skillset!"; counterMessage.style.color = "#10b981"; }
        }
        localStorage.setItem('trainingCounter', counter);
    }
    
    if (decrementBtn && incrementBtn) {
        decrementBtn.addEventListener('click', () => { if (counter > 0) { counter--; updateCounterDisplay(); showToast('Program removed', 'info'); } });
        incrementBtn.addEventListener('click', () => { if (counter < 10) { counter++; updateCounterDisplay(); showToast('Program added!', 'success'); } else { showToast('Maximum 10 programs reached!', 'warning'); } });
    }
    
    const savedCounter = localStorage.getItem('trainingCounter');
    if (savedCounter !== null) { counter = parseInt(savedCounter); updateCounterDisplay(); }
}

// ===================== SCROLL TO TOP BUTTON =====================

const scrollTopBtn = document.createElement('button');
scrollTopBtn.innerHTML = '↑';
scrollTopBtn.className = 'scroll-top-btn';
document.body.appendChild(scrollTopBtn);

window.addEventListener('scroll', function() {
    if (window.scrollY > 300) scrollTopBtn.classList.add('show');
    else scrollTopBtn.classList.remove('show');
});

scrollTopBtn.addEventListener('click', function() { window.scrollTo({ top: 0, behavior: 'smooth' }); });

// ===================== ANIMATE ON SCROLL =====================

const animateElements = document.querySelectorAll('.TrainingSystems-col, .Solutions-col, .Industries-col, .Resources-col');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('animate-in'); });
}, { threshold: 0.1 });
animateElements.forEach(el => observer.observe(el));

console.log("✅ All features loaded successfully!");

});
// ===================== PASSWORD VISIBILITY TOGGLE =====================

function togglePasswordVisibility(fieldId) {
    const passwordInput = document.getElementById(fieldId);
    const icon = document.getElementById(fieldId === 'password' ? 'passwordIcon' : 'confirmPasswordIcon');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

