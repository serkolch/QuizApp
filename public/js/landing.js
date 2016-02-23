$(document).ready(function(){

  // Set background image to height of window
  var menuHeight = $('.menu').height();
  var windowHeight = $(window).height();
  $('.landing-body').css('height',windowHeight-menuHeight-1);

  // Enable log in when there's an email and password (via submit button, enter button)
  var $emailLogIn = $('.sign-in input').eq(0);
  var $passwordLogIn = $('.sign-in input').eq(1);
  var $logIn = $('#sign-in-button')
  var checkLogIns = function(){
    if ($emailLogIn.val() && $passwordLogIn.val().length >= 5){
      $logIn.removeClass('disabled')
    } else {
      $logIn.addClass('disabled')
    }
  }
  $('.sign-in input').on('keypress',checkLogIns);
  $('.sign-in input').on('keydown',function(event){
    if (event.keyCode===13){
      if (!$emailLogIn.val() || $passwordLogIn.val().length < 6) {
        event.preventDefault();
      }
    }
  })
})