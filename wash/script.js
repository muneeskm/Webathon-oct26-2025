document.addEventListener('DOMContentLoaded', function() {
    const bookingForm = document.getElementById('bookingForm');
    const confirmation = document.getElementById('confirmation');
    const bookingDetails = document.getElementById('bookingDetails');

    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form values
        const formData = {
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            date: document.getElementById('date').value,
            time: document.getElementById('time').value,
            service: document.getElementById('service').value,
            carType: document.getElementById('carType').value,
            notes: document.getElementById('notes').value
        };

        // Validate form data
        if (!validateForm(formData)) {
            return;
        }

        // Display confirmation
        displayConfirmation(formData);

        // Here you would typically send the data to a server
        // For this example, we're just showing the confirmation
        console.log('Booking details:', formData);
    });

    function validateForm(data) {
        // Basic validation
        if (!data.name || !data.phone || !data.email || !data.date || !data.time || !data.service || !data.carType) {
            alert('Please fill in all required fields');
            return false;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            alert('Please enter a valid email address');
            return false;
        }

        // Phone validation (basic)
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(data.phone.replace(/[^0-9]/g, ''))) {
            alert('Please enter a valid 10-digit phone number');
            return false;
        }

        // Date validation
        const selectedDate = new Date(data.date);
        const today = new Date();
        if (selectedDate < today) {
            alert('Please select a future date');
            return false;
        }

        return true;
    }

    function displayConfirmation(data) {
        // Hide the form
        bookingForm.style.display = 'none';

        // Show confirmation
        confirmation.classList.remove('hidden');

        // Get service name
        const serviceName = document.getElementById('service').options[document.getElementById('service').selectedIndex].text;

        // Format date
        const formattedDate = new Date(data.date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Display booking details
        bookingDetails.innerHTML = `
            <h3>Booking Details:</h3>
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Phone:</strong> ${data.phone}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Date:</strong> ${formattedDate}</p>
            <p><strong>Time:</strong> ${data.time}</p>
            <p><strong>Service:</strong> ${serviceName}</p>
            <p><strong>Car Type:</strong> ${data.carType}</p>
            ${data.notes ? `<p><strong>Special Instructions:</strong> ${data.notes}</p>` : ''}
        `;
    }
});
