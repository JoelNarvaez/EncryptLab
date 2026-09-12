# Documentación del código — EncryptLab

Cada número entre corchetes en `src/lib` (`// [1]`, `// [2]`...) marca un punto del código y apunta a la explicación correspondiente acá abajo: qué hace esa función y por qué está escrita así. El código queda limpio y legible; la explicación completa vive en un solo lugar, ordenado.

## alfabeto.ts — el alfabeto configurable

**[1]** `ALFABETO_POR_DEFECTO` es el ASCII imprimible completo: del espacio (32) a la virgulilla `~` (126), 95 símbolos. Cubre mayúsculas, minúsculas, dígitos, espacio y puntuación. Los caracteres de control (0-31, 127) quedan fuera porque no se pueden escribir ni ver en un textarea.

**[2]** `ALFABETO_ESPANOL` es el preset "Español": mayúsculas, minúsculas, Ñ/ñ, vocales acentuadas y espacio (65 símbolos). Ninguno de estos caracteres está en el ASCII estándar (0-127) — por eso no forman parte de `ALFABETO_POR_DEFECTO` y hay que elegirlos aparte si se quiere cifrar texto en español "completo".

**[3]** `normalizarAlfabeto()` convierte el string crudo que escribe el usuario en el array de símbolos únicos que usa todo el programa: segmenta el string en grafemas (ver [4]), recorre esos grafemas en orden, y usa un `Set` para descartar los que ya aparecieron — el primero que aparece de cada símbolo es el que queda, en su posición original. Así "aab" se normaliza a `['a', 'b']`.

**[4]** `aGrafemas()` segmenta por grafema (no por code point) porque un solo símbolo visible puede ocupar varios code points — un emoji con variation selector (❤️ = U+2764 + U+FE0F) o con modificador de tono de piel (🧑🏽 = persona + modificador) son el caso típico. Con `for...of` (code point a code point) esos code points entrarían como caracteres distintos aunque se vean como uno solo. Se usa en todo lugar que corte texto en "caracteres" — el alfabeto y el texto a cifrar/descifrar/analizar — para que ambos lados corten igual y un símbolo multi-code-point se pueda encontrar de vuelta.

## cesar.ts — cifrado César

**[5]** `cifrarCesar()` es la sustitución completa: para cada carácter del texto (segmentado en grafemas), busca su posición `i` dentro del alfabeto y lo reemplaza por el símbolo que está `k` posiciones más adelante, con `(i + k + n) % n` (el `+ n` extra antes del módulo es para que funcione igual de bien con `k` negativo, ver [6]). Si el carácter no está en el alfabeto (`indexOf` devuelve `-1`), se deja tal cual, sin tocar — así un emoji o símbolo fuera del alfabeto elegido pasa de largo sin romper el resto del texto.

**[6]** `descifrarCesar()` es literalmente `cifrarCesar()` con `-k`: correr `k` posiciones hacia adelante y después `k` posiciones hacia atrás cancela el desplazamiento, así que restar es la misma operación con el signo invertido — no hace falta una función aparte con la lógica duplicada.

**[7]** El rango válido de `k` es 1 a `desplazamientoMaximo(alfabeto)` (el tamaño del alfabeto menos uno). `k=0` no cifra nada, así que se excluye.

## atbash.ts — cifrado Atbash

**[8]** `atbash()` es una reflexión fija sobre el alfabeto, sin clave ni módulo:
- **Al cifrar**: para cada carácter del texto (en grafemas, ver [4]), busca su posición `i` en el alfabeto y lo reemplaza por el símbolo en la posición `n - 1 - i` — el primero se cambia por el último, el segundo por el penúltimo, y así sucesivamente. Un carácter fuera del alfabeto se deja tal cual, igual que en César.
- **Al descifrar**: se llama a la misma función, sin variantes. Es correcto porque la reflexión es su propia inversa — aplicar la fórmula dos veces devuelve el original: `n - 1 - (n - 1 - i) = i`. Por eso no existe un `descifrarAtbash()` aparte, a diferencia de `cifrarCesar()`/`descifrarCesar()` ([5]/[6]).

## coincidencia.ts — índice de coincidencia

