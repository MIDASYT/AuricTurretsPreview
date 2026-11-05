@tool
extends Node3D
## M17 FINAL SUIT / VISUAL PROTOTYPE. Private preview only, not game content.
## This model is intentionally original: a large, articulated war suit carrying
## the established small antagonist in a protected cockpit, and the Auric Core
## integrated in the chest. No enlargement of the antagonist's approved face.
@export_range(1, 5, 1) var preview_phase: int = 1:
	set(value):
		preview_phase = clampi(value, 1, 5)
		if is_inside_tree():
			_rebuild()

var suit: Node3D
var palette: Dictionary = {}
var core: MeshInstance3D
var iris_left: MeshInstance3D
var iris_right: MeshInstance3D
var studio_ready := false
var pulse := 0.0

func _ready() -> void:
	if not studio_ready:
		_make_studio()
		studio_ready = true
	_rebuild()
	set_process(not Engine.is_editor_hint())

func _process(delta: float) -> void:
	pulse += delta
	if is_instance_valid(core):
		var glow := core.material_override as StandardMaterial3D
		if glow != null:
			glow.emission_energy_multiplier = 2.5 + .75 * sin(pulse * 2.5)
	if Input.is_key_pressed(KEY_1): _set_phase(1)
	if Input.is_key_pressed(KEY_2): _set_phase(2)
	if Input.is_key_pressed(KEY_3): _set_phase(3)
	if Input.is_key_pressed(KEY_4): _set_phase(4)
	if Input.is_key_pressed(KEY_5): _set_phase(5)

func _set_phase(number: int) -> void:
	if number != preview_phase: preview_phase = number

func _material(color: Color, metal: float=.80, rough: float=.33, emission: float=0.0) -> StandardMaterial3D:
	var m := StandardMaterial3D.new()
	m.albedo_color = color
	m.metallic = metal
	m.roughness = rough
	if emission > 0.0:
		m.emission_enabled = true
		m.emission = color
		m.emission_energy_multiplier = emission
	return m

func _make_palette() -> void:
	palette = {
		"obsidian": _material(Color(.055,.07,.09),.83,.29),
		"graphite": _material(Color(.10,.125,.15),.87,.30),
		"steel": _material(Color(.40,.49,.54),.84,.31),
		"silver": _material(Color(.66,.71,.73),.86,.24),
		"gold": _material(Color(.68,.46,.15),.86,.25),
		"dark": _material(Color(.014,.021,.028),.35,.53),
		"copper": _material(Color(.42,.27,.12),.85,.31),
		"core": _material(Color(1,.69,.19),.12,.17,2.5),
		"ring": _material(Color(1,.83,.41),.28,.20,1.1),
		"red": _material(Color(.95,.11,.04),.20,.19,2.1),
		"cyan": _material(Color(.25,.94,.96),.24,.17,1.8),
		"violet": _material(Color(.64,.26,.97),.24,.17,1.8),
		"yellow": _material(Color(1,.74,.15),.24,.17,1.8),
		"glass": _material(Color(.10,.19,.26),.25,.08),
		"stage": _material(Color(.055,.085,.115),.7,.5)
	}
	var glass_material: StandardMaterial3D = palette["glass"]
	glass_material.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA
	glass_material.albedo_color = Color(.10,.19,.26,.52)

func _block(parent: Node3D, name: String, pos: Vector3, size: Vector3, mat: Material, rot: Vector3=Vector3.ZERO) -> MeshInstance3D:
	var node := MeshInstance3D.new()
	node.name = name
	var mesh := BoxMesh.new()
	mesh.size = size
	node.mesh = mesh
	node.material_override = mat
	node.position = pos
	node.rotation = rot
	parent.add_child(node)
	return node

func _ball(parent: Node3D, name: String, pos: Vector3, radius: float, mat: Material, height_scale: float=1.0) -> MeshInstance3D:
	var node := MeshInstance3D.new()
	node.name = name
	var mesh := SphereMesh.new()
	mesh.radius = radius
	mesh.height = radius * 2.0
	mesh.radial_segments = 20
	mesh.rings = 12
	node.mesh = mesh
	node.material_override = mat
	node.position = pos
	node.scale.y = height_scale
	parent.add_child(node)
	return node

