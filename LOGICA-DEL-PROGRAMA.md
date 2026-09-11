# Cómo funciona EncryptLab

Resumen de la lógica del programa, de abajo hacia arriba: primero las piezas puras (`src/lib`), después cómo se combinan para detectar automáticamente el método y módulo, y al final cómo se conecta todo a la UI.

## 1. El alfabeto — la base de todo (`alfabeto.ts`)

Todo el programa trabaja sobre un **alfabeto configurable**: un array de caracteres únicos, en el orden que sea. Cifrar/descifrar/detectar no saben nada de "letras" — solo saben trabajar con posiciones dentro de ese array.

- `ALFABETO_POR_DEFECTO`: los 95 símbolos ASCII imprimibles (espacio a `~`).
- `ALFABETO_ESPANOL`: 65 símbolos — mayúsculas, minúsculas, Ñ/ñ, vocales acentuadas y espacio.
- `normalizarAlfabeto(crudo)`: convierte el string que escribe el usuario en un array sin duplicados (si escribís "aab", el alfabeto queda `['a','b']`), segmentando por grafema (no por code point) para que un símbolo visual de varios code points (un emoji con modificador) cuente como uno solo.
- `esAlfabetoValido`: exige mínimo 2 caracteres (con 1 solo símbolo no hay nada que sustituir).

El alfabeto vive en `Aplicacion.tsx` (no en cada vista) y se pasa como prop a Cifrar y Descifrar, para que configurarlo una vez sirva en las dos pantallas.

## 2. Cifrado: César y Atbash

### César (`cesar.ts`)
Desplazamiento por módulo `k` sobre las posiciones del alfabeto:

```
cifrar:    posición_nueva = (posición + k) mod n
descifrar: posición_nueva = (posición - k) mod n     (= cifrar con -k)
```

`k` va de 1 a `n-1` (con `n` = tamaño del alfabeto). Un carácter que no está en el alfabeto (por ejemplo un emoji, si el alfabeto no lo incluye) se deja tal cual, sin tocar.

### Atbash (`atbash.ts`)
Reflexión fija, sin clave: la primera posición se cambia por la última, la segunda por la penúltima, etc. (`posición_nueva = n - 1 - posición`). Es su propia inversa — cifrar y descifrar son la misma función.

## 3. El corazón del programa: detección automática (`deteccion.ts`)

Al descifrar, el usuario **no elige** método ni módulo — el sistema prueba todo y decide solo. La idea de fondo (esto es lo que pide la rúbrica como "análisis de frecuencia estilo Al-Kindi"): una sustitución monoalfabética no cambia la forma estadística del texto, solo le cambia las etiquetas. Entonces el candidato correcto es el que "se parece más al español".

### Paso 1 — Generar todos los candidatos
Se prueban **todos** los descifrados posibles:
- César con cada `k` de 1 a `n-1`
- Atbash (uno solo, no tiene clave)

Con el alfabeto por defecto (95 símbolos) son 95 candidatos por analizar.

### Paso 2 — Puntuar cada candidato con chi-cuadrado (`frecuencias.ts` + `puntuacion.ts`)
Cada candidato se compara letra por letra contra `FRECUENCIAS_ESPANOL` (tabla de frecuencia real del español: A=12.5%, E=13.7%, espacio=16%, etc.):

```
χ² = Σ (observado% - esperado%)² / esperado%
```

Menor χ² = más parecido al español = mejor candidato. Dos detalles importantes:
- **Piso mínimo de 3%** en el denominador (`PORC_MINIMO_ESPERADO`): sin esto, una letra rarísima (como la H) que aparece por casualidad en un texto corto dispara el χ² a un número absurdo y hace perder al candidato correcto.
- **`cobertura`**: qué fracción del candidato tiene letras reconocibles en la tabla. Si es 0 en todos los candidatos (alfabeto sin relación con el español), no hay nada que detectar de verdad.

### Paso 3 — Refuerzos para textos cortos (el chi-cuadrado solo no alcanza con palabras de 3-7 letras)

**`diccionario.ts`** — ~400 palabras comunes del español, embebidas a mano. `contarCoincidenciasDiccionario()` cuenta cuántas palabras reales aparecen en el candidato (separando por espacios de verdad, ignorando fragmentos rotos por símbolos). Si un candidato tiene una palabra real reconocida, gana por sobre cualquier estadística.