**[9]** `indiceDeCoincidencia()` implementa el Índice de Coincidencia de Friedman: cuenta cuántas veces aparece cada símbolo distinto (`conteos`), y calcula `Σ nᵢ(nᵢ-1) / [N(N-1)]` — la probabilidad de que dos caracteres elegidos al azar del texto sean iguales. Una sustitución monoalfabética (César o Atbash) solo reetiqueta símbolos: nunca cambia cuántas veces se repite cada uno. Por eso el IC del texto cifrado es idéntico al de cualquier candidato de descifrado, sin importar el `k` — no sirve para elegir el ganador entre candidatos. Sirve como señal de confianza aparte: comparar el IC del cifrado contra el IC característico del español ([10]) confirma (o no) el supuesto de que hay una sustitución monoalfabética de texto en español detrás, sobre todo cuando el texto es corto y el chi-cuadrado por sí solo es ruidoso.

**[10]** `IC_ESPANOL = 0.075` es el IC característico de texto largo en español, usado como referencia para comparar contra el IC medido del cifrado.

## frecuencias.ts — tabla de frecuencias del español

**[11]** Frecuencia relativa de letras en español (%), calculada solo sobre caracteres alfabéticos — es la tabla de referencia clásica que usa cualquier análisis de frecuencia estilo Al-Kindi.

## puntuacion.ts — chi-cuadrado (el análisis de Al-Kindi)

**[12]** Las vocales acentuadas NO se fusionan con su vocal base. Se probó y abre un hueco: un candidato basura cargado de acentos se "disfraza" de texto normal porque hereda la frecuencia completa de la vocal base, mucho más alta de lo real. Una acentuada sin cobertura propia cae en el mismo bucket que un dígito o símbolo ajeno — resta cobertura, no corrompe el chi-cuadrado.

**[13]** Piso mínimo (3%) para la frecuencia esperada usada como denominador. Sin esto, una letra rarísima en español (la H, ~0.7%) que aparece una sola vez por pura casualidad en un texto corto ("hola") dispara el chi-cuadrado a un número enorme —`(observado-esperado)²/esperado` explota cuando esperado es casi cero— y el candidato correcto pierde contra basura que por suerte evitó cualquier letra rara.

**[14]** `cobertura` es la fracción (0..1) de los caracteres del candidato, dentro del alfabeto, que tienen frecuencia de referencia conocida en español.

**[15]** `chiCuadradoAlKindi()` es el núcleo del criptoanálisis: el análisis de frecuencia de letras que Al-Kindi describió en el siglo IX para romper cifrados de sustitución simple. Recorre el texto en grafemas, cuenta cuántas veces aparece cada letra dentro del alfabeto, y calcula:

```
χ² = Σ (observado% − esperado%)² / esperado%
```

sumando esa cuenta letra por letra sobre todas las letras de la tabla de referencia (`FRECUENCIAS_ESPANOL`). Mientras más se parezca la distribución observada a la esperada, más bajo el χ², más probable que el texto sea español real y no ruido. Todo lo demás en `deteccion.ts` (diccionario, bigramas, desempate) son refuerzos que se aplican DESPUÉS de esto, para los casos donde el texto es demasiado corto para que la estadística de letras sueltas alcance por sí sola.

## bigramas.ts — refuerzo por bigramas

**[16]** Frecuencias reales de bigramas (pares de letras consecutivas) en español, derivadas del corpus de Leipzig (~965 millones de ocurrencias de bigramas), publicadas por el proyecto engram-es-2021 (Ian Douglas / binarybottle en GitHub, `data/spanish-bigram-frequency-v1.ods`). Es la misma idea del análisis de frecuencia de Al-Kindi, extendida de letras sueltas a pares de letras — mucha más señal por carácter en textos cortos. Solo cubre las 26 letras base (A-Z, sin Ñ): el corpus fuente no distingue la Ñ como letra propia en esta tabla, así que `plegarParaBigrama()` la pliega a N antes de buscar (igual con vocales acentuadas → su vocal base). Valores en porcentaje (suman ~100 sobre las 675 combinaciones observadas).

**[17]** `estadisticasBigrama()` recorre el texto palabra por palabra (separadas con la misma expresión regular de letras que el diccionario). Dentro de cada palabra, pliega cada letra con `plegarParaBigrama()` y para cada par consecutivo de letras calcula `-log(probabilidad / 100)` contra la tabla de [16]. El promedio final de todos esos valores es el puntaje: menor promedio = combinación de letras más típica del español.

## diccionario.ts — refuerzo por diccionario