func _beam(parent: Node3D, name: String, a: Vector3, b: Vector3, radius: float, mat: Material, top_radius: float=-1.0) -> MeshInstance3D:
	var node := MeshInstance3D.new()
	node.name = name
	var mesh := CylinderMesh.new()
	mesh.bottom_radius = radius
	mesh.top_radius = radius if top_radius < 0.0 else top_radius
	mesh.height = maxf(.005, a.distance_to(b))
	mesh.radial_segments = 14
	node.mesh = mesh
	node.material_override = mat
	node.position = (a+b)*.5
	var d := b-a
	if d.length() > .0001:
		node.quaternion = Quaternion(Vector3.UP, d.normalized())
	parent.add_child(node)
	return node

func _hoop(parent: Node3D, name: String, center: Vector3, radius: float, width: float, mat: Material, vertical: bool=true) -> MeshInstance3D:
	var node := MeshInstance3D.new()
	node.name = name
	var mesh := TorusMesh.new()
	mesh.inner_radius = radius - width
	mesh.outer_radius = radius + width
	mesh.rings = 28
	mesh.ring_segments = 10
	node.mesh = mesh
	node.material_override = mat
	node.position = center
	if vertical: node.rotation.x = PI*.5
	parent.add_child(node)
	return node

func _make_studio() -> void:
	var camera := Camera3D.new()
	camera.name = "PreviewCamera"
	camera.position = Vector3(16, 12, 23)
	add_child(camera)
	camera.look_at(Vector3(0, 5.1, 0), Vector3.UP)
	camera.fov = 45.0
	camera.current = true
	var sun := DirectionalLight3D.new()
	sun.name = "StudioKeyLight"
	sun.rotation_degrees = Vector3(-40, -25, 0)
	sun.light_energy = 2.1
	add_child(sun)
	var fill := OmniLight3D.new()
	fill.name = "StudioFillLight"
	fill.position = Vector3(-5, 10, 7)
	fill.light_energy = 0.9
	fill.omni_range = 25.0
	add_child(fill)
	var env := WorldEnvironment.new()
	env.name = "PreviewEnvironment"
	var settings := Environment.new()
	settings.background_mode = Environment.BG_COLOR
	settings.background_color = Color(.035,.05,.08)
	settings.ambient_light_source = Environment.AMBIENT_SOURCE_COLOR
	settings.ambient_light_color = Color(.30,.36,.45)
	settings.ambient_light_energy = .8
	env.environment = settings
	add_child(env)

func _rebuild() -> void:
	if is_instance_valid(suit):
		suit.free()
	suit = Node3D.new()
	suit.name = "FinalSuit_Phase_%d" % preview_phase
	add_child(suit)
	_make_palette()
	_platform()
	_legs()
	_hip_and_core_structure()
	_arms()
	_cockpit_with_identity()
	_spine_and_cannons()
	_reactor()
	_phase_hardware()

func _platform() -> void:
	_block(suit,"GroundReference",Vector3(0,-.18,0),Vector3(14,.24,11),palette.stage)
	for i in 24:
		var t := TAU*float(i)/24.0
		var u := TAU*float(i+1)/24.0
		_beam(suit,"DeckRing_%02d"%i,Vector3(5.4*cos(t),-.03,3.9*sin(t)),Vector3(5.4*cos(u),-.03,3.9*sin(u)),.048,palette.gold)
	for i in 5:
		_block(suit,"DeckRib_%02d"%i,Vector3(0,-.03,-3.2+i*1.6),Vector3(12,.05,.06),palette.steel)

