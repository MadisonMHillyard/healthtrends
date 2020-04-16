
function getCookie(name) {
  var cookieValue = null;
  if (document.cookie && document.cookie !== '') {
      var cookies = document.cookie.split(';');
      for (var i = 0; i < cookies.length; i++) {
          var cookie = cookies[i].trim();
          // Does this cookie string begin with the name we want?
          if (cookie.substring(0, name.length + 1) === (name + '=')) {
              cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
              break;
          }
      }
  }
  return cookieValue;
}


$('#signinButton').click(function() {
  // signInCallback defined in step 6.
  auth2.grantOfflineAccess().then(signInCallback);
});
function signInCallback(authResult) {
  if (authResult) {
    console.log(authResult)
    // Hide the sign-in button now that the user is authorized, for example:
    $('#signinButton').attr('style', 'display: none');
    $('#goToQuery').attr('style', 'display: block');
    // Send the code to the server
    $.ajax({
      type: 'POST',
      url: window.location.href + '/tokensignin',
      // Always include an `X-Requested-With` header in every AJAX request,
      // to protect against CSRF attacks.
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRFToken': getCookie('csrftoken')
      },
      contentType: 'application/octet-stream; charset=utf-8',
      success: function(result) {
        console.log(result)
        return result;
        // Handle or verify the server response.
      },
      processData: false,
      data: authResult['code']
    });
  } else {
    console.log("ERROR IN AUTH CALLBACK");
    // There was an error.
  }
}

function revokeAllScopes(){
  auth2.disconnect();
  $('#signinButton').attr('style', 'display: block');
}