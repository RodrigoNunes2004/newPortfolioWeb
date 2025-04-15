document.getElementById('contact-form').addEventListener('submit', async function (e) {
    e.preventDefault(); // Prevent default form submission
  
    const form = e.target;
    const formData = new FormData(form);
    const loading = form.querySelector('.loading');
    const errorMessage = form.querySelector('.error-message');
    const sentMessage = form.querySelector('.sent-message');
  
    // Reset messages
    loading.classList.add('d-block');
    errorMessage.classList.remove('d-block');
    sentMessage.classList.remove('d-block');
  
    // Convert FormData to JSON
    const jsonData = {};
    formData.forEach((value, key) => {
      jsonData[key] = value;
    });
  
    try {
      const response = await fetch(form.action, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonData),
      });
  
      if (response.ok) {
        sentMessage.innerHTML = 'Your message has been sent. Thank you!';
        sentMessage.classList.add('d-block');
        form.reset(); // Clear the form
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      errorMessage.innerHTML = 'Error: Failed to send message. Please try again.';
      errorMessage.classList.add('d-block');
    } finally {
      loading.classList.remove('d-block');
    }
  });
