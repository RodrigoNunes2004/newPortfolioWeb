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
          thisForm.querySelector('.loading').classList.remove('d-block');
          if (response.ok) {
              return response.json().then(data => {
                  if (data.ok) { // Formspree retorna {"ok": "Your message has been sent."} em caso de sucesso
                      thisForm.querySelector('.sent-message').innerHTML = data.ok;
                      thisForm.querySelector('.sent-message').classList.add('d-block');
                      thisForm.reset();
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