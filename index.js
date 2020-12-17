(function() {
  const TYPE_TEXT = "Stranded - A Puzzle Game Developed by Glitch";
  const TYPE_SPEED = 50;
  const NAV_HEIGHT = 70;
  const OFFSET = Math.sin(2 * Math.PI / 180) * window.innerWidth;
  const NAV_ANGLE = Math.sin(2 * Math.PI / 180) * Math.sin(88 * Math.PI / 100);
  let slideIndex = 1;
  let timer;
  let slideShow;
  let currDot;

  window.addEventListener("load", init);

  function init() {
    typeText(TYPE_TEXT, id("intro"), 0);
    let userAgent = navigator.userAgent;
    if(!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(userAgent) &&
    /Chrome/i.test(userAgent) || /Firefox/i.test(userAgent)) {
      initStickyNav();
    } else {
      defaultNav();
    }
    showSlides(slideIndex);
    timer = setInterval(function(){ changeSlides(1)}, 3500);
    slideShow = document.getElementById("inner_slide");
    slideShow.addEventListener("mouseenter", pause);
    slideShow.addEventListener("mouseleave", resume);
    let dots = document.getElementsByClassName("dot");
    for (let i = 0; i < dots.length; i++) {
      currDot = i + 1;
      dots[i].addEventListener("click", currSlide);
    }
    initSlideButton();
  }

  function defaultNav() {
    id("nav_shadow").classList.remove("hidden");
    id("main_nav").classList.add("default_nav");
  }

  function initSlideButton() {
    id("prev").addEventListener("click", function() {
      changeSlides(-1)});
    id("next").addEventListener("click", function() {changeSlides(1)});
  }

  function initStickyNav() {
    let sections = document.getElementsByClassName("content");
    updateNavBackground(sections);

    id("nav_background").classList.remove("hidden");
    id("nav_shadow").classList.remove("hidden");

    let last_scroll_pos = 0;
    let tick = false;

    window.addEventListener("scroll", () => {
      last_scroll_pos = window.scrollY;
      if(!tick) {
        window.requestAnimationFrame(() => {
          updateNavBackground(sections);
          tick = false;
        });
        tick = true;
      }
    });
  }

  function updateNavBackground(sections) {
    let intersect = false;
    for (section of sections) {
      let box = section.getBoundingClientRect();

      let top = box.top - OFFSET;
      let bottom = box.bottom + OFFSET;
      if (top <= NAV_HEIGHT && bottom >= 0) {
        intersect = true;
        if (top >= -NAV_HEIGHT && top <= NAV_HEIGHT) {
          updateNavStyle(box.top + "px", "",
            Math.max(0, window.innerWidth - (NAV_HEIGHT - top) / NAV_ANGLE) + "px", "");
        } else if (box.bottom <= NAV_HEIGHT && box.bottom >= -NAV_HEIGHT) {
          updateNavStyle("", NAV_HEIGHT * 3 - bottom + "px",
            "", Math.max(0, window.innerWidth - (bottom - NAV_HEIGHT) / NAV_ANGLE) + "px");
        } else {
          updateNavStyle(-NAV_HEIGHT+ "px", "", "0", "");
        }
      }
    }
    if (intersect) {
      id("nav_background").style.display = "";
      id("nav_shadow").style.display = "";
    } else {
      id("nav_background").style.display = "none";
      id("nav_shadow").style.display = "none";
    }
  }


  /**
  * Updates nav style with given values.
  * @param {string} navTop - nav bar top style.
  * @param {string} navBottom - nav bar bottom style.
  * @param {string} shadowTop - shadow left style.
  * @param {string} shadowBottom - shadow right bottom style.
  */
  function updateNavStyle(navTop, navBottom, shadowLeft, shadowRight) {
    id("nav_background").style.top = navTop;
    id("nav_background").style.bottom = navBottom;
    id("nav_shadow").style.left = shadowLeft;
    id("nav_shadow").style.right = shadowRight;
  }

  function typeText(text, elem, index) {
    if (index < text.length) {
      elem.innerHTML += text.charAt(index);
      setTimeout(typeText, TYPE_SPEED, text, elem, index + 1);
    } else {
      id("cursor").classList.add("blinking_cursor");
    }
  }

  function changeSlides(n) {
    clearInterval(timer);
    if (n < 0) {
      showSlides(slideIndex -= 1);
    } else {
      showSlides(slideIndex += 1);
    }
  }

  function currSlide() {
    clearInterval(timer);
    timer = setInterval(function() {changeSlides(currDot + 1)}, 3500);
    showSlides(slideIndex = currDot);
  }

  function showSlides(n) {
    let slides = document.getElementsByClassName("slide");
    let dots = document.getElementsByClassName("dot");
    if (n > slides.length) {
      slideIndex = 1;
    }
    if (n < 1) {
      slideIndex = slides.length;
    }
    for (let i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
    }
    for(let i = 0; i < dots.length; i++) {
      dots[i].classList.remove("active");
    }
    slides[slideIndex - 1].style.display = "block";
    dots[slideIndex - 1].classList.add("active");
  }

  function pause() {
    clearInterval(timer);
  }

  function resume() {
    clearInterval(timer);
    timer = setInterval(function() { changeSlides(slideIndex)}, 3500);
  }

  function id(name) {
    return document.getElementById(name);
  }

})();