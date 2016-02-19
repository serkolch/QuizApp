$(document).ready(function(){

  var menuHeight = $('.menu').height();
  var windowHeight = $(window).height();
  $('.landing-body').css('height',windowHeight-menuHeight);

  var $firstName = $('#sign-up input').eq(0);
  var $lastName = $('#sign-up input').eq(1);
  var $email = $('#sign-up input').eq(2);
  var $password = $('#sign-up input').eq(3);
  var $terms = $('#sign-up input').eq(4)
  var $signUp = $('#sign-up-button');
  var $submitLabel = $('#submit-label');

  var termsAreAgreed = function(){

    if ($terms.prop('checked') === true) {
      ($signUp.removeClass('disabled'))
    } else {
      ($signUp.addClass('disabled'))
    }
  }

  $terms.on('click',termsAreAgreed)

  $signUp.on('click',function(){

    if (!$firstName.val() || !$lastName.val() || !$email.val() || !$password.val()){
      $submitLabel.text('Please complete empty fields');
    } else {
      if ($password.val().length<6){
        $submitLabel.text('Password must be at least 6 characters');
      } else {
        $('.segment').animate({height: '100px'},1000);
        $('#thank-you').toggle();
        $('#sign-up').toggle();
      }
    }
  })

})