func _legs() -> void:
	for side in [-1,1]:
		var s := float(side)
		_ball(suit,"HipBearing_%d"%side,Vector3(s*1.38,4.15,0),.72,palette.gold)
		_beam(suit,"ThighMain_%d"%side,Vector3(s*1.38,4.15,0),Vector3(s*1.63,2.67,.30),.72,palette.graphite,.62)
		_block(suit,"ThighArmor_%d"%side,Vector3(s*1.53,3.44,.39),Vector3(1.4,1.3,1.05),palette.obsidian,Vector3(0,0,-s*.09))
		_block(suit,"ThighPlate_%d"%side,Vector3(s*1.57,3.50,1.04),Vector3(1.11,.94,.23),palette.steel)
		_block(suit,"ThighGoldSlash_%d"%side,Vector3(s*1.57,3.63,1.19),Vector3(.9,.12,.11),palette.gold)
		_ball(suit,"KneeSocket_%d"%side,Vector3(s*1.63,2.57,.30),.59,palette.gold)
		_block(suit,"KneeFace_%d"%side,Vector3(s*1.63,2.56,.96),Vector3(1.14,.55,.37),palette.silver)
		_beam(suit,"LowerLeg_%d"%side,Vector3(s*1.63,2.51,.3),Vector3(s*1.73,.65,.30),.57,palette.obsidian)
		_block(suit,"ShinArmor_%d"%side,Vector3(s*1.73,1.56,.74),Vector3(1.35,1.45,.83),palette.graphite)
		_block(suit,"ShinFace_%d"%side,Vector3(s*1.73,1.54,1.21),Vector3(1.04,1.18,.18),palette.steel)
		_block(suit,"Foot_%d"%side,Vector3(s*1.73,.27,1.03),Vector3(1.66,.5,2.65),palette.obsidian)
		_block(suit,"ToeBlade_%d"%side,Vector3(s*1.73,.22,2.24),Vector3(1.44,.27,.36),palette.silver)
		_block(suit,"Heel_%d"%side,Vector3(s*1.73,.42,-.61),Vector3(1.45,.58,.8),palette.graphite)
		for k in 3:
			_block(suit,"FootClaw_%d_%d"%[side,k],Vector3(s*1.73+float(k-1)*.43,.19,2.44),Vector3(.25,.18,.65),palette.gold)
		_beam(suit,"LegPistonMain_%d"%side,Vector3(s*2.15,3.52,-.18),Vector3(s*2.12,2.0,.05),.16,palette.gold)
		_beam(suit,"LegPistonInner_%d"%side,Vector3(s*2.12,3.19,.03),Vector3(s*2.15,1.83,.18),.09,palette.silver)
		for k in 3:
			_block(suit,"ShinVent_%d_%d"%[side,k],Vector3(s*1.73,1.20+float(k)*.25,1.33),Vector3(.78,.055,.10),palette.dark)

func _hip_and_core_structure() -> void:
	_block(suit,"Pelvis",Vector3(0,4.24,0),Vector3(3.4,1.06,2.0),palette.obsidian)
	_block(suit,"WaistLock",Vector3(0,4.67,.78),Vector3(3.8,.23,1.02),palette.gold)
	_block(suit,"LowerTorso",Vector3(0,5.52,0),Vector3(3.6,1.58,2.18),palette.graphite)
	_block(suit,"OuterTorso",Vector3(0,7.13,-.08),Vector3(5.1,2.65,2.74),palette.obsidian)
	_block(suit,"UpperPectoral",Vector3(0,8.22,1.27),Vector3(4.54,.73,.34),palette.steel)
	for side in [-1,1]:
		var s := float(side)
		if preview_phase < 5:
			_block(suit,"Breastplate_%d"%side,Vector3(s*1.59,7.08,1.47),Vector3(1.50,2.22,.43),palette.graphite,Vector3(0,0,s*.09))
		else:
			_block(suit,"BrokenPectoralTop_%d"%side,Vector3(s*1.75,8.01,1.47),Vector3(1.05,.38,.38),palette.steel,Vector3(0,0,s*.27))
			_block(suit,"BrokenPectoralBottom_%d"%side,Vector3(s*1.84,6.15,1.48),Vector3(.94,.48,.37),palette.graphite,Vector3(0,0,-s*.23))
			for rib in 4:
				_block(suit,"ExposedActuator_%d_%d"%[side,rib],Vector3(s*1.44,6.65+float(rib)*.32,1.55),Vector3(1.24,.13,.21),palette.silver)
		_block(suit,"GiltChestSeam_%d"%side,Vector3(s*2.28,7.06,1.68),Vector3(.12,2.04,.12),palette.gold)
		for k in 4:
			_block(suit,"Rib_%d_%d"%[side,k],Vector3(s*1.05,5.07+float(k)*.33,1.16),Vector3(1.15,.09,.20),palette.steel)
		_beam(suit,"SpineCorePipe_%d"%side,Vector3(s*.88,5.05,-1.15),Vector3(s*1.68,8.23,-.64),.11,palette.gold)
		_ball(suit,"SpineVent_%d"%side,Vector3(s*1.28,6.67,-1.65),.41,palette.dark,.53)
	_block(suit,"CentralSpine",Vector3(0,6.90,-1.5),Vector3(1.65,3.15,.74),palette.steel)
	_block(suit,"CervicalBlock",Vector3(0,8.63,-.25),Vector3(2.42,.67,1.55),palette.dark)
	for j in 7:
		_block(suit,"BackVertebra_%02d"%j,Vector3(0,5.13+float(j)*.48,-1.95),Vector3(1.35,.17,.28),palette.gold)

func _arms() -> void:
	for side in [-1,1]:
		var s := float(side)
		_ball(suit,"ShoulderPivot_%d"%side,Vector3(s*3.05,8.0,-.05),.83,palette.gold)
		if preview_phase < 5:
			_block(suit,"MainPauldron_%d"%side,Vector3(s*3.55,8.34,-.02),Vector3(2.35,.91,2.82),palette.obsidian,Vector3(0,0,-s*.11))
		else:
			_block(suit,"BrokenPauldronFore_%d"%side,Vector3(s*3.48,8.38,.65),Vector3(1.87,.42,1.04),palette.graphite,Vector3(0,0,s*.28))
			_block(suit,"BrokenPauldronAft_%d"%side,Vector3(s*3.7,8.27,-.85),Vector3(1.34,.30,.78),palette.steel,Vector3(0,0,-s*.24))
		_block(suit,"PauldronSilverFace_%d"%side,Vector3(s*4.58,8.27,.39),Vector3(.23,.85,1.86),palette.steel)
		_block(suit,"PauldronGoldBand_%d"%side,Vector3(s*3.75,8.85,.07),Vector3(1.87,.11,2.47),palette.gold)
		_beam(suit,"UpperArmPillar_%d"%side,Vector3(s*3.2,7.72,0),Vector3(s*3.46,6.03,.28),.51,palette.graphite)
		_block(suit,"BicepArmor_%d"%side,Vector3(s*3.42,7.06,.46),Vector3(1.09,1.24,.85),palette.steel)
		_ball(suit,"ElbowPivot_%d"%side,Vector3(s*3.46,5.97,.27),.60,palette.gold)
		_beam(suit,"ForearmPillar_%d"%side,Vector3(s*3.46,5.97,.27),Vector3(s*3.54,4.39,.45),.64,palette.obsidian)
		_block(suit,"Gauntlet_%d"%side,Vector3(s*3.54,4.85,.70),Vector3(1.38,1.44,1.33),palette.graphite)
		_block(suit,"GauntletFace_%d"%side,Vector3(s*3.54,4.89,1.44),Vector3(1.08,1.2,.20),palette.steel)
		_block(suit,"GauntletLine_%d"%side,Vector3(s*3.54,5.18,1.57),Vector3(.86,.08,.11),palette.gold)
		_block(suit,"Palm_%d"%side,Vector3(s*3.54,3.95,.71),Vector3(1.03,.56,1.12),palette.silver)
		for k in 4:
			var xx := s*3.54+float(k-1.5)*.26
			_beam(suit,"Finger_%d_%d"%[side,k],Vector3(xx,3.75,1.02),Vector3(xx,3.32,1.28),.115,palette.graphite)
			_ball(suit,"FingerKnuckle_%d_%d"%[side,k],Vector3(xx,3.53,1.20),.135,palette.gold)
		_beam(suit,"BicepHydraulics_%d"%side,Vector3(s*2.58,7.65,.43),Vector3(s*3.10,5.93,.79),.15,palette.gold)
		_beam(suit,"GauntletHydraulics_%d"%side,Vector3(s*3.0,5.8,-.23),Vector3(s*3.08,4.33,-.06),.11,palette.silver)
		for i in 3:
			_block(suit,"ArmHeatSink_%d_%d"%[side,i],Vector3(s*3.54,4.42+float(i)*.26,1.58),Vector3(.78,.055,.12),palette.dark)
		if preview_phase >= 3:
			# Real physically attached elbow weapons, not detached projectiles.
			_beam(suit,"ElbowRail_%d"%side,Vector3(s*3.54,5.08,-.47),Vector3(s*3.54,5.08,2.0),.21,palette.steel)
			_hoop(suit,"ElbowMuzzle_%d"%side,Vector3(s*3.54,5.08,2.05),.27,.07,palette.gold)

