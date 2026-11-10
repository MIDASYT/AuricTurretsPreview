// Physical damage and boss-scale outer armor for Auric Turrets' M17 web viewer.
// New 3D parts are attached to the actual existing suit; broken armor meshes are removed.
export function applyPhysicalWear(T,root,phase,pal,all){
 const add=(parent,geometry,material,name,position)=>{
  const mesh=new T.Mesh(geometry,pal[material]);mesh.name=name;
  mesh.position.set(...position);parent.add(mesh);all.push(mesh);return mesh;
 };
 const plate=(parent,name,points,depth,material,position,rotation=[0,0,0])=>{
  const shape=new T.Shape();points.forEach(([x,y],i)=>i?shape.lineTo(x,y):shape.moveTo(x,y));shape.closePath();
  const thick=Math.min(.08,depth*.12);
  const geo=new T.ExtrudeGeometry(shape,{depth:Math.max(.02,depth-2*thick),bevelEnabled:true,bevelSize:.04,bevelThickness:thick,bevelSegments:1});
  geo.translate(0,0,-depth/2+thick);
  const mesh=add(parent,geo,material,name,position);mesh.rotation.set(...rotation);return mesh;
 };
 const beam=(parent,name,a,b,r,material='silver')=>{
  const v=new T.Vector3(...a),w=new T.Vector3(...b),direction=w.clone().sub(v);
  const mesh=add(parent,new T.CylinderGeometry(r,r,direction.length(),10),material,name,v.clone().add(w).multiplyScalar(.5).toArray());
  mesh.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),direction.normalize());return mesh;
 };
 const disc=(parent,name,pos,r,depth,mat='gold')=>{
  const mesh=add(parent,new T.CylinderGeometry(r,r,depth,14),mat,name,pos);mesh.rotation.x=Math.PI/2;return mesh;
 };
 const remove=(name)=>{
  const m=root.getObjectByName(name);if(!m)return;
  m.parent.remove(m);const i=all.indexOf(m);if(i>=0)all.splice(i,1);m.geometry?.dispose();
 };
 // Completely different, heavy-war-machine mask, not the face of its small human-sized pilot.
 const head=root.getObjectByName('ColossusHead_NotPilotHead');
 if(head){
  ['OpticalSlot','Gold_Glare'].forEach(name=>{
   const m=head.getObjectByName(name);if(!m)return;
   head.remove(m);const i=all.indexOf(m);if(i>=0)all.splice(i,1);m.geometry.dispose();
  });
  for(const s of [-1,1]){
   plate(head,'SeparateBlackEyeSocket_'+s,[[-.37,-.23],[.39,-.23],[.47,.22],[-.47,.22]],.13,'black',[s*.46,.11,1.06],[0,0,-s*.09]);
   disc(head,'EmplacedGoldEyeRing_'+s,[s*.46,.10,1.16],.24,.13,'gold');
   disc(head,'WarEyeIris_'+s,[s*.46,.10,1.23],.14,.06,'optic');
   disc(head,'MachineIrisAperture_'+s,[s*.46,.10,1.28],.06,.03,'black');
   plate(head,'HeavyFrowningBrow_'+s,[[-.46,-.1],[.46,-.1],[.41,.26],[-.45,.23]],.25,'armor',[s*.47,.49,1.08],[0,0,-s*.12]);
   beam(head,'AngledCrestSupport_'+s,[s*1,.86,.10],[s*1.48,1.33,.05],.20,'gold');
   const horn=add(head,new T.ConeGeometry(.20,1.3,6),'silver','ArmoredCrownFin_'+s,[s*1.50,1.72,.04]);horn.rotation.z=-s*.26;
  }
  plate(head,'LowerJawAegis',[[-.94,-.3],[.94,-.3],[.8,.24],[-.8,.24]],.34,'armor',[0,-.77,.88]);
  for(let i=0;i<6;i++)beam(head,'VentilatorFang_'+i,[(i-2.5)*.22,-.53,1.05],[(i-2.5)*.22,-.91,1.12],.05,'steel');
 }
 if(phase<3)return;
 // Phase 3: two small collisions; pieces are actually absent, not repainted brown.
 // A third of the visible left shoulder shell is physically missing.
 remove('Pauldron_-1');
 remove('PauldronFace_-1');
 plate(root,'FracturedPauldronBigShell',[[-1.18,-.66],[.45,-.66],[1.00,-.18],[.18,.06],[.68,.61],[-.54,.93],[-1.38,.20]],1.17,'armor',[-4.27,9.46,-.21],[0,0,-.10]);
 plate(root,'FracturedPauldronFront',[[-1.01,-.53],[.34,-.53],[.72,-.19],[.07,.03],[.51,.39],[-.56,.70],[-1.16,.16]],.16,'steel',[-4.30,9.37,1.19]);
 disc(root,'ExposedShoulderLargeGear',[-3.47,9.29,1.07],.47,.22,'gold');
 for(let i=0;i<4;i++)beam(root,'MissingShoulderArmorRib_'+i,[-3.89+i*.19,8.87,.89],[-3.67+i*.19,9.90,1.18],.105,i%2?'steel':'gold');
 beam(root,'FirstImpactSplitA',[-4.84,10.0,1.29],[-4.15,9.56,1.39],.092,'black');
 beam(root,'FirstImpactSplitB',[-4.15,9.56,1.39],[-3.69,9.19,1.27],.084,'black');
 plate(root,'DentedSideGusset',[[-.56,-.50],[.50,-.50],[.65,.24],[.02,.62],[-.63,.30]],.26,'steel',[-2.75,6.22,1.42],[0,0,-.12]);
 remove('ShinAccent_1');
 beam(root,'DeformedShinAccent',[2.18,1.02,1.12],[2.42,1.93,1.16],.14,'steel');
 for(let i=0;i<3;i++)beam(root,'VisibleDamagedShinRib_'+i,[1.97+i*.24,1.06,1.01],[2.02+i*.24,1.96,1.11],.065,'gold');
 if(phase<4)return;
 // Phase 4: more shattered armor, visible actuators at arm and leg, reactor bay opens.
 remove('ForearmFace_1');
 plate(root,'GashedRightForearm',[[-.65,-.7],[.23,-.7],[.68,-.12],[.23,.51],[-.65,.51]],.14,'steel',[4.50,5.86,1.36],[0,0,-.08]);
 for(let i=0;i<3;i++)beam(root,'RightForearmOpenPiston_'+i,[4.10+i*.31,6.53,1.18],[4.24+i*.31,5.15,1.18],.11,i===1?'gold':'silver');
 remove('PauldronFace_1');
 for(let i=0;i<3;i++)beam(root,'RightShoulderDamagedSkeleton_'+i,[3.65+i*.4,9.04,1.08],[3.52+i*.4,9.87,1.25],.11,'silver');
 remove('ShinShield_-1');
 plate(root,'ChippedLeftShinPanel',[[-.62,-.84],[.22,-.84],[.51,-.22],[.12,.41],[-.58,.73],[-.82,.1]],.68,'plating',[-2.23,1.43,1.05]);
 beam(root,'ExposedShinRod',[-2.19,2.18,1.22],[-2.26,.71,1.20],.13,'gold');
 beam(root,'HingedChestTorn',[-3.49,8.47,1.77],[-2.89,7.90,2.10],.14,'silver');
 if(phase<5)return;
 // Phase 5: catastrophic damage through physically missing plating; original structure still exists.
 ['Pauldron_-1','PauldronFace_1','Pauldron_1','ForearmCasting_1','ThighCasting_1','ThighInset_1','ForearmFace_-1','ShinShield_1','ChestWing_-1'].forEach(remove);
 for(let i=0;i<4;i++){
  beam(root,'OpenLeftShoulderCage_'+i,[-5.02+i*.52,8.91,-.50],[-5.02+i*.52,10.19,.88],.13,'silver');
  beam(root,'OpenRightForearmFrame_'+i,[4.00+i*.31,6.92,.32],[4.19+i*.31,4.94,.78],.12,i===1?'gold':'steel');
  beam(root,'RightThighInside_'+i,[1.62+i*.25,4.0,.66],[1.78+i*.25,2.48,1.03],.12,'silver');
  beam(root,'RightShinFrame_'+i,[1.91+i*.22,2.13,.76],[2.04+i*.22,.70,1.01],.1,'steel');
 }
 disc(root,'ExposedShoulderBearing',[-4.05,9.51,1.05],.75,.45,'gold');
 disc(root,'ExposedForearmDrive',[4.47,5.81,.81],.62,.33,'steel');
 plate(root,'DisplacedChestShard',[[-1.12,-.81],[.17,-.81],[.58,.24],[-.89,.58]],.35,'plating',[-3.42,7.02,1.93],[0,-.32,-.43]);
 for(let i=0;i<5;i++)beam(root,'VisibleChestCoreFeed_'+i,[-2.28,5.89+i*.51,1.58],[-1.29,6.10+i*.51,1.58],.10,i===2?'gold':'silver');
 if(head){
  const m=head.getObjectByName('Faceplate_Armor');
  if(m){head.remove(m);const i=all.indexOf(m);if(i>=0)all.splice(i,1);m.geometry.dispose();}
  plate(head,'BrokenMaskHalf',[[-.92,-.42],[.16,-.42],[.55,.19],[-.76,.48]],.18,'steel',[-.33,-.14,.81]);
  for(let i=0;i<3;i++)beam(head,'ExposedJawInterior_'+i,[.12+i*.21,-.37,.69],[.28+i*.21,-.84,1.04],.085,'gold');
 }
}
