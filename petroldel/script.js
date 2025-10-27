
(function(){
  const price = { petrol:90, premium:100 };
  const mode = document.getElementById('mode');
  const liters = document.getElementById('liters');
  const amount = document.getElementById('amount');
  const grade = document.getElementById('grade');
  const address = document.getElementById('address');
  const est = document.getElementById('est');
  const priceEl = document.getElementById('price');
  const proceed = document.getElementById('proceed');

  function update(){
	const p = price[grade.value];
	priceEl.textContent = '₹' + p;
	if(mode.value === 'liters'){
	  amount.parentElement.parentElement.classList.add('hidden');
	  liters.parentElement.parentElement.classList.remove('hidden');
	  const l = parseFloat(liters.value) || 0;
	  est.textContent = l.toFixed(2) + ' L — ₹' + (l * p).toFixed(2);
	} else {
	  liters.parentElement.parentElement.classList.add('hidden');
	  amount.parentElement.parentElement.classList.remove('hidden');
	  const a = parseFloat(amount.value) || 0;
	  est.textContent = (a / p).toFixed(2) + ' L — ₹' + a.toFixed(2);
	}
  }

  mode.addEventListener('change', update);
  liters.addEventListener('input', update);
  amount.addEventListener('input', update);
  grade.addEventListener('change', update);

  proceed.addEventListener('click', function(){
	if(!address.value.trim()){ alert('Enter delivery address'); address.focus(); return; }
	const confirmText = 'Place order?\n' + est.textContent + '\nAddress: ' + address.value;
	if(confirm(confirmText)){
	  alert('Payment simulated. Order placed.');
	  // reset minimal
	  liters.value = 0; amount.value = 0; update();
	}
  });

  update();
})();

