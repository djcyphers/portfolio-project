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
    $("#parallax-bg").animate({ right: "0px" }, 450);
    //$('#main-bg').addClass("main-slide");
  } else if (check === "#about") {
    $("#wrapper").animate({ scrollLeft: dWidth * 3 });
    $("#parallax-bg").animate({ right: "200px" }, 450);
  } else if (check === "#portfolio") {
    $("#wrapper").animate({ scrollLeft: dWidth * 6 });
    $("#parallax-bg").animate({ right: "400px" }, 450);
  } else if (check === "#social") {
    $("#wrapper").animate({ scrollLeft: dWidth * 9 });
    $("#parallax-bg").animate({ right: "600px" }, 450);
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
