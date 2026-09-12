// [18]
const PALABRAS = [
  // Articulos, pronombres, preposiciones, conjunciones
  'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas', 'lo',
  'yo', 'tu', 'tú', 'el', 'ella', 'usted', 'nosotros', 'nosotras', 'vosotros', 'vosotras', 'ellos', 'ellas', 'ustedes',
  'me', 'te', 'se', 'nos', 'os', 'le', 'les',
  'mi', 'mis', 'tus', 'su', 'sus', 'nuestro', 'nuestra', 'nuestros', 'nuestras', 'vuestro', 'vuestra',
  'este', 'esta', 'esto', 'estos', 'estas', 'ese', 'esa', 'eso', 'esos', 'esas', 'aquel', 'aquella', 'aquello',
  'de', 'a', 'en', 'con', 'por', 'para', 'sin', 'sobre', 'entre', 'hacia', 'hasta', 'desde', 'ante', 'bajo', 'tras', 'según', 'durante', 'mediante',
  'y', 'e', 'o', 'u', 'ni', 'pero', 'mas', 'más', 'aunque', 'porque', 'pues', 'si', 'sí', 'no', 'que', 'qué', 'como', 'cómo',
  'cuando', 'cuándo', 'donde', 'dónde', 'quien', 'quién', 'quienes', 'cuanto', 'cuánto', 'cual', 'cuál', 'cuales',
  'ya', 'muy', 'también', 'tampoco', 'solo', 'sólo', 'todo', 'toda', 'todos', 'todas', 'nada', 'algo', 'alguien', 'nadie',
  'algún', 'alguno', 'alguna', 'algunos', 'algunas', 'ningún', 'ninguno', 'ninguna', 'otro', 'otra', 'otros', 'otras',
  'mucho', 'mucha', 'muchos', 'muchas', 'poco', 'poca', 'pocos', 'pocas', 'tanto', 'tanta', 'tantos', 'tantas',
  'antes', 'después', 'ahora', 'hoy', 'ayer', 'mañana', 'siempre', 'nunca', 'jamás', 'aquí', 'ahí', 'allí', 'allá',
  'bien', 'mal', 'aquí', 'así', 'entonces', 'luego', 'además', 'incluso', 'quizás', 'quizá', 'tal', 'vez',

  // Verbos comunes (formas frecuentes)
  'ser', 'soy', 'eres', 'es', 'somos', 'sois', 'son', 'era', 'eras', 'fue', 'fui', 'fuiste', 'seré', 'será',
  'estar', 'estoy', 'estás', 'está', 'estamos', 'estáis', 'están', 'estaba', 'estuvo', 'estaré',
  'haber', 'he', 'has', 'ha', 'hemos', 'habéis', 'han', 'había', 'hubo', 'habrá',
  'tener', 'tengo', 'tienes', 'tiene', 'tenemos', 'tenéis', 'tienen', 'tenía', 'tuvo', 'tendrá',
  'hacer', 'hago', 'haces', 'hace', 'hacemos', 'hacéis', 'hacen', 'hacía', 'hizo', 'hará', 'hecho',
  'poder', 'puedo', 'puedes', 'puede', 'podemos', 'podéis', 'pueden', 'podía', 'pudo', 'podrá',
  'decir', 'digo', 'dices', 'dice', 'decimos', 'decís', 'dicen', 'decía', 'dijo', 'dirá', 'dicho',
  'ir', 'voy', 'vas', 'va', 'vamos', 'vais', 'van', 'iba', 'fue', 'irá',
  'ver', 'veo', 'ves', 've', 'vemos', 'veis', 'ven', 'veía', 'vio', 'verá', 'visto',
  'dar', 'doy', 'das', 'da', 'damos', 'dais', 'dan', 'daba', 'dio', 'dará',
  'saber', 'sé', 'sabes', 'sabe', 'sabemos', 'sabéis', 'saben', 'sabía', 'supo', 'sabrá',
  'querer', 'quiero', 'quieres', 'quiere', 'queremos', 'queréis', 'quieren', 'quería', 'quiso', 'querrá',
  'llegar', 'llego', 'llegas', 'llega', 'llegamos', 'llegan', 'llegó', 'llegará',
  'pasar', 'paso', 'pasas', 'pasa', 'pasamos', 'pasan', 'pasó', 'pasará',
  'deber', 'debo', 'debes', 'debe', 'debemos', 'deben', 'debía', 'debió',
  'poner', 'pongo', 'pones', 'pone', 'ponemos', 'ponen', 'puso', 'pondrá', 'puesto',
  'parecer', 'parezco', 'pareces', 'parece', 'parecemos', 'parecen', 'pareció',
  'quedar', 'quedo', 'quedas', 'queda', 'quedamos', 'quedan', 'quedó', 'quedará',
  'creer', 'creo', 'crees', 'cree', 'creemos', 'creen', 'creyó', 'creído',
  'hablar', 'hablo', 'hablas', 'habla', 'hablamos', 'hablan', 'habló', 'hablará',
  'llevar', 'llevo', 'llevas', 'lleva', 'llevamos', 'llevan', 'llevó',
  'dejar', 'dejo', 'dejas', 'deja', 'dejamos', 'dejan', 'dejó',
  'seguir', 'sigo', 'sigues', 'sigue', 'seguimos', 'siguen', 'siguió',
  'encontrar', 'encuentro', 'encuentras', 'encuentra', 'encontramos', 'encuentran', 'encontró',
  'llamar', 'llamo', 'llamas', 'llama', 'llamamos', 'llaman', 'llamó',
  'venir', 'vengo', 'vienes', 'viene', 'venimos', 'vienen', 'vino', 'vendrá',
  'pensar', 'pienso', 'piensas', 'piensa', 'pensamos', 'piensan', 'pensó',
  'salir', 'salgo', 'sales', 'sale', 'salimos', 'salen', 'salió', 'saldrá',
  'volver', 'vuelvo', 'vuelves', 'vuelve', 'volvemos', 'vuelven', 'volvió',
  'tomar', 'tomo', 'tomas', 'toma', 'tomamos', 'toman', 'tomó',
  'conocer', 'conozco', 'conoces', 'conoce', 'conocemos', 'conocen', 'conoció',
  'vivir', 'vivo', 'vives', 'vive', 'vivimos', 'viven', 'vivió',
  'sentir', 'siento', 'sientes', 'siente', 'sentimos', 'sienten', 'sintió',
  'trabajar', 'trabajo', 'trabajas', 'trabaja', 'trabajamos', 'trabajan', 'trabajó',
  'escribir', 'escribo', 'escribes', 'escribe', 'escribimos', 'escriben', 'escribió', 'escrito',
  'leer', 'leo', 'lees', 'lee', 'leemos', 'leen', 'leyó', 'leído',
  'comer', 'como', 'comes', 'come', 'comemos', 'comen', 'comió',
  'dormir', 'duermo', 'duermes', 'duerme', 'dormimos', 'duermen', 'durmió',
  'jugar', 'juego', 'juegas', 'juega', 'jugamos', 'juegan', 'jugó',
  'escuchar', 'escucho', 'escuchas', 'escucha', 'escuchamos', 'escuchan', 'escuchó',
  'gustar', 'gusto', 'gustas', 'gusta', 'gustamos', 'gustan', 'gustó',
  'buscar', 'busco', 'buscas', 'busca', 'buscamos', 'buscan', 'buscó',
  'necesitar', 'necesito', 'necesitas', 'necesita', 'necesitamos', 'necesitan',
  'ayudar', 'ayudo', 'ayudas', 'ayuda', 'ayudamos', 'ayudan', 'ayudó',
  'entender', 'entiendo', 'entiendes', 'entiende', 'entendemos', 'entienden', 'entendió',
  'abrir', 'abro', 'abres', 'abre', 'abrimos', 'abren', 'abrió', 'abierto',
  'cerrar', 'cierro', 'cierras', 'cierra', 'cerramos', 'cierran', 'cerró',
  'empezar', 'empiezo', 'empiezas', 'empieza', 'empezamos', 'empiezan', 'empezó',
  'terminar', 'termino', 'terminas', 'termina', 'terminamos', 'terminan', 'terminó',

  // Sustantivos y adjetivos cotidianos
  'hola', 'adiós', 'gracias', 'favor', 'perdón', 'permiso', 'buenos', 'buenas', 'días', 'tardes', 'noches',
  'casa', 'mundo', 'vida', 'tiempo', 'hombre', 'mujer', 'niño', 'niña', 'persona', 'gente',
  'año', 'mes', 'semana', 'día', 'hora', 'minuto', 'segundo', 'momento',
  'mano', 'pie', 'cabeza', 'ojo', 'ojos', 'boca', 'nariz', 'oreja', 'brazo', 'pierna', 'corazón', 'cuerpo',
  'agua', 'fuego', 'tierra', 'aire', 'viento', 'lluvia', 'nieve', 'sol', 'luna', 'estrella', 'cielo', 'nube',
  'país', 'ciudad', 'pueblo', 'calle', 'plaza', 'parque', 'escuela', 'universidad', 'trabajo', 'oficina',
  'familia', 'padre', 'madre', 'hijo', 'hija', 'hermano', 'hermana', 'abuelo', 'abuela', 'amigo', 'amiga', 'amor',
  'comida', 'pan', 'agua', 'café', 'leche', 'azúcar', 'sal', 'fruta', 'manzana', 'naranja',
  'canción', 'música', 'baile', 'fiesta', 'juego', 'libro', 'historia', 'palabra', 'idioma', 'nombre',
  'coche', 'carro', 'camino', 'puerta', 'ventana', 'mesa', 'silla', 'cama', 'pared', 'techo',
  'perro', 'gato', 'pájaro', 'pez', 'animal', 'árbol', 'flor', 'planta', 'bosque', 'montaña', 'río', 'mar', 'playa',
  'jirafa', 'elefante', 'león', 'tigre', 'oso', 'lobo', 'zorro', 'conejo', 'ratón', 'caballo', 'vaca', 'cerdo', 'oveja',
  'rojo', 'azul', 'verde', 'amarillo', 'blanco', 'negro', 'gris', 'rosa', 'morado', 'naranja',
  'grande', 'pequeño', 'pequeña', 'bueno', 'buena', 'malo', 'mala', 'nuevo', 'nueva', 'viejo', 'vieja',
  'bonito', 'bonita', 'feo', 'fea', 'alto', 'alta', 'bajo', 'baja', 'largo', 'larga', 'corto', 'corta',
  'rápido', 'rápida', 'lento', 'lenta', 'fácil', 'difícil', 'importante', 'diferente', 'mismo', 'misma',
  'primero', 'primera', 'segundo', 'segunda', 'último', 'última', 'nuevo', 'joven', 'niño',
  'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez',
  'once', 'doce', 'veinte', 'treinta', 'cien', 'mil',
  'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo',
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
  'universidad', 'estudiante', 'profesor', 'clase', 'examen', 'tarea', 'proyecto', 'programa', 'computadora',
  'seguridad', 'sistema', 'código', 'mensaje', 'texto', 'letra', 'número', 'clave', 'módulo', 'análisis',

  // Mas sustantivos cotidianos (vivienda, ciudad, cuerpo, objetos comunes)
  'piso', 'apartamento', 'departamento', 'edificio', 'habitación', 'cuarto', 'baño', 'cocina', 'jardín', 'garaje',
  'barrio', 'pueblo', 'región', 'provincia', 'estado', 'nación', 'capital', 'frontera', 'población',
  'espalda', 'pecho', 'hombro', 'cuello', 'dedo', 'dedos', 'rodilla', 'codo', 'cadera', 'piel', 'sangre', 'hueso',
  'dinero', 'moneda', 'billete', 'banco', 'tarjeta', 'precio', 'costo', 'venta', 'compra', 'negocio', 'empresa',
  'teléfono', 'celular', 'pantalla', 'internet', 'correo', 'aplicación', 'archivo', 'carpeta', 'video', 'imagen',
  'reloj', 'espejo', 'lámpara', 'llave', 'bolsa', 'caja', 'papel', 'lápiz', 'pluma', 'cuaderno',
  'ropa', 'camisa', 'pantalón', 'zapato', 'zapatos', 'vestido', 'abrigo', 'sombrero', 'bolsillo',
  'salud', 'enfermedad', 'dolor', 'medicina', 'hospital', 'médico', 'doctor', 'doctora', 'paciente',
  'guerra', 'paz', 'ley', 'derecho', 'justicia', 'política', 'religión', 'cultura', 'arte', 'ciencia',
  'razón', 'idea', 'pregunta', 'respuesta', 'problema', 'solución', 'razón', 'error', 'verdad', 'mentira',
  'fuerza', 'energía', 'poder', 'control', 'peligro', 'riesgo', 'suerte', 'oportunidad', 'cambio', 'diferencia',

  // Prestamos de otros idiomas ya de uso comun en español (no siguen la
  // fonotactica clasica del idioma, pero son palabras reales y frecuentes)
  'gay', 'ok', 'club', 'test', 'chat', 'web', 'blog', 'email', 'internet', 'wifi', 'bar', 'fan', 'set', 'stop',
]

export const PALABRAS_ESPANOL = new Set(PALABRAS.map((p) => p.toLowerCase()))

const PATRON_PALABRA = /[a-zA-ZÁÉÍÓÚÑáéíóúñ]+/g

const LONGITUD_MINIMA_COINCIDENCIA = 3

// [19]
export function contarCoincidenciasDiccionario(texto: string): number {
  const segmentos = texto.split(/\s+/).filter((s) => s.length > 0)
  let coincidencias = 0
  for (const segmento of segmentos) {
    const tramos = segmento.match(PATRON_PALABRA) ?? []
    if (tramos.length !== 1) continue
    const palabra = tramos[0]
    const esSegmentoCompleto = palabra.length === segmento.length
    const suficientementeLarga = palabra.length >= LONGITUD_MINIMA_COINCIDENCIA || (esSegmentoCompleto && palabra.length >= 2)
    if (suficientementeLarga && PALABRAS_ESPANOL.has(palabra.toLowerCase())) coincidencias++
  }
  return coincidencias
}