**[18]** Lista de palabras comunes en español, embebida (sin librerías ni acceso a internet). No es exhaustiva — ningún diccionario de unos cientos de palabras cubre todo el idioma — pero cubre las palabras de uso más frecuente: artículos, pronombres, preposiciones, verbos comunes y sustantivos cotidianos. Sirve como señal extra para textos cortos, donde el chi-cuadrado por sí solo no tiene suficiente información: una palabra real reconocida por su forma vale más que un patrón de letras con suerte estadística.

**[19]** `contarCoincidenciasDiccionario()` separa el texto primero por ESPACIOS (límites de palabra de verdad), no por cualquier carácter no-letra: separar por cualquier símbolo dejaba pasar basura como "ao_]han]" (con el alfabeto ASCII completo, dígitos/símbolos mezclados), que se fragmenta en "ao" + "han" — y "han" (verbo haber) es una palabra real del diccionario, así que le ganaba a una palabra genuina como "escalera" por pura casualidad de fragmentación.

## deteccion.ts — detección automática del método

**[20]** `detectarMetodo()` es el motor completo, en cuatro pasos:
1. **Generar candidatos**: descifra el texto cifrado con cada `k` posible de César (1 a `n-1`) usando `descifrarCesar()`, más un candidato de Atbash — son `n` candidatos en total.
2. **Puntuar cada candidato**: para cada uno, calcula su chi-cuadrado y cobertura ([15]), cuenta sus coincidencias de diccionario ([19]) y sus estadísticas de bigramas ([17]).
3. **Filtrar bigramas poco confiables**: descarta (trata como `null`) el puntaje de bigramas de cualquier candidato con muchos menos bigramas que el mejor cubierto del grupo ([23]).
4. **Ordenar y elegir**: ordena todos los candidatos con `ordenarPorRefuerzos()` ([22]) y toma el primero como `ganador`. Con ese ganador calcula el IC del texto ([9]), el nivel de confianza y el porcentaje de confianza.

**[21]** `Candidato` guarda, para un descifrado posible: el método y `k` probados, el texto resultante, su chi-cuadrado y cobertura contra el español, cuántas palabras de diccionario reconoció (`coincidenciasDiccionario`, ver `diccionario.ts`), su puntaje de bigramas (`puntuacionBigrama`, `null` si no hubo suficientes bigramas para confiar en el promedio frente a los demás candidatos — ver `cantidadBigramas` y [23]) y la fracción de letras en minúscula (`fraccionMinusculas`) — este último es el desempate final para el empate may/min que produce un alfabeto con mayúsculas y minúsculas en bloques simétricos.

**[22]** `ordenarPorRefuerzos()` implementa los refuerzos sobre el chi-cuadrado de Al-Kindi (ver [15]). El chi-cuadrado por sí solo es el método pedido por la rúbrica, pero no es confiable en textos cortos — estas capas existen únicamente para resolver esos casos, en este orden de prioridad:
1. **`coincidenciasDiccionario`** — una palabra real del español reconocida vale más que cualquier estadística.
2. **`puntuacionBigrama`** — la misma idea de Al-Kindi pero con pares de letras en vez de letras sueltas: más señal por carácter en un texto corto.
3. **`chiCuadrado`** — el método de Al-Kindi. Con texto suficientemente largo, ya decide solo antes de llegar acá.
4. **`fraccionMinusculas`** — último desempate, solo para cuando dos candidatos empatan en todo lo demás salvo mayúsculas/minúsculas.

**[23]** Un candidato con símbolos/dígitos mezclados (alfabeto ASCII completo) se puede fragmentar en pocos bigramas; promediar sobre pocas muestras es ruidoso y le puede ganar por suerte a una palabra real más larga con un promedio apenas más alto. Se descarta (se trata como sin señal) el `puntuacionBigrama` de cualquier candidato bastante peor cubierto que el mejor cubierto del mismo cifrado.

## narracion.ts — explicación en lenguaje natural

**[24]** `ExplicacionDeteccion`: `titular` es el método y módulo ganador ("César · módulo 62" / "Atbash" / "No se pudo determinar"); `porcConfianza` (0-100, o `null` si no se pudo determinar); `chiCuadrado` es el del candidato ganador, se muestra junto al encabezado sin más detalle (el margen y el IC quedan fuera de la UI); `razonamiento` es una frase muy corta con nada más el método de refuerzo usado (diccionario, bigramas o solo frecuencia de letras), más una nota de confianza si aplica.