func _cockpit_with_identity() -> void:
	# Exact palette and compact robotic expression inspired by the existing
	# antagonist_identity.gd concept. Do not upscale the small occupant.
	_block(suit,"CockpitSocket",Vector3(0,9.28,.04),Vector3(2.1,1.55,1.96),palette.dark)
	_block(suit,"CockpitUpperGuard",Vector3(0,10.07,.10),Vector3(2.51,.46,2.14),palette.obsidian)
	_block(suit,"CockpitGiltCrown",Vector3(0,10.36,.52),Vector3(1.90,.14,.73),palette.gold)
	_block(suit,"CranialBase",Vector3(0,9.31,.48),Vector3(.77,.86,.70),palette.obsidian)
	_block(suit,"ActualAntagonistFace",Vector3(0,9.43,.88),Vector3(.56,.44,.06),palette.steel)
	_block(suit,"CentralBrowGuard",Vector3(0,9.78,.96),Vector3(.69,.12,.21),palette.dark)
	_block(suit,"ArticulatedJaw",Vector3(0,9.14,.92),Vector3(.48,.14,.19),palette.silver,Vector3(deg_to_rad(6.0 if preview_phase >= 4 else 0.0),0,0))
	_block(suit,"MouthCut",Vector3(0,9.21,1.035),Vector3(.35,.037,.028),palette.dark)
	var optic_color: Material = palette.cyan
	match preview_phase:
		2: optic_color = palette.yellow
		3: optic_color = palette.violet
		4,5: optic_color = palette.red
	for side in [-1,1]:
		var s := float(side)
		_ball(suit,"AntagonistOpticalRing_%d"%side,Vector3(s*.17,9.51,.965),.135,palette.gold)
		var iris := _ball(suit,"ApprovedEye_%d"%side,Vector3(s*.17,9.51,1.061),.064,optic_color)
		if side < 0: iris_left = iris
		else: iris_right = iris
		_block(suit,"MovableBrow_%d"%side,Vector3(s*.18,9.68,1.04),Vector3(.30,.07,.08),palette.silver,Vector3(0,0,s*(.13 if preview_phase>=4 else -.06)))
		_block(suit,"RealFaceCheek_%d"%side,Vector3(s*.31,9.29,.86),Vector3(.18,.27,.16),palette.graphite)
		_beam(suit,"JawMechanism_%d"%side,Vector3(s*.26,9.36,.83),Vector3(s*.20,9.15,.79),.038,palette.gold)
	_block(suit,"CockpitGlass",Vector3(0,9.42,1.13),Vector3(1.40,1.08,.07),palette.glass)
	for side in [-1,1]:
		_block(suit,"CockpitExteriorFrame_%d"%side,Vector3(float(side)*.82,9.35,1.05),Vector3(.25,1.46,.44),palette.obsidian)
		_block(suit,"CockpitRail_%d"%side,Vector3(float(side)*.83,9.35,1.29),Vector3(.10,1.33,.10),palette.gold)

func _spine_and_cannons() -> void:
	for side in [-1,1]:
		var s := float(side)
		_block(suit,"BackPillar_%d"%side,Vector3(s*1.59,8.74,-1.34),Vector3(1.25,1.6,1.04),palette.graphite)
		if preview_phase == 1:
			_block(suit,"CollapsedBattery_%d"%side,Vector3(s*1.65,9.38,-1.4),Vector3(1.65,.45,1.3),palette.obsidian)
		else:
			for index in 2:
				var xx := s*(1.2+float(index)*.76)
				if preview_phase == 5 and index == 1:
					_block(suit,"SnappedArtillerySocket_%d"%side,Vector3(xx,9.11,-1.45),Vector3(.72,.42,.88),palette.silver,Vector3(s*.25,0,0))
					continue
				_block(suit,"DeployableBatteryMount_%d_%d"%[side,index],Vector3(xx,9.25,-1.7),Vector3(.57,.8,1.05),palette.gold)
				_beam(suit,"ArtilleryTube_%d_%d"%[side,index],Vector3(xx,9.29,-1.65),Vector3(xx,9.45,2.32),.22,palette.steel)
				_hoop(suit,"ArtilleryMuzzle_%d_%d"%[side,index],Vector3(xx,9.45,2.36),.28,.07,palette.gold)
				_ball(suit,"MuzzleRecess_%d_%d"%[side,index],Vector3(xx,9.45,2.3),.14,palette.dark)

