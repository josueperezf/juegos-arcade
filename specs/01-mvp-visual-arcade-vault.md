# Spec 01 — MVP Visual Arcade Vault

- **Estado:** Implementado
- **Depende de:** ninguno (primer spec del proyecto)
- **Fecha:** 2026-07-18
- **Objetivo:** Implementar todas las pantallas visuales de Arcade Vault (Biblioteca, Detalle de juego, Reproductor, Login y Salón de la Fama) como rutas reales de Next.js, replicando fielmente el diseño y las interacciones de `references/templates/`, sin lógica de juego real.

## Alcance

### Incluye
- 5 pantallas como rutas reales de Next.js (App Router):
  - `/` — Biblioteca (grid de juegos, búsqueda, filtro por categoría)
  - `/juegos/[id]` — Detalle de juego (info, tabla de mejores puntuaciones, botón jugar)
  - `/juegos/[id]/jugar` — Reproductor (HUD simulado, CRT visual, modal de fin de juego)
  - `/login` — Auth (login/registro mock, invitado, botones sociales decorativos)
  - `/salon-de-la-fama` — Hall of Fame (podio + tabla de puntuaciones por juego, tabs por juego)
- Layout compartido con Nav (desktop + panel móvil) y footer, igual al template.
- Migración del diseño de `styles.css` (tema neón/pixel arcade) al proyecto Next.js.
- Datos mock en `app/data/` (juegos, jugadores, generador de puntuaciones `seededScores`).
- Loop de puntaje simulado en el Reproductor (igual al template: incremento automático, subida de nivel, pausa/fin funcionales).
- Sesión de login mock persistida en `localStorage` (sin validación real de credenciales).
- Guardado de puntuaciones en memoria (se reinicia al refrescar la página).
- Componentes reutilizables: Nav, GameCard, tabla/podio de puntuaciones.

### No incluye
- Lógica de juego real (ningún juego jugable de verdad; el "juego" en `/jugar` es una simulación visual).
- Autenticación real (backend, validación de credenciales, OAuth funcional con Google/GitHub).
- Persistencia real de puntuaciones entre sesiones o dispositivos (ni base de datos, ni backend).
- Sistema de créditos/monedas funcional (el contador "CRÉDITOS · 03" del Nav es decorativo, como en el template).
- Tests automatizados (no hay test runner configurado en el proyecto).
- Cualquier funcionalidad de multijugador o versus real.

## Modelo de datos

Todo vive en `app/data/` como estructuras mock en memoria (TypeScript), reemplazando el `data.jsx` del template. Pensado para que su forma (shape) sea la que eventualmente consumirá una base de datos real.

### `app/data/games.ts`

```ts
export type GameCategory = "ARCADE" | "PUZZLE" | "SHOOTER" | "VERSUS";

export interface Game {
  id: string;
  title: string;
  short: string;
  long: string;
  cat: GameCategory;
  cover: string;      // clase CSS para el fondo de portada (cover-bricks, cover-tetro, etc.)
  color: "cyan" | "magenta" | "green" | "yellow";
  best: number;
  plays: string;       // ej. "12.4K"
}

export const GAMES: Game[];
export const CATS: ("TODOS" | GameCategory)[];
```

### `app/data/players.ts`

```ts
export const PLAYERS: string[]; // nombres de jugadores mock para la tabla de puntuaciones

export interface ScoreRow {
  rank: number;
  name: string;
  score: number;
  date: string; // dd/mm/yyyy
}

export function seededScores(seed: number, count?: number): ScoreRow[];
```

### `app/data/scores.ts` (puntuaciones guardadas en memoria)

```ts
export interface SavedScore {
  gameId: string;
  name: string;
  score: number;
  at: number; // timestamp
}

// Store en memoria (módulo-level), se reinicia al refrescar la página.
export function saveScore(entry: SavedScore): void;
export function getScoresForGame(gameId: string): SavedScore[];
```

### Sesión de usuario (`localStorage`)

No es parte de `app/data` (no es "dato de juego"), vive en un helper de auth (p. ej. `lib/session.ts` o un hook `useSession`):

