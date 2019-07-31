'use strict';

// Document ready
$(document).on('ready', function(){

  // Magnific popup gallery
  $('.gallery').each(function() {
    $(this).magnificPopup({
      delegate: '.gallery-item',
      type: 'image',
      gallery:{
        enabled: true,
        tCounter: '%curr% из %total%'
      },
      zoom: {
        enabled: true, // By default it's false, so don't forget to enable it

        duration: 300, // duration of the effect, in milliseconds
        easing: 'ease-in-out', // CSS transition easing function

        // The "opener" function should return the element from which popup will be zoomed in
        // and to which popup will be scaled down
        // By defailt it looks for an image tag:
        opener: function(openerElement) {
          // openerElement is the element on which popup was initialized, in this case its <a> tag
          // you don't need to add "opener" option if this code matches your needs, it's defailt one.
          return openerElement.is('img') ? openerElement : openerElement.find('img');
        }
      }
    });
  });

  // Magnific popup one image
  $('.image-popup').magnificPopup({
    type: 'image',
    closeOnContentClick: true,
    mainClass: 'mfp-img-mobile',
    image: {
      verticalFit: true
    }
  });

  // Magnific popup video
  $('.popup-youtube, .popup-vimeo, .popup-gmaps').magnificPopup({
    disableOn: 700,
    type: 'iframe',
    mainClass: 'mfp-fade',
    removalDelay: 160,
    preloader: true,
    fixedContentPos: false
  });

  $('.open-popup-link').magnificPopup({
    type: 'inline',
    midClick: true,
    showCloseBtn: false,
    callbacks: {
      beforeOpen: function() {
        var width = $(window).width();
        var btn = $('.header__btn');
        var shadow = $('.body__shadow');
        var body = $('body');
        var mobile = $('.mobile__nav');

        if (width <= 991 && body.hasClass('scroll-lock') && mobile.hasClass('is-active')) {
          btn.removeClass('is-active');
          shadow.removeClass('is-active');
          body.removeClass('scroll-lock');
          mobile.removeClass('is-active');
        }
      }
    }
  });

  $('.popup__close').on('click', function(){
    $.magnificPopup.close();
  })

  $('.advantages__block').matchHeight();

  $('.comments__carousel').slick({
    slidesToShow: 1,
    centerMode: true,
    variableWidth: true,
    centerPadding: '0',
    lazyLoad: 'ondemand',
    infinite: true,
    dots: false,
    arrows: true,
    prevArrow: '#comments__prev',
    nextArrow: '#comments__next',
    responsive: [
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 1,
          variableWidth: false,
          centerPadding: '0px',
          centerMode: false
        }
      }
    ]
  });

  $('.about__carousel').slick({
    slidesToShow: 2,
    slidesToScroll: 1,
    infinite: true,
    responsive: [
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 1
        }
      }
    ]
  });

  doctorsTab();
  inputFocus();
  mobileNav();

  // Chrome Smooth Scroll
  try {
    $.browserSelector();
    if($("html").hasClass("chrome")) {
      $.smoothScroll();
    }
  } catch(err) {

  };

  // simpleForm version 2015-09-23 14:30 GMT +2
  simpleForm('form.form-callback');
});

$(window).on('load', function() {
  $(".loader").delay(400).fadeOut("slow");
});

$(window).on('scroll', function() { });
$(window).on('resize', function() { 
  var width = $(window).width();

  if (width >= 992) {
    $('.header__btn').removeClass('is-active');
    $('.body__shadow').removeClass('is-active');
    $('body').removeClass('scroll-lock');
    $('.mobile__nav').removeClass('is-active');
  }

});

/*
version 2015-09-23 14:30 GMT +2
*/
function simpleForm(form, callback) {
  $(document).on('submit', form, function(e){
    e.preventDefault();
    var formData = {};
    var hasFile = false;
    if ($(this).find('[type=file]').length < 1) {
      formData = $(this).serialize();
    }
    else {
      formData = new FormData();
      $(this).find('[name]').each(function(){

        switch($(this).prop('type')) {

          case 'file':
            if ($(this)[0]['files'].length > 0) {
              formData.append($(this).prop('name'), $(this)[0]['files'][0]);
              hasFile = true;
            }
            break;

          case 'radio':
          case 'checkbox':
            if (!$(this).prop('checked')) {
              break;
            }
            formData.append($(this).prop('name'), $(this).val().toString());
            break;

          default:
            formData.append($(this).prop('name'), $(this).val().toString());
            break;
        }
      });
    }

    $.ajax({
      url: $(this).prop('action'),
      data: formData,
      type: 'POST',
      contentType : hasFile ? 'multipart/form-data' : 'application/x-www-form-urlencoded',
      cache       : false,
      processData : false,
      success: function(response) {
        $(form).removeClass('ajax-waiting');
        $(form).find("[type=submit]").prop("disabled", false);
        $(form).html($(response).find(form).html());

        if (typeof callback === 'function') {
          callback(response);
        }
      }
    });

    $(form).addClass('ajax-waiting');
    $(form).find("[type=submit]").prop("disabled", true);

    return false;
  });
}

function doctorsTab() {
  var body = $('#doctorsTab');
  var mobile = $('.doctors__nav-mobile');
  var links = body.find('a');
  var linksActive = body.find('a.active');

  mobile.find('span').html(linksActive.text());

  mobile.on('click', function(){
    var _this = $(this);
    if (_this.parent().hasClass('is-active')) {
      _this.parent().removeClass('is-active');
    } else {
      _this.parent().addClass('is-active');
    }
  });

  links.on('click', function(){
    var text = $(this).text();
    mobile.find('span').html($(this).text());
  });

  // console.log(linksActive.text());
  
}

function inputFocus(){
  var jinput = $(".j-input");

  jinput.each(function(){
    var _this = $(this);
    var val = _this.val();

    if (val.length > 0 && _this.is('input') || val.length > 0 && _this.is('textarea')) {
      _this.parent().addClass("active-full");
    } else {
      _this.parent().removeClass("active-full");
    }

    // input on focus
    _this.focus(function () {
      _this.parent().addClass("active");
    }).blur(function () {
      _this.parent().removeClass("active");
    })

    _this.on('change', function () {
      var val = _this.val();

      if (val == '') {
        _this.parent().removeClass("active-full");
      } else {
        _this.parent().addClass("active-full");
      }
    });
  })
}

function mobileNav() {
  var width = $(window).width();
  var btn = $('.header__btn');
  var shadow = $('.body__shadow');
  var body = $('body');
  var mobile = $('.mobile__nav');
  var close = mobile.find('.mobile__nav-close');

  btn.on('click', function(){
    var _this = $(this);

    if (_this.hasClass('is-active')) {
      _this.removeClass('is-active');
      shadow.removeClass('is-active');
      body.removeClass('scroll-lock');
      mobile.removeClass('is-active');
    } else {
      _this.addClass('is-active');
      shadow.addClass('is-active');
      body.addClass('scroll-lock');
      mobile.addClass('is-active');
    }
  });

  shadow.on('click', function(){
    if (body.hasClass('scroll-lock') && mobile.hasClass('is-active')) {
      btn.removeClass('is-active');
      shadow.removeClass('is-active');
      body.removeClass('scroll-lock');
      mobile.removeClass('is-active');
    }
  });

  close.on('click', function(e){
    if (body.hasClass('scroll-lock') && mobile.hasClass('is-active')) {
      btn.removeClass('is-active');
      shadow.removeClass('is-active');
      body.removeClass('scroll-lock');
      mobile.removeClass('is-active');
    }
  });
  
}