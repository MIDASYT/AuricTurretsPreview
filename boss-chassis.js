// Structural connectors for the final suit, shared by all five forms.
// Prevent floating limbs/shoulder weapons and add an identifiable M17 military chassis.
export function attachBossChassis(T,root,phase,palette,meshes) {
 const material=(k)=>palette[k]||palette.steel;
 function add(geo,mat,name,pos){
  const mesh=new T.Mesh(geo,material(mat));mesh.name=name;mesh.position.set(...pos);root.add(mesh);meshes.push(mesh);return mesh;
 }
 function beam(name,a,b,r,mat='steel'){
  const start=new T.Vector3(...a),end=new T.Vector3(...b),dist=end.clone().sub(start);
  const mesh=add(new T.CylinderGeometry(r,r,dist.length(),12),mat,name,start.clone().add(end).multiplyScalar(.5).toArray());
  mesh.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),dist.normalize());return mesh;
 }
 function box(name,pos,size,mat='plating'){
  return add(new T.BoxGeometry(...size),mat,name,pos);
 }
 function cylinder(name,pos,r,h,mat='gold',axis='z'){
  const mesh=add(new T.CylinderGeometry(r,r,h,14),mat,name,pos);
  if(axis==='z')mesh.rotation.x=Math.PI/2;else if(axis==='x')mesh.rotation.z=Math.PI/2;return mesh;
 }
 function shield(name,points,z,y,x,materialName='armor',depth=.3,rotation=0){
  const p=new T.Shape();points.forEach(([xx,yy],i)=>i?p.lineTo(xx,yy):p.moveTo(xx,yy));p.closePath();
  const g=new T.ExtrudeGeometry(p,{depth,bevelEnabled:true,bevelThickness:.035,bevelSize:.05,bevelSegments:1});
  g.translate(0,0,-depth/2);
  const o=add(g,materialName,name,[x,y,z]);o.rotation.z=rotation;return o;
 }
 // Load-bearing internal spinal column and pelvis. Plating is physically supported, not suspended.
 beam('WeldedPrimarySpine',[0,4.3,-1.18],[0,10.55,-1.18],.43,'steel');
 cylinder('WaistPrimaryGear',[0,4.95,-.93],1.0,.56,'gold');
 box('WaistReactorBrace',[0,5.2,-1.12],[3.6,.42,1.5],'armor');
 for(const s of [-1,1]){
  // Two solid load paths from chest to shoulder joint. Shoulder armor and arms share this connection.
  beam('CoronalShoulderCrossbeam_'+s,[s*2.25,9.15,-.50],[s*3.45,9.27,-.18],.38,'armor');
  beam('ShoulderUnderframe_'+s,[s*2.44,8.38,-1.16],[s*3.68,8.91,-.21],.24,'steel');
  cylinder('ShoulderInnerRotor_'+s,[s*3.42,9.27,-.12],.71,.65,'gold');
  beam('ShoulderServoAxle_'+s,[s*3.42,9.27,.15],[s*4.14,8.80,.28],.30,'steel');
  // Torso to both hips; do not create loose knees and legs.
  beam('LowerTrunkToHip_'+s,[s*1.12,5.12,-.70],[s*1.84,4.18,.0],.40,'armor');
  beam('ReinforcedHipActuator_'+s,[s*.94,4.60,-.87],[s*2.06,3.91,-.30],.20,'gold');
  beam('KneeCenterBolt_'+s,[s*2.10,2.48,.25],[s*2.22,1.53,.0],.28,'steel');
  beam('ShinToeWeb_'+s,[s*2.21,.80,.15],[s*2.22,.38,1.45],.29,'steel');
  // Arm elbow and glove connected by one inner structure with visible motion hardware.
  beam('ArmRootSkeleton_'+s,[s*3.72,9.06,-.23],[s*4.27,7.16,.23],.34,'steel');
  beam('ArmElbowSkeleton_'+s,[s*4.27,7.16,.23],[s*4.51,4.82,.56],.31,'steel');
  cylinder('ElbowHydraulicDrive_'+s,[s*4.28,7.10,.3],.68,.46,'gold');
  beam('WristToPalm_'+s,[s*4.5,4.95,.54],[s*4.5,4.19,.72],.38,'steel');
  if(phase>=2){
   // Dorsal racks and two different railguns have structural load-bearing pylons.
   beam('MissileGantralSupport_'+s,[s*2.63,9.75,-1.20],[s*6.39,10.07,-.55],.34,'armor');
   beam('MissileGantralHydraulic_'+s,[s*3.07,8.68,-1.50],[s*5.67,9.80,-.66],.15,'gold');
   beam('RailGunBackMount_'+s,[s*2.23,9.30,-1.65],[s*2.54,10.98,-1.23],.31,'steel');
   cylinder('DorsalRailPivot_'+s,[s*2.54,10.10,-1.23],.48,.37,'gold');
  }
 }
 // The helmet is NOT the little pilot. A thick articulated neck physically joins it to the chest.
 beam('NeckArmoredHydraulic',[0,9.77,-.43],[0,10.94,.28],.62,'armor');
 cylinder('HeadLowerTurretBearing',[0,10.70,.20],.87,.46,'gold');
 box('NeckCollarFront',[0,10.18,.92],[2.3,.27,.65],'plating');
 // An unmistakable mechanically attached "Crown": thick crested shoulder pylons,
 // no holograms, rays or floating insignia.
 for(const s of [-1,1]){
  beam('CrownFortressPylon_'+s,[s*3.33,9.75,-.35],[s*3.02,10.57,-.55],.25,'armor');
  shield('ShoulderRoyalChevron_'+s,[[-.70,-.15],[.70,-.15],[.50,.42],[-.56,.42]],
   1.52,9.62,s*4.10,'gold',.16,s*.03);
  box('CrownBuckle_'+s,[s*3.4,9.36,1.57],[.65,.16,.26],'black');
 }
 shield('UpperFortressBrow',[[-2.30,-.24],[2.30,-.24],[1.75,.36],[-1.75,.36]],2.68,9.59,0,'armor',.23);
 // Reflect light on true edges; no ghostly suspended metal pieces.
 for(let i=-2;i<=2;i++)box('MechanicalFasciaBolt_'+i,[i*.81,9.64,2.85],[.16,.18,.19],'gold');
}
