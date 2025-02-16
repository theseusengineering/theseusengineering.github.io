/***********************
  TOGGLE CUSTOM FORM
***********************/
function toggleCustomForm() {
    const formContainer = document.getElementById('customForm');
    if (!formContainer) return;
  
    if (formContainer.style.display === 'none' || formContainer.style.display === '') {
      formContainer.style.display = 'block';
    } else {
      formContainer.style.display = 'none';
    }
  }
  
  /***********************
    CUSTOM DESIGN FORM
  ***********************/
  const customDesignForm = document.getElementById('customDesignForm');
  if (customDesignForm) {
    customDesignForm.addEventListener('submit', function(e) {
      e.preventDefault();
  
      // Simulate form submission (AJAX or fetch here if you have a backend)
      document.getElementById('customFormMessage').textContent =
        'Thank you! We will contact you soon about your custom design request.';
  
      // Reset form
      customDesignForm.reset();
    });
  }
  
  /***********************
    STL UPLOAD FORM
  ***********************/
  const stlForm = document.getElementById('stlForm');
  if (stlForm) {
    stlForm.addEventListener('submit', function(e) {
      e.preventDefault();
  
      const fileInput = document.getElementById('fileInput');
      if (!fileInput.files[0]) {
        alert('Please select an STL file to upload.');
        return;
      }
  
      // Simulate file upload (AJAX or fetch here if you have a backend)
      document.getElementById('stlMessage').textContent =
        'Your STL file has been uploaded. We’ll get back to you with a quote shortly.';
  
      // Reset the form
      stlForm.reset();
    });
  }