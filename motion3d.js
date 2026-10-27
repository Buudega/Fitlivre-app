(() => {
'use strict';
const THREE = window.THREE;
const $ = id => document.getElementById(id);
const phaseNames = {
 squat:['Apoie os pés','Leve o quadril para trás','Empurre o chão para subir'],air:['Pés firmes','Desça até onde for confortável','Volte a ficar em pé'],sit:['Pés apoiados no chão','Incline e levante','Sente devagar com controle'],
 wallpush:['Mãos na parede','Aproxime o peito','Empurre a parede'],incline:['Mãos no apoio firme','Aproxime o peito do apoio','Empurre o apoio'],calf:['Segure num apoio','Suba os calcanhares','Desça sem impulso'],bridge:['Deite com joelhos dobrados','Eleve o quadril','Desça devagar'],
 march:['Fique perto de um apoio','Eleve um joelho','Alterne os lados'],side:['Pés paralelos','Dê um passo para o lado','Volte sem saltar'],deadbug:['Deite com joelhos dobrados','Toque um calcanhar','Retorne e alterne'],bird:['Apoie mãos e joelhos','Estenda braço e perna opostos','Retorne e troque o lado'],
 row:['Braços à frente','Puxe os cotovelos para trás','Estenda os braços devagar'],hinge:['Destrave os joelhos','Leve o quadril para trás','Volte à posição alta'],press:['Halteres nos ombros','Empurre para cima','Desça até os ombros'],curl:['Braços ao lado do corpo','Dobre os cotovelos','Desça sem balançar'],
 stretch:['Relaxe os ombros','Faça círculos pequenos','Continue sem forçar'],cat:['Comece com a coluna neutra','Arredonde suavemente','Volte e alongue sem forçar'],ankle:['Calcanhar apoiado','Leve o joelho à parede','Retorne e alterne'],breath:['Solte os ombros','Inspire confortavelmente','Expire devagar'],
 kneeup:['Fique perto de um apoio','Eleve um joelho','Apoie e alterne'],arms:['Braços à frente do peito','Abra os braços','Retorne devagar']
};
const phaseCues={
 squat:['Fique atrás da cadeira. Pés na largura do quadril e cadeira firme logo atrás.','Leve o quadril para trás; joelhos acompanham a direção dos pés.','Empurre o chão para ficar em pé. Use a cadeira como apoio se precisar.'],air:['Pés na largura confortável e tronco alto.','Flexione quadril e joelhos sem tirar os pés do chão.','Empurre o chão e volte sem travar os joelhos.'],sit:['Sente na parte da frente da cadeira, pés inteiros no chão.','Incline o tronco um pouco à frente e levante usando as pernas.','Leve o quadril para trás e sente lentamente.'],
 wallpush:['Fique a um passo da parede, mãos na altura do peito.','Dobre os cotovelos e aproxime o corpo mantendo-o alinhado.','Empurre a parede até estender os braços sem travar.'],incline:['Apoie as mãos numa bancada firme e sem rodas.','Flexione os cotovelos mantendo cabeça, tronco e pernas alinhados.','Empurre o apoio para voltar à posição inicial.'],calf:['Segure numa cadeira ou parede estável.','Suba na ponta dos pés sem jogar o corpo à frente.','Desça lentamente até apoiar os calcanhares.'],bridge:['Deite, dobre os joelhos e deixe os pés apoiados.','Eleve o quadril apertando suavemente os glúteos.','Desça devagar sem arquear a lombar.'],
 march:['Fique ao lado de uma parede ou cadeira se precisar.','Eleve um joelho só até uma altura confortável.','Apoie o pé com controle e alterne.'],side:['Pés paralelos e joelhos levemente flexionados.','Dê um passo curto para o lado, sem cruzar os pés.','Traga o outro pé e siga sem saltar.'],deadbug:['Deite com joelhos dobrados; mantenha as costas confortáveis.','Toque o chão com um calcanhar de cada vez.','Retorne o pé e alterne sem prender a respiração.'],bird:['Em quatro apoios, mãos sob os ombros e joelhos sob quadris.','Estenda braço e perna opostos sem girar o tronco.','Volte à base e alterne os lados.'],
 row:['Prenda o elástico com segurança ou ajuste a polia.','Puxe os cotovelos junto ao corpo; não encolha os ombros.','Estenda os braços devagar sem arredondar as costas.'],hinge:['Fique em pé com joelhos destravados.','Empurre o quadril para trás, mantendo a coluna confortável.','Contraia os glúteos e volte a ficar em pé.'],press:['Segure pesos leves na altura dos ombros.','Empurre para cima só até onde for confortável.','Desça devagar até os ombros.'],curl:['Segure pesos leves com braços ao lado do corpo.','Dobre os cotovelos sem mover o tronco.','Desça com controle; evite embalo.'],
 stretch:['Solte os ombros e mantenha os cotovelos relaxados.','Faça círculos pequenos, para frente ou para trás.','Mantenha o movimento confortável; pare se doer.'],cat:['Em quatro apoios, comece com a coluna confortável.','Arredonde as costas suavemente, sem forçar o pescoço.','Volte ao neutro e alongue com leveza.'],ankle:['Fique de frente para a parede, calcanhar apoiado.','Leve o joelho em direção à parede sem tirar o calcanhar do chão.','Retorne e repita do outro lado.'],breath:['Sente ou fique em pé numa posição confortável.','Inspire pelo nariz sem levantar os ombros à força.','Solte o ar lentamente; repita no seu ritmo.'],
 kneeup:['Fique perto de uma cadeira firme para apoio.','Eleve um joelho só até uma altura confortável.','Apoie o pé devagar e alterne o lado.'],arms:['Mantenha os braços à frente, na altura do peito.','Abra para os lados sem elevar além do confortável.','Traga os braços à frente com controle.']
};
let renderer,scene,camera,rig,props,ro,activeId='squat',playing=true,elapsed=0,last=0,theta=.12,frameHandle=null,initError='',manualStep=null;
const stage=()=>$('customDemo');
const V=(x,y,z)=>new THREE.Vector3(x,y,z);
function makeMat(color,roughness=.7){return new THREE.MeshStandardMaterial({color,roughness,metalness:.02})}
const mat={skin:makeMat('#bd8061',.82),skinLight:makeMat('#d69b78',.78),skinShadow:makeMat('#996349',.82),shirt:makeMat('#38613d',.88),shirtLight:makeMat('#78a552',.82),seam:makeMat('#a6c878',.8),short:makeMat('#283945',.86),shortLight:makeMat('#425667',.82),shoe:makeMat('#e8e7df',.64),sole:makeMat('#34424b',.78),lace:makeMat('#f5f0e6',.6),joint:makeMat('#bd8061',.84),eye:makeMat('#292523',.42),white:makeMat('#f2e9de',.5),hair:makeMat('#302724',.93),brow:makeMat('#49362e',.9),prop:makeMat('#64717a'),wall:makeMat('#dfe5e5'),mat:makeMat('#d9e2dc'),band:makeMat('#e9a857'),weight:makeMat('#43515c')};
function addMesh(parent,geometry,material,position,scale){const m=new THREE.Mesh(geometry,material);if(position)m.position.copy(position);if(scale)m.scale.set(...scale);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m}
function capsule(parent,material,r1,r2){const g=new THREE.Group();const core=new THREE.Mesh(new THREE.CylinderGeometry(r1*.82,r2*.82,.70,16),material);core.position.y=.5;core.castShadow=true;core.receiveShadow=true;g.add(core);const top=new THREE.Mesh(new THREE.SphereGeometry(r1,16,12),material);top.position.y=.84;top.castShadow=true;g.add(top);const bottom=new THREE.Mesh(new THREE.SphereGeometry(r2,16,12),material);bottom.position.y=.16;bottom.castShadow=true;g.add(bottom);parent.add(g);return g}
function ball(parent,material,r,scale=[1,1,1]){return addMesh(parent,new THREE.SphereGeometry(r,18,14),material,null,scale)}
function link(mesh,a,b){const d=b.clone().sub(a);const length=d.length();mesh.position.copy(a).add(b).multiplyScalar(.5);mesh.scale.set(1,Math.max(.001,length),1);mesh.quaternion.setFromUnitVectors(V(0,1,0),d.normalize())}
function createRig(){
 const g=new THREE.Group(),seg={shoulder:{},sleeve:{},upperArm:{},forearm:{},elbow:{},wrist:{},hand:{},fingers:{},thumb:{},hip:{},thigh:{},shortsLeg:{},knee:{},shin:{},ankle:{},foot:{},shoe:{},sole:{},laces:{},weight:{}};
 const unitSphere=new THREE.SphereGeometry(1,24,18);
 function detail(parent,material,scale,pos){const m=new THREE.Mesh(unitSphere,material);m.scale.set(...scale);m.position.set(...pos);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m}
 seg.torso=detail(g,mat.shirt,[.30,.43,.185],[0,0,0]);
 seg.chest=detail(g,mat.shirtLight,[.295,.205,.186],[0,.13,.006]);
 seg.pelvis=detail(g,mat.short,[.225,.16,.17],[0,0,0]);
 seg.waistBand=detail(g,mat.shortLight,[.224,.038,.173],[0,.075,0]);
 seg.neck=detail(g,mat.skinLight,[.074,.13,.075],[0,0,0]);
 seg.collar=detail(g,mat.shirt,[.094,.042,.088],[0,0,0]);
 seg.head=detail(g,mat.skinLight,[.145,.185,.14],[0,0,0]);
 seg.hair=detail(g,mat.hair,[.151,.089,.148],[0,0,0]);
 seg.hairFringe=detail(g,mat.hair,[.135,.039,.035],[0,0,0]);
 seg.ears=[detail(g,mat.skin,[.032,.052,.028],[0,0,0]),detail(g,mat.skin,[.032,.052,.028],[0,0,0])];
 seg.eyes=[detail(g,mat.white,[.022,.025,.012],[0,0,0]),detail(g,mat.white,[.022,.025,.012],[0,0,0])];
 seg.pupils=[detail(g,mat.eye,[.010,.014,.008],[0,0,0]),detail(g,mat.eye,[.010,.014,.008],[0,0,0])];
 seg.brows=[detail(g,mat.brow,[.031,.009,.012],[0,0,0]),detail(g,mat.brow,[.031,.009,.012],[0,0,0])];
 seg.nose=detail(g,mat.skin,[.026,.041,.035],[0,0,0]);
 for(const s of ['L','R']){
  const sign=s==='L'?-1:1;
  seg.shoulder[s]=detail(g,mat.shirt,[.115,.122,.13],[0,0,0]);
  seg.sleeve[s]=capsule(g,mat.shirtLight,.085,.105);
  seg.upperArm[s]=capsule(g,mat.skinLight,.069,.084);seg.forearm[s]=capsule(g,mat.skinLight,.052,.067);
  seg.elbow[s]=detail(g,mat.skin,[.072,.073,.071],[0,0,0]);seg.wrist[s]=detail(g,mat.skinLight,[.051,.052,.05],[0,0,0]);
  seg.hand[s]=detail(g,mat.skinLight,[.058,.078,.034],[0,0,0]);
  seg.fingers[s]=[];for(let i=0;i<4;i++)seg.fingers[s].push(detail(g,mat.skinLight,[.014,.049,.015],[0,0,0]));
  seg.thumb[s]=detail(g,mat.skin,[.023,.05,.022],[0,0,0]);
  seg.hip[s]=detail(g,mat.short,[.09,.10,.095],[0,0,0]);
  seg.thigh[s]=capsule(g,mat.skinLight,.092,.112);
  seg.shortsLeg[s]=capsule(g,mat.shortLight,.106,.111);
  seg.knee[s]=detail(g,mat.skinLight,[.085,.086,.081],[0,0,0]);
  seg.shin[s]=capsule(g,mat.skinLight,.057,.077);
  seg.ankle[s]=detail(g,mat.skin,[.055,.067,.059],[0,0,0]);
  seg.shoe[s]=detail(g,mat.shoe,[.084,.076,.15],[0,0,0]);
  seg.sole[s]=detail(g,mat.sole,[.085,.027,.15],[0,0,0]);
  seg.laces[s]=[];for(let j=0;j<3;j++)seg.laces[s].push(detail(g,mat.lace,[.038,.006,.007],[0,0,0]));
  seg.weight[s]=capsule(g,mat.weight,.05,.05);
 }
 g.userData.seg=seg;scene.add(g);return g;
}
function basePose(){return {
 head:[0,2.04,0],neck:[0,1.84,0],chest:[0,1.57,0],pelvis:[0,1.03,0],
 SL:[-.23,1.67,0],SR:[.23,1.67,0],EL:[-.34,1.34,0],ER:[.34,1.34,0],WL:[-.36,1.08,0],WR:[.36,1.08,0],
 HL:[-.13,1.01,0],HR:[.13,1.01,0],KL:[-.14,.56,0],KR:[.14,.56,0],AL:[-.14,.12,0],AR:[.14,.12,0],TL:[-.14,.06,.19],TR:[.14,.06,.19],
 handL:[-.37,1.03,.04],handR:[.37,1.03,.04],spine:0,weightL:[-.36,1.1,0],weightR:[.36,1.1,0]
};}
function v(p,k){return V(...p[k])}function put(p,k,x,y,z){p[k]=[x,y,z]}
function pair(p,key,s,x,y,z){put(p,key+s,s==='L'?-x:x,y,z)}
function standing(p,{hip=1.03,shift=0,lean=0}={}){
 put(p,'pelvis',0,hip,shift);put(p,'chest',0,hip+.54,shift+lean*.48);put(p,'neck',0,hip+.80,shift+lean*.75);put(p,'head',0,hip+1.00,shift+lean*.88);p.spine=lean;
 for(const s of ['L','R']){const sign=s==='L'?-1:1;put(p,'H'+s,sign*.13,hip-.02,shift);put(p,'K'+s,sign*.14,.56,shift+.18*Math.max(0,(1.03-hip)*2));put(p,'A'+s,sign*.14,.12,shift);put(p,'T'+s,sign*.14,.06,shift+.19);put(p,'S'+s,sign*.23,hip+.63,shift+lean*.48);put(p,'E'+s,sign*.32,hip+.30,shift+lean*.48);put(p,'W'+s,sign*.35,hip+.04,shift+lean*.48);put(p,'hand'+s,sign*.36,hip+.015,shift+lean*.48);put(p,'weight'+s,sign*.36,hip+.01,shift+lean*.48)}
}
function setArm(p,s,elbow,wrist){put(p,'E'+s,...elbow);put(p,'W'+s,...wrist);put(p,'hand'+s,wrist[0],wrist[1]-.035,wrist[2]+.07);put(p,'weight'+s,wrist[0],wrist[1]-.08,wrist[2]+.05)}
function blendPose(a,b,t){const p={};for(const k in a){if(Array.isArray(a[k]))p[k]=a[k].map((x,i)=>x+(b[k][i]-x)*t);else p[k]=a[k]+(b[k]-a[k])*t}return p}
function smoother(x){x=Math.max(0,Math.min(1,x));return x*x*(3-2*x)}
function cycleRamp(t){return .5-.5*Math.cos(2*Math.PI*t)}
function sidePose(id,t){const p=basePose(),f=cycleRamp(t),wave=Math.sin(2*Math.PI*t),ab=Math.abs(wave),side=wave>=0?'L':'R';
 if(['squat','air','sit'].includes(id)){
  if(id==='sit'){
   const seated=basePose();standing(seated,{hip:.70,shift:-.09,lean:-.03});put(seated,'chest',0,1.28,-.12);put(seated,'neck',0,1.54,-.12);put(seated,'head',0,1.75,-.12);for(const s of ['L','R']){const q=s==='L'?-1:1;put(seated,'K'+s,q*.14,.45,.31);put(seated,'A'+s,q*.14,.12,.34);put(seated,'T'+s,q*.14,.06,.51);put(seated,'S'+s,q*.23,1.36,-.1);setArm(seated,s,[q*.32,1.02,.02],[q*.33,.78,.27])}
   const ph=(t*4)%4;const stand=basePose();const leanPose=JSON.parse(JSON.stringify(seated));put(leanPose,'pelvis',0,.69,-.06);put(leanPose,'chest',0,1.24,-.01);put(leanPose,'neck',0,1.51,.01);put(leanPose,'head',0,1.72,.02);for(const ss of ['L','R']){const qq=ss==='L'?-1:1;put(leanPose,'S'+ss,qq*.23,1.28,-.01);put(leanPose,'E'+ss,qq*.34,1.02,.10);put(leanPose,'W'+ss,qq*.35,.79,.29);put(leanPose,'hand'+ss,qq*.36,.77,.35)}if(ph<1)return blendPose(seated,leanPose,smoother(ph));if(ph<2)return blendPose(leanPose,stand,smoother(ph-1));if(ph<3)return blendPose(stand,leanPose,smoother(ph-2));return blendPose(leanPose,seated,smoother(ph-3))
  }
  const depth=.21*f,hip=1.03-.26*f;standing(p,{hip,shift:-.08*f,lean:-.06*f});for(const s of ['L','R']){const q=s==='L'?-1:1;put(p,'K'+s,q*.15,.56-.06*f,.18+.25*f);put(p,'A'+s,q*.15,.12,.02);put(p,'T'+s,q*.15,.06,.21);put(p,'S'+s,q*.23,hip+.63,-.08*f);setArm(p,s,[q*.42,hip+.34,.05],[q*.48,hip+.18,.27])}p.spine=-.06*f;return p
 }
 if(id==='wallpush'||id==='incline'){
  const incline=id==='incline', top=basePose();
  const shoulderY=incline?1.58:1.64, hipY=incline?1.05:1.12, handY=incline?.91:1.37, handZ=incline?.86:1.34;
  put(top,'head',0,shoulderY+.13,.60);put(top,'neck',0,shoulderY+.04,.50);put(top,'chest',0,shoulderY-.1,.34);put(top,'pelvis',0,hipY,-.05);top.spine=0;
  for(const s of ['L','R']){const q=s==='L'?-1:1;put(top,'S'+s,q*.22,shoulderY,.36);put(top,'H'+s,q*.13,hipY,-.05);put(top,'K'+s,q*.14,.57,-.43);put(top,'A'+s,q*.14,.12,-.92);put(top,'T'+s,q*.14,.06,-.73);put(top,'W'+s,q*.22,handY,handZ);put(top,'E'+s,q*.22,handY+.12, .8);put(top,'hand'+s,q*.22,handY,handZ+.07)}
  const low=JSON.parse(JSON.stringify(top));for(const s of ['L','R']){const q=s==='L'?-1:1;put(low,'S'+s,q*.22,shoulderY-.12,.48);put(low,'E'+s,q*.25,handY+.02,1.06);put(low,'W'+s,q*.22,handY,handZ);put(low,'hand'+s,q*.22,handY,handZ+.07)}put(low,'head',0,shoulderY-.01,.69);put(low,'chest',0,shoulderY-.19,.45);put(low,'pelvis',0,hipY-.03,.0);return blendPose(top,low,f)
 }
 if(id==='calf'){
  const rise=.12*f;standing(p,{hip:1.03+rise});for(const s of ['L','R']){const q=s==='L'?-1:1;put(p,'A'+s,q*.14,.12+rise,0);put(p,'T'+s,q*.14,.06,.19);put(p,'K'+s,q*.14,.56+rise*.65,0)}return p
 }
 if(id==='bridge'){
  put(p,'head',0,.31,.89);put(p,'neck',0,.30,.64);put(p,'chest',0,.31,.35);put(p,'pelvis',0,.20+.38*f,0);p.spine=.3*f;
  for(const s of ['L','R']){const q=s==='L'?-1:1;put(p,'S'+s,q*.22,.30,.42);put(p,'E'+s,q*.28,.20,.08);put(p,'W'+s,q*.28,.12,-.18);put(p,'hand'+s,q*.28,.10,-.24);put(p,'H'+s,q*.13,.20+.38*f,0);put(p,'K'+s,q*.14,.57,-.39);put(p,'A'+s,q*.14,.12,-.75);put(p,'T'+s,q*.14,.06,-.56)}return p
 }
 if(id==='march'||id==='kneeup'){
  const lift=Math.max(0,wave)*.48,advance=side==='L'?Math.max(0,wave):Math.max(0,-wave);standing(p,{hip:1.03+.02*advance,shift:.02*wave});const s=side;
  put(p,'K'+s,s==='L'?-.15:.15,.56+lift,.18+advance*.2);put(p,'A'+s,s==='L'?-.15:.15,.12+lift*.62,.25+advance*.25);put(p,'T'+s,s==='L'?-.15:.15,.06+lift*.62,.43+advance*.25);
  const other=s==='L'?'R':'L';setArm(p,s,[s==='L'?-.35:.35,1.35,.05],[s==='L'?-.38:.38,1.55,.05]);setArm(p,other,[other==='L'?-.35:.35,1.30,-.04],[other==='L'?-.38:.38,1.48,-.08]);return p
 }
 if(id==='side'){
  const shift=.25*wave;standing(p,{shift});put(p,'KL',-.25,.55,.08);put(p,'KR',.25,.55,.08);put(p,'AL',-.34,.12,0);put(p,'AR',.34,.12,0);put(p,'TL',-.34,.06,.19);put(p,'TR',.34,.06,.19);for(const s of ['L','R']){const q=s==='L'?-1:1;put(p,'E'+s,q*.48,1.47,0);put(p,'W'+s,q*.57,1.50,.02);put(p,'hand'+s,q*.62,1.5,.08)}return p
 }
 if(id==='deadbug'){
  put(p,'head',0,.31,.94);put(p,'neck',0,.30,.72);put(p,'chest',0,.29,.4);put(p,'pelvis',0,.24,0);p.spine=0;
  for(const s of ['L','R']){const q=s==='L'?-1:1;put(p,'S'+s,q*.22,.30,.43);put(p,'E'+s,q*.34,.22,.20);put(p,'W'+s,q*.38,.13,.02);put(p,'hand'+s,q*.38,.10,-.05);put(p,'H'+s,q*.13,.24,0);put(p,'K'+s,q*.15,.53,-.23);put(p,'A'+s,q*.15,.24,-.45);put(p,'T'+s,q*.15,.19,-.54)}const moving=wave>0?'L':'R';const q=moving==='L'?-1:1;put(p,'K'+moving,q*.15,.52,-.23-.15*ab);put(p,'A'+moving,q*.15,.13+.3*(1-ab),-.57-.1*ab);put(p,'T'+moving,q*.15,.06+.3*(1-ab),-.66-.1*ab);return p
 }
 if(id==='bird'||id==='cat'){
  put(p,'head',0,.96,.59);put(p,'neck',0,.85,.43);put(p,'chest',0,.69,.20);put(p,'pelvis',0,.65,-.34);p.spine=id==='cat'?wave*.16:0;
  for(const s of ['L','R']){const q=s==='L'?-1:1;put(p,'S'+s,q*.22,.70,.22);put(p,'E'+s,q*.22,.38,.35);put(p,'W'+s,q*.22,.12,.44);put(p,'hand'+s,q*.22,.09,.49);put(p,'H'+s,q*.13,.64,-.34);put(p,'K'+s,q*.14,.12,-.34);put(p,'A'+s,q*.14,.10,-.60);put(p,'T'+s,q*.14,.06,-.43)}
  if(id==='bird'){const moving=wave>0?'L':'R',opposite=moving==='L'?'R':'L',q=moving==='L'?-1:1,oq=-q;put(p,'W'+moving,q*.23,.58,.92);put(p,'hand'+moving,q*.23,.57,1.02);put(p,'K'+opposite,oq*.15,.46,-.92);put(p,'A'+opposite,oq*.15,.42,-1.15);put(p,'T'+opposite,oq*.15,.37,-1.28)}
  return p
 }
 if(id==='row'){
  standing(p);for(const s of ['L','R']){const q=s==='L'?-1:1;const reach=.15+.46*(1-f);setArm(p,s,[q*.34,1.38,.24+.12*(1-f)],[q*.34,1.34,reach]);}return p
 }
 if(id==='hinge'){
  const lean=.24+.35*f;standing(p,{hip:1.03,shift:-.12*f,lean});for(const s of ['L','R']){const q=s==='L'?-1:1;put(p,'K'+s,q*.14,.57,.12*f);put(p,'A'+s,q*.14,.12,0);setArm(p,s,[q*.34,1.35+lean*.35,lean*.7],[q*.36,1.00+lean*.45,lean*1.45]);}return p
 }
 if(id==='press'){
  standing(p);const y=1.72+.40*f;for(const s of ['L','R']){const q=s==='L'?-1:1;setArm(p,s,[q*(.40-.12*f),1.66+.13*f,.05],[q*(.42-.18*f),y,.05]);}return p
 }
 if(id==='curl'){
  standing(p);for(const s of ['L','R']){const q=s==='L'?-1:1;setArm(p,s,[q*.34,1.34,0],[q*.36,1.06+.43*f,.12*f]);}return p
 }
 if(id==='stretch'){
  standing(p);for(const s of ['L','R']){const q=s==='L'?-1:1;const a=2*Math.PI*t+(s==='L'?0:Math.PI);put(p,'E'+s,q*(.31+.08*Math.sin(a)),1.60+.08*Math.cos(a),.04);put(p,'W'+s,q*(.48+.14*Math.sin(a)),1.60+.14*Math.cos(a),.06);put(p,'hand'+s,q*(.54+.14*Math.sin(a)),1.60+.14*Math.cos(a),.08)}return p
 }
 if(id==='ankle'){
  standing(p);put(p,'AL',-.15,.12,.30);put(p,'TL',-.15,.06,.49);put(p,'KL',-.15,.59,.31+.24*f);put(p,'HL',-.13,1.02,.1);put(p,'AR',.15,.12,-.46);put(p,'TR',.15,.06,-.27);put(p,'KR',.15,.56,-.38);put(p,'HR',.13,1.02,-.05);for(const s of ['L','R'])setArm(p,s,[s==='L'?- .32:.32,1.35,.25],[s==='L'?-.30:.30,1.20,.82]);return p
 }
 if(id==='breath'){
  standing(p);const raise=.28*(.5-.5*Math.cos(2*Math.PI*t));for(const s of ['L','R']){const q=s==='L'?-1:1;put(p,'E'+s,q*(.34+.12*raise),1.45+.25*raise,0);put(p,'W'+s,q*(.40+.18*raise),1.34+.48*raise,0);put(p,'hand'+s,q*(.42+.18*raise),1.31+.49*raise,.04)}put(p,'chest',0,1.57+.015*raise,0);return p
 }
 if(id==='arms'){
  standing(p);const open=cycleRamp(t);for(const s of ['L','R']){const q=s==='L'?-1:1;put(p,'S'+s,q*.23,1.67,0);put(p,'E'+s,q*(.26+.28*open),1.55,0);put(p,'W'+s,q*(.26+.55*open),1.54,.02);put(p,'hand'+s,q*(.30+.60*open),1.53,.08)}return p
 }
 return p;
}
function updateRig(p){const s=rig.userData.seg;for(const side of ['L','R']){
  const sign=side==='L'?-1:1,S=v(p,'S'+side),E=v(p,'E'+side),W=v(p,'W'+side),H=v(p,'H'+side),K=v(p,'K'+side),A=v(p,'A'+side),T=v(p,'T'+side);
  s.shoulder[side].position.copy(S);link(s.sleeve[side],S.clone().lerp(E,.14),S.clone().lerp(E,.78));link(s.upperArm[side],S.clone().lerp(E,.32),S.clone().lerp(E,.91));s.elbow[side].position.copy(E);link(s.forearm[side],E.clone().lerp(W,.14),E.clone().lerp(W,.92));s.wrist[side].position.copy(W);
  const hand=v(p,'hand'+side);s.hand[side].position.copy(hand);const fingerOffsets=[-.036,-.012,.012,.036];s.fingers[side].forEach((f,i)=>{f.position.set(hand.x+fingerOffsets[i],hand.y-.074,hand.z+.009);f.rotation.z=sign*(i-1.5)*.07});s.thumb[side].position.set(hand.x-sign*.046,hand.y-.012,hand.z+.022);s.thumb[side].rotation.z=sign*.65;
  s.hip[side].position.copy(H);link(s.shortsLeg[side],H.clone().lerp(K,.07),H.clone().lerp(K,.40));link(s.thigh[side],H.clone().lerp(K,.34),H.clone().lerp(K,.94));s.knee[side].position.copy(K);link(s.shin[side],K.clone().lerp(A,.09),K.clone().lerp(A,.92));s.ankle[side].position.copy(A);
  const foot=T.clone().add(V(0,.075,.055));s.shoe[side].position.copy(foot);s.sole[side].position.copy(T).add(V(0,.018,.055));s.shoe[side].rotation.x=-.08;
  s.laces[side].forEach((l,i)=>{l.position.set(foot.x,foot.y+.037,foot.z+.035-i*.035)});
  s.weight[side].visible=['press','curl'].includes(activeId);s.weight[side].scale.set(.8,.14,.8);s.weight[side].position.copy(v(p,'weight'+side));s.weight[side].quaternion.setFromUnitVectors(V(0,1,0),v(p,'weight'+side).sub(W).normalize());
 }
 const head=v(p,'head');s.head.position.copy(head);s.hair.position.copy(head).add(V(0,.105,-.008));s.hairFringe.position.copy(head).add(V(0,.055,.107));for(let i=0;i<2;i++){const sign=i===0?-1:1;s.ears[i].position.copy(head).add(V(sign*.144,-.005,0));s.eyes[i].position.copy(head).add(V(sign*.052,.012,.125));s.pupils[i].position.copy(head).add(V(sign*.052,.01,.137));s.brows[i].position.copy(head).add(V(sign*.052,.053,.124));s.brows[i].rotation.z=sign*.1}
 s.nose.position.copy(head).add(V(0,-.016,.145));s.neck.position.copy(v(p,'neck'));s.collar.position.copy(v(p,'neck')).add(V(0,-.055,0));
 const chest=v(p,'chest'),pelvis=v(p,'pelvis'),spine=chest.clone().sub(pelvis);s.torso.position.copy(chest).lerp(pelvis,.43);s.torso.quaternion.setFromUnitVectors(V(0,1,0),spine.clone().normalize());s.torso.scale.set(.30,spine.length()*.51,.19);s.chest.position.copy(chest).lerp(pelvis,.21);s.chest.quaternion.copy(s.torso.quaternion);s.chest.scale.set(.285,spine.length()*.22,.19);s.pelvis.position.copy(pelvis);s.waistBand.position.copy(pelvis).add(V(0,.07,0));
}
function box(parent,w,h,d,material,x,y,z){return addMesh(parent,new THREE.BoxGeometry(w,h,d),material,V(x,y,z))}
function buildProps(id){if(props){scene.remove(props);props.traverse(o=>{if(o.geometry)o.geometry.dispose()})}props=new THREE.Group();
 const floorMat=makeMat('#e8ece9');const floor=addMesh(props,new THREE.PlaneGeometry(10,10),floorMat,V(0,0,0));floor.rotation.x=-Math.PI/2;floor.receiveShadow=true;
 if(id==='sit'||id==='squat'){box(props,.8,.09,.45,mat.prop,0,.49,-.05);box(props,.08,.46,.08,mat.prop,-.3,.25,-.05);box(props,.08,.46,.08,mat.prop,.3,.25,-.05);box(props,.75,.08,.08,mat.prop,0,.21,-.05)}
 if(id==='wallpush'||id==='ankle'){const w=box(props,2.5,3,.08,mat.wall,0,1.5,1.43);w.material=makeMat('#e4e9e8');}
 if(id==='incline'){box(props,1.25,.12,.46,mat.prop,0,.85,.82);box(props,.12,.85,.12,mat.prop,-.5,.42,.82);box(props,.12,.85,.12,mat.prop,.5,.42,.82);}
 if(['bridge','deadbug'].includes(id)){const m=addMesh(props,new THREE.PlaneGeometry(2.6,1.5),mat.mat,V(0,.015,0));m.rotation.x=-Math.PI/2;}
 if(id==='row'){for(const x of [-.22,.22]){const pole=box(props,.04,.8,.04,mat.prop,x,1.05,1.3);pole.rotation.x=.2;const line=new THREE.Line(new THREE.BufferGeometry().setFromPoints([V(x,1.3,1.3),V(x,1.3,.4)]),new THREE.LineBasicMaterial({color:'#e9a857'}));props.add(line)}}
 if(['press','curl'].includes(id)){const benchId=box(props,1.3,.1,.5,mat.prop,0,.5,-.65);if(activeId==='press')benchId.visible=false}
 scene.add(props);}
function init3D(){if(renderer)return true;const wrap=stage(),canvas=$('motionCanvas');if(!wrap||!canvas||!THREE)return false;try{
 scene=new THREE.Scene();scene.background=new THREE.Color('#dce5e0');scene.fog=new THREE.Fog('#dce5e0',7,13);camera=new THREE.PerspectiveCamera(32,1,.1,50);renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false});renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputEncoding=THREE.sRGBEncoding;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.92;
 scene.add(new THREE.HemisphereLight('#ffffff','#87928c',.72));const key=new THREE.DirectionalLight('#fff5e9',1.65);key.position.set(3,6,4);key.castShadow=true;key.shadow.mapSize.set(2048,2048);key.shadow.camera.left=-3;key.shadow.camera.right=3;key.shadow.camera.top=4;key.shadow.camera.bottom=-2;key.shadow.bias=-.00035;scene.add(key);const rim=new THREE.DirectionalLight('#c6dcff',.42);rim.position.set(-4,3,-3);scene.add(rim);
 const ground=new THREE.Mesh(new THREE.PlaneGeometry(30,30),makeMat('#cdd8d2'));ground.rotation.x=-Math.PI/2;ground.position.y=-.015;ground.receiveShadow=true;scene.add(ground);
 rig=createRig();ro=new ResizeObserver(resize3D);ro.observe(wrap);wrap.addEventListener('pointerdown',dragStart);wrap.addEventListener('pointermove',dragMove);wrap.addEventListener('pointerup',dragEnd);wrap.addEventListener('pointercancel',dragEnd);if(!frameHandle)renderer.setAnimationLoop(renderFrame);resize3D();return true
 }catch(e){initError=String(e&&e.message||e);console.warn('3D indisponível',e);return false}}
let drag=null;function dragStart(e){if(e.target.closest('button'))return;drag={x:e.clientX,t:theta};stage().setPointerCapture?.(e.pointerId)}function dragMove(e){if(drag){theta=drag.t+(e.clientX-drag.x)*.009;positionCamera()}}function dragEnd(){drag=null}
function positionCamera(){const r=4.2;camera.position.set(Math.sin(theta)*r,2.15,Math.cos(theta)*r);camera.lookAt(0,1.02,0)}function resize3D(){if(!renderer)return;const w=stage().clientWidth,h=stage().clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();positionCamera()}
function pictureFor(id,t,label,showArrow=false){const p=sidePose(id,t),project=(pose,k)=>{const q=pose[k];return [+(180+q[0]*58+q[2]*36).toFixed(1),+(215-q[1]*51).toFixed(1)]},xy=k=>project(p,k),line=(a,b,color,width,opacity)=>{const A=xy(a),B=xy(b);return '<line x1="'+A[0]+'" y1="'+A[1]+'" x2="'+B[0]+'" y2="'+B[1]+'" stroke="'+color+'" stroke-width="'+width+'" stroke-linecap="round" opacity="'+(opacity||1)+'"/>'},dot=(k,r,color)=>{const q=xy(k);return '<circle cx="'+q[0]+'" cy="'+q[1]+'" r="'+r+'" fill="'+color+'"/>'},parts=[];
 const chair=(id==='sit'||id==='squat')?'<path d="M94 157h76v9H94zm6 9v49m64-49v49m-64 0h64" fill="#be8154" stroke="#815535" stroke-width="4" stroke-linejoin="round"/>':'',wall=id==='wallpush'?'<path d="M274 28v187" stroke="#bac5c0" stroke-width="10"/>':'',bench=id==='incline'?'<path d="M225 153h82m-73 0v62m65-62v62" fill="none" stroke="#8b694d" stroke-width="10" stroke-linecap="round"/>':'',mat=['bridge','deadbug'].includes(id)?'<rect x="78" y="211" width="205" height="7" rx="3" fill="#d9e5de"/>':'';
 parts.push(chair,wall,bench,mat,'<ellipse cx="180" cy="215" rx="123" ry="5" fill="#e6ebe7"/>');
 for(const s of ['L','R']){const alpha=s==='L'?.62:1;parts.push(line('H'+s,'K'+s,'#263b36',17,alpha),dot('H'+s,8,'#34493e'),dot('K'+s,7,'#c98e68'),line('K'+s,'A'+s,'#253a35',12,alpha),dot('A'+s,5,'#d59c75'),line('A'+s,'T'+s,'#315849',11,alpha),line('S'+s,'E'+s,'#d39470',12,alpha),dot('S'+s,7,'#d39470'),dot('E'+s,5,'#d39470'),line('E'+s,'W'+s,'#d39470',10,alpha),dot('W'+s,4,'#d39470'),line('W'+s,'hand'+s,'#e2ae86',8,alpha))}
 const sl=xy('SL'),sr=xy('SR'),ch=xy('chest'),pel=xy('pelvis');parts.push('<path d="M'+sl[0]+' '+sl[1]+' Q'+(ch[0]-8)+' '+(ch[1]-8)+' '+ch[0]+' '+ch[1]+' Q'+(ch[0]+7)+' '+(ch[1]+8)+' '+sr[0]+' '+sr[1]+' L'+(pel[0]+10)+' '+pel[1]+' Q'+pel[0]+' '+(pel[1]+8)+' '+(pel[0]-10)+' '+pel[1]+' Z" fill="#dda840" stroke="#b97835" stroke-width="3" stroke-linejoin="round"/>');
 parts.push(line('chest','neck','#d39470',12),dot('neck',5,'#c88764'));
 const head=xy('head');parts.push('<circle cx="'+head[0]+'" cy="'+head[1]+'" r="13" fill="#e4ad85"/><path d="M'+(head[0]-12)+' '+(head[1]-4)+'q1-13 14-11q9 2 11 11q-7-4-14-4q-4 6-11 4" fill="#302724"/><circle cx="'+(head[0]+5)+'" cy="'+(head[1]+1)+'" r="1.5" fill="#342b27"/>');
 const start=sidePose(id,.02),candidates=['pelvis','chest','WL','WR','KL','KR','AL','AR'];let moved='pelvis',distance=0;for(const key of candidates){const a=project(start,key),b=xy(key),d=Math.hypot(b[0]-a[0],b[1]-a[1]);if(d>distance){distance=d;moved=key}}let arrow='';if(showArrow&&distance>7){const a=project(start,moved),b=xy(moved),cx=(a[0]+b[0])/2-(b[1]-a[1])*.2,cy=(a[1]+b[1])/2+(b[0]-a[0])*.2;arrow='<defs><marker id="motionArrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0L6 3L0 6" fill="none" stroke="#77a93b" stroke-width="1.5"/></marker></defs><path d="M'+a[0]+' '+a[1]+' Q'+cx+' '+cy+' '+b[0]+' '+b[1]+'" fill="none" stroke="#77a93b" stroke-width="3" stroke-dasharray="5 4" marker-end="url(#motionArrow)" opacity=".9"/>'}
 return '<svg viewBox="0 0 360 235" role="img" aria-label="'+label+'" xmlns="http://www.w3.org/2000/svg"><title>'+label+'</title><rect width="360" height="235" fill="#fff"/>'+parts.join('')+arrow+'<path d="M18 215H342" stroke="#a8b4ad" stroke-width="2"/></svg>'}
const illustrationSlugs={squat:'bodyweight-squat',air:'bodyweight-squat',wallpush:'wall-push-up',incline:'incline-push-up',deadbug:'dead-bug',bird:'bird-dog',bridge:'glute-bridge',cat:'cat-cow-stretch',stretch:'arm-circles',row:'banded-row',press:'standing-dumbbell-press'};
const illustrationCdn='https://cdn.jsdelivr.net/npm/@bryllim/workout-guide@1.0.0/assets/';
const illustrationRaw='https://raw.githubusercontent.com/bryllim/workout-guide/main/packages/workout-guide/assets/';
function illustrationKey(slug,index){return 'fitlivre_illustration_v5_'+slug+'_'+index}
function isSvgDocument(svg){if(typeof svg!=='string'||!svg.trim())return false;try{const doc=new DOMParser().parseFromString(svg,'image/svg+xml');return doc.documentElement?.localName==='svg'&&!doc.querySelector('parsererror')}catch{return false}}
function getCachedSvg(slug,index){try{const svg=localStorage.getItem(illustrationKey(slug,index));return isSvgDocument(svg)?svg:null}catch{return null}}
function storeSvg(slug,index,svg){if(!isSvgDocument(svg))return false;try{localStorage.setItem(illustrationKey(slug,index),svg);return true}catch{return false}}
function mountSvg(img,svg){try{const doc=new DOMParser().parseFromString(svg,'image/svg+xml');if(doc.documentElement?.localName!=='svg'||doc.querySelector('parsererror'))return false;const root=document.importNode(doc.documentElement,true);root.setAttribute('class','source-exercise-svg');root.setAttribute('role','img');root.setAttribute('aria-label',img.alt||'Demonstração do exercício');root.setAttribute('preserveAspectRatio','xMidYMid meet');root.querySelectorAll('script,foreignObject').forEach(node=>node.remove());root.querySelectorAll('*').forEach(node=>[...node.attributes].forEach(attr=>{if(/^on/i.test(attr.name))node.removeAttribute(attr.name)}));img.replaceWith(root);return true}catch{return false}}
async function fetchSvg(slug,index){const path=slug+'/frame-'+index+'.svg';for(const base of [illustrationCdn,illustrationRaw]){try{const response=await fetch(base+path,{mode:'cors',cache:'no-cache'});if(!response.ok)continue;const svg=await response.text();if(!isSvgDocument(svg))continue;if(!storeSvg(slug,index,svg))return null;return svg}catch{}}return null}
async function cacheAllIllustrations(){const button=$('cacheIllustrations'),status=$('illustrationCacheStatus');if(button)button.disabled=true;const assets=[...new Set(Object.values(illustrationSlugs))].flatMap(slug=>[1,2,3].map(index=>({slug,index})));if(status)status.textContent='Baixando '+assets.length+' quadros licenciados… mantenha o app aberto.';let saved=0;await Promise.all(assets.map(async item=>{if(getCachedSvg(item.slug,item.index)||await fetchSvg(item.slug,item.index))saved++}));if(status)status.textContent=saved===assets.length?'Todas as imagens foram salvas. As demonstrações ficam disponíveis sem internet neste navegador.':saved?saved+' de '+assets.length+' quadros salvos. Conecte-se e tente novamente para completar.':'Não foi possível baixar as imagens. Verifique a conexão e tente novamente.';if(button)button.disabled=false;return saved===assets.length}
async function loadStoryImage(img,slug,index){const cached=getCachedSvg(slug,index);if(cached&&mountSvg(img,cached))return true;const svg=await fetchSvg(slug,index);if(svg&&mountSvg(img,svg))return true;img.src=illustrationCdn+slug+'/frame-'+index+'.svg';return false}function renderStoryboard(id){const names=['COMEÇO','MOVIMENTO','VOLTA'],labels=phaseNames[id]||phaseNames.squat,cues=phaseCues[id]||phaseCues.squat,slug=illustrationSlugs[id],container=$('motionStoryboard');if(!slug){container.innerHTML='<div class="story-unavailable"><strong>Ilustração não encontrada para este movimento</strong><p>Para não ensinar uma variação diferente, não exibimos uma imagem aproximada. Siga as instruções e consulte um profissional se tiver dúvidas.</p></div>';return}container.innerHTML=names.map((name,i)=>'<figure class="story-frame"><div class="story-visual"><img class="source-exercise-frame" alt="'+name+': '+labels[i]+'" loading="eager" onerror="if(!this.dataset.fallback){this.dataset.fallback=\'1\';this.src=\'https://raw.githubusercontent.com/bryllim/workout-guide/main/packages/workout-guide/assets/'+slug+'/frame-'+(i+1)+'.svg\'}else{this.hidden=true;this.parentElement.classList.add(\'image-unavailable\')}"><span class="image-unavailable-note">Imagem indisponível<br>Conecte-se para baixar</span></div><figcaption class="story-caption"><span class="story-number">'+(i+1)+'</span><div><strong>'+name+'</strong><p>'+cues[i]+'</p></div></figcaption></figure>'+(i<2?'<div class="story-arrow" aria-hidden="true">→</div>':'')).join('');container.querySelectorAll('.source-exercise-frame').forEach((img,i)=>loadStoryImage(img,slug,i+1))}function exerciseDuration(id=activeId){return id==='sit'?8:id==='breath'?7.5:6.2}function phaseIndex(t){return t<.12?0:t<.68?1:2}function phaseSample(id,index){return id==='sit'?[.02,.48,.88][index]:index===0?.02:index===1?.50:.98}function updateTimeline(t){const labels=phaseNames[activeId]||phaseNames.squat,index=manualStep===null?phaseIndex(t):manualStep;$('motionPhase').textContent=labels[index];$('motionStepTitle').textContent=labels[index];$('motionStepCue').textContent=phaseCues[activeId][index];$('motionStepCount').textContent=`ETAPA ${index+1} DE 3`;document.querySelectorAll('[data-motion-step]').forEach(b=>{const active=+b.dataset.motionStep===index;b.classList.toggle('active',active);b.setAttribute('aria-pressed',active?'true':'false')});$('motionPrev').disabled=index===0;$('motionNext').textContent=index===2?'Voltar ao começo':'Próxima etapa →';$('motionProgress').style.width=`${(index+1)*100/3}%`}
function renderFrame(now){if(!$('demoModal')?.classList.contains('open'))return;if(!renderer||!rig)return;try{const dt=last?Math.min(.06,(now-last)/1000):0;last=now;if(playing)elapsed+=dt;const duration=exerciseDuration();const t=manualStep===null?(elapsed/duration)%1:phaseSample(activeId,manualStep);updateRig(sidePose(activeId,t));positionCamera();renderer.render(scene,camera);updateTimeline(t)}catch(e){playing=false;showFallback('Falha ao desenhar a animação: '+String(e&&e.message||e));console.error(e)}}
function setExercise(id){activeId=id;playing=false;manualStep=0;$('mediaLoading').style.display='none';$('mediaFallback').style.display='none';$('exerciseGif').style.display='none';$('mediaStage').style.display='none';$('customDemo').style.display='none';$('motionLesson').style.display='none';$('motion3dControls').style.display='none';$('motionStoryboard').classList.add('is-visible');$('coachLabel').textContent='SEQUÊNCIA ILUSTRADA · 3 POSIÇÕES';renderStoryboard(id)}
function showFallback(msg){$('mediaFallback').textContent=msg;$('mediaFallback').style.display='grid'}
function toggle(){playing=!playing;if(playing&&manualStep!==null){elapsed=phaseSample(activeId,manualStep)*exerciseDuration();manualStep=null}last=0;$('motionToggle').textContent=playing?'Pausar movimento':'Reproduzir movimento'}function setStep(i){const index=Math.max(0,Math.min(2,i));playing=false;manualStep=index;elapsed=phaseSample(activeId,index)*exerciseDuration();last=0;$('motionToggle').textContent='Reproduzir movimento';updateRig(sidePose(activeId,phaseSample(activeId,index)));updateTimeline(phaseSample(activeId,index))}function reset(){theta=.12;positionCamera()}
window.FitLivreMotion={setExercise,toggle,reset,setStep,cacheImages:cacheAllIllustrations,stop(){playing=false;last=0},resume(){playing=true;last=0}};
function bindControls(){$('motionToggle')?.addEventListener('click',toggle);$('motionView')?.addEventListener('click',reset);document.querySelectorAll('[data-motion-step]').forEach(b=>b.addEventListener('click',()=>setStep(+b.dataset.motionStep)));$('motionPrev')?.addEventListener('click',()=>setStep((manualStep===null?phaseIndex((elapsed/exerciseDuration())%1):manualStep)-1));$('motionNext')?.addEventListener('click',()=>{const i=manualStep===null?phaseIndex((elapsed/exerciseDuration())%1):manualStep;setStep(i===2?0:i+1)})}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bindControls,{once:true});else bindControls();
})();
