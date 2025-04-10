(function() {
    "use strict";

    document.addEventListener('DOMContentLoaded', function() {
        let form = document.getElementById('contact-form');

        if (form) {
            form.addEventListener('submit', function(event) {
                event.preventDefault();

                let action = "https://new-portfolio-web-sgyr-llfj1bpyg-rodrigos-projects-2e367d33.vercel.app/api/sendEmail";

                let formData = new FormData(form);
                let jsonData = {};
                formData.forEach((value, key) => {
                    jsonData[key] = value;
                });

                fetch(action, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(jsonData),
                })
                .then(response => {
                    form.querySelector('.loading').classList.remove('d-block');
                    if (response.ok) {
                        form.querySelector('.sent-message').innerHTML = "Your message has been sent. Thank you!";
                        form.querySelector('.sent-message').classList.add('d-block');
                        form.reset();
                    } else {
                        throw new Error('Form submission failed');
                    }
                })
                .catch(error => {
                    displayError(form, error);
                });
            });
        }

        function displayError(thisForm, error) {
            thisForm.querySelector('.loading').classList.remove('d-block');
            thisForm.querySelector('.error-message').innerHTML = error;
            thisForm.querySelector('.error-message').classList.add('d-block');
        }
    });
})();