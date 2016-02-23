$(document).ready(function(){

  $('.ui.dropdown')
    .dropdown()
  ;

  var height;
  var width;

  var cohorts = ['Sample','Persephone','Zoolander','BLT','Fargo'];
  var randomCohort = function(){
    return cohorts[Math.floor(Math.random()*cohorts.length)]
  }

  var sizeDivs = function(){  
    height = $(window).height()-$('#nav-bar').height()-32;
    width = $(window).width()-$('.side-bar').width()-57;
    $('.ui.blue.segment').css('height',height);
    $('#left-data').css('height',$('.test').height()-$('.ui.dividing.header').height()-10)
    $('.test').css({'height':height,'width':width})
  }

  var marginTop = function(){
    var marginTop = $('.test').height()-$('.ui.dividing.header').height()-$('#chart1').height()-options.height
    $('#chart2').css('margin-top',marginTop)
  }

  sizeDivs();
  
  var rand = function(){
    return Math.floor(Math.random()*6);
  }

  var data = function(){
    return {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      // Our series array that contains series objects or in this case series data arrays
      series: [
        [rand(), rand(), rand(), rand(), rand()]
      ]
    }
  };

  var options = {
    width: width-30-$('#left-data').width(),
    height: (height/2)-35
  }

  $('.ui.list').css({'margin': 0, 'height':options.height-25-$('h5.ui.header').height()})

  // Create a new line chart object where as first parameter we pass in a selector
  // that is resolving to our chart container element. The Second parameter
  // is the actual data object.
  var chart1 = new Chartist.Line('#chart1', data(), options);
  var chart2 = new Chartist.Line('#chart2', data(), options);
  marginTop();
  $(window).on('resize',function(){
    sizeDivs();
    marginTop();
    
    options = {
      width: width-30-$('#left-data').width(),
      height: (height/2)-35
    }
    $('.ui.list').css({'margin': 0, 'height':options.height-25-$('h5.ui.header').height()})

    chart1.update(data(),options)
    chart2.update(data(),options)
  })

})