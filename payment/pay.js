// Minimal payment helper utilities
// Exposes a small API on window.PaymentUtils for validation and simulated payments.
(function(){
	'use strict';

	function luhnCheck(num){
		const s = String(num).replace(/\s+/g,'');
		if(!/^[0-9]{13,19}$/.test(s)) return false;
		let sum=0, alt=false;
		for(let i=s.length-1;i>=0;i--){
			let n = parseInt(s.charAt(i),10);
			if(alt){ n *= 2; if(n > 9) n -= 9; }
			sum += n; alt = !alt;
		}
		return sum % 10 === 0;
	}

	function validateExpiry(mmYY){
		if(!/^(0[1-9]|1[0-2])\/(\d{2})$/.test(mmYY)) return false;
		const parts = mmYY.split('/');
		const mm = parseInt(parts[0],10); const yy = parseInt(parts[1],10);
		const now = new Date();
		const year = now.getFullYear() % 100;
		const month = now.getMonth() + 1;
		return yy > year || (yy === year && mm >= month);
	}

	function validateCvv(cvv){
		return /^[0-9]{3,4}$/.test(String(cvv));
	}

	function validateUpi(id){
		return typeof id === 'string' && id.includes('@') && id.length >= 3;
	}

	function simulatePayment(method, details){
		// method: 'card'|'upi'|'cod' ; details: object with method-specific fields
		return new Promise((resolve, reject) => {
			// basic validation per method
			if(method === 'card'){
				if(!luhnCheck(details.number)) return reject(new Error('Invalid card number'));
				if(!validateExpiry(details.exp)) return reject(new Error('Invalid expiry'));
				if(!validateCvv(details.cvv)) return reject(new Error('Invalid CVV'));
			} else if(method === 'upi'){
				if(!validateUpi(details.upi)) return reject(new Error('Invalid UPI ID'));
			} else if(method === 'cod'){
				// no validation
			} else {
				return reject(new Error('Unknown payment method'));
			}

			// simulate network/payment processing delay
			setTimeout(()=>{
				// simulate success 95% of the time
				if(Math.random() < 0.95){
					resolve({ success: true, txId: 'TX' + Date.now() });
				} else {
					reject(new Error('Payment failed (simulated)'));
				}
			}, 900);
		});
	}

	// expose
	window.PaymentUtils = {
		luhnCheck,
		validateExpiry,
		validateCvv,
		validateUpi,
		simulatePayment
	};
})();

