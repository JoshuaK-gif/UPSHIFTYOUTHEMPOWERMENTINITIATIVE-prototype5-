form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const firstName = document.getElementById('first-name').value.trim();
    const lastName  = document.getElementById('last-name').value.trim();
    const phone     = document.getElementById('phone').value.trim();
    const email     = document.getElementById('email').value.trim();
    const subject   = document.getElementById('subject').value;
    const message   = document.getElementById('message').value.trim();

    // First name — letters only, at least 2 characters
    const nameRegex = /^[a-zA-Z]{2,}$/;
    if (!firstName || !nameRegex.test(firstName)) {
        alert('Please enter a valid First Name (letters only, at least 2 characters).');
        document.getElementById('first-name').focus();
        return;
    }

    // Last name — letters only, at least 2 characters
    if (!lastName || !nameRegex.test(lastName)) {
        alert('Please enter a valid Last Name (letters only, at least 2 characters).');
        document.getElementById('last-name').focus();
        return;
    }

    // Phone — numbers only, between 7 and 15 digits
    const phoneRegex = /^[0-9]{7,15}$/;
    if (phone && !phoneRegex.test(phone)) {
        alert('Please enter a valid Phone Number (numbers only).');
        document.getElementById('phone').focus();
        return;
    }

    // Email — must be a real format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        alert('Please enter a valid Email address.');
        document.getElementById('email').focus();
        return;
    }

    // Subject — must be selected
    if (!subject) {
        alert('Please select a Subject.');
        document.getElementById('subject').focus();
        return;
    }

    // Message — at least 20 characters, no repeated characters like "aaaaaaa"
    const repeatedCharsRegex = /(.)\1{4,}/;
    if (!message || message.length < 20) {
        alert('Please enter a message with at least 20 characters.');
        document.getElementById('message').focus();
        return;
    }
    if (repeatedCharsRegex.test(message)) {
        alert('Please enter a valid message.');
        document.getElementById('message').focus();
        return;
    }

    // Check message has real words (at least 3 words)
    const wordCount = message.split(/\s+/).filter(word => word.length > 1).length;
    if (wordCount < 3) {
        alert('Please enter a meaningful message with at least 3 words.');
        document.getElementById('message').focus();
        return;
    }

    // All good — submit
    const formData = new FormData(form);

    const originalText = submitBtn.textContent;
    submitBtn.textContent = "Sending...";
    submitBtn.disabled = true;

    try {
        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        if (response.ok) {
            alert("Success! Your message has been sent.");
            form.reset();
        } else {
            alert("Error: " + data.message);
        }

    } catch (error) {
        alert("Something went wrong. Please try again.");

    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
});