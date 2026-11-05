# Auric Turrets — Modelo 3D del traje final (M17)

**Repositorio privado de pruebas.** El juego principal NO ha sido modificado.

Este proyecto Godot 4.x crea geometría 3D real: traje de gran escala, articulaciones, detalles metálicos, cuatro cañones dorsales plegables, soportes de asedio, reactor Auric alojado en el pecho y cabina con rostro mecánico pequeño del antagonista. Usa una paleta vinculada a las fuentes artísticas actuales sin copiar sus scripts privados.

## Ver las cinco configuraciones

1. Abrir `project.godot` con Godot.
2. Abrir y ejecutar `scenes/BossPreview.tscn`.
3. Pulsar **1, 2, 3, 4 o 5** para ver las diferentes formas. También se puede modificar `Preview Phase` en el Inspector del editor, gracias a `@tool`.

## Exportar modelos 3D

Desde una terminal con Godot instalado, en la raíz del proyecto:

```bash
godot --headless --path . --script res://scripts/export_all_phases.gd
```

Este script genera `exports/M17_TrajeNucleo_Fase1.glb` hasta `Fase5.glb`. Los GLB generados se excluyen de Git hasta revisión.

## Limitaciones verificadas

Se comprobó por GitHub que los cuatro archivos esenciales están publicados en este repositorio: escena, script de modelo, proyecto y script exportador. En este entorno **no se dispone de una ejecución local de Godot**, por lo que no se afirma que el proyecto haya pasado validación del motor ni se publican capturas fingidas. El modelo aún no tiene rig completo ni animaciones de combate. Sigue siendo **PROPUESTO**; no se debe integrar en la versión jugable sin aprobación.

[Descripción de las cinco fases](PLAN_VISUAL.md).


## Vista web para celular — GitHub Pages

Se añadieron \`index.html\`, \`styles.css\` y \`viewer.js\` a la raíz del repositorio. **La web funciona en el navegador; no se necesita abrir Godot ni descargar nada.**

Pasos para publicarla:
1. En GitHub, entra a **Settings → Pages** de este repositorio.
2. Selecciona **Deploy from a branch**, rama **main**, carpeta **/(root)**; pulsa **Save**.
3. Cuando GitHub confirme que se publicó, utiliza el enlace **Visit site** que aparece en la misma página. La dirección típica de un sitio de proyecto público es \`https://midasyt.github.io/AuricTurretsPreview/\`; **no significa que esté publicado antes de que GitHub confirme el despliegue**.

**Privacidad:** este repositorio es privado. GitHub Pages en repositorios privados requiere un plan GitHub que lo permita (Pro/Team/Enterprise). En GitHub Free, la web requiere un repositorio público. No hagas público el repositorio principal del juego: contiene fuentes privadas. Revisa también el contenido de este repositorio de pruebas antes de cambiar su visibilidad.

El visor web es un modelo 3D original de planificación basado en las proporciones y la paleta del traje prototipo y el antagonista real en la fuente 0.1.24. No es una exportación exacta de los modelos internos del juego. Las cinco etapas se pueden seleccionar desde el teléfono. Tiene giro táctil, acercamiento, vista frontal, modo de estructura y guardado de una captura PNG.
