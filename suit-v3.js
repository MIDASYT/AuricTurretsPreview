// Auric Turrets M17: industrial, five-lane final boss suit, physical web concept.
// Sculptural language from original Godot art: boss_portraits, boss_optics,
// operador_art, giant_chassis and auric_core_art (versiones/0.1.24).
// One continuous bipedal suit throughout; transformations are operational, not arbitrary morphs.
export function makeSuit(T,phase){
 const root=new T.Group();root.name='PlataformaDeLaCorona_TrajeFinal_Phase'+phase;
 const p={
  armor:new T.MeshStandardMaterial({color:0x172431,metalness:.76,roughness:.39}),
  navy:new T.MeshStandardMaterial({color:0x0c1a2b,metalness:.78,roughness:.34}),
  armor2:new T.MeshStandardMaterial({color:0x2e404b,metalness:.83,roughness:.35}),
  steel:new T.MeshStandardMaterial({color:0x70818a,metalness:.85,roughness:.33}),
  pale:new T.MeshStandardMaterial({color:0xa1adb2,metalness:.89,roughness:.3}),
  gold:new T.MeshStandardMaterial({color:0xb68d40,metalness:.83,roughness:.29}),
  gold2:new T.MeshStandardMaterial({color:0xe1ba68,metalness:.82,roughness:.22}),
  black:new T.MeshStandardMaterial({color:0x070d14,metalness:.36,roughness:.59}),
  shadow:new T.MeshStandardMaterial({color:0x0e2639,metalness:.53,roughness:.53}),
  lens:new T.MeshStandardMaterial({color:0x38bdf2,emissive:0x147bde,emissiveIntensity:1.75,metalness:.22,roughness:.18}),
  crystal:new T.MeshStandardMaterial({color:0x347bed,emissive:0x1a55dd,emissiveIntensity:2.45,metalness:.23,roughness:.16,flatShading:true}),
  warm:new T.MeshStandardMaterial({color:0xe3ba68,emissive:0xa86c19,emissiveIntensity:1.8,metalness:.36,roughness:.2}),
  damage:new T.MeshStandardMaterial({color:0x303a42,metalness:.88,roughness:.53}),
  transparent:new T.MeshPhysicalMaterial({color:0x24445a,metalness:.45,roughness:.18,transparent:true,opacity:.28,depthWrite:false,side:T.DoubleSide})
 };
 const meshes=[];
 const put=(parent,geometry,material,name,xyz=[0,0,0])=>{
  const m=new T.Mesh(geometry,p[material]);m.name=name;m.position.set(...xyz);parent.add(m);meshes.push(m);return m;
 };
 function box(parent,name,xyz,sz,mat='armor',rot=[0,0,0]){
  const m=put(parent,new T.BoxGeometry(...sz),mat,name,xyz);m.rotation.set(...rot);return m;
 }
 function polygon(parent,name,xy,depth,mat,at,rot=[0,0,0]){
  const s=new T.Shape();xy.forEach(([x,y],i)=>i?s.lineTo(x,y):s.moveTo(x,y));s.closePath();
  const k=Math.min(.09,depth*.14);
  const g=new T.ExtrudeGeometry(s,{depth:Math.max(.01,depth-2*k),bevelEnabled:true,bevelSize:.05,bevelThickness:k,bevelSegments:1});
  g.translate(0,0,-depth/2+k);
  const m=put(parent,g,mat,name,at);m.rotation.set(...rot);return m;
 }
 function rod(parent,name,a,b,r,mat='steel'){
  const va=new T.Vector3(...a),vb=new T.Vector3(...b),dir=vb.clone().sub(va);
  const o=put(parent,new T.CylinderGeometry(r,r,dir.length(),12),mat,name,va.add(vb).multiplyScalar(.5).toArray());
  o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),dir.normalize());return o;
 }
 function cyl(parent,name,xyz,r,h,mat='steel',axis='z'){
  const o=put(parent,new T.CylinderGeometry(r,r,h,16),mat,name,xyz);
  if(axis==='z')o.rotation.x=Math.PI/2;else if(axis==='x')o.rotation.z=Math.PI/2;return o;
 }
 function ring(parent,name,xyz,r,t,mat='gold'){
  return put(parent,new T.TorusGeometry(r,t,9,32),mat,name,xyz);
 }
 function bead(parent,name,xyz,r,mat='gold'){
  return put(parent,new T.SphereGeometry(r,10,8),mat,name,xyz);
 }
 const ch=root;
 // I. Industrial load-bearing chassis. One connected machine from feet to helmet.
 rod(ch,'CentralSpinalBeam',[0,4.35,-1.23],[0,11.12,-1.23],.49,'steel');
 box(ch,'LowerBackMachinedTrunk',[0,5.66,-.97],[3.98,1.27,2.10],'armor');
 box(ch,'AxePelvis',[0,4.92,0],[4.66,.88,2.42],'navy');
 cyl(ch,'PelvicMainBearing',[0,5.02,-.34],1.32,.45,'gold');
 polygon(ch,'PelvicApron',[[-2.23,-.57],[2.23,-.57],[1.56,.65],[-1.56,.65]],.34,'armor2',[0,4.88,1.36]);
 box(ch,'CentralWaistLock',[0,5.54,1.18],[3.2,.22,.52],'gold');
 const backPlate=polygon(ch,'RearChestLoadWall',[[-2.94,-2.32],[2.94,-2.32],[3.19,1.73],[2.15,2.56],[-2.15,2.56],[-3.19,1.73]],1.0,'navy',[0,8.1,-1.77]);
 // Main chest has an actual open cavity, not a solid hull intersecting the core crystal.
 for(const side of [-1,1]){
  const sx=side*3.02;
  rod(ch,'TorsoOuterIBeam'+side,[sx,5.81,-.64],[sx,10.36,-.65],.43,'armor2');
  polygon(ch,'TorsoSideEnclosure'+side,[[-.57,-2.10],[.57,-2.10],[.72,1.83],[.1,2.32],[-.57,1.79]],2.82,'armor',[sx,8.05,-.22]);
  for(let j=0;j<5;j++)box(ch,'ChestSideCooler_'+side+'_'+j,[side*3.42,6.48+j*.65,1.05],[.27,.13,1.16],j%2?'gold':'steel');
  rod(ch,'ChestStructuralDiagonal'+side,[side*1.2,5.95,-1.65],[side*3.12,10.28,-1.05],.18,'gold');
  rod(ch,'InternalCoreBrace_'+side,[side*1.85,6.2,-1.15],[side*2.36,9.7,-1.15],.17,'steel');
  for(let j=0;j<5;j++)rod(ch,'MachinedRib_'+side+'_'+j,[side*1.66,6.4+j*.70,-1.36],[side*2.87,6.4+j*.70,.15],.09,'steel');
 }
 const top=polygon(ch,'OverChestArmor',[[-2.82,-.29],[2.82,-.29],[2.34,.46],[-2.34,.46]],1.96,'armor2',[0,10.49,-.68]);
 box(ch,'ShoulderCrossmember',[0,10.12,-.82],[7.45,.78,2.12],'navy');
 box(ch,'ChestFrontTop', [0,10.05,1.18],[5.17,.32,.73],'steel');
 // II. Actual huge Auric CORE, fixed in space during ALL phases.
 // The four-sided two-cone prism is ~3.65 units high, physically smaller than the 5.2-unit internal bay.
 const core=new T.Group();core.name='ActualAuricCore_NeverResizes';core.position.set(0,8.03,.20);ch.add(core);
 const coreMeshes=[];
 const cp=(g,mat,name,at)=>{const m=put(core,g,mat,name,at);coreMeshes.push(m);return m;};
 cyl(core,'AuricContainmentLowerCradle',[0,-2.16,0],1.30,.36,'navy','y');
 cyl(core,'AuricCradleGoldRing',[0,-1.93,0],1.13,.13,'gold','y');
 cyl(core,'AuricMachinedSeat',[0,-1.80,0],.92,.19,'steel','y');
 // Build_auric_crystal in game: two opposed FOUR-sided blue pyramids + gold heart.
 const pointTop=cp(new T.ConeGeometry(1.08,2.50,4,1,false,Math.PI/4),'crystal','AuricCrystal_Top',[0,.76,0]);
 const pointBottom=cp(new T.ConeGeometry(1.08,1.64,4,1,false,Math.PI/4),'crystal','AuricCrystal_Inverted',[0,-1.24,0]);pointBottom.rotation.z=Math.PI;
 cp(new T.SphereGeometry(.40,12,8),'warm','AuricCore_CenterGold',[0,-.18,0]);
 cyl(core,'CoreCentralGoldSpacer',[0,-.22,.02],.63,.22,'gold','y');
 for(let j=0;j<3;j++){
  const a=j*Math.PI*2/3+.25,x=Math.cos(a)*1.27,z=Math.sin(a)*1.27;
  rod(core,'CradleRealMetalArm_'+j,[x,-1.93,z],[x*.43,.42,z*.43],.16,'gold');
  bead(core,'ReceiverSmallBlueIndicator_'+j,[x*.46,.46,z*.45],.14,'lens');
 }
 for(const s of [-1,1]){
  const z=s*1.41;
  cyl(core,'ActualSideReceiver_'+s,[0,-1.34,z],.34,.36,'navy','y');
  cyl(core,'ReceiverBrassTrim_'+s,[0,-1.10,z],.29,.12,'gold','y');
  bead(core,'ReceiverIlluminatedCap_'+s,[0,-.98,z],.19,'lens');
 }
 for(const s of [-1,1]) {
  rod(ch,'CoreMetalUpright_'+s,[s*2.34,5.91,.2],[s*2.34,9.99,.2],.22,'steel');
  rod(ch,'CoreGoldConduit_'+s,[s*1.23,6.15,-.60],[s*2.8,9.32,-1.14],.14,'gold');
 }
 // Phase 1-3: two armored doors enclose unchanged core. Phase 4: doors are swung to the side.
 const open=phase>=4;
 const doors=new T.Group();doors.name='ActualHingedChestDoors';ch.add(doors);
 for(const s of [-1,1]){
  cyl(doors,'DoorHinge_'+s,[s*2.75,8.00,2.02],.23,4.15,'gold','y');
  const d=new T.Group();d.name='PhysicalVaultDoor_'+s;
  d.position.set(s*(open?3.58:1.42),8.13,open?1.30:2.63);
  d.rotation.y=s*(open?.48:0);d.rotation.z=s*(open?-.1:0);doors.add(d);
  polygon(d,'ActualDoorShield_'+s,[[-1.40,-2.34],[1.40,-2.34],[1.65,1.26],[1.08,2.25],[-1.05,2.25],[-1.65,1.26]],.38,phase>=5?'damage':'armor',[0,0,0]);
  polygon(d,'MachinedFrontDoorInset_'+s,[[-1.1,-1.90],[1.1,-1.90],[1.31,1.1],[.72,1.88],[-.7,1.88],[-1.31,1.1]],.16,'armor2',[0,0,.28]);
  for(let j=0;j<4;j++)box(d,'DoorExternalRibs_'+s+'_'+j,[0,-1.44+j*.78,.43],[1.62,.08,.14],j%2?'gold':'steel');
  box(d,'VaultBrassSeal_'+s,[s*.98,0,.49],[.13,3.25,.13],'gold');
 }
 // Internal core impossible to see before opening unless core-cutaway toggle hides door meshes.
 // III. Full leg architecture, rooted in real hip joints.
 for(const s of [-1,1]){
  const hip=[s*1.75,4.62,-.03],knee=[s*2.04,2.50,.35],foot=[s*2.18,.42,.81];
  rod(ch,'RealHipConnection_'+s,[s*1.12,5.03,-.30],hip,.48,'steel');
  cyl(ch,'HipRotor_'+s,hip,.81,.58,'gold');
  rod(ch,'FemurFrame_'+s,hip,knee,.64,'navy');
  polygon(ch,'ThighCasting_'+s,phase===5&&s===1?[[-.91,-.92],[.46,-.92],[.76,-.13],[.26,.69],[-.62,1.12],[-1,.86]]:[[-.91,-.92],[.91,-.92],[1.08,.82],[.62,1.24],[-.65,1.20],[-1.08,.82]],1.57,'armor',[s*1.96,3.56,.30]);
  if(phase<5||s===-1)polygon(ch,'ThighFrontPlate_'+s,[[-.66,-.79],[.66,-.79],[.78,.62],[-.76,.62]],.15,'steel',[s*1.96,3.55,1.18]);
  else for(let k=0;k<3;k++)rod(ch,'MissingRightThighPlateRib_'+k,[1.56+k*.38,2.66,1.03],[1.7+k*.38,4.42,1.07],.14,k===1?'gold':'steel');
  cyl(ch,'KneeMainCoupler_'+s,knee,.70,.82,'gold');
  rod(ch,'LowerLegRealPiston_'+s,knee,[s*2.18,.78,.42],.53,'navy');
  for(let k=0;k<2;k++)rod(ch,'KneeHydraulic_'+s+'_'+k,[s*(2.63+k*.26),3.27,-.36],[s*(2.63+k*.26),1.44,-.20],.13,k===0?'steel':'gold');
  if(phase<4||s===1)polygon(ch,'Greave_'+s,[[-.71,-.96],[.71,-.96],[.87,.61],[.57,1.03],[-.60,1.04],[-.89,.51]],1.27,'armor2',[s*2.16,1.46,.40]);
  else polygon(ch,'BrokenGreave_'+s,[[-.73,-.96],[.42,-.96],[.65,-.38],[.19,.22],[-.48,1.02],[-.89,.50]],1.13,'damage',[s*2.15,1.48,.38]);
  if(phase===5&&s===1){
   for(let k=0;k<3;k++)rod(ch,'OpenRightShin_'+k,[s*1.84+k*.3,2.17,1.09],[s*1.91+k*.3,.79,.99],.15,'steel');
  }
  box(ch,'FootFrame_'+s,[s*2.16,.34,.77],[2.17,.48,2.9],'navy');
  polygon(ch,'MachineBootToe_'+s,[[-1.08,-.2],[1.08,-.2],[1.13,.22],[-1.13,.22]],1.28,'steel',[s*2.16,.33,1.85]);
  for(let j=0;j<3;j++)box(ch,'SegmentedToe_'+s+'_'+j,[s*2.16+(j-1)*.54,.22,2.63],[.44,.20,.51],'gold');
 }
 // IV. Head: industrial construction like existing boss_portraits/boss_optics.
 // NO ears, horns, antennas, vampire silhouette or human/fantasy eyes.
 rod(ch,'SolidNeckColumn',[0,10.10,-.38],[0,11.51,-.16],.53,'steel');
 cyl(ch,'NeckBearing',[0,11.09,.04],.96,.47,'gold');
 const hd=new T.Group();hd.name='MassiveBossMachinedHead_NotPilot';hd.position.set(0,11.9,.32);ch.add(hd);
 polygon(hd,'LargeRectangularHeadCasting',[[-1.50,-.96],[1.50,-.96],[1.7,-.40],[1.68,.86],[-1.65,.86],[-1.7,-.4]],1.43,'armor',[0,0,0]);
 polygon(hd,'FrontContinuousMask',[[-1.39,-.74],[1.39,-.74],[1.48,.37],[1.1,.62],[-1.10,.62],[-1.48,.37]],.18,'steel',[0,-.14,.80]);
 polygon(hd,'WideHelmetBrow',[[-1.65,-.18],[1.65,-.18],[1.39,.21],[-1.39,.21]],.35,'armor2',[0,.64,.86]);
 box(hd,'IndustrialBrowGoldStripe',[0,.78,.88],[2.67,.10,.17],'gold');
 for(const s of [-1,1]){
  // Rectangular mechanical optical assembly from boss portraits: housing, eyelid, iris, pupil.
  box(hd,'OneOfTwoMetalEyeSockets_'+s,[s*.61,.14,.94],[.93,.39,.23],'armor');
  box(hd,'DarkMachineEye_'+s,[s*.61,.12,1.075],[.77,.27,.06],'black');
  box(hd,'NarrowBlueIris_'+s,[s*.61,.13,1.115],[.42,.19,.045],'lens');
  box(hd,'MovingDarkPupil_'+s,[s*.53,.13,1.145],[.10,.205,.05],'black');
  box(hd,'HeavyUpperEyelid_'+s,[s*.61,.29,1.13],[.88,.12,.10],'steel',[0,0,-s*.10]);
  cyl(hd,'SideHeadBearing_'+s,[s*1.63,-.10,.05],.33,.27,'gold','x');
  box(hd,'RecessedCheek_'+s,[s*1.4,-.48,.70],[.36,.45,.30],'armor2');
 }
 polygon(hd,'SeparateMachineJaw',[[-1.13,-.28],[1.13,-.28],[.91,.10],[-.91,.10]],.48,'armor2',[0,-.80,.71]);
 for(let j=0;j<7;j++)box(hd,'ArticulatedGrille_'+j,[(j-3)*.29,-.79,.99],[.085,.25,.075],'black');
 for(const s of [-1,1])rod(hd,'JawSteelJoint_'+s,[s*1.1,-.39,.62],[s*.93,-.91,.62],.10,'gold');
 if(phase>=4)rod(hd,'HeadImpactScar',[-1.06,.58,1.13],[-.23,.00,1.18],.07,'black');
 if(phase>=5){
  box(hd,'DisplacedFaceSection',[-1.05,-.25,.87],[.69,.35,.3],'damage',[0,0,-.16]);
  for(let k=0;k<3;k++)rod(hd,'ExposedJawServo_'+k,[.18+k*.28,-.56,.85],[.24+k*.28,-1.03,1.11],.09,'steel');
 }
 // Pilot: physically INSIDE a private capsule above/behind the reactor, never used as suit optics.
 const cockpit=new T.Group();cockpit.name='ConcealedSmallConsciousPilot';cockpit.position.set(0,10.54,-1.17);ch.add(cockpit);
 const mini=box(cockpit,'ActualSmallRobotTorso',[0,-.38,0],[.68,.62,.45],'armor2');
 const miniH=box(cockpit,'ActualSmallRobotSkull',[0,.11,.05],[.56,.43,.45],'steel');
 for(const s of [-1,1])box(cockpit,'ActualPilotGoldEye_'+s,[s*.15,.13,.29],[.115,.07,.04],'warm');
 box(cockpit,'PilotProtectedCockpit', [0,.01,.34],[1.53,1.05,.14],'navy');
 // V. Arms all anchored to chassis; hands are INDUSTRIAL claws made from solid fist blocks.
 for(const s of [-1,1]){
  const x=s*3.85;
  rod(ch,'ShoulderPrimaryGirder_'+s,[s*2.54,9.84,-.35],[s*3.66,9.49,-.21],.47,'steel');
  cyl(ch,'ShoulderBearing_'+s,[x,9.49,.03],.93,.74,'gold');
  const sideArmorMissing=phase>=3&&s===-1;
  if(!sideArmorMissing){
   polygon(ch,'ShoulderCasting_'+s,[[-1.28,-.82],[1.28,-.82],[1.49,.48],[.99,1.10],[-1,1.10],[-1.49,.48]],1.87,'armor',[x,9.52,.22],[0,0,-s*.04]);
   polygon(ch,'ShoulderFrontPlate_'+s,[[-1.12,-.48],[1.12,-.48],[1.35,.3],[-1.30,.30]],.20,'steel',[x,9.39,1.25]);
  }else{
   polygon(ch,'BrokenShoulderCasting',[[-1.27,-.82],[.42,-.82],[.82,-.11],[.11,.35],[.73,.72],[-.62,1.04],[-1.47,.48]],1.24,'armor',[x,9.53,.1],[0,0,.04]);
   for(let k=0;k<5;k++)rod(ch,'ShoulderExposedRib_'+k,[x-.93+k*.45,8.98,.42],[x-.93+k*.45,10.16,1.13],.125,k%2?'gold':'steel');
   cyl(ch,'ExposedShoulderDrive',[x,9.36,1.09],.61,.35,'gold');
  }
  if(phase>=5&&s===1){
    // The opposite pauldron also loses its face: battle-worn, not just brown paint.
    for(let k=0;k<4;k++)rod(ch,'RightDamagedShoulderScratches_'+k,[x-.65+k*.34,9.01,1.26],[x-.44+k*.34,9.87,1.35],.085,'black');
  }
  rod(ch,'UpperArmRammedSteel_'+s,[x,9.17,-.13],[s*4.32,7.27,.28],.56,'navy');
  polygon(ch,'BicepsArmor_'+s,[[-.62,-.94],[.62,-.94],[.77,.70],[-.75,.70]],1.08,'armor2',[s*4.26,8.18,.28]);
  cyl(ch,'ActualElbowHinge_'+s,[s*4.31,7.14,.40],.68,.68,'gold');
  rod(ch,'UnbrokenInnerForearm_'+s,[s*4.31,7.10,.35],[s*4.55,4.93,.62],.55,'steel');
  const exposedForearm=phase===5&&s===1;
  if(!exposedForearm){
   polygon(ch,'ForearmArmor_'+s,[[-.83,-1.04],[.83,-1.04],[1.04,.73],[.62,1.23],[-.62,1.23],[-1.04,.73]],1.42,'armor',[s*4.49,6.08,.44]);
   if(phase>=4&&s===1){
    polygon(ch,'CrackedForearmShield',[[-.48,-.88],[.26,-.88],[.73,-.08],[.36,.63],[-.73,.63]],.18,'steel',[s*4.49,5.99,1.25]);
    rod(ch,'ExposedForearmOilLine',[s*4.01,6.91,1.21],[s*4.04,5.20,1.22],.11,'gold');
   }else polygon(ch,'ForearmFrontShield_'+s,[[-.66,-.77],[.66,-.77],[.78,.58],[-.78,.58]],.15,'steel',[s*4.49,6.01,1.22]);
  }else{
   for(let k=0;k<4;k++)rod(ch,'ExposedRightForearmPistons_'+k,[s*4.11+k*.25,6.88,.47],[s*4.22+k*.25,4.95,1.02],.135,k===1?'gold':'steel');
   cyl(ch,'ForearmExposedGearing',[s*4.46,5.84,.83],.58,.31,'gold');
  }
  rod(ch,'RealWristAxle_'+s,[s*4.54,5.09,.69],[s*4.53,4.40,.93],.40,'steel');
  cyl(ch,'FistWristCog_'+s,[s*4.53,4.69,.85],.56,.46,'gold');
  polygon(ch,'GiantMechanicalFist_'+s,[[-.91,-.63],[.91,-.63],[1.03,.50],[-1.03,.50]],1.24,'steel',[s*4.52,4.13,1.03]);
  for(let j=0;j<4;j++){
   const xf=s*4.51+(j-1.5)*.45;
   rod(ch,'FistSolidKnuckle_'+s+'_'+j,[xf,3.84,1.37],[xf,3.29,1.65],.22,'armor');
   cyl(ch,'FingerMetalBearing_'+s+'_'+j,[xf,3.39,1.66],.18,.25,'gold');
  }
 }
 // VI. Hardware from phase 2 onwards: two four-tube missile racks + TWO DISTINCT rail batteries.
 if(phase>=2){
  for(const s of [-1,1]){
   const x=s*6.06;
   rod(ch,'WeaponMainSteelGantry_'+s,[s*3.05,10.32,-1.35],[x,11.33,-1.12],.43,'armor');
   rod(ch,'HydraulicRackUnderbracing_'+s,[s*3.17,9.52,-1.70],[s*5.89,10.66,-1.29],.23,'gold');
   cyl(ch,'DorsalMissilePivot_'+s,[x,11.27,-1.24],.64,.52,'gold');
   polygon(ch,'FourHoleLauncherCase_'+s,[[-1.26,-.83],[1.26,-.83],[1.42,.59],[-1.42,.59]],1.65,'armor',[x,11.40,-.44]);
   polygon(ch,'FourHoleArmoredFace_'+s,[[-1.17,-.71],[1.17,-.71],[1.32,.48],[-1.32,.48]],.17,'steel',[x,11.40,.46]);
   for(let row=0;row<2;row++)for(let col=0;col<2;col++){
    const a=x+(col-.5)*1.17,b=11.4+(row-.5)*.66;
    cyl(ch,'OneOfFourPhysicalMissileHoles_'+s+'_'+row+'_'+col,[a,b,.56],.25,.23,'black');
    ring(ch,'MissileBarrelTrim_'+s+'_'+row+'_'+col,[a,b,.70],.25,.052,'gold');
    cyl(ch,'MissilePrimer_'+s+'_'+row+'_'+col,[a,b,.75],.08,.08,'lens');
   }
   // Different, explicitly separate rear railgun with a long slotted magnetic barrel.
   rod(ch,'RailSupportRail_'+s,[s*2.32,10.18,-1.52],[s*2.67,12.04,-1.53],.29,'steel');
   cyl(ch,'RailPowerActuator_'+s,[s*2.67,12.14,-1.50],.56,.57,'gold');
   polygon(ch,'RailBatteryHousing_'+s,[[-.7,-.48],[.7,-.48],[.83,.24],[.45,.58],[-.45,.58],[-.83,.24]],1.60,'armor',[s*2.66,12.45,-1.15]);
   for(let k=-1;k<=1;k++)rod(ch,'RailLinearMagneticBar_'+s+'_'+k,[s*2.66+k*.23,12.48,-.9],[s*2.66+k*.23,12.48,2.89],.10,k===0?'gold':'pale');
   ring(ch,'RailHeavyMuzzle_'+s,[s*2.66,12.48,2.89],.42,.10,'gold');
   cyl(ch,'RailEnergyBore_'+s,[s*2.66,12.48,2.95],.22,.16,'lens');
  }
 }
 // Phase 3: visible loss (one shoulder shell is GONE, multiple exposed metal ribs),
 // phase 4: open real chest (same embedded core), phase 5: severe missing armor.
 if(phase>=3){
  box(ch,'LeftGreaveDamagedGuard',[-2.16,1.38,1.18],[.36,1.45,.21],'damage',[0,0,-.16]);
  for(let i=0;i<3;i++)rod(ch,'FirstImpactBrokenLines_'+i,[1.65+i*.29,3.89,1.25],[1.94+i*.29,3.51,1.27],.09,'black');
 }
 if(phase>=4){
  for(let i=0;i<4;i++)rod(ch,'ChestOpenStructuralCable_'+i,[-1.55+i*1.00,6.29,.96],[-1.45+i*.98,9.68,.52],.11,i===1?'gold':'steel');
  if(phase>=5){
   for(const s of [-1,1])for(let i=0;i<5;i++)
    rod(ch,'FinalOpenChestPiston_'+s+'_'+i,[s*(1.15+i*.20),5.94,-.41],[s*(1.27+i*.25),9.8,-.4],.08,i%2?'steel':'gold');
   // Left side of face has an actual broken jaw and loose but ATTACHED metal guards.
   for(let j=0;j<3;j++)rod(hd,'FinalFaceExposedServos_'+j,[-1.10+j*.14,-.44,.88],[-.89+j*.14,-1.0,.74],.10,'steel');
  }
 }
 root.userData={materials:p,meshes,core:pointTop,phase,viewTarget:new T.Vector3(0,7.3,0),viewDistance:phase>=2?33:30};
 return root;
}
