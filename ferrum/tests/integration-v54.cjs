const vm=require('node:vm'),fs=require('node:fs'),path=require('node:path'),{webcrypto}=require('node:crypto');
// Ejecutar: node --experimental-vm-modules ferrum/tests/integration-v54.cjs
// DOM mínimo y API/almacenamiento simulados: no sustituye una prueba E2E.
const root=path.resolve(__dirname,'..');
const dummy={innerHTML:'',style:{setProperty(){},removeProperty(){}},classList:{add(){},remove(){},toggle(){},contains(){return false}},querySelector(){return null},querySelectorAll(){return []},addEventListener(){},append(){},appendChild(){},setAttribute(){},remove(){},relList:{supports(){return true}},getBoundingClientRect(){return {width:300,left:0}},dataset:{}};
const document={createElement:()=>({...dummy}),getElementById:()=>dummy,querySelector:()=>null,querySelectorAll:()=>[],documentElement:{...dummy},addEventListener(){},head:{append(){}},body:{append(){}},hidden:true};
const storage=new Map();const localStorage={getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,String(v)),removeItem:k=>storage.delete(k),key:i=>[...storage.keys()][i],get length(){return storage.size}};
const location={hash:'#/train',pathname:'/ferrum/',origin:'http://localhost',search:'?nosw'};
const context=vm.createContext({console,document,location,localStorage,sessionStorage:localStorage,navigator:{onLine:false},window:{matchMedia:()=>({matches:true,addEventListener(){}}),addEventListener(){},dispatchEvent(){},scrollTo(){}},crypto:webcrypto,URL,Blob,Headers,Request,Response,TextEncoder,TextDecoder,AbortController,Intl,Date,Event,CustomEvent:class extends Event{},setTimeout:()=>0,clearTimeout(){},setInterval:()=>0,clearInterval(){},requestAnimationFrame(){},MutationObserver:class{observe(){}},Storage:class{},URLSearchParams});
const modules=new Map();async function get(file){file=path.resolve(file);if(modules.has(file))return modules.get(file);let source=fs.readFileSync(file,'utf8');if(file.endsWith('/assets/index-CaX35N1u.js'))source=source.replace('Ye();function L()', 'function L()');const m=new vm.SourceTextModule(source,{context,identifier:file,initializeImportMeta(meta){meta.url='file://'+file},importModuleDynamically:async(spec,mod)=>{const child=await get(path.resolve(path.dirname(mod.identifier),spec));if(child.status==='unlinked')await child.link(link);if(child.status==='linked')await child.evaluate();return child}});modules.set(file,m);return m;}
const link=(spec,mod)=>get(path.resolve(path.dirname(mod.identifier),spec));
(async()=>{
for(const file of fs.readdirSync(root+'/ui').filter(x=>x.endsWith('.js')).map(x=>root+'/ui/'+x).concat(fs.readdirSync(root+'/assets').filter(x=>x.endsWith('.js')).map(x=>root+'/assets/'+x))){const m=await get(file);if(m.status==='unlinked')await m.link(link)}
console.log('STATIC MODULES LINKED',modules.size);
const entry=await get(root+'/assets/index-CaX35N1u.js');await entry.evaluate();
const ns=entry.namespace,db=ns.d;
const exercise={id:'audit-ex',nameEs:'Press auditado',primaryMuscle:'Pecho',secondaryMuscles:[],equipment:'Barra',type:'strength',instructionsEs:'Controlar el movimiento.',isCustom:false};
const routine={id:'audit-routine',name:'Rutina auditada',dayOfWeek:1,folderId:null,exercises:[{exerciseId:exercise.id,sets:[]}],updatedAt:Date.now()};
const workout={id:'audit-workout',title:'Sesión auditada',startTime:Date.now()-3600000,endTime:Date.now(),exercises:[{exerciseId:exercise.id,sets:[{done:true,weightKg:20,reps:8,setType:'normal'}]}]};
const records={exercises:[exercise],routines:[routine],folders:[],workouts:[workout],measurements:[],progressPhotos:[],workoutPhotos:[],kv:[],programState:[],aliases:[]};
db.all=async name=>records[name]||[];db.get=async(name,id)=>(records[name]||[]).find(x=>(x.id||x.key||x.workoutId)===id);db.workoutsDesc=async()=>records.workouts;db.put=async()=>{};
const calls=[['train-BcyrzlLb.js','renderTrainHome','/train',''],['train-BcyrzlLb.js','renderActiveWorkout','/train/active',''],['routines-D_hnj1j8.js','renderRoutines','/routines',''],['yo-KhCrBFLb.js','renderYo','/yo',''],['exercises-CCB_5JFc.js','renderExercises','/exercises',''],['stats-pk7mYZrJ.js','renderStats','/stats','tab=global'],['stats-pk7mYZrJ.js','renderStats','/stats','tab=exercise&ex=audit-ex'],['stats-pk7mYZrJ.js','renderStats','/stats','tab=felicidad'],['measures-Dv90eRs6.js','renderMeasures','/measures',''],['more-DOSpxVl3.js','renderMore','/more','']];
for(const [file,fn,route,query] of calls){const m=await get(root+'/assets/'+file);await m.evaluate();const view={...dummy,innerHTML:''};location.hash='#'+route;try{await m.namespace[fn](view,new URLSearchParams(query));if(/undefined|Algo falló/.test(view.innerHTML+dummy.innerHTML))throw Error('Contenido inválido');console.log('PLANTILLA DOM SIMULADO',route,query,'OK')}catch(e){throw Error(route+' '+query+': '+e.message)}}
context.window.__ferrum={db,go:ns.g,toast:ns.t,confirmDlg:ns.c,esc:ns.e,getActive:ns.l,setActive:ns.s,workoutVolume:ns.w,workoutSets:ns.h};
const platform=await get(root+'/ui/platform-v2.js');await platform.evaluate();
Object.defineProperty(platform.namespace.db,'hookMarker',{value:true});if(platform.namespace.db.hookMarker!==true)throw Error('Proxy marker not readable');
let written=0;platform.namespace.db.put=async()=>written++;await db.put();if(written!==1)throw Error('Hook not forwarded');console.log('PROXY hooks and marker OK');
const feed=await get(root+'/ui/feed-v2.js');await feed.evaluate();for(const post of [{...workout,localId:workout.id,author:{nickname:'Auditor'},exercises:[{name:'Press',sets:[]}]},{id:'invalid',endTime:'invalid',satisfaction:'<img src=x onerror=alert(1)>',fatigue:NaN,exercises:[{name:'Sin series'}]}]){const html=feed.namespace.postCard(post,{own:true});if(/undefined|NaN|onerror=/.test(html))throw Error('Feed not safe');}console.log('FEED valid/invalid date, missing sets and ratings OK');
const storeModule=await get(root+'/ui/social-store-v2.js');await storeModule.evaluate();const store=storeModule.namespace.socialStore,memory=new Map(),jobs=new Map();
store.get=async k=>memory.get(k);store.set=async(k,v)=>memory.set(k,v);store.remove=async k=>memory.delete(k);store.setAll=async values=>{for(const [k,v] of Object.entries(values))memory.set(k,v)};
store.jobs=async()=>[...jobs.values()];store.putJob=async j=>jobs.set(j.localId,j);store.removeJob=async(id,revision)=>{if(jobs.get(id)?.revision===revision)jobs.delete(id)};store.removeMatchingRevision=async(k,revision)=>{if(memory.get(k)?.revision===revision)memory.delete(k)};
let server={profile:{id:'account-audit',nickname:'Auditor',sharing:false,recoveryReady:true},members:[{id:'person-out',nickname:'Uno'},{id:'person-in',nickname:'Dos'}],relationships:[{id:'incoming',state:'pending',incoming:true,person:{id:'person-in',nickname:'Dos'}}],posts:[]},networkFailure=false;const requests=[];
context.navigator.onLine=true;
context.fetch=async(url,options={})=>{
 if(String(url).endsWith('/social-config.json'))return Response.json({apiBase:'https://audit.invalid'});
 const endpoint=new URL(url).pathname.replace('/v1','');requests.push({endpoint,method:options.method,body:typeof options.body==='string'?JSON.parse(options.body):null});
 if(endpoint==='/invites/preview')return Response.json({message:'Invitación caducada',code:'expired'},{status:410});
 if(endpoint==='/capabilities'){if(networkFailure)throw Error('offline');return Response.json({privateBackup:1,accountSecurity:1})}
 if(endpoint==='/profile')server.profile={...server.profile,...JSON.parse(options.body)};
 if(endpoint==='/requests'){const {personId}=JSON.parse(options.body);server.relationships.push({id:'outgoing',state:'pending',incoming:false,person:{id:personId,nickname:'Uno'}})}
 if(endpoint==='/requests/incoming/accept')server.relationships=server.relationships.map(x=>x.id==='incoming'?{...x,state:'accepted'}:x);
 if(endpoint==='/posts')return Response.json({id:'published-audit'});
 return Response.json(server);
};
const social=await get(root+'/ui/social-v2.js');await social.evaluate();await social.namespace.initialize(platform.namespace.db,{workoutVolume:ns.w,workoutSets:ns.h});
await social.namespace.join({nickname:'Auditor',invite:[...webcrypto.getRandomValues(new Uint8Array(32))].map(x=>x.toString(16).padStart(2,'0')).join('')});
await social.namespace.saveSelection(['person-out','person-in']);await social.namespace.completeOnboarding();await social.namespace.synchronize();
const outgoing=requests.filter(x=>x.endpoint==='/requests');if(outgoing.length!==1||outgoing[0].body.personId!=='person-out'||requests.some(x=>x.endpoint.endsWith('/accept')))throw Error('Onboarding accepted a friendship implicitly');
await social.namespace.action('/requests/incoming/accept',{});if(server.relationships.find(x=>x.id==='incoming').state!=='accepted')throw Error('Individual acceptance failed');
try{await social.namespace.previewInvitation('invalid');throw Error('Expired invitation accepted')}catch(e){if(e.status!==410)throw e}
console.log('SOCIAL selection, one outgoing request, explicit incoming acceptance and expired invite rejection OK');
const friends=await get(root+'/ui/friends-v2.js');await friends.evaluate();
const friendBody={...dummy,value:'',querySelector(selector){return ['#fui-join','.fui-social-panels','.fui-no-search'].includes(selector)?null:this;}};
const friendView={...dummy,isConnected:true,querySelector:()=>friendBody};location.hash='#/friends';await friends.namespace.renderFriends(friendView);
if(/undefined|Algo falló/.test(friendView.innerHTML+friendBody.innerHTML))throw Error('Friends generated invalid content');friends.namespace.stopFriendView();console.log('AMIGOS plantilla con estado simulado OK');

await db.put('workouts',workout);if(!jobs.has(workout.id))throw Error('Bundle write did not enqueue social upload');console.log('BUNDLE -> SOCIAL outbox hook OK');
networkFailure=true;const cloud=await get(root+'/ui/cloud-v2.js');await cloud.evaluate();await cloud.namespace.initializeCloud(platform.namespace.db);await cloud.namespace.synchronizeCloud();
if(cloud.namespace.cloudSnapshot().status!=='offline')throw Error('Capability connection failure reported as unavailable');
networkFailure=false;await cloud.namespace.synchronizeCloud();if(cloud.namespace.cloudSnapshot().status!=='needs-code')throw Error('Existing account did not require recovery key');
await db.put('routines',routine);if(!memory.get('cloud-dirty'))throw Error('Bundle write did not mark cloud copy dirty');console.log('CLOUD connection failure, recovery key required and bundle dirty hook OK');

})().catch(e=>{console.error(e);process.exitCode=1});
