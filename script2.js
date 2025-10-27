// Login page behavior for phone/email toggle and user/operator flows
document.addEventListener('DOMContentLoaded', function () {
	const segButtons = Array.from(document.querySelectorAll('.seg-btn'));
	const identifier = document.getElementById('identifier');
	const identifierLabel = document.getElementById('identifier-label');
	const identifierHint = document.getElementById('identifier-hint');
	const form = document.getElementById('login-form');
	const password = document.getElementById('password');
	const result = document.getElementById('result');

	// default mode
	let mode = 'email';

	function setMode(m) {
		mode = m;
		segButtons.forEach(b => {
			const active = b.dataset.mode === m;
			b.classList.toggle('active', active);
			b.setAttribute('aria-pressed', active ? 'true' : 'false');
		});

		if (m === 'phone') {
			identifierLabel.textContent = 'Phone';
			identifier.placeholder = '+1 555 555 5555';
			identifier.inputMode = 'tel';
			identifier.autocomplete = 'tel';
		} else {
			identifierLabel.textContent = 'Email';
			identifier.placeholder = 'you@example.com';
			identifier.inputMode = 'email';
			identifier.autocomplete = 'email';
		}
		identifierHint.textContent = '';
		identifier.value = '';
		identifier.focus();
	}

	segButtons.forEach(btn => {
		btn.addEventListener('click', () => setMode(btn.dataset.mode));
	});

	function isValidEmail(v) {
		// simple email validation
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
	}

	function isValidPhone(v) {
		// allow +, spaces, dashes, digits; require 7-15 digits
		const digits = v.replace(/[^0-9]/g, '');
		return digits.length >= 7 && digits.length <= 15;
	}

	function normalizePhone(v) {
		return v.replace(/[^0-9+]/g, '');
	}

	form.addEventListener('submit', function (e) {
		e.preventDefault();
		const idVal = identifier.value.trim();
		const pwd = password.value;
		const role = (form.querySelector('input[name="role"]:checked') || {}).value || 'user';
		const remember = document.getElementById('remember').checked;

		let ok = true;
		identifierHint.textContent = '';

		if (!idVal) {
			identifierHint.textContent = mode === 'phone' ? 'Phone is required.' : 'Email is required.';
			ok = false;
		} else if (mode === 'email' && !isValidEmail(idVal)) {
			identifierHint.textContent = 'Enter a valid email address.';
			ok = false;
		} else if (mode === 'phone' && !isValidPhone(idVal)) {
			identifierHint.textContent = 'Enter a valid phone number (7–15 digits).';
			ok = false;
		}

		if (!pwd || pwd.length < 6) {
			result.textContent = 'Password must be at least 6 characters.';
			result.style.color = 'var(--danger)';
			ok = false;
		} else {
			result.textContent = '';
		}

		if (!ok) return;

		// build payload (simulated)
		const payload = {
			method: mode,
			identifier: mode === 'phone' ? normalizePhone(idVal) : idVal.toLowerCase(),
			role,
			remember
		};

		// simulate submission: show friendly message and log payload (masking sensitive bits)
		const maskedIdentifier = mode === 'phone'
			? '••••' + payload.identifier.slice(-4)
			: payload.identifier.replace(/(^[^@]{2})([^@]*)(@.*)$/, (_, a, b, c) => a + '•••' + c);

		result.style.color = '#0f172a';
		result.textContent = `Signing in as ${role} with ${mode}: ${maskedIdentifier}…`;

		// For development: print the payload (with masked password) to console
		const debug = Object.assign({}, payload, { password: '••••••' });
		console.info('Simulated login payload:', debug);

		// Simulate async response
		setTimeout(() => {
			result.textContent = `Welcome back, ${role === 'operator' ? 'operator' : 'user'}!`;
		}, 800);
	});

	identifier.addEventListener('input', () => {
		identifierHint.textContent = '';
		result.textContent = '';
	});

	// initialize
	setMode('email');
});
