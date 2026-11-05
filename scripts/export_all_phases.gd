extends SceneTree
## Run from the private preview project:
## godot --headless --path . --script res://scripts/export_all_phases.gd
## Produces five self-contained 3D .glb assets, one per boss phase.
func _initialize() -> void:
	call_deferred("_export")

func _export() -> void:
	var packed: PackedScene = load("res://scenes/BossPreview.tscn")
	if packed == null:
		push_error("Boss preview scene could not be loaded")
		quit(1)
		return
	var output := "res://exports"
	if DirAccess.make_dir_recursive_absolute(ProjectSettings.globalize_path(output)) != OK:
		push_error("Could not create export directory")
		quit(2)
		return
	for phase_number in range(1,6):
		var scene: Node3D = packed.instantiate()
		scene.preview_phase = phase_number
		get_root().add_child(scene)
		var geometry := scene.get_node_or_null("FinalSuit_Phase_%d" % phase_number)
		if geometry == null:
			push_error("Missing phase %d geometry" % phase_number)
			scene.queue_free()
			quit(3)
			return
		var document := GLTFDocument.new()
		var state := GLTFState.new()
		var err := document.append_from_scene(geometry,state)
		if err != OK:
			push_error("Could not encode phase %d: %s" % [phase_number,error_string(err)])
			scene.queue_free()
			quit(4)
			return
		var path := "%s/M17_TrajeNucleo_Fase%d.glb" % [output,phase_number]
		err = document.write_to_filesystem(state,path)
		if err != OK:
			push_error("Could not write %s: %s" % [path,error_string(err)])
			scene.queue_free()
			quit(5)
			return
		print("EXPORTED: ",path)
		scene.queue_free()
	print("Five boss visual phases exported; design still awaits approval and validation.")
	quit(0)