**`bigramas.ts`** — tabla de frecuencia real de 675 pares de letras consecutivos (bigramas) en español, sacada de un corpus real (~965M de ocurrencias). Es la misma idea de Al-Kindi pero un nivel más fino: en vez de "¿qué tan común es esta letra sola?", "¿qué tan común es que esta letra vaya seguida de esta otra?". `estadisticasBigrama()` calcula el promedio de `-log(probabilidad)` de los bigramas del candidato — menor promedio = combinación de letras más típica del español. Tiene su propio piso mínimo (para bigramas rarísimos) y se descarta si el candidato tiene muchos menos bigramas que el mejor cubierto del mismo cifrado (para no dejar que un candidato fragmentado gane por tener pocas muestras de casualidad).

### Paso 4 — Orden final de desempate (`detectarMetodo`, dentro de `deteccion.ts`)

Los candidatos se ordenan por esta prioridad, de más a menos decisivo:

1. **Coincidencias de diccionario** (más es mejor) — una palabra real vale más que cualquier estadística
2. **Puntaje de bigramas** (menor es mejor) — señal fina cuando no hubo palabra exacta
3. **Chi-cuadrado** (menor es mejor) — el núcleo estilo Al-Kindi
4. **Fracción de minúsculas** (más es mejor) — último desempate para cuando dos rotaciones quedan matemáticamente empatadas (pasa con el preset Español, que tiene mayúsculas/minúsculas simétricas)

El primero de la lista ordenada es el `ganador`.

### Índice de coincidencia (`coincidencia.ts`) — señal aparte, no desempate
El IC mide qué tan repetidos están los símbolos de un texto. Es **invariante** bajo cualquier sustitución monoalfabética (nunca cambia cuántas veces se repite cada símbolo, solo lo reetiqueta) — por eso es idéntico para los 95 candidatos y **no sirve para elegir un ganador**. Sirve como evidencia aparte: se compara contra `IC_ESPANOL = 0.075` para confirmar (o no) que hay español de verdad detrás del texto cifrado.

### Nivel de confianza
- `cobertura < 0.5` → **baja** (alfabeto sin relación real con el español)
- hubo coincidencia de diccionario → **alta**
- texto analizado < 10 caracteres → **media** (poca muestra, más ruido)
- si no → **alta**

## 4. Explicación en lenguaje natural (`narracion.ts`)

`explicarDeteccion()` arma un párrafo breve con el resultado: qué método/módulo ganó, el χ² del ganador, y una frase corta con el refuerzo que decidió (diccionario, bigramas o solo frecuencia de letras), más una nota de confianza si el texto es corto o el alfabeto no se parece al español. Es lo que se muestra al usuario detrás de "¿cómo lo dedujo? →".

## 5. La interfaz (`Aplicacion.tsx` + `components/`)

- **`Aplicacion.tsx`**: dueño del alfabeto compartido y del modo activo (`cifrar` / `descifrar`). Renderiza `SelectorModo` y la vista correspondiente.
- **`SelectorModo.tsx`**: los dos botones (pestañas) de arriba, Cifrar/Descifrar.
- **`VistaCifrado.tsx`**: textarea de texto plano → elige César (con slider de `k`) o Atbash → muestra el resultado cifrado en vivo (`useMemo`, se recalcula solo).
- **`VistaDescifrado.tsx`**: textarea de texto cifrado → botón "Descifrar" llama a `detectarMetodo()` → muestra el texto descifrado (con animación letra por letra vía `useRevelado`), método/k detectados, nivel de confianza, y un detalle expandible con la narración + gráfico de frecuencias + los 3 siguientes mejores candidatos (para que se vea que hubo comparación real, no magia).
- **`BarrasFrecuencia.tsx`**: barras comparando la frecuencia observada en el texto descifrado contra la esperada en español — la evidencia visual del chi-cuadrado.
- **`useRevelado.ts`**: hook cosmético — revela el texto descifrado de izquierda a derecha con caracteres aleatorios antes de asentarse, para que la revelación se sienta como un "descifrado" en vez de aparecer de golpe.

Ambas vistas comparten el mismo alfabeto (prop desde `Aplicacion.tsx`) y tienen un panel "⚙ personalizar alfabeto" escondido por defecto, con atajos a los presets ASCII/Español.

## 6. Flujo completo, de punta a punta

**Cifrar:** escribís texto → elegís César(k) o Atbash → `cifrarCesar`/`atbash` aplican la sustitución posición por posición sobre el alfabeto activo → resultado en pantalla, copiable.

**Descifrar:** pegás texto cifrado → clic en "Descifrar" → `detectarMetodo` genera los `n-1` candidatos de César + 1 de Atbash → cada uno se puntúa con chi-cuadrado, diccionario y bigramas → se ordenan por la prioridad de la sección 3.4 → el primero es el resultado mostrado, con su nivel de confianza y la narración de por qué ganó.
