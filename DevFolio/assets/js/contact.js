(function() {
    "use strict";

    let form = document.getElementById('contact-form');

    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();

            let action = form.getAttribute('action');

            if (!action) {
                displayError(form, 'The form action property is not set!');
                return;
            }

            form.querySelector('.loading').classList.add('d-block');
            form.querySelector('.error-message').classList.remove('d-block');
            form.querySelector('.sent-message').classList.remove('d-block');

            let formData = new FormData(form);

            fetch(action, {
                method: 'POST',
                body: formData,
                mode: 'cors' // Adicionado modo CORS
            })
            .then(response => {
                form.querySelector('.loading').classList.remove('d-block');
                if (response.ok) {
                    return response.json().then(data => {
                        if (data.ok) {
                            form.querySelector('.sent-message').innerHTML = data.ok;
                            form.querySelector('.sent-message').classList.add('d-block');
                            form.reset();
                        } else {
                            throw new Error(data.error || 'Form submission failed');
                        }
                    });
                } else {
                    return response.json().then(data => {
                        throw new Error(data.error || `Form submission failed with status: ${response.status}`);
                    });
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
})();