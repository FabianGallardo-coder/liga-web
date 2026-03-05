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

// Custom JS for jugadores/detail.html
function confirmarEliminar(nombre, id) {
	if (confirm('¿Estás seguro que deseas eliminar a ' + nombre + '? Esta acción no se puede deshacer.')) {
		console.log('Eliminar jugador ID: ' + id);
		// Aquí iría la lógica de eliminación
		// Redirect a listado
		// window.location.href = 'index.html';
	}
}

// Custom JS for clubes/club-create.html
// Validación básica del formulario
document.addEventListener('DOMContentLoaded', function() {
	if (document.getElementById('clubForm')) {
		document.getElementById('clubForm').addEventListener('submit', function(e) {
			const nombre = document.getElementById('nombre').value.trim();

			if (!nombre) {
				alert('Por favor ingresa el nombre del club');
				e.preventDefault();
			}
		});

		// Actualizar labels de archivos
		if (document.getElementById('logo')) {
			document.getElementById('logo').addEventListener('change', function() {
				const label = this.nextElementSibling;
				const fileName = this.files[0]?.name || 'Seleccionar archivo...';
				label.textContent = fileName;
			});
		}

		if (document.getElementById('escudo')) {
			document.getElementById('escudo').addEventListener('change', function() {
				const label = this.nextElementSibling;
				const fileName = this.files[0]?.name || 'Seleccionar archivo...';
				label.textContent = fileName;
			});
		}
	}
});

// Custom JS for jugadores/edit.html
document.addEventListener('DOMContentLoaded', function() {
	if (document.getElementById('jugadorEditForm')) {
		document.getElementById('jugadorEditForm').addEventListener('submit', function(e) {
			const nombre = document.getElementById('nombre').value.trim();
			const apellido = document.getElementById('apellido').value.trim();
			const dorsal = document.getElementById('dorsal').value;

			if (!nombre || !apellido || !dorsal) {
				alert('Por favor completa todos los campos requeridos');
				e.preventDefault();
			}
		});
	}
});

// Custom JS for jugadores/index.html
function confirmarEliminarJugador(nombre, id) {
	if (confirm('¿Estás seguro que deseas eliminar a ' + nombre + '?')) {
		console.log('Eliminar jugador ID: ' + id);
		// Aquí iría la lógica de eliminación
	}
}

// Custom JS for jugadores/create.html
document.addEventListener('DOMContentLoaded', function() {
	if (document.getElementById('jugadorForm')) {
		document.getElementById('jugadorForm').addEventListener('submit', function(e) {
			const nombre = document.getElementById('nombre').value.trim();
			const apellido = document.getElementById('apellido').value.trim();
			const dorsal = document.getElementById('dorsal').value;

			if (!nombre || !apellido || !dorsal) {
				alert('Por favor completa todos los campos requeridos');
				e.preventDefault();
			}
		});

		// Actualizar label de archivo
		if (document.getElementById('foto')) {
			document.getElementById('foto').addEventListener('change', function() {
				const label = this.nextElementSibling;
				const fileName = this.files[0]?.name || 'Seleccionar archivo...';
				label.textContent = fileName;
			});
		}
	}
});

// Custom JS for referente/create.html
document.addEventListener('DOMContentLoaded', function() {
	if (document.getElementById('referenteForm')) {
		document.getElementById('referenteForm').addEventListener('submit', function(e) {
			const nombre = document.getElementById('nombre').value.trim();
			const email = document.getElementById('email').value.trim();
			const tipo = document.getElementById('tipo').value;

			if (!nombre || !email || !tipo) {
				alert('Por favor completa todos los campos requeridos');
				e.preventDefault();
			}
		});

		// Mostrar/ocultar club asignado según tipo
		if (document.getElementById('tipo')) {
			document.getElementById('tipo').addEventListener('change', function() {
				const clubSelect = document.getElementById('club').parentElement;
				if (this.value === 'Representante') {
					clubSelect.style.display = 'block';
				} else {
					clubSelect.style.display = 'none';
				}
			});
		}
	}
});

// Custom JS for cuota/index.html
function confirmarEliminar(id) {
	if (confirm('¿Estás seguro que deseas eliminar esta cuota?')) {
		console.log('Eliminar cuota ID: ' + id);
		// Aquí iría la lógica de eliminación
	}
}

// Custom JS for cuota/payment.html
// Establecer fecha de pago como hoy
document.getElementById('fecha_pago').valueAsDate = new Date();

document.getElementById('paymentForm').addEventListener('submit', function(e) {
	e.preventDefault();
	const cuota = document.getElementById('cuota_pagar').value;
	const monto = document.getElementById('monto_pago').value;
	const fechaPago = document.getElementById('fecha_pago').value;
	const metodo = document.getElementById('metodo_pago_nuevo').value;

	if (!cuota || !monto || !fechaPago || !metodo) {
		alert('Por favor completa todos los campos requeridos.');
		return;
	}

	if (monto <= 0) {
		alert('El monto debe ser mayor a 0.');
		return;
	}

	console.log('Registrando pago:', {
		cuota: cuota,
		monto: monto,
		fechaPago: fechaPago,
		metodo: metodo
	});

	alert('Pago registrado exitosamente. Se generará el comprobante automáticamente.');
	// Aquí iría la lógica para guardar en bd y generar comprobante
	document.getElementById('paymentForm').reset();
});

// Custom JS for cuota/create.html
document.getElementById('cuotaForm').addEventListener('submit', function(e) {
	e.preventDefault();
	const concepto = document.getElementById('concepto').value;
	const monto = document.getElementById('monto').value;
	const entidad = document.getElementById('entidad_asignada').value;
	const fechaVencimiento = document.getElementById('fecha_vencimiento').value;

	if (!concepto || !monto || !entidad || !fechaVencimiento) {
		alert('Por favor completa todos los campos requeridos.');
		return;
	}

	if (monto <= 0) {
		alert('El monto debe ser mayor a 0.');
		return;
	}

	console.log('Registrando cuota:', {
		concepto: concepto,
		monto: monto,
		entidad: entidad,
		fechaVencimiento: fechaVencimiento
	});

	alert('Cuota registrada exitosamente.');
	// Aquí iría la lógica para guardar en bd
});

// Establecer fecha de emisión como hoy
document.getElementById('fecha_emision').valueAsDate = new Date();

// Custom JS for clubes/index.html
function confirmarEliminar(nombre, id) {
	if (confirm('¿Estás seguro que deseas eliminar ' + nombre + '?')) {
		console.log('Eliminar club ID: ' + id);
		// Aquí iría la lógica de eliminación
	}
}

// Custom JS for referente/edit.html
document.addEventListener('DOMContentLoaded', function() {
	// Validación básica del formulario
	if (document.getElementById('referenteEditForm')) {
		document.getElementById('referenteEditForm').addEventListener('submit', function(e) {
			const nombre = document.getElementById('nombre').value.trim();
			const email = document.getElementById('email').value.trim();
			const tipo = document.getElementById('tipo').value;

			if (!nombre || !email || !tipo) {
				alert('Por favor completa todos los campos requeridos');
				e.preventDefault();
			}
		});

		// Mostrar/ocultar club asignado según tipo
		document.getElementById('tipo').addEventListener('change', function() {
			const clubSelect = document.getElementById('club').parentElement;
			if (this.value === 'Representante') {
				clubSelect.style.display = 'block';
			} else {
				clubSelect.style.display = 'none';
			}
		});
	}
});

// Custom JS for referente/index.html
function confirmarEliminarReferente(nombre, id) {
	if (confirm('¿Estás seguro que deseas eliminar a ' + nombre + '?')) {
		console.log('Eliminar referente ID: ' + id);
		// Aquí iría la lógica de eliminación
	}
}

// Custom JS for clubes/club-edit.html
document.addEventListener('DOMContentLoaded', function() {
	// Validación básica del formulario
	if (document.getElementById('clubEditForm')) {
		document.getElementById('clubEditForm').addEventListener('submit', function(e) {
			const nombre = document.getElementById('nombre').value.trim();

			if (!nombre) {
				alert('Por favor ingresa el nombre del club');
				e.preventDefault();
			}
		});
	}
});

// Custom JS for clubes/club-detail.html
function confirmarEliminarClubDetail(nombre, id) {
	if (confirm('¿Estás seguro que deseas eliminar ' + nombre + '? Esta acción no se puede deshacer.')) {
		console.log('Eliminar club ID: ' + id);
		// Aquí iría la lógica de eliminación
		// window.location.href = 'index.html';
	}
}