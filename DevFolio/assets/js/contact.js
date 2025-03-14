(function() {
    "use strict";
  
    let forms = document.querySelectorAll('.php-email-form');
  
    forms.forEach(function(form) {
      form.addEventListener('submit', function(event) {
        event.preventDefault();
  
        let thisForm = this;
        let action = thisForm.getAttribute('action');
        
        if (!action) {
          displayError(thisForm, 'The form action property is not set!');
          return;
        }
        
        thisForm.querySelector('.loading').classList.add('d-block');
        thisForm.querySelector('.error-message').classList.remove('d-block');
        thisForm.querySelector('.sent-message').classList.remove('d-block');
  
        let formData = new FormData(thisForm);
  
        fetch(action, {
          method: 'POST',
          body: formData,
        })
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error(`${response.status} ${response.statusText}`);
          }
        })
        .then(data => {
          thisForm.querySelector('.loading').classList.remove('d-block');
          if (data.success) {
            thisForm.querySelector('.sent-message').innerHTML = data.message;
            thisForm.querySelector('.sent-message').classList.add('d-block');
            thisForm.reset();
          } else {
            throw new Error(data.message ? data.message : 'Form submission failed and no error message returned from: ' + action);
          }
        })
        .catch(error => {
          displayError(thisForm, error);
        });
      });
    });
  
    function displayError(thisForm, error) {
      thisForm.querySelector('.loading').classList.remove('d-block');
      thisForm.querySelector('.error-message').innerHTML = error;
      thisForm.querySelector('.error-message').classList.add('d-block');
    }
  
  })();