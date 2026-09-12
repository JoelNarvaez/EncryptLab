# EncryptLab explicado fácil

Los mismos 24 números que aparecen en el código (`// [1]`, `// [2]`...) están acá, explicados como se los explicaría a un compañero: qué hace esa parte y por qué está así, sin tanto tecnicismo.

## alfabeto.ts

**[1]** Esto arma el alfabeto por defecto, todos los caracteres normales que se pueden escribir en un teclado. Son 95 en total. No metemos caracteres raros como tabulaciones o saltos de línea porque no se ven.

**[2]** Este es el alfabeto en español: mayúsculas, minúsculas, la Ñ y las vocales con acento, más el espacio. Son 65 símbolos. Estos caracteres (como la Á o la Ñ) no están en el alfabeto de arriba, es otro alfabeto más simple.

**[3]** Esta función agarra lo que el usuario escribió como alfabeto y le quita los símbolos repetidos, dejando solo uno de cada uno: si escribes "aab", te queda `['a', 'b']`. Simplemente recorre el texto símbolo por símbolo y va guardando en una lista los que no había visto todavía; si un símbolo ya apareció antes, lo salta y sigue.

**[4]** Esta función parte el texto en pedazos, uno por cada símbolo. Por ejemplo, algunos emojis en realidad son dos piezas de información pegadas (el dibujo + un modificador invisible, como el tono de piel). Si partiéramos el texto de la forma normal, esos emojis se romperían en dos "letras" distintas y todo se desordenaría. Por eso usamos una herramienta que sabe reconocer "esto es un solo símbolo visual" aunque por dentro sean dos piezas.

## cesar.ts

**[5]** Esta es la función que realmente cifra con César: agarra cada símbolo del texto, ve en qué posición está dentro del alfabeto, y lo cambia por el símbolo que quedó `k` posiciones más adelante (si te pasas del final del alfabeto, vuelves a empezar desde el principio, como dando la vuelta). Si el símbolo ni siquiera está en el alfabeto (por ejemplo, un emoji que no agregaste), lo deja tal cual, sin tocarlo.

**[6]** Esta es la función que descifra. Llama a la misma función de cifrar, pero con `k` en negativo: si cifrar es "avanzar k posiciones", descifrar es "retroceder k posiciones".

**[7]** El número de corrimiento `k` tiene que ser entre 1 y el tamaño del alfabeto menos uno. No dejamos usar `k = 0` porque eso significaría "correr cero posiciones", o sea, no cifraría.

## atbash.ts

**[8]** Atbash es similar: la misma función sirve para cifrar y para descifrar. Es más simple que César porque no suma nada, solo invierte el alfabeto — el primer símbolo se cambia por el último, el segundo por el penúltimo, y así hasta el final. Si la aplicas dos veces seguidas, vuelves al texto original.

## coincidencia.ts

**[9]** Esto mide qué tan seguido se repiten los mismos símbolos en un texto. Lo importante es que este número no cambia sin importar qué `k` uses para descifrar. Por eso este número no sirve para elegir cuál `k` es el correcto. Lo usamos para compararlo contra el valor típico del español, como una forma extra de confirmar que sí hay español detrás del texto.

**[10]** Este es el valor "normal" del número de arriba para un texto largo en español (0.075). Es el que usamos de referencia para comparar.

## frecuencias.ts

**[11]** Esta es la tabla clásica que nos dice qué porcentaje de las veces aparece cada letra en un texto en español. Es la base de todo el análisis de frecuencia.

## puntuacion.ts

**[12]** Las letras con acento (á, é, í...) las contamos aparte de su letra sin acento.

**[13]** Le ponemos un piso de 3% a la frecuencia esperada de cada letra. Si un texto corto tiene una sola H (es muy rara en el español) por pura casualidad, la matemática del chi-cuadrado se dispara a un número absurdo y hace perder al candidato correcto.

**[14]** `cobertura` es qué porcentaje del texto tiene letras que sí reconocemos en nuestra tabla de frecuencias en español.

**[15]** Esta es la función principal del análisis de frecuencia que inventó Al-Kindi para romper este tipo de cifrados. Primero comparamos qué tan seguido aparece cada letra en el texto contra lo que debería aparecer en español normal. Cuanto más se parezcan, más probable es que ese sea el descifrado correcto.

## bigramas.ts

**[16]** Esta tabla dice qué tan común es cada par de letras seguidas en español. Los datos son reales, sacados de un estudio con casi mil millones de pares de letras contados en español. Es la misma idea del chi-cuadrado, pero yendo un nivel más fino: en vez de mirar letras solas, miramos parejas.

**[17]** Esta función recorre el texto palabra por palabra, letra por letra, y va calculando qué tan típico o raro es cada par de letras seguidas, comparado con el español real.

## diccionario.ts

**[18]** Tenemos una lista de como 400 palabras comunes del español guardada directo en el código. No es todo el diccionario, pero cubre lo más usado: artículos, verbos comunes, palabras de todos los días.

**[19]** Esta función cuenta cuántas palabras reales de español hay en el texto. Partimos el texto por los espacios; si no, un texto lleno de basura se rompería en pedacitos que por casualidad coinciden con palabras reales cortas, y eso nos engañaría.

## deteccion.ts

**[20]** Esta es la función más importante, la que descifra el texto sin que el usuario elija nada. Prueba todos los `k` posibles de César (del 1 hasta el tamaño del alfabeto menos uno) más una vez con Atbash, y a cada uno de esos intentos de descifrado le calcula qué tan parecido es al español con el chi-cuadrado, cuántas palabras reales de diccionario tiene, y qué tan típicos son sus pares de letras. Si un intento tiene muy pocos pares de letras como para confiar en ese dato, lo ignora. Con toda esa información ordena los intentos de mejor a peor y se queda con el primero como resultado final, calculando también qué tan confiable es ese resultado.

**[21]** Por cada posible descifrado (es decir, cada `k` de César, más Atbash) guardamos toda la información que juntamos sobre él: su chi-cuadrado, cuántas palabras de diccionario tiene, su puntaje de bigramas, y qué porcentaje de sus letras son minúsculas (esto último es un desempate para casos muy raros).

**[22]** Acá se decide quién gana entre todos los candidatos, en este orden de importancia: primero quién tiene más palabras reales reconocidas, después quién tiene mejor puntaje de bigramas, después quién tiene mejor chi-cuadrado, y por último quién tiene más letras en minúscula.

**[23]** Si un candidato tiene muy pocos pares de letras para analizar comparado con los demás, no confiamos en su puntaje de bigramas — lo tratamos como si no tuviera esa señal, para que no gane por pura casualidad estadística.

## narracion.ts

**[24]** Esto arma la explicación que se le muestra al usuario, es decir, qué método y módulo ganaron, el chi-cuadrado de ese ganador, y una frase cortita diciendo qué fue lo que más ayudó a decidir (¿fue una palabra real? ¿los pares de letras? ¿solo la frecuencia normal?), más un aviso si el texto era corto o el alfabeto raro.
