import $ from "jquery";
import "./Custom.js";

// JS and jQuery Scripts
$(function () {
  // Setup for blog
  // $("a").has("img").addClass("entry__thumb-link")

  //Setup event handler to detect orientation change and then re-correct site position in referance to the menu selection
  window.addEventListener("orientationchange", function () {
    var elm = $(".menu");
    if (elm.has(".selected")) {
      setTimeout("$('.selected').click();", 100);
    }
  });

  // Setup handler to detect window resize and then re-correct
  let resizeTimer;

  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      // Run code here after resizing has finished
      var elm = $(".menu");
      if (elm.has(".selected")) {
        $(".selected").trigger("click");
      }
    }, 250);
  });

  // Setup for touchswipe on main page
  document.addEventListener("touchstart", handleTouchStart, false);
  document.addEventListener("touchmove", handleTouchMove, false);
  var xDown = null;
  var yDown = null;

  function handleTouchStart(evt) {
    xDown = evt.touches[0].clientX;
    yDown = evt.touches[0].clientY;
  }

  function handleTouchMove(evt) {
    if (!xDown || !yDown) {
      return;
    }
    var xUp = evt.touches[0].clientX;
    var yUp = evt.touches[0].clientY;
    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;

    if (Math.abs(xDiff) > Math.abs(yDiff)) {
      /*most significant*/
      if (xDiff > 0) {
        /* left swipe */
        /* check where we are */
        console.log("left swipe");
        if (
          !$("a.link").hasClass("selected") ||
          $("a.link[href*='#home']").hasClass("selected")
        ) {
          setPosition("#about");
          $("a.link[href*='#about']").addClass("selected");
          $("a.link[href*='#home']").removeClass("selected");
        } else if ($("a.link[href*='#about']").hasClass("selected")) {
          setPosition("#portfolio");
          $("a.link[href*='#portfolio']").addClass("selected");
          $("a.link[href*='#about']").removeClass("selected");
        } else if ($("a.link[href*='#portfolio']").hasClass("selected")) {
          setPosition("#social");
          $("a.link[href*='#social']").addClass("selected");
          $("a.link[href*='#portfolio']").removeClass("selected");
        }
      } else {
        /* right swipe */
        if ($("a.link[href*='#social']").hasClass("selected")) {
          setPosition("#portfolio");
          $("a.link[href*='#portfolio']").addClass("selected");
          $("a.link[href*='#social']").removeClass("selected");
        } else if ($("a.link[href*='#portfolio']").hasClass("selected")) {
          setPosition("#about");
          $("a.link[href*='#about']").addClass("selected");
          $("a.link[href*='#portfolio']").removeClass("selected");
        } else if ($("a.link[href*='#about']").hasClass("selected")) {
          setPosition("#home");
          $("a.link[href*='#home']").addClass("selected");
          $("a.link[href*='#about']").removeClass("selected");
        }
      }
    } else {
      if (yDiff > 0) {
        /* up swipe */
      } else {
        /* down swipe */
      }
    }
    /* reset values */
    xDown = null;
    yDown = null;
  }
});

// Parallax code
$(function () {
  $("a.link").on("click", function () {
    setPosition($(this).attr("href"));
    $("a.link").removeClass("selected");
    $(this).addClass("selected");
    return false;
  });
});

function setPosition(check) {
  var dWidth = $(window).width() / 3;
  if (check === "#home") {
    $("#wrapper").animate({ scrollLeft: 0 });
    $("#clouds-near-svg").css({ transform: "translate(200px)" });
    $("#clouds-middle-svg").css({ transform: "translate(200px)" });
    $("#clouds-far-svg").css({ transform: "translate(-50px)" });
    $("#clouds-far-svg-2").css({ transform: "translate(-50px)" });
    $("#mt-rainier-svg").css({ transform: "translate(-25px)" });
    $("#mt-range-svg").css({ transform: "translate(-20px)" });
    $("#moon-city-svg").css({ transform: "translate(-50px)" });
    $("#large-buildings-svg").css({ transform: "translate(100px)" });
    $("#seattle-city-svg").css({ transform: "translate(50px)" });
    $("#far-buildings-svg").css({ transform: "translate(50px)" });
  } else if (check === "#about") {
    $("#wrapper").animate({ scrollLeft: dWidth * 3 });
    $("#clouds-near-svg").css({ transform: "translate(50px)" });
    $("#clouds-middle-svg").css({ transform: "translate(100px)" });
    $("#clouds-far-svg").css({ transform: "translate(-75px)" });
    $("#clouds-far-svg-2").css({ transform: "translate(-75px)" });
    $("#mt-rainier-svg").css({ transform: "translate(-30px)" });
    $("#mt-range-svg").css({ transform: "translate(-40px)" });
    $("#moon-city-svg").css({ transform: "translate(-60px)" });
    $("#large-buildings-svg").css({ transform: "translate(0px)" });
    $("#seattle-city-svg").css({ transform: "translate(0px)" });
    $("#far-buildings-svg").css({ transform: "translate(25px)" });
  } else if (check === "#portfolio") {
    $("#wrapper").animate({ scrollLeft: dWidth * 6 });
    $("#clouds-near-svg").css({ transform: "translate(-100px)" });
    $("#clouds-middle-svg").css({ transform: "translate(0px)" });
    $("#clouds-far-svg").css({ transform: "translate(-100px)" });
    $("#clouds-far-svg-2").css({ transform: "translate(-100px)" });
    $("#mt-rainier-svg").css({ transform: "translate(-45px)" });
    $("#mt-range-svg").css({ transform: "translate(-60px)" });
    $("#moon-city-svg").css({ transform: "translate(-70px)" });
    $("#large-buildings-svg").css({ transform: "translate(-100px)" });
    $("#seattle-city-svg").css({ transform: "translate(-50px)" });
    $("#far-buildings-svg").css({ transform: "translate(0px)" });
  } else if (check === "#social") {
    $("#wrapper").animate({ scrollLeft: dWidth * 9 });
    $("#clouds-near-svg").css({ transform: "translate(-250px)" });
    $("#clouds-middle-svg").css({ transform: "translate(-100px)" });
    $("#clouds-far-svg").css({ transform: "translate(-125px)" });
    $("#clouds-far-svg-2").css({ transform: "translate(-125px)" });
    $("#mt-rainier-svg").css({ transform: "translate(-55px)" });
    $("#mt-range-svg").css({ transform: "translate(-80px)" });
    $("#moon-city-svg").css({ transform: "translate(-80px)" });
    $("#large-buildings-svg").css({ transform: "translate(-200px)" });
    $("#seattle-city-svg").css({ transform: "translate(-100px)" });
    $("#far-buildings-svg").css({ transform: "translate(-25px)" });
  }
}

// Blog Button
$(function () {
  $(".line-1").hide().first().show();
  setTimeout(function () {
    nextPhrase();
  }, 3000);
});

function firstPhrase() {
  $(".line-1").hide().first().show();
  setTimeout(function () {
    nextPhrase();
  }, 3000);
}

function nextPhrase() {
  $(".line-1:visible").hide().next().show();
  setTimeout(function () {
    lastPhrase();
  }, 3000);
}

function lastPhrase() {
  $(".line-1:visible").hide().next().show();
  setTimeout(function () {
    firstPhrase();
  }, 3000);
}
