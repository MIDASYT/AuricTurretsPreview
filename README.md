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
