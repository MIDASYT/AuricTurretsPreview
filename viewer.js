import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

const root=document.querySelector('#stage');
const scene=new THREE.Scene();
scene.background=new THREE.Color('#0b1422');
scene.fog=new THREE.Fog('#0b1422',23,54);
const camera=new THREE.PerspectiveCamera(35,1,.1,100);
camera.position.set(15,11,22);
const renderer=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true,alpha:false,powerPreference:'high-performance'});
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=1.45;
renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));
root.append(renderer.domElement);
document.querySelector('#loading')?.remove();
const controls=new OrbitControls(camera,renderer.domElement);
controls.enableDamping=true;controls.dampingFactor=.07;controls.minDistance=13;controls.maxDistance=39;
controls.minPolarAngle=.35;controls.maxPolarAngle=2.2;
controls.target.set(0,5.05,0);controls.update();
const ambient=new THREE.HemisphereLight(0xcbdde7,0x151c25,2.0);scene.add(ambient);
const key=new THREE.DirectionalLight(0xffe9c2,4);key.position.set(-7,14,10);scene.add(key);
const rim=new THREE.DirectionalLight(0x6eabef,4);rim.position.set(7,9,-9);scene.add(rim);
const fill=new THREE.DirectionalLight(0xd9e9ff,1);fill.position.set(9,3,7);scene.add(fill);
const floor=new THREE.Group();scene.add(floor);
const P={
  armor:new THREE.MeshStandardMaterial({color:0x111820,metalness:.86,roughness:.3}),
  graphite:new THREE.MeshStandardMaterial({color:0x26313b,metalness:.88,roughness:.33}),
  steel:new THREE.MeshStandardMaterial({color:0x74828b,metalness:.9,roughness:.28}),
  silver:new THREE.MeshStandardMaterial({color:0xa8b4b6,metalness:.87,roughness:.25}),
  gold:new THREE.MeshStandardMaterial({color:0xb88735,metalness:.84,roughness:.27}),
  black:new THREE.MeshStandardMaterial({color:0x070b11,metalness:.65,roughness:.37}),
  eye:new THREE.MeshStandardMaterial({color:0x34d8ef,emissive:0x28d7f5,emissiveIntensity:3,metalness:.2,roughness:.23}),
  crystal:new THREE.MeshPhysicalMaterial({color:0xf2a544,emissive:0xe5a232,emissiveIntensity:3,metalness:.26,roughness:.14,clearcoat:1}),
  conduit:new THREE.MeshStandardMaterial({color:0xe5aa46,emissive:0x92551c,emissiveIntensity:.9,metalness:.72,roughness:.28}),
  glass:new THREE.MeshPhysicalMaterial({color:0x22394b,transparent:true,opacity:.32,metalness:.3,roughness:.1,side:THREE.DoubleSide,depthWrite:false}),
  deck:new THREE.MeshStandardMaterial({color:0x172432,metalness:.8,roughness:.46}),
  scar:new THREE.MeshStandardMaterial({color:0x8b3d30,emissive:0x41120b,emissiveIntensity:.25,metalness:.7,roughness:.4})
};
function add(parent,geom,mat,name,x=0,y=0,z=0){let m=new THREE.Mesh(geom,P[mat]||P.armor);m.position.set(x,y,z);m.name=name;parent.add(m);return m}
function cube(parent,name,x,y,z,w,h,d,mat='graphite',rx=0,ry=0,rz=0){const m=add(parent,new THREE.BoxGeometry(w,h,d),mat,name,x,y,z);m.rotation.set(rx,ry,rz);return m}
function ball(parent,name,x,y,z,r,mat='graphite',scale=[1,1,1]){const m=add(parent,new THREE.SphereGeometry(r,16,12),mat,name,x,y,z);m.scale.set(...scale);return m}
function beam(parent,name,a,b,r,mat='gold',r2=null){const va=new THREE.Vector3(...a),vb=new THREE.Vector3(...b),delta=vb.clone().sub(va);
let mesh=add(parent,new THREE.CylinderGeometry(r2??r,r,delta.length(),12),mat,name,...va.clone().add(vb).multiplyScalar(.5).toArray());
mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize());return mesh}
function hoop(parent,name,x,y,z,r,thickness,mat='gold',rx=Math.PI/2){const m=add(parent,new THREE.TorusGeometry(r,thickness,9,36),mat,name,x,y,z);m.rotation.x=rx;return m}
function tip(parent,name,x,y,z,r,h,mat='gold',rx=Math.PI/2){const m=add(parent,new THREE.ConeGeometry(r,h,8),mat,name,x,y,z);m.rotation.x=rx;return m}
function buildDeck(){
 const base=add(floor,new THREE.CylinderGeometry(8.8,9,0.28,64),'deck','Deck',0,-.34,0);
 add(floor,new THREE.CylinderGeometry(7.4,7.6,.1,64),'steel','DeckPlate',0,-.17,0);
 for(let i=0;i<24;i++){const a=i*Math.PI/12,aa=(i+1)*Math.PI/12;
 beam(floor,'DeckTrim'+i,[8.1*Math.cos(a),-.12,8.1*Math.sin(a)],[8.1*Math.cos(aa),-.12,8.1*Math.sin(aa)],.045,'gold');}
 for(let i=-3;i<=3;i++)cube(floor,'PlatformGroove'+i,0,-.08,i*.9,12,.035,.025,'graphite');
 for(let i=0;i<12;i++){const a=i*Math.PI/6;ball(floor,'DeckLights'+i,7.35*Math.cos(a),-.03,7.35*Math.sin(a),.055,'conduit');}
}
buildDeck();
let suit=new THREE.Group();scene.add(suit);let coreMesh=null;let coreLamp=null;let state=1;
const stages=[
 'Armadura completa; el reactor permanece dentro del pecho.',
 'Módulos superiores desplegados; la silueta conserva la del mismo traje.',
 'Los estabilizadores se extienden desde cadera y espalda.',
 'El pecho se abre y muestra más superficie del Núcleo Auric.',
 'El blindaje central está dañado; el Núcleo queda expuesto.'
];
function newSuit(stage){
 const old=suit;suit=new THREE.Group();suit.name='TrajeFinalNucleo_Fase_'+stage;scene.add(suit);scene.remove(old);
 old.traverse(o=>{if(o.geometry)o.geometry.dispose()});
 const h=suit;
 cube(h,'Pelvis',0,4.05,0,3.2,1.2,2.05,'armor');
 cube(h,'HebillaCinturon',0,4.52,1.05,2.9,.22,.22,'gold');
 cube(h,'TorsoInterior',0,6.4,-.18,4.45,3.65,2.4,'armor');
 cube(h,'LomoAcero',0,6.4,-1.45,2.2,3.1,.68,'steel');
 cube(h,'PectoralSuperior',0,8.02,.96,4.4,.7,.7,'steel');
 cube(h,'Collar',0,8.52,0,3,.43,2.25,'black');
 cube(h,'CaderaEstabilizador',0,3.8,-.95,3.8,.32,.5,'gold');
 for(const s of [-1,1]){
   ball(h,'RodamientoCadera'+s,s*1.35,3.55,0,.6,'gold');
   beam(h,'EjeMuslo'+s,[s*1.35,3.55,0],[s*1.53,2.44,.2],.64,'graphite');
   cube(h,'ArmaduraMuslo'+s,s*1.53,3,.38,1.34,1.2,1.05,'armor',0,0,-s*.07);
   cube(h,'PlacaMuslo'+s,s*1.55,3.04,.99,1.02,.92,.14,'steel');
   ball(h,'BisagraRodilla'+s,s*1.53,2.27,.12,.55,'gold');
   cube(h,'Rodillera'+s,s*1.55,2.2,.73,1.1,.47,.28,'silver');
   beam(h,'Tibia'+s,[s*1.53,2.2,0],[s*1.65,.65,.1],.49,'armor');
   cube(h,'Espinillera'+s,s*1.66,1.38,.55,1.1,1.2,.9,'graphite');
   cube(h,'PlacaEspinilla'+s,s*1.66,1.38,1.06,.78,.95,.14,'steel');
   cube(h,'Pie'+s,s*1.69,.28,1.04,1.45,.5,2.4,'armor');
   cube(h,'PuntaPie'+s,s*1.69,.2,2.26,1.24,.19,.34,'silver');
   for(let k=0;k<3;k++)cube(h,'DedoPie'+s+'_'+k,s*1.69+(k-1)*.32,.19,2.38,.21,.18,.38,'gold');
   beam(h,'PistonPierna'+s,[s*2.12,3.5,-.18],[s*2.16,1.8,.12],.13,'gold');
   ball(h,'GiroHombro'+s,s*2.75,7.75,0,.73,'gold');
   cube(h,'Hombrera'+s,s*3.32,8.09,-.08,2.1,.91,2.75,stage===5?'graphite':'armor',0,0,-s*.09);
   cube(h,'GuardaHombro'+s,s*4.37,7.99,.24,.19,.75,1.88,'steel');
   cube(h,'BandaHombro'+s,s*3.48,8.6,-.08,1.7,.11,2.5,'gold');
   beam(h,'HombroAntebrazo'+s,[s*2.9,7.43,0],[s*3.15,5.85,.32],.53,'graphite');
   cube(h,'Biceps'+s,s*3.16,6.83,.48,1.05,1.1,.85,'steel');
   ball(h,'Codo'+s,s*3.17,5.77,.25,.55,'gold');
   cube(h,'Antebrazo'+s,s*3.24,4.78,.48,1.23,1.67,1.28,'armor');
   cube(h,'PlacaAntebrazo'+s,s*3.24,4.75,1.2,1,.95,.19,'steel');
   cube(h,'Palma'+s,s*3.24,3.62,.57,.99,.62,1.12,'silver');
   for(let f=0;f<4;f++)beam(h,'DedoMano'+s+'_'+f,[s*3.24+(f-1.5)*.24,3.39,.8],[s*3.24+(f-1.5)*.24,3.04,1.02],.102,'graphite');
   beam(h,'PistonBrazo'+s,[s*2.58,7.53,.47],[s*2.98,5.91,.7],.135,'gold');
   for(let k=0;k<4;k++)cube(h,'DisipadorCostado'+s+'_'+k,s*1.89,5.12+k*.44,1.03,.7,.07,.12,'steel');
   for(let k=0;k<4;k++)cube(h,'DorsoVertebra'+s+'_'+k,s*.7,5.1+k*.56,-1.57,.56,.09,.23,'gold');
   if(stage===5){
     cube(h,'ArmaduraRotaSuperior'+s,s*1.8,7.85,1.42,1.0,.46,.26,'steel',0,0,s*.28);
     cube(h,'ArmaduraRotaInferior'+s,s*1.86,6.05,1.4,.9,.45,.24,'graphite',0,0,-s*.2);
     for(let k=0;k<5;k++)cube(h,'CostillaExpuesta'+s+'_'+k,s*1.45,6.38+k*.3,1.4,1.0,.065,.2,'silver');
   }else{
     const opened=stage>=4;
     cube(h,'ArmaduraToracica'+s,s*(opened?1.86:1.52),6.73,1.3,1.47,2.22,.34,opened?'steel':'graphite',0,0,s*(opened?.25:.055));
     cube(h,'CosturaOro'+s,s*(opened?2.6:2.24),6.65,1.5,.08,2.0,.1,'gold');
   }
   if(stage>=2){
     for(let k=0;k<2;k++){const x=s*(.9+k*.9);
       cube(h,'ArtilleriaDorsal'+s+'_'+k,x,8.63,-1.4,.69,.78,1.24,'graphite');
       beam(h,'CanoDorsal'+s+'_'+k,[x,8.65,-1.55],[x,8.65,1.54],.16,'steel');
       hoop(h,'BocaDorsal'+s+'_'+k,x,8.65,1.6,.21,.052,'gold',0);
     }
   }else cube(h,'ModuloPlegado'+s,s*1.5,8.48,-1.33,1.5,.4,.77,'armor');
   if(stage>=3){
      for(const z of [-.75,.75]){
        const a=[s*1.2,3.6,z],b=[s*3.05,.55,z*1.95];
        beam(h,'SoporteAsedio'+s+'_'+z,a,b,.21,'steel');
        beam(h,'PistonAsedio'+s+'_'+z,[s*1.3,3.38,z],[s*2.56,1.2,z*1.7],.09,'gold');
        cube(h,'PieAnclaje'+s+'_'+z,b[0],b[1],b[2],.85,.25,.86,'graphite');
      }
   }
 }
 // The occupant remains small relative to the suit; original established color palette and expressive optics.
 cube(h,'CavidadPiloto',0,9.37,-.05,2.15,1.65,2.0,'black');
 cube(h,'MarcoPilotoSuperior',0,10.24,.0,2.5,.37,2.05,'armor');
 cube(h,'CoronaPiloto',0,10.44,.35,1.88,.13,.65,'gold');
 cube(h,'CabezaRobotReal',0,9.45,.54,.76,.77,.73,'armor');
 cube(h,'PlacaFacial',0,9.49,.94,.57,.41,.07,'steel');
 cube(h,'MandibulaArticulada',0,9.19,.92,.47,.13,.14,'silver');
 cube(h,'CejaIzq',-.17,9.77,1.04,.26,.06,.09,'gold');
 cube(h,'CejaDer',.17,9.77,1.04,.26,.06,.09,'gold');
 const eyeColor=[0x42d8ed,0xe5bf4f,0x9c59ee,0xf75d50,0xe74440][stage-1];
 P.eye.color.setHex(eyeColor);P.eye.emissive.setHex(eyeColor);
 for(let s of [-1,1]){ball(h,'MonturaOptica'+s,s*.17,9.52,1.012,.13,'gold');ball(h,'Iris'+s,s*.17,9.52,1.125,.072,'eye');}
 cube(h,'CristalCabina',0,9.41,1.12,1.46,1.15,.045,'glass');
 // Integrated core. It sits inside the chest cavity and glows through openings, not beside the suit.
 cube(h,'CamaraBlindada',0,6.67,.84,2.12,2.2,.72,'black');
 coreMesh=ball(h,'NucleoAuric_Fisico',0,6.65,1.48,stage>=4?.84:.67,'crystal');
 coreMesh.scale.set(1,1,.68);
 hoop(h,'AroExternoDelNucleo',0,6.65,1.72,stage>=4?1.15:.85,.085,'gold');
 hoop(h,'AroEnergia',0,6.65,1.8,stage>=4?.97:.68,.055,'conduit');
 for(let k=0;k<6;k++){const a=k*Math.PI/3;
   cube(h,'SegmentoDelNucleo'+k,Math.sin(a)*(stage>=4?.72:.53),6.65+Math.cos(a)*(stage>=4?.72:.53),1.83,.21,.13,.12,'gold',0,0,-a);
 }
 if(stage>=4){
    for(let s of [-1,1])for(let j=0;j<3;j++){
       beam(h,'RutaEnergia'+s+'_'+j,[s*.6,6.65,1.67],[s*(2+j*.24),7.06+j*.36,.65],.06,'conduit');
    }
 }
 if(stage===5){
   hoop(h,'AroNucleoExpuesto',0,6.65,1.89,1.36,.11,'conduit');
   for(let s of [-1,1])cube(h,'AletaBlindajeRota'+s,s*2.34,7.33,1.4,.38,1.75,.3,'scar',0,0,s*.16);
 }
 if(coreLamp)scene.remove(coreLamp);
 coreLamp=new THREE.PointLight(0xf5aa44,stage>=4?6:3,6);coreLamp.position.set(0,6.65,2.1);scene.add(coreLamp);
}
function setPhase(n){
 state=n;newSuit(n);
 document.querySelectorAll('#phaseButtons button').forEach(b=>b.classList.toggle('selected',Number(b.dataset.phase)===n));
 document.querySelector('#stageNote').textContent=stages[n-1];
 setWireframe(document.querySelector('#wireframe').checked);
}
function setWireframe(on){suit.traverse(o=>{if(o.isMesh){o.userData.oldMaterial=o.userData.oldMaterial||o.material;if(on){if(!o.userData.wireMat){o.userData.wireMat=new THREE.MeshBasicMaterial({color:0xd2ab69,wireframe:true,transparent:true,opacity:.55})}o.material=o.userData.wireMat;}else o.material=o.userData.oldMaterial}})}
document.querySelectorAll('#phaseButtons button').forEach(btn=>btn.addEventListener('click',()=>setPhase(Number(btn.dataset.phase))));
document.querySelector('#wireframe').addEventListener('change',e=>setWireframe(e.target.checked));
document.querySelector('#autoRotate').addEventListener('change',e=>controls.autoRotate=e.target.checked);
document.querySelector('#coreFocus').addEventListener('change',e=>{
 const focus=e.target.checked;controls.target.set(0,focus?6.7:5.05,0);camera.position.set(focus?7:15,focus?7.5:11,focus?11:22);controls.update();
});
function resetView(){camera.position.set(15,11,22);controls.target.set(0,5.05,0);document.querySelector('#coreFocus').checked=false;controls.update();}
document.querySelector('#reset').addEventListener('click',resetView);
document.querySelector('#resetPose').addEventListener('click',()=>{camera.position.set(0,8.1,27);controls.target.set(0,5.05,0);controls.update();});
document.querySelector('#snapshot').addEventListener('click',()=>{
 renderer.render(scene,camera);const a=document.createElement('a');a.download='Auric-M17-Traje-Nucleo-Fase'+state+'.png';a.href=renderer.domElement.toDataURL('image/png');a.click();
});
function resize(){
 const rect=root.getBoundingClientRect();if(rect.width<1||rect.height<1)return;
 camera.aspect=rect.width/rect.height;camera.updateProjectionMatrix();renderer.setSize(rect.width,rect.height,false);
}
if('ResizeObserver'in window)new ResizeObserver(resize).observe(root);else window.addEventListener('resize',resize);
let t=0;setPhase(1);resize();
function animate(){requestAnimationFrame(animate);t+=.017;
 if(coreMesh){const s=1+.035*Math.sin(t*2.1);coreMesh.scale.x=s;coreMesh.scale.y=s;}
 if(coreLamp)coreLamp.intensity=(state>=4?6:3)*(1+.16*Math.sin(t*2));
 controls.update();renderer.render(scene,camera);}
animate();