```ts
export interface SessionUser {
  name: string;
}

// Persistido en localStorage bajo la clave "av_user"
export function getSession(): SessionUser | null;
export function setSession(user: SessionUser | null): void;
```

## Plan de implementación

1. **Migrar el tema visual.** Portar `references/templates/styles.css` a `app/globals.css` (variables de color neón, tipografías pixel/mono, clases `.btn`, `.chip`, `.card`, animaciones `flicker`/`blink`/`pulse`, etc.). Verificar que las fuentes usadas (pixel/mono) estén disponibles o se carguen vía `next/font`.

2. **Crear la capa de datos.** `app/data/games.ts`, `app/data/players.ts` (con `seededScores`) y `app/data/scores.ts`, migrando el contenido de `data.jsx` 1:1 (mismos 8 juegos, mismos nombres de jugadores).

3. **Crear el helper de sesión.** `lib/session.ts` con `getSession`/`setSession` sobre `localStorage` (clave `av_user`), más un hook cliente (`useSession`) para consumirlo en Nav y en las páginas que lo necesiten.

4. **Construir el layout raíz.** `app/layout.tsx` con el componente `Nav` (desktop + panel móvil) y el footer, igual al template. `Nav` es client component (usa `useSession` y estado de menú móvil).

5. **Implementar `/` (Biblioteca).** `app/page.tsx` con búsqueda, chips de categoría y grid de `GameCard` (con el efecto tilt al mouse), navegando a `/juegos/[id]` al seleccionar.

6. **Implementar `/juegos/[id]` (Detalle).** Portada, tags, descripción, stat-strip, tabla de mejores puntuaciones (`seededScores`), botones "Jugar ahora" (→ `/juegos/[id]/jugar`) y "Volver al Vault".

7. **Implementar `/juegos/[id]/jugar` (Reproductor).** HUD (jugador, puntaje, vidas, nivel), CRT visual, loop simulado de puntaje/nivel con `setInterval`, pausa, botón fin, modal de fin de juego con input de iniciales y `saveScore` (en memoria).

8. **Implementar `/login` (Auth).** Tabs iniciar sesión / crear cuenta, formulario mock que llama `setSession` y redirige a `/`, botón "jugar como invitado", botones sociales decorativos (sin funcionalidad real).

9. **Implementar `/salon-de-la-fama` (Hall of Fame).** Tabs por juego, podio (top 3), tabla completa de puntuaciones, fila destacada "tu mejor marca" si hay sesión activa.

10. **Repaso visual final.** Comparar cada pantalla contra `references/templates/` en navegador (desktop y mobile) y ajustar detalles de estilo/espaciado que se hayan perdido en la migración.

Cada paso deja la aplicación funcional y navegable (build sin errores) antes de pasar al siguiente.

## Criterios de aceptación

- [ ] `/` renderiza el grid de juegos con búsqueda por nombre y filtro por categoría (TODOS/ARCADE/PUZZLE/SHOOTER/VERSUS) funcionando en tiempo real.
- [ ] Cada `GameCard` navega a `/juegos/[id]` al hacer click en la tarjeta o en "JUGAR".
- [ ] `/juegos/[id]` muestra la información del juego (tags, descripción, stat-strip) y una tabla de mejores puntuaciones generada con `seededScores`.
- [ ] Desde `/juegos/[id]`, el botón "JUGAR AHORA" navega a `/juegos/[id]/jugar`.
- [ ] `/juegos/[id]/jugar` incrementa el puntaje automáticamente, sube de nivel cada ~2500 puntos, y el botón de pausa detiene/reanuda el incremento.
- [ ] En `/juegos/[id]/jugar`, el botón "FIN" abre el modal de fin de juego mostrando el puntaje final.
- [ ] En el modal de fin de juego, "GUARDAR PUNTUACIÓN" guarda el registro en memoria (vía `app/data/scores.ts`) y muestra el estado "guardado"; al refrescar la página el registro desaparece.
- [ ] `/login` permite "iniciar sesión" o "crear cuenta" (mock, sin validar credenciales) y redirige a `/` dejando al usuario logueado en el Nav.
- [ ] "JUGAR COMO INVITADO" en `/login` navega a `/` sin sesión activa.
- [ ] La sesión de usuario persiste tras refrescar la página (se lee de `localStorage` al cargar) y "Cerrar sesión" la elimina.
- [ ] `/salon-de-la-fama` muestra tabs por juego, un podio (top 3) y una tabla completa de puntuaciones que cambian según el juego seleccionado.
- [ ] Si hay sesión activa, `/salon-de-la-fama` muestra la fila destacada "tu mejor marca".
- [ ] El Nav (desktop y panel móvil) permite navegar entre Biblioteca y Salón de la Fama, y refleja el estado de sesión (botón "Iniciar Sesión" vs. nombre de usuario).
- [ ] El diseño visual (colores, tipografías, animaciones neón) coincide con `references/templates/` en las 5 pantallas, en desktop y mobile.
- [ ] El proyecto compila (`next build`) sin errores ni warnings de tipos.

