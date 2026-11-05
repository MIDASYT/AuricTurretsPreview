# Traje final de Auric Turrets — maqueta revisable

## Intención y diferencias respecto a la primera maqueta

El antagonista es un robot inteligente de tamaño aproximadamente normal. No se agranda: está físicamente **dentro** del traje de guerra gigante, en una cabina, con su rostro mecánico visible a escala menor. Su identidad recupera la paleta que usa el juego original: grafito casi negro, acero/plata y detalles de oro. Los ojos cambian con la expresión (cian, oro, violeta, rojo).

El **Núcleo Auric está físicamente instalado en el centro del pecho**, sujeto por un anillo, compuertas, conductos a los brazos y dorsal; no es un holograma ni una esfera externa flotante. La armadura contiene dos brazos con manos articuladas, piernas mecánicas con pistones, cuatro cañones dorsales plegables y anclajes de asedio.

### Cinco configuraciones físicas

| Fase | HP del combate propuesto | Cambio físico visible |
|---|---:|---|
| 1: Fortaleza | 25.000 a 20.000 | Traje humanoide completo; baterías dorsales retraídas |
| 2: Arsenal | 20.000 a 15.000 | Cuatro cañones dorsales emergen con soportes y bocas |
| 3: Asedio | 15.000 a 10.000 | Cuatro anclajes laterales conectan físicamente el torso con el suelo; armas de antebrazo |
| 4: Reactor | 10.000 a 5.000 | Compuertas del pecho se abren, radiadores salen y conductos del Núcleo visibles |
| 5: Última Voluntad | 5.000 a 0 | Núcleo totalmente expuesto, conductos de emergencia, piezas fracturadas y refuerzos desprendidos |

Estas **no son fases aprobadas**; los 25.000 HP y cinco fases de 5.000 sí están confirmados por el dueño.

## Cómo revisar

1. Abrir `project.godot` con Godot 4.x.
2. Abrir `scenes/BossPreview.tscn`.
3. Seleccionar el nodo raíz y cambiar `Preview Phase` entre 1 y 5 desde el Inspector. La geometría se reconstruye en el editor mediante `@tool`.
4. Ejecutar la escena para verla con cámara e iluminación, y pulsar 1–5 para cambiar de configuración.

El modelo es **fuente geométrica 3D real en Godot**, no una imagen generada ni una interfaz que solo simula profundidad. Todavía requiere rig completo de movimiento, texturas, animaciones de ataques y revisión del dueño. Su fidelidad se basa en el lenguaje visual de `antagonist_identity.gd` y `antagonist_prototype.gd`, que permanecen únicamente en el repositorio principal; este proyecto NO los altera ni depende de ellos.

**Verificación:** subida confirmada al repositorio de pruebas. Sin Godot ejecutado en este entorno no se afirma prueba visual ni compatibilidad en un exportable.
