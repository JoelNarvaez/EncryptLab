# EncryptLab

Programa web que cifra y descifra texto con los métodos **César** y **Atbash**, sobre un alfabeto configurable por el usuario (ASCII completo, un preset en español, o un conjunto propio).

Lo más importante: al descifrar, **el usuario no elige nada** — el sistema prueba todos los descifrados posibles y decide solo cuál es el correcto, aplicando el análisis de frecuencia que Al-Kindi describió en el siglo IX, reforzado con un diccionario de palabras y bigramas para textos cortos.

Trabajo universitario individual — UAA, materia de Seguridad.

## Cómo correrlo

```bash
npm install
npm run dev       # levanta el servidor de desarrollo
npm test          # corre los tests
npm run build     # build de producción
```

## Estructura

- `src/lib/` — toda la lógica pura: alfabeto, cifrado César/Atbash, y el motor de detección automática (chi-cuadrado, diccionario, bigramas).
- `src/components/` — la interfaz (vistas de cifrar/descifrar, editor de alfabeto, gráfica de frecuencias).
- `src/Aplicacion.tsx` / `src/principal.tsx` — punto de entrada.

## Documentación

El código en `src/lib` tiene comentarios numerados (`// [1]`, `// [2]`...) que apuntan a una explicación en:

- [`DOCUMENTACION.md`](./DOCUMENTACION.md) — versión técnica completa.
- [`DOCUMENTACION-SIMPLE.md`](./DOCUMENTACION-SIMPLE.md) — la misma explicación, en simple.