## Decisiones tomadas y descartadas

- **Rutas reales de Next.js en vez de hash-routing SPA.** El template usa `location.hash` con un objeto de ruta serializado; se descarta porque no es idiomático en Next.js App Router y pierde beneficios como carga por segmento, metadata por página y navegación con `<Link>`. Se adoptan rutas de archivo (`/`, `/juegos/[id]`, `/juegos/[id]/jugar`, `/login`, `/salon-de-la-fama`).

- **Loop de puntaje simulado en el Reproductor.** Se decidió conservar el `setInterval` que incrementa el puntaje automáticamente (igual al template) en vez de un mockup estático, para transmitir la sensación de "juego en curso" sin implementar lógica de juego real. Es una decisión explícita de UX para el MVP visual.

- **Autenticación mock sin backend.** El login/registro no valida credenciales reales; solo simula el estado de sesión. Se descarta implementar auth real (NextAuth, backend propio, etc.) porque está fuera del alcance de este spec (solo parte visual).

- **Puntuaciones guardadas en memoria, no en `localStorage`.** Se decidió que `app/data/scores.ts` mantenga el registro de puntuaciones en un store en memoria (module-level) que se reinicia al refrescar, en vez de persistir en `localStorage` como el template original. Motivo: mantener coherencia con la idea de que `app/data` es un stand-in temporal por una futura base de datos (el patrón de "guardar" debe parecerse a una llamada a API/DB, no a un mecanismo de persistencia del navegador).

- **Sesión de usuario sí persiste en `localStorage`.** A diferencia de las puntuaciones, se decidió que la sesión de login sobreviva a un refresh (recomendación aceptada por el usuario), porque perder la sesión en cada recarga sería una mala experiencia y no aporta valor al MVP visual.

- **Datos mock centralizados en `app/data/`.** Se migra `data.jsx` tal cual (mismos 8 juegos, mismo generador `seededScores`) para no introducir cambios de contenido fuera de alcance en este spec.

## Riesgos identificados

- **Hydration mismatch por `localStorage`.** Leer la sesión de `localStorage` directamente durante el render causará un mismatch entre servidor y cliente en Next.js (App Router hace SSR). Mitigación: leer la sesión dentro de un `useEffect` (o marcar el componente como estrictamente client-side) y renderizar un estado inicial neutro hasta que se hidrate.

- **Fidelidad visual al migrar CSS.** Portar `styles.css` (pensado para HTML/React global, sin CSS Modules ni Tailwind) a `app/globals.css` puede chocar con los estilos base que trae `create-next-app` con Tailwind 4. Mitigación: revisar `app/globals.css` existente y resolver conflictos de reset/estilos base antes de aplicar el tema neón.

- **APIs de Next.js 16 desconocidas.** Este repo usa Next.js 16, con cambios respecto a versiones anteriores. Mitigación: consultar `node_modules/next/dist/docs/` antes de escribir rutas dinámicas (`[id]`), layouts y client components, como indica `AGENTS.md`.