func _reactor() -> void:
	var exposed := preview_phase >= 4
	_block(suit,"CoreStructuralCradle",Vector3(0,6.86,1.33),Vector3(2.45,2.55,.49),palette.dark)
	_ball(suit,"InnerCoreContainment",Vector3(0,6.92,1.76),.90,palette.silver)
	core = _ball(suit,"REAL_AURIC_CORE_IN_CHEST",Vector3(0,6.92,2.03),.73 if not exposed else .82,palette.core)
	_hoop(suit,"CoreContainmentOuter",Vector3(0,6.92,2.15),1.11,.075,palette.gold)
	_hoop(suit,"CoreContainmentInner",Vector3(0,6.92,2.22),.91,.045,palette.ring)
	for side in [-1,1]:
		var s := float(side)
		var p := s*(1.51 if exposed else .85)
		_block(suit,"ReactorHingedShutter_%d"%side,Vector3(p,6.92,2.19),Vector3(.76,1.92,.30),palette.obsidian,Vector3(0,s*(.5 if exposed else .08),0))
		_block(suit,"ReactorShutterTrim_%d"%side,Vector3(p+s*.35,6.92,2.32),Vector3(.08,1.67,.22),palette.gold)
		_beam(suit,"CoreToShoulderConduit_%d"%side,Vector3(s*.85,7.42,1.35),Vector3(s*2.68,8.06,.37),.13,palette.gold)
		_beam(suit,"CoreToElbowConduit_%d"%side,Vector3(s*.88,6.43,1.45),Vector3(s*3.31,5.92,.4),.09,palette.copper)
	if preview_phase >= 4:
		for j in 8:
			var t := float(j)*TAU/8.0
			_ball(suit,"ReactorChannel_%02d"%j,Vector3(1.13*cos(t),6.92+1.13*sin(t),2.13),.10,palette.ring)
	if preview_phase == 5:
		for j in 6:
			var t := float(j)*TAU/6.0
			_beam(suit,"EmergencyCoil_%02d"%j,Vector3(1.08*cos(t),6.92+1.08*sin(t),2.04),Vector3(1.38*cos(t+.2),6.92+1.38*sin(t+.2),2.56),.068,palette.red)

func _phase_hardware() -> void:
	if preview_phase >= 3:
		for side in [-1,1]:
			var s := float(side)
			for forward in [-1,1]:
				var z := float(forward)
				var a := Vector3(s*1.5,4.2,z*.76)
				var b := Vector3(s*4.92,.34,z*2.14)
				_beam(suit,"DeployedGroundAnchor_%d_%d"%[side,forward],a,b,.27,palette.graphite)
				_beam(suit,"AnchorChromePiston_%d_%d"%[side,forward],a*.75+b*.25,a*.28+b*.72,.12,palette.silver)
				_block(suit,"AnchorFoot_%d_%d"%[side,forward],b,Vector3(.9,.32,1.0),palette.gold)
	if preview_phase >= 4:
		for side in [-1,1]:
			var s := float(side)
			_block(suit,"DeployingHeatRadiator_%d"%side,Vector3(s*2.18,7.3,-1.65),Vector3(.68,2.7,.37),palette.steel,Vector3(0,0,s*.2))
			for index in 5:
				_block(suit,"RadiatorFin_%d_%d"%[side,index],Vector3(s*2.20,6.4+float(index)*.37,-1.94),Vector3(.55,.09,.46),palette.gold)
	if preview_phase == 5:
		# Mechanical damage and opened chest: never visually enlarge the occupant.
		for side in [-1,1]:
			var s := float(side)
			_block(suit,"FinalEmergencyClamp_%d"%side,Vector3(s*2.56,8.92,-1.26),Vector3(.38,2.25,.68),palette.silver,Vector3(0,0,s*.22))
			_beam(suit,"FinalRedPowerBus_%d"%side,Vector3(s*.92,6.93,2.1),Vector3(s*2.99,7.81,1.10),.16,palette.red)
			for index in 4:
				_block(suit,"FracturedArmorRib_%d_%d"%[side,index],Vector3(s*1.42,5.15+float(index)*.32,1.46),Vector3(.84,.11,.25),palette.silver,Vector3(0,0,s*.05))
