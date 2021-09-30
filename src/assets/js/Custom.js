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
        if (
          !$("a.link").hasClass("selected") ||
          $("a.link[href*='#box1']").hasClass("selected")
        ) {
          setPosition("#box2");
          $("a.link[href*='#box2']").addClass("selected");
          $("a.link[href*='#box1']").removeClass("selected");
        } else if ($("a.link[href*='#box2']").hasClass("selected")) {
          setPosition("#box3");
          $("a.link[href*='#box3']").addClass("selected");
          $("a.link[href*='#box2']").removeClass("selected");
        } else if ($("a.link[href*='#box3']").hasClass("selected")) {
          setPosition("#box4");
          $("a.link[href*='#box4']").addClass("selected");
          $("a.link[href*='#box3']").removeClass("selected");
        }
      } else {
        /* right swipe */
        if ($("a.link[href*='#box4']").hasClass("selected")) {
          setPosition("#box3");
          $("a.link[href*='#box3']").addClass("selected");
          $("a.link[href*='#box4']").removeClass("selected");
        } else if ($("a.link[href*='#box3']").hasClass("selected")) {
          setPosition("#box2");
          $("a.link[href*='#box2']").addClass("selected");
          $("a.link[href*='#box3']").removeClass("selected");
        } else if ($("a.link[href*='#box2']").hasClass("selected")) {
          setPosition("#box1");
          $("a.link[href*='#box1']").addClass("selected");
          $("a.link[href*='#box2']").removeClass("selected");
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

// // Gallery from Laravel
// $(document).on("load", function () {
//   //Setup hover event
//   $(".zoom").on("mouseenter", function () {
//     $(this).addClass("transition");
//   });
//   $(".zoom").on("mouseleave", function () {
//     $(this).removeClass("transition");
//   });

//   //Begin album setup
//   $(".album-container").on("click", function () {
//     var albumId = $(this).data("container");
//     if (albumId > 0) {
//       // Hide all albums
//       $(".album-container").each(function () {
//         $(this).addClass("collapse");
//       });
//     } else {
//       return false;
//     }
//     // Replace with lightbox class element to contain images -> gallery id
//     $("<div/>", {
//       class: "container fb-container container-fluid row col-lg-12",
//     }).appendTo("#gallery");

//     // Create close button for album images section
//     var bsButton =
//       '<div class="outerclose" aria-label="Close"><div class="innerclose"><label>Back</label></div></div>';
//     $(".container-wrapper").prepend(bsButton);

//     // Hide all images -> fancyb-container
//     $(".outerclose").on("click", function (event) {
//       event.preventDefault();
//       $(".fb-container").addClass("collapse animated zoomOut");
//       $(this).addClass("collapse animated zoomOut");
//       $(".album-container").removeClass("collapse").addClass("animated zoomIn");
//     });

//     // Get path to images from divs and append to lightbox container as img
//     $(".album-image").each(function () {
//       var currentElement = $(this);
//       var imgName = currentElement.data("image");
//       var albumList = currentElement.data("album");
//       var description = currentElement.data("description");
//       var path = "/storage/albums/" + albumList + "/" + imgName;

//       //Create bootstrap wrapper for images and start them hidden and effec to fadein
//       if (albumList === albumId) {
//         $("<a/>", {
//           href: path,
//           class:
//             "fancybox image-wrapper card text-white border-0 bg-transparent mb-3 col-md-6 col-lg-4 collapse",
//           "data-fancybox": "images",
//           "data-caption": description,
//         }).appendTo(".fb-container");
//       }
//     });
//     // get all href divs and foreach one add img from href
//     $(".fancybox").each(function () {
//       var $this = $(this);
//       var imageUrl = $this.attr("href");
//       $(this).append(
//         "<img class='image img-fluid rounded mx-auto d-block' src='" +
//           imageUrl +
//           "' width='100%'/>"
//       );
//     });
//     $(".image").on("load", function () {
//       $(this).parent().addClass("animated zoomIn");
//       $(this).parent().removeClass("collapse");
//     });
//   });
// });

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
