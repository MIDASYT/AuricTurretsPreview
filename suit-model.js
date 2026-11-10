// Auric Turrets M17. Sculpted Three.js concept in the game's machine palette.
// Reference shapes: builders.gd build_auric_crystal, auric_core_art.gd, antagonist_prototype.gd.
// This is an authored web geometry study, not an exported game asset.
export function makeSuit(T,phase){
 const group=new T.Group();group.name='M17_Armored_Suit_Phase_'+phase;
 const pal={
  armor:new T.MeshStandardMaterial({color:0x101723,metalness:.89,roughness:.32}),
  blue:new T.MeshStandardMaterial({color:0x10264a,metalness:.84,roughness:.3}),
  plating:new T.MeshStandardMaterial({color:0x334353,metalness:.88,roughness:.3}),
  steel:new T.MeshStandardMaterial({color:0x728492,metalness:.92,roughness:.23}),
  silver:new T.MeshStandardMaterial({color:0xadbcc7,metalness:.93,roughness:.24}),
  gold:new T.MeshStandardMaterial({color:0xd2a22d,metalness:.89,roughness:.25}),
  brass:new T.MeshStandardMaterial({color:0x81632d,metalness:.89,roughness:.32}),
  black:new T.MeshStandardMaterial({color:0x080d15,metalness:.73,roughness:.43}),
  cyan:new T.MeshStandardMaterial({color:0x269bff,emissive:0x1362f2,emissiveIntensity:1.65,metalness:.3,roughness:.17}),
  crystal:new T.MeshStandardMaterial({color:0x397eff,emissive:0x145ce0,emissiveIntensity:2.7,metalness:.24,roughness:.11,flatShading:true}),
  goldLight:new T.MeshStandardMaterial({color:0xf9c955,emissive:0xffac24,emissiveIntensity:2.2,metalness:.28,roughness:.22}),
  optic:new T.MeshStandardMaterial({color:0xd8ac46,emissive:0xf8b523,emissiveIntensity:1.45,metalness:.3,roughness:.22}),
  vents:new T.MeshStandardMaterial({color:0x151c25,metalness:.35,roughness:.75}),
  wear:new T.MeshStandardMaterial({color:0x66482f,metalness:.71,roughness:.47})
 };
 const all=[];const add=(parent,geo,material,name,position=[0,0,0])=>{
   const m=new T.Mesh(geo,pal[material]);m.name=name;m.position.set(...position);parent.add(m);all.push(m);return m;
 };
 function box(parent,name,pos,size,mat,rotation=[0,0,0]){
  const m=add(parent,new T.BoxGeometry(...size),mat,name,pos);m.rotation.set(...rotation);return m;
 }
 function hull(parent,name,xy,depth,mat,pos=[0,0,0],rotation=[0,0,0]){
  const shape=new T.Shape();xy.forEach(([x,y],i)=>i?shape.lineTo(x,y):shape.moveTo(x,y));shape.closePath();
  const d=Math.max(.08,depth);const thick=Math.min(.1,d*.13);
  const g=new T.ExtrudeGeometry(shape,{steps:1,depth:d-2*thick,bevelEnabled:true,bevelThickness:thick,bevelSize:.055,bevelSegments:1,curveSegments:1});
  g.translate(0,0,-d/2+thick);
  const m=add(parent,g,mat,name,pos);m.rotation.set(...rotation);return m;
 }
 function beam(parent,name,a,b,r,mat='steel',r2=r){
  const v=new T.Vector3(...a),w=new T.Vector3(...b),d=w.clone().sub(v);
  const m=add(parent,new T.CylinderGeometry(r2,r,d.length(),10),mat,name,v.clone().add(w).multiplyScalar(.5).toArray());
  m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d.normalize());return m;
 }
 function drum(parent,name,pos,r,h,mat='black',axis='z',count=16){
  const m=add(parent,new T.CylinderGeometry(r,r,h,count),mat,name,pos);
  if(axis==='z')m.rotation.x=Math.PI/2;else if(axis==='x')m.rotation.z=Math.PI/2;return m;
 }
 function orb(parent,name,pos,r,mat='steel'){
  return add(parent,new T.SphereGeometry(r,16,10),mat,name,pos);
 }
 function ring(parent,name,pos,r,t,mat='gold',axis='z'){
  const m=add(parent,new T.TorusGeometry(r,t,8,28),mat,name,pos);
  if(axis==='y')m.rotation.x=Math.PI/2;else if(axis==='x')m.rotation.y=Math.PI/2;return m;
 }
 function bolts(parent,prefix,x,y,z,dx,dy,n=5){
  for(let i=0;i<n;i++)orb(parent,prefix+'_'+i,[x+dx*i,y+dy*i,z],.065,'gold');
 }
 function armorVent(parent,prefix,x,y,z,step=.23,n=5){
  for(let i=0;i<n;i++)box(parent,prefix+'_'+i,[x,y+i*step,z],[.53,.063,.07],'black');
 }
 // Actual game build_auric_crystal: TWO opposite four-sided cones, BLUE, with GOLD core.
 // Scaled significantly; the physical crystal is the chest's main power source.
 let reactorCrystal=null;
 function core(parent,position,size=4.8,exposed=false){
  const C=new T.Group();C.name='AuricCore_FourSided_OriginalConstruction';C.position.set(...position);parent.add(C);
  const ringR=.26*size;
  drum(C,'CradleBase',[0,-.50*size,0],ringR*1.2,.14*size,'blue','y',12);
  drum(C,'CradleGold',[0,-.425*size,0],ringR*.98,.06*size,'gold','y',12);
  drum(C,'ReceptorSeat',[0,-.37*size,0],ringR*.84,.11*size,'steel','y',12);
  for(let i=0;i<3;i++){const ang=i*Math.PI*2/3+.25;
    const x=Math.cos(ang)*ringR*1.05,z=Math.sin(ang)*ringR*1.05;
    beam(C,'MachinedBrace_'+i,[x,-.32*size,z],[x*.56,.18*size,z*.56],.042*size,'gold');
    orb(C,'BlueReceiver_'+i,[x*.56,.19*size,z*.56],.045*size,'cyan');
  }
  // Top cone sits around +.25*size, base at y=0; inverted bottom around -.15*size.
  const prismGeo1=new T.ConeGeometry(.22*size,.5*size,4,1,false,Math.PI/4);
  const prismGeo2=new T.ConeGeometry(.22*size,.3*size,4,1,false,Math.PI/4);
  const top=add(C,prismGeo1,'crystal','AuricCrystal_Top',[0,.25*size,0]);
  const bottom=add(C,prismGeo2,'crystal','AuricCrystal_Inverted',[0,-.15*size,0]);
  bottom.rotation.z=Math.PI;
  reactorCrystal=top;
  orb(C,'AuricCore_GoldHeart',[0,.05*size,0],.08*size,'goldLight');
  for(const side of [-1,1]){
    const z=side*.34*size;
    drum(C,'Receiver_'+side,[0,-.30*size,z],.115*size,.15*size,'blue','y',8);
    drum(C,'ReceiverRim_'+side,[0,-.18*size,z],.095*size,.045*size,'gold','y',8);
    orb(C,'ReceiverLight_'+side,[0,-.14*size,z],.068*size,'cyan');
  }
  if(exposed){
   ring(C,'ReactorRingLeft',[0,.02*size,.05*size],.34*size,.028*size,'steel','z');
   ring(C,'ReactorRingRight',[0,.02*size,.05*size],.42*size,.024*size,'gold','z');
   for(const side of [-1,1])for(let j=0;j<3;j++){
     beam(C,'CoreConduit_'+side+'_'+j,[side*.18*size,(j-1)*.11*size,0],[side*.40*size,(j-1)*.15*size,-.35*size],.025*size,'cyan');
   }
  }
  return C;
 }
 // Distinguish the SUIT'S own mechanical face from the SMALL occupant's head.
 function bossVisor(parent,pos,scale=1){
  const g=new T.Group();g.name='ColossusHead_NotPilotHead';g.position.set(...pos);g.scale.setScalar(scale);parent.add(g);
  hull(g,'Helmet_Machined',[[-1.18,-.8],[1.18,-.8],[1.42,.15],[1.08,1.09],[-1.08,1.09],[-1.42,.15]],1.22,'armor',[0,0,0]);
  hull(g,'Faceplate_Armor',[[-.98,-.50],[.98,-.50],[1.08,.13],[.83,.53],[-.83,.53],[-1.08,.13]],.2,'steel',[0,-.09,.74]);
  hull(g,'OpticalSlot',[[-.86,.05],[.86,.05],[.75,.36],[-.75,.36]],.1,'black',[0,0,.92]);
  hull(g,'Gold_Glare',[[-.69,.11],[.69,.11],[.57,.23],[-.57,.23]],.10,'optic',[0,0,1.005]);
  hull(g,'BrowBridge',[[-.96,.41],[.96,.41],[1.12,.66],[.61,.57],[-.61,.57],[-1.12,.66]],.29,'armor',[0,0,.92]);
  for(const side of [-1,1]){
   box(g,'SideCamera_'+side,[side*1.14,.06,.77],[.18,.53,.32],'gold');
   beam(g,'CrownSupport_'+side,[side*.81,.9,.29],[side*1.22,1.44,.12],.10,'silver');
  }
  box(g,'CrownRidge',[0,1.0,0],[1.55,.17,1.2],'gold');
  for(let i=0;i<6;i++)box(g,'VoiceGrille'+i,[-.56+i*.22,-.43,.9],[.07,.21,.09],'black');
  return g;
 }
 function pilot(parent,pos){
  const p=new T.Group();p.name='ActualAntagonist_Inside_Suit';p.position.set(...pos);parent.add(p);
  const scale=.53;p.scale.setScalar(scale);
  hull(p,'PilotSkull',[[-.5,-.52],[.5,-.52],[.68,-.25],[.63,.47],[-.63,.47],[-.68,-.25]],.58,'armor');
  box(p,'PilotFace',[0,.0,.36],[.89,.57,.1],'steel');
  for(let side of [-1,1]){
   drum(p,'PilotOpticRing_'+side,[side*.25,.12,.45],.135,.08,'gold','z',12);
   orb(p,'PilotOpticGold_'+side,[side*.25,.12,.505],.077,'optic');
   box(p,'PilotBrow_'+side,[side*.26,.33,.49],[.38,.055,.11],'armor',[0,0,-side*.08]);
  }
  box(p,'PilotJaw',[0,-.42,.36],[.52,.17,.16],'silver');
  for(let i=0;i<5;i++)box(p,'PilotMouth'+i,[-.25+i*.125,-.4,.475],[.07,.06,.035],'black');
  box(p,'PilotChest',[0,-.94,0],[.8,.55,.65],'armor');
  return p;
 }
 function limbsHumanoid(parent,isArsenal){
  // Articulated industrial hips and shins, not scaled generic humanoid primitives.
  for(const s of [-1,1]){
   drum(parent,'HipRing_'+s,[s*1.83,4.2,0],.9,.57,'gold','z');
   beam(parent,'UpperLegHydraulic_'+s,[s*1.84,4.16,0],[s*2.1,2.55,.28],.8,'armor');
   hull(parent,'ThighCasting_'+s,[[-.84,-.8],[.84,-.8],[1,1.06],[.55,1.30],[-.68,1.25],[-1,1.03]],1.6,'plating',[s*2.02,3.34,.42],[0,0,-s*.08]);
   hull(parent,'ThighInset_'+s,[[-.59,-.58],[.58,-.58],[.68,.66],[-.68,.66]],.13,'steel',[s*2.02,3.34,1.31]);
   drum(parent,'KneeActuator_'+s,[s*2.11,2.35,.3],.66,.68,'gold','z');
   beam(parent,'TibiaMechanism_'+s,[s*2.1,2.32,0],[s*2.22,.75,.04],.59,'armor');
   hull(parent,'ShinShield_'+s,[[-.64,-.88],[.64,-.88],[.87,.60],[.53,1.0],[-.56,1.0],[-.87,.60]],1.25,'plating',[s*2.23,1.47,.43]);
   box(parent,'ShinAccent_'+s,[s*2.23,1.41,1.11],[.23,1.4,.12],'gold');
   box(parent,'Heel_'+s,[s*2.22,.39,-.61],[1.65,.66,1.35],'black');
   hull(parent,'Foot_'+s,[[-.85,-.33],[.85,-.33],[1.02,.12],[.86,.55],[-.84,.55],[-1.02,.12]],2.9,'armor',[s*2.22,.36,.9],[Math.PI/2,0,0]);
   for(let i=-1;i<=1;i++)box(parent,'Toe_'+s+'_'+i,[s*2.22+i*.42,.22,2.08],[.29,.16,.76],'gold');
   beam(parent,'KneePiston_'+s,[s*2.8,3.49,-.33],[s*2.78,1.76,-.12],.16,'silver');
   beam(parent,'KneeRod_'+s,[s*2.8,2.53,-.29],[s*2.78,1.43,-.11],.085,'gold');
   const x=s*4.1;
   drum(parent,'ShoulderGear_'+s,[s*3.43,9.27,-.13],.96,.7,'gold','z');
   hull(parent,'Pauldron_'+s,[[-1.25,-.67],[1.25,-.67],[1.43,.39],[.99,1.02],[-1.04,1.02],[-1.47,.38]],2.3,'armor',[x,9.56,0],[0,0,-s*.06]);
   hull(parent,'PauldronFace_'+s,[[-1.16,-.44],[1.16,-.44],[1.27,.31],[-1.26,.31]],.15,'steel',[x,9.36,1.23]);
   box(parent,'PauldronTrim_'+s,[x,10.13,.92],[2.26,.12,.16],'gold');
   bolts(parent,'ShoulderBolts'+s,x-1.0,9.28,1.39,.5,0,5);
   beam(parent,'Biceps_'+s,[s*4.10,8.93,-.05],[s*4.28,7.1,.3],.58,'armor');
   hull(parent,'BicepsArmor_'+s,[[-.53,-.79],[.53,-.79],[.73,.77],[-.73,.77]],.9,'plating',[s*4.26,8.12,.54]);
   drum(parent,'ElbowGear_'+s,[s*4.28,7.08,.3],.63,.7,'gold','z');
   beam(parent,'ForearmPiston_'+s,[s*4.24,7.04,-.05],[s*4.55,5.45,.38],.62,'black');
   hull(parent,'ForearmCasting_'+s,[[-.78,-1.1],[.78,-1.1],[1,.8],[.58,1.28],[-.58,1.28],[-1,.8]],1.48,'armor',[s*4.49,5.94,.53],[0,0,-s*.035]);
   hull(parent,'ForearmFace_'+s,[[-.62,-.73],[.62,-.73],[.78,.63],[-.75,.63]],.13,'steel',[s*4.49,5.85,1.35]);
   for(let i=0;i<4;i++)box(parent,'ForearmVent'+s+i,[s*4.49,5.37+i*.27,1.44],[.91,.045,.075],'black');
   drum(parent,'Wrist_'+s,[s*4.5,4.85,.56],.54,.6,'gold','z');
   hull(parent,'Palm_'+s,[[-.71,-.45],[.71,-.45],[.84,.52],[-.84,.52]],1.1,'steel',[s*4.5,4.22,.69]);
   for(let k=0;k<4;k++){
    let px=s*4.5+(k-1.5)*.35;
    beam(parent,'FingerUpper_'+s+'_'+k,[px,3.85,.95],[px,3.38,1.2],.19,'armor');
    drum(parent,'FingerJoint_'+s+'_'+k,[px,3.4,1.22],.17,.24,'gold','z');
    beam(parent,'FingerTip_'+s+'_'+k,[px,3.4,1.2],[px,3.07,1.52],.13,'steel');
   }
   for(let i=0;i<2;i++)beam(parent,'ArmPiston_'+s+'_'+i,[s*3.57+i*.16,8.76,-.63],[s*4.04+i*.16,6.96,-.46],.12,'gold');
   for(let i=0;i<3;i++)box(parent,'SideVents_'+s+i,[s*3.02,7.0+i*.43,1.05],[.13,.075,.6],'steel');
   if(isArsenal) {
     // Each shoulder has a distinct four-hole missile rack.
     const rack=new T.Group();rack.name='FourHoleMissileRack_'+s;rack.position.set(s*6.45,10.02,-.15);parent.add(rack);
     hull(rack,'MissileCase',[[-1.17,-.72],[1.17,-.72],[1.35,.66],[-1.35,.66]],1.95,'armor');
     hull(rack,'FrontFace',[[-1.09,-.62],[1.09,-.62],[1.2,.53],[-1.2,.53]],.1,'steel',[0,0,1.05]);
     for(let col=0;col<2;col++)for(let row=0;row<2;row++){
       const xx=(col-.5)*1.17,yy=(row-.5)*.62;
       drum(rack,'MissileTube'+row+'_'+col,[xx,yy,1.17],.235,.19,'black','z',12);
       ring(rack,'MissileRim'+row+'_'+col,[xx,yy,1.29],.245,.045,'gold','z');
       drum(rack,'MissileHead'+row+'_'+col,[xx,yy,1.3],.08,.06,'cyan','z');
     }
     for(let k=0;k<2;k++)beam(parent,'RackArm_'+s+k,[s*3.58,9.92,-1.09],[s*6.12,9.9+k*.2,-1.0],.21,'plating');
   }
  }
 }
 function centerBody(parent,stage){
  // Oversized five-lane boss torso; six-sided armor plates not stacks of cubes.
  hull(parent,'MainTorso',[[-2.7,-1.7],[2.7,-1.7],[3.25,.65],[2.4,2.2],[-2.4,2.2],[-3.25,.65]],3.5,'armor',[0,7.52,-.25]);
  if(stage<4) hull(parent,'Breastplate',[[-2.62,-1.12],[2.62,-1.12],[2.93,.45],[1.95,1.57],[-1.95,1.57],[-2.93,.45]],.55,'plating',[0,7.75,1.62]);
  else {
   // The same humanoid suit OPENS its physical chest instead of becoming another machine.
   for(const side of [-1,1]){
    hull(parent,'ChestHingedDoor_'+side,[[-1.02,-1.17],[1.02,-1.17],[1.15,.89],[-1.15,.89]],.48,stage===5?'wear':'plating',[side*3.23,7.64,1.65],[0,side*.34,side*.13]);
    beam(parent,'CoreFeed_'+side,[side*.95,6.3,1.70],[side*2.9,8.2,1.43],.17,'gold');
   }
   hull(parent,'ReactorBacking',[[-1.65,-2.05],[1.65,-2.05],[1.88,1.75],[-1.88,1.75]],.22,'black',[0,7.31,1.63]);
  }
  hull(parent,'UpperBar',[[-2.3,-.34],[2.3,-.34],[2.1,.3],[-2.1,.3]],.22,'steel',[0,9.17,1.83]);
  for(let s of [-1,1]){
    hull(parent,'ChestWing_'+s,[[-.66,-1.15],[.66,-1.15],[1.03,.65],[.40,1.2],[-.4,1.2],[-1,.65]],.4,stage===5?'wear':'blue',[s*(stage>=4?3.5:1.77),7.64,stage>=4?1.38:1.94],[0,0,s*(stage>=4?.33:.1)]);
    box(parent,'Rib'+s,[s*2.87,6.97,1.16],[.16,2.1,.4],'gold');
    for(let i=0;i<4;i++)box(parent,'AirIntake'+s+i,[s*2.89,7.05+i*.37,1.5],[.13,.06,.69],'black');
  }
  hull(parent,'Pelvis',[[-1.8,-.55],[1.8,-.55],[2.0,.45],[-2.0,.45]],2.15,'armor',[0,4.68,-.14]);
  hull(parent,'WaistGrille',[[-1.4,-.45],[1.4,-.45],[1.55,.35],[-1.55,.35]],.25,'steel',[0,5.17,1.19]);
  for(let i=0;i<6;i++)box(parent,'UnderWaistSlit'+i,[-1.25+i*.5,5.08,1.37],[.15,.53,.045],'black');
  for(let s of [-1,1])beam(parent,'SpineConduit_'+s,[s*1.33,5.35,-1.72],[s*1.28,9.52,-1.22],.16,'gold');
  // Core exists at its true oversized scale in the physical chest, never scaled like an icon.
  core(parent,[0,7.25,stage>=4?2.0:.23],stage>=4?5.25:4.8,stage>=4);
  // Massive front armor physically conceals most of the crystal in stages 1/2.
  if(stage<4){
   hull(parent,'NucleusVaultCover',[[-1.54,-1.64],[1.54,-1.64],[1.95,.92],[1.42,1.92],[-1.42,1.92],[-1.95,.92]],.64,'armor',[0,7.24,2.12]);
   hull(parent,'NucleusVaultGoldRib',[[-1.6,-.13],[1.6,-.13],[1.35,.15],[-1.35,.15]],.17,'gold',[0,7.25,2.55]);
   hull(parent,'CoreVaultEmblem',[[-.30,-.41],[.30,-.41],[.58,.08],[0,.49],[-.58,.08]],.17,'blue',[0,7.28,2.64]);
   for(let s of [-1,1])bolts(parent,'CoreVaultBolt'+s,s*1.56,8.4,2.38,0,-.36,7);
  }
  if(stage===5){
   // Keep the same head, legs and arm geometry. Visible damage only: no arbitrary new form.
   for(const side of [-1,1]){
    for(let i=0;i<3;i++)beam(parent,'DamagedRib_'+side+'_'+i,[side*1.45,5.65+i*.62,1.51],[side*2.30,5.95+i*.59,1.77],.12,'steel');
    hull(parent,'ScarredChestShield_'+side,[[-.58,-.35],[.58,-.35],[.43,.35],[-.43,.35]],.22,'wear',[side*2.65,7.93,2.12],[0,0,side*.21]);
   }
  }
  bossVisor(parent,[0,11.26,.28],1.25);
  // Occupant is a much smaller independent unit, behind the main armor.
  pilot(parent,[0,10.07,.82]);
  // Cockpit obscures the pilot from normal front views but it is a real 3D separate object.
  hull(parent,'PilotCanopy',[[-.85,-.53],[.85,-.53],[1.05,.49],[.78,.84],[-.78,.84],[-1.05,.49]],.28,'blue',[0,10.14,1.44]);
 }
 function rail(parent,s,x,y,z){
  const g=new T.Group();g.name='RailBattery_Dorsal_'+s;g.position.set(x,y,z);parent.add(g);
  hull(g,'RailHousing',[[-.72,-.52],[.72,-.52],[.98,.35],[.58,.66],[-.58,.66],[-.98,.35]],1.7,'armor');
  hull(g,'RailArmor',[[-.47,-.32],[.47,-.32],[.56,.34],[-.56,.34]],.15,'steel',[0,0,.97]);
  for(let i=-1;i<=1;i++)beam(g,'RailBar_'+i,[i*.29,.0,.1],[i*.29,0,3.65],.085,i===0?'gold':'silver');
  ring(g,'RailMuzzle',[0,0,3.61],.45,.10,'gold');
  drum(g,'RailInterior',[0,0,3.68],.26,.2,'cyan','z');
  for(let i=0;i<5;i++)box(g,'HeatSink_'+i,[0,-.61+i*.22,-.81],[.86,.08,.17],'steel');
  return g;
 }
 function humanoid(stage){
  const p=new T.Group();p.name=stage===1?'FORM_I_BIPEDAL_FORTRESS':stage===2?'FORM_II_MISSILE_ARSENAL':stage===3?'FORM_III_SAME_SUIT_ACTIVE':'FORM_IV_V_OPEN_CORE_SAME_SUIT';group.add(p);
  limbsHumanoid(p,stage>=2);centerBody(p,stage);
  if(stage>=2) {
   // Not two copies of the missile rack: these are DIFFERENT long-range rail weapons.
   rail(p,-1,-2.54,10.95,-1.23);rail(p,1,2.54,10.95,-1.23);
   hull(p,'ArsenalYoke',[[-5.9,-.38],[5.9,-.38],[5.4,.56],[-5.4,.56]],1.25,'plating',[0,10.18,-.65]);
   for(const s of [-1,1]){
     beam(p,'HydraulicWing'+s,[s*3.12,10.02,-1.1],[s*6.3,10.3,-.95],.3,'steel');
     for(let i=0;i<6;i++)box(p,'HeatFins'+s+i,[s*(4.0+i*.33),10.92,-.65],[.13,.75,.77],'black');
   }
  }
 }
 // Preserve one recognizable boss suit in all phases. Arsenal deployment in phase 2,
 // same frame in phase 3, actual chest opening in phase 4, damage in phase 5.
 humanoid(phase);
 group.userData={materials:pal,meshes:all,core:reactorCrystal,phase,viewTarget:new T.Vector3(0,7.25,0),viewDistance:phase===1?26:29};
 return group;
}
