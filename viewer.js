import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {makeSuit} from './suit-v3.js';

const root=document.querySelector('#stage');
const renderer=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=1.35;
renderer.shadowMap.enabled=false;
renderer.setClearColor('#0d1624');
root.appendChild(renderer.domElement);
document.querySelector('#loading')?.remove();
const scene=new THREE.Scene();
scene.background=new THREE.Color('#0c1522');
scene.fog=new THREE.Fog('#0c1522',27,85);
const camera=new THREE.PerspectiveCamera(33,1,.1,150);
const controls=new OrbitControls(camera,renderer.domElement);
controls.enableDamping=true;
controls.dampingFactor=.07;
controls.minPolarAngle=.22;
controls.maxPolarAngle=Math.PI*.77;
controls.minDistance=13;
controls.maxDistance=70;
controls.enablePan=false;
const light=(color,intensity,x,y,z)=>{
 const L=new THREE.DirectionalLight(color,intensity);L.position.set(x,y,z);scene.add(L);return L;
};
scene.add(new THREE.HemisphereLight(0xe4f1ff,0x0a1325,2.4));
light(0xfbe6bb,4.6,-9,17,14);light(0x62b6ff,5.1,9,12,-11);light(0xd4e5ff,1.9,13,7,10);
const accents=[
 new THREE.PointLight(0x1d8fff,8,22),
 new THREE.PointLight(0xf9b33b,6,18)
];accents[0].position.set(-6,9,-1);accents[1].position.set(6,5,8);accents.forEach(x=>scene.add(x));
const mat={
 deck:new THREE.MeshStandardMaterial({color:0x121e2c,metalness:.8,roughness:.43}),
 lane:new THREE.MeshStandardMaterial({color:0x27374a,metalness:.77,roughness:.35}),
 gold:new THREE.MeshStandardMaterial({color:0xc39a4c,metalness:.85,roughness:.32}),
 rail:new THREE.MeshStandardMaterial({color:0x536879,metalness:.82,roughness:.29}),
 light:new THREE.MeshStandardMaterial({color:0x1b77bc,emissive:0x1263bc,emissiveIntensity:1.3})
};
const platform=new THREE.Group();platform.name='Floor_Industrial_Reference';scene.add(platform);
const board=new THREE.Mesh(new THREE.BoxGeometry(24,.55,15.0),mat.deck);board.position.y=-.43;platform.add(board);
for(let lane=0;lane<5;lane++){
 const z=(lane-2)*2.65;
 const inset=new THREE.Mesh(new THREE.BoxGeometry(21,.05,2.33),mat.lane);inset.position.set(0,-.105,z);platform.add(inset);
 for(let col=-5;col<=5;col++){
  const line=new THREE.Mesh(new THREE.BoxGeometry(.055,.06,2.28),mat.rail);line.position.set(col*1.9,-.055,z);platform.add(line);
 }
 const seam=new THREE.Mesh(new THREE.BoxGeometry(23,.07,.065),mat.gold);seam.position.set(0,-.02,z-1.27);platform.add(seam);
}
for(const side of [-1,1]){
 const edge=new THREE.Mesh(new THREE.BoxGeometry(.5,.35,15.8),mat.rail);edge.position.set(side*12,0,0);platform.add(edge);
 for(let i=0;i<12;i++){
  const p=new THREE.Mesh(new THREE.CylinderGeometry(.08,.08,.7,8),mat.gold);p.position.set(side*12,.4,-6.7+i*1.24);platform.add(p);
 }
}
for(let i=-5;i<=5;i++){
 const lamp=new THREE.Mesh(new THREE.BoxGeometry(.22,.025,.45),mat.light);lamp.position.set(i*2,-.012,-7.2);platform.add(lamp);
}
const desired={pos:new THREE.Vector3(20,15.7,29),target:new THREE.Vector3(0,7.0,0)};
camera.position.copy(desired.pos);controls.target.copy(desired.target);controls.update();
let suit=null,phase=1,wire=false,pulse=0,transitionTime=0;
controls.addEventListener('start',()=>{transitionTime=0;});
const labels=[
 'TRAJE INTACTO · Una sola máquina acorazada. Núcleo Auric grande, instalado dentro del pecho y protegido por dos compuertas reales.',
 'ARMAS DORSALES · Dos lanzadores con cuatro misiles cada uno y dos cañones de riel aparecen conectados al chasis; la armadura sigue intacta.',
 'PRIMEROS DAÑOS · Un gran sector de la hombrera está destruido, se ve el mecanismo interior y hay marcas de impacto en las piernas.',
 'REACTOR EXPUESTO · Se abren las compuertas, dejando visible el mismo Núcleo sin moverlo ni cambiar su tamaño; los mecanismos se deterioran.',
 'BLINDAJE CRÍTICO · Pérdida de placas en hombros, extremidades y torso; quedan expuestos pistones, engranajes y conductos del mismo traje.'
];
const wanted=[0,28,36,33,31,32];
function adjustCamera(p,snap=false){
 const center=suit.userData.viewTarget;
 const size=suit.userData.viewDistance;
 const angle=.52;
 desired.target.copy(center);
 desired.pos.set(Math.sin(angle)*size,center.y+size*.29,Math.cos(angle)*size);
 if(snap){camera.position.copy(desired.pos);controls.target.copy(desired.target);transitionTime=0;controls.update();}else transitionTime=1.6;
}
function setPhase(next){
 phase=next;
 if(suit){
  scene.remove(suit);
  suit.traverse(obj=>{
   if(obj.geometry)obj.geometry.dispose();
  });
  Object.values(suit.userData.materials||{}).forEach(m=>m.dispose());
 }
 suit=makeSuit(THREE,phase);
 scene.add(suit);
 showCoreCutaway(document.querySelector('#coreCutaway').checked);
 document.querySelectorAll('#phaseButtons button').forEach(b=>b.classList.toggle('selected',Number(b.dataset.phase)===next));
 document.querySelector('#stageNote').textContent=labels[next-1];
 setWire(wire);adjustCamera(next,false);
}
function setWire(on){
 wire=on;
 if(!suit)return;
 suit.traverse(o=>{
  if(!o.isMesh)return;
  if(!o.userData.materialOriginal)o.userData.materialOriginal=o.material;
  if(on){
   if(!o.userData.wireMat)o.userData.wireMat=new THREE.MeshBasicMaterial({color:0xe6b46a,wireframe:true,transparent:true,opacity:.65,depthTest:true});
   o.material=o.userData.wireMat;
  }else o.material=o.userData.materialOriginal;
 });
}
document.querySelectorAll('#phaseButtons button').forEach(b=>b.addEventListener('click',()=>setPhase(Number(b.dataset.phase))));
function showCoreCutaway(on){
 if(!suit)return;
 // The two DOOR assemblies are physically closed in phases I-III.
 // Hide only these actual pieces to prove the fixed-size reactor fits inside.
 for(const side of [-1,1]){
   const door=suit.getObjectByName('PhysicalVaultDoor_'+side);
   if(door)door.visible=!on;
 }
}
document.querySelector('#coreCutaway').addEventListener('change',e=>showCoreCutaway(e.target.checked));
document.querySelector('#wireframe').addEventListener('change',e=>setWire(e.target.checked));
document.querySelector('#autoRotate').addEventListener('change',e=>controls.autoRotate=e.target.checked);
document.querySelector('#coreFocus').addEventListener('change',e=>{
 const focus=e.target.checked;
 if(focus) {
  desired.target.set(0,7.3,1);
  desired.pos.set(8,9.4,14);
 }else adjustCamera(phase,false);
});
function reset(){document.querySelector('#coreFocus').checked=false;adjustCamera(phase,true);}
document.querySelector('#reset').addEventListener('click',reset);
document.querySelector('#resetPose').addEventListener('click',()=>{
 document.querySelector('#coreFocus').checked=false;
 const y=suit.userData.viewTarget.y;
 desired.target.set(0,y,0);desired.pos.set(0,y+7,phase===3?37:30);
 camera.position.copy(desired.pos);controls.target.copy(desired.target);controls.update();
});
document.querySelector('#snapshot').addEventListener('click',()=>{
 try{
  renderer.render(scene,camera);
  const a=document.createElement('a');a.download='Auric-Turrets-M17-Traje-Fase-'+phase+'.png';
  a.href=renderer.domElement.toDataURL('image/png');document.body.append(a);a.click();a.remove();
 }catch(e){alert('No se pudo guardar la vista en este navegador.');}
});
function resize(){
 const rect=root.getBoundingClientRect();if(!rect.width||!rect.height)return;
 camera.aspect=rect.width/rect.height;camera.updateProjectionMatrix();renderer.setSize(rect.width,rect.height,false);
}
if('ResizeObserver'in window)new ResizeObserver(resize).observe(root);else window.addEventListener('resize',resize);
setPhase(1);
resize();
const clock=new THREE.Clock();
function frame(){
 requestAnimationFrame(frame);
 const delta=Math.min(.05,clock.getDelta());pulse+=delta;
 const focus=document.querySelector('#coreFocus').checked;
 if(suit){
  suit.traverse(obj=>{
   if(!obj.isMesh)return;
   if(obj.name==='AuricCrystal_Top'||obj.name==='AuricCrystal_Inverted'){
    const glow=obj.userData.materialOriginal||obj.material;
    if(glow&&glow.emissiveIntensity!==undefined)glow.emissiveIntensity=2.5+.3*Math.sin(pulse*1.9);
   }
  });
 }
 if(transitionTime>0){
  transitionTime=Math.max(0,transitionTime-delta);
  camera.position.lerp(desired.pos,1-Math.exp(-delta*4.2));
  controls.target.lerp(desired.target,1-Math.exp(-delta*4.2));
 }
 controls.update();renderer.render(scene,camera);
}
frame();
