// Función para obtener la ruta base relativa según la profundidad de la carpeta
function getBasePath() {
  const pathname = window.location.pathname;
  // Contar el número de directorios desde la raíz (excluyendo el nombre del archivo)
  const pathParts = pathname.split('/').filter(p => p && !p.endsWith('.html'));
  
  // Si estamos en la raíz, no necesitamos ../
  // Si estamos en liga-web/, no necesitamos ../
  // Si estamos en liga-web/clubes/, necesitamos ../
  // Si estamos en liga-web/jugadores/, necesitamos ../
  
  let basePath = '';
  // Determinar profundidad: buscar 'liga-web' en la ruta
  const ligazIndexed = pathname.indexOf('/liga-web/');
  if (ligazIndexed !== -1) {
    const afterLigaWeb = pathname.substr(ligazIndexed + 10); // 10 = len('/liga-web/');
    const dirCount = afterLigaWeb.split('/').filter(p => p && !p.endsWith('.html')).length;
    for (let i = 0; i < dirCount; i++) {
      basePath += '../';
    }
  }
  return basePath;
}

// Cargar componentes dinámicos
document.addEventListener("DOMContentLoaded", () => {
  const basePath = getBasePath();
  loadComponent("navbar-container", basePath + "components/navbar.html", true, false);
  loadComponent("footer-container", basePath + "components/footer.html", false, true);
});

function loadComponent(containerId, path, isNavbar = false, isFooter = false) {
  const container = document.getElementById(containerId);
  if (!container) return;

  fetch(path)
    .then(response => response.text())
    .then(html => {
      container.innerHTML = html;
      
      // Inicializar meanmenu después de cargar el navbar
      if (isNavbar && typeof jQuery !== 'undefined') {
        jQuery(function() {
          jQuery('.main-menu').meanmenu({
            meanMenuContainer: '.mobile-menu',
            meanScreenWidth: "992"
          });
        });
      }

      // Inicializar logo carousel después de cargar el footer
      if (isFooter && typeof jQuery !== 'undefined') {
        jQuery(function() {
          jQuery(".logo-carousel-inner").owlCarousel({
            items: 4,
            loop: true,
            autoplay: true,
            margin: 30,
            responsive:{
              0:{
                items:1,
                nav:false
              },
              600:{
                items:3,
                nav:false
              },
              1000:{
                items:4,
                nav:false,
                loop:true
              }
            }
          });
        });
      }
    })
    .catch(error => {
      console.error(`Error loading ${path}`, error);
    });
}

(function ($) {
    "use strict";

    $(document).ready(function($){
        
        // testimonial sliders
        $(".testimonial-sliders").owlCarousel({
            items: 1,
            loop: true,
            autoplay: true,
            responsive:{
                0:{
                    items:1,
                    nav:false
                },
                600:{
                    items:1,
                    nav:false
                },
                1000:{
                    items:1,
                    nav:false,
                    loop:true
                }
            }
        });

        // homepage slider
        $(".homepage-slider").owlCarousel({
            items: 1,
            loop: true,
            autoplay: true,
            nav: true,
            dots: false,
            navText: ['<i class="fas fa-angle-left"></i>', '<i class="fas fa-angle-right"></i>'],
            responsive:{
                0:{
                    items:1,
                    nav:false,
                    loop:true
                },
                600:{
                    items:1,
                    nav:true,
                    loop:true
                },
                1000:{
                    items:1,
                    nav:true,
                    loop:true
                }
            }
        });

        // logo carousel - Inicializado en loadComponent después de cargar el footer dinámicamente
        // $(".logo-carousel-inner").owlCarousel({
        //     items: 4,
        //     loop: true,
        //     autoplay: true,
        //     margin: 30,
        //     responsive:{
        //         0:{
        //             items:1,
        //             nav:false
        //         },
        //         600:{
        //             items:3,
        //             nav:false
        //         },
        //         1000:{
        //             items:4,
        //             nav:false,
        //             loop:true
        //         }
        //     }
        // });

        // count down
        if($('.time-countdown').length){  
            $('.time-countdown').each(function() {
            var $this = $(this), finalDate = $(this).data('countdown');
            $this.countdown(finalDate, function(event) {
                var $this = $(this).html(event.strftime('' + '<div class="counter-column"><div class="inner"><span class="count">%D</span>Days</div></div> ' + '<div class="counter-column"><div class="inner"><span class="count">%H</span>Hours</div></div>  ' + '<div class="counter-column"><div class="inner"><span class="count">%M</span>Mins</div></div>  ' + '<div class="counter-column"><div class="inner"><span class="count">%S</span>Secs</div></div>'));
            });
         });
        }

        // projects filters isotop
        $(".product-filters li").on('click', function () {
            
            $(".product-filters li").removeClass("active");
            $(this).addClass("active");

            var selector = $(this).attr('data-filter');

            $(".product-lists").isotope({
                filter: selector,
            });
            
        });
        
        // isotop inner
        $(".product-lists").isotope();

        // magnific popup
        $('.popup-youtube').magnificPopup({
            disableOn: 700,
            type: 'iframe',
            mainClass: 'mfp-fade',
            removalDelay: 160,
            preloader: false,
            fixedContentPos: false
        });

        // light box
        $('.image-popup-vertical-fit').magnificPopup({
            type: 'image',
            closeOnContentClick: true,
            mainClass: 'mfp-img-mobile',
            image: {
                verticalFit: true
            }
        });

        // homepage slides animations
        $(".homepage-slider").on("translate.owl.carousel", function(){
            $(".hero-text-tablecell .subtitle").removeClass("animated fadeInUp").css({'opacity': '0'});
            $(".hero-text-tablecell h1").removeClass("animated fadeInUp").css({'opacity': '0', 'animation-delay' : '0.3s'});
            $(".hero-btns").removeClass("animated fadeInUp").css({'opacity': '0', 'animation-delay' : '0.5s'});
        });

        $(".homepage-slider").on("translated.owl.carousel", function(){
            $(".hero-text-tablecell .subtitle").addClass("animated fadeInUp").css({'opacity': '0'});
            $(".hero-text-tablecell h1").addClass("animated fadeInUp").css({'opacity': '0', 'animation-delay' : '0.3s'});
            $(".hero-btns").addClass("animated fadeInUp").css({'opacity': '0', 'animation-delay' : '0.5s'});
        });

       

        // stikcy js
        $("#sticker").sticky({
            topSpacing: 0
        });

        // mean menu - Inicializado en loadComponent después de cargar el navbar dinámicamente
        // $('.main-menu').meanmenu({
        //     meanMenuContainer: '.mobile-menu',
        //     meanScreenWidth: "992"
        // });
        
         // search form
        $(".search-bar-icon").on("click", function(){
            $(".search-area").addClass("search-active");
        });

        $(".close-btn").on("click", function() {
            $(".search-area").removeClass("search-active");
        });
    
    });


    jQuery(window).on("load",function(){
        jQuery(".loader").fadeOut(1000);
    });


}(jQuery));