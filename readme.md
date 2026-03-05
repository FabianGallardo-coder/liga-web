# Proyecto «liga‑web»

Este repositorio contiene la versión estática de un sitio web de la **Liga de Handball Punilla**.  
La plantilla base es **Fruitkha**, un tema Bootstrap 4 adaptado mediante SCSS.  
El árbol principal del proyecto es:

```
404.html
about.html
contact.html
index.html
news.html
single-news.html
tablas.html
assets/
  css/        ← hojas de estilo compiladas
  scss/       ← fuentes Sass (ver prepros‑6.config)
  img/
  js/         ← scripts jQuery y plugins
  webfonts/   ← fuentes de Font‑Awesome
components/
  navbar.html
  footer.html
layouts/     ← (vacío)
vendor/
  bootstrap/  ← CSS/JS de Bootstrap 4
```

## Flujo actual

* Cada página HTML (`index.html`, `about.html`, …) contiene el `head` con todas las hojas de estilo y los tags `script` al final.
* El menú y el pie de página no se repiten: se cargan dinámicamente por `assets/js/main.js` usando `fetch()` y `innerHTML`.
  ```js
  document.addEventListener("DOMContentLoaded", () => {
    loadComponent("navbar-container", "components/navbar.html", true, false);
    loadComponent("footer-container", "components/footer.html", false, true);
  });
  ```

* Los estilos están escritos en SCSS, compilables con Prepros (configurado en `assets/css/scss/prepros-6.config`).

* El comportamiento dinámico se apoya en jQuery y plugins como `owl.carousel`, `jquery.countdown`, `sticky`, `meanmenu`, etc.

* La tabla de resultados y el fixture se encuentran en `tablas.html`; se renderizan como tablas HTML estáticas.

* Las páginas de noticias (`news.html`, `single-news.html`) contienen bloques repetidos de noticias.

---

## Objetivo: migrar a React

A continuación hay una guía de qué partes conviene convertir a componentes React para que un frontend junior pueda trabajar sin romper la estructura.

### 1. Componentes reutilizables

- **Navbar** (`components/navbar.html`)  
  El menú superior es estático, pero contiene enlaces y sub‑menús que podrán alimentarse de un `state` o `props`.  
  En React se puede crear `<Navbar links={…} />` y reemplazar `loadComponent()` por renderizarlo desde el árbol de componentes.

- **Footer** (`components/footer.html`)  
  Rápida conversión a `<Footer />`. Si hay un carrusel de logotipos se puede envolver con un hook `useEffect` para inicializar OwlCarousel.

- **Breadcrumb / Hero**  
  En cada página aparece una sección de “breadcrumb” con icono, texto y fondo. Conviene extraerlo como `<Breadcrumb title="Noticias" bg="breadcrumb-bg.jpg" />`.

- **Listado de noticias**  
  En `news.html` hay varios bloques idénticos con imagen, título, meta y botón “Leer más”.  
  Crea un componente `<NewsCard post={post} />` y pásale un array de objetos. Los datos pueden vivir en un `posts.json` o en el `state` del contenedor.

- **Artículo individual** (`single-news.html`)  
  Similar al anterior; el contenido estático se convertirá en props o en un fetch según el `id`.

- **Tabla de puntuación / Fixture**  
  La tabla en `tablas.html` es un buen candidato para `<Standings data={…} />` y `<Fixture data={…} />`.  
  Un junior podrá editar el array `teams`/`matches` sin tocar la estructura HTML.

### 2. Hooks y efectos

Varios scripts jQuery inicializan plugins al `DOMContentLoaded`. En React se migra a `useEffect`:

```jsx
// ejemplo en React (assets/js/main.js -> components/App.jsx)
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    // initializar carousel
    $(".testimonial-sliders").owlCarousel({ items:1, loop:true, autoplay:true });
    $("#sticker").sticky({ topSpacing: 0 });
    // …
  }, []); // se ejecuta una vez
  return (
    <>
      <Navbar />
      <Routes>…</Routes>
      <Footer />
    </>
  );
}
```

Los plugins que dependen de jQuery pueden mantenerse junto a la conversión o reemplazarse gradualmente por soluciones React‑friendly (por ejemplo, [react-owl-carousel](https://www.npmjs.com/package/react-owl-carousel)).

### 3. Estilos

- Mantener los SCSS actuales. En un proyecto React se pueden compilar con Webpack/`sass-loader` o usar `create-react-app` que ya soporta `.scss`.
- Las clases de Bootstrap (`container`, `row`, `col‑…`) se conservan; los nombres de clase (`cart-table`, `latest-news`) siguen existiendo.

### 4. Estructura propuesta de carpetas en React

```
src/
  components/
    Navbar.jsx
    Footer.jsx
    Breadcrumb.jsx
    NewsCard.jsx
    Article.jsx
    Standings.jsx
    Fixture.jsx
    Loader.jsx       // reemplaza .loader
  pages/
    Home.jsx
    About.jsx
    News.jsx
    SingleNews.jsx
    Contact.jsx
    Tables.jsx
    NotFound.jsx
  assets/            // css, img, js legacy (si se requiere)
  scss/              // copiar carpetas base/sections/pages
  App.jsx
  index.jsx
```

### 5. Punto de entrada y navegación

Utilizar `react-router` para reemplazar los enlaces `<a href="…">`.  
Un menú dinámico podría lucir así:

```jsx
// src/components/Navbar.jsx
import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Inicio' },
  { label: 'Handball', sub: [{ to: '/tablas', label: 'Tablas & fixture' }] },
  { label: 'Institucional', sub: [
      { to: '/about', label: 'Nosotros' },
      { to: '/404', label: '404 page' },
    ]},
  ...
];

export default function Navbar() {
  return (
    <nav className="main-menu">
      <ul>
        {links.map(link => (
          <li key={link.label}>
            {link.to ? <NavLink to={link.to}>{link.label}</NavLink> : link.label}
            {link.sub && (
              <ul className="sub-menu">
                {link.sub.map(s => (
                  <li key={s.label}><NavLink to={s.to}>{s.label}</NavLink></li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
```

Un desarrollador junior puede cambiar el contenido de `links` sin modificar la estructura del `nav`.

### 6. Ejemplo de componente dinámico para noticias

```jsx
// src/pages/News.jsx
import NewsCard from '../components/NewsCard';
import posts from '../data/posts.json'; // array de objetos

export default function News() {
  return (
    <div className="latest-news mt-150 mb-150">
      <div className="container">
        <div className="row">
          {posts.map(p => (
            <div key={p.id} className="col-lg-4 col-md-6">
              <NewsCard post={p} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

`posts.json` podría tener la forma:

```json
[
  {
    "id": 1,
    "title": "You will vainly look for fruit on it in autumn.",
    "author": "Admin",
    "date": "27 December, 2019",
    "excerpt": "Lorem ipsum dolor sit amet…",
    "image": "assets/img/latest-news/news-bg-1.jpg"
  },
  …
]
```

### 7. Consejos para no romper la estructura

* **No modifiques directamente el CSS compilado** (`assets/css/*.css`); edita el SCSS correspondiente.
* **Usa los componentes existentes**: si necesitas un botón con la clase `boxed-btn`, simplemente úsala; no crees CSS nuevo a menos que sea necesario.
* **Mantén el `id` y las clases** que los scripts jQuery utilizan (`#sticker`, `.time-countdown`, etc.) hasta que migres esos comportamientos.
* **Reemplaza `fetch()` por imports estáticos** o llamadas a APIs cuando el contenido se haga dinámico.
* **Valida con el navegador** después de cada cambio; la estructura de la cabecera (`<head>`) puede permanecer en `public/index.html` de React.

---

## Pasos iniciales para un junior

1. Clonar el repositorio y ejecutar `npm install` (configura el `package.json` de React).
2. Copiar `assets/css/scss/…` a `src/scss/` y ajustar rutas.
3. Crear `src/components/Navbar.jsx` y renderizarlo en `src/App.jsx`.
4. Cambiar `index.html` para que solo cargue `root` y los estilos globales.
5. Migrar página por página: empieza por `Home.jsx` reproduciendo el HTML actual en JSX, usando componentes reutilizables.
6. Reemplazar enlaces `<a>` por `<Link>` de `react-router-dom`.
7. Añadir los datos (`posts.json`, `teams.js`, …) y pasar como props en lugar de escribir HTML repetido.

---

## Recursos

* [Bootstrap 4 CDN y documentación](https://getbootstrap.com/docs/4.4/getting-started/introduction/)
* [React docs – Componentes y props](https://reactjs.org/docs/components-and-props.html)
* [React Router v6](https://reactrouter.com/)
* [Owl Carousel React wrapper](https://www.npmjs.com/package/react-owl-carousel)

Con esta base, un desarrollador frontend junior puede modificar fácilmente el contenido de los componentes y añadir nuevas secciones sin tocar el HTML estático original. La estructura clara de carpetas y la separación de datos (JSON/props) facilitan los cambios y minimizan el riesgo de “romper” la plantilla.