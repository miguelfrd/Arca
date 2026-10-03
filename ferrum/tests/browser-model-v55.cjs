// Modelo de navegador aislado: DOM mínimo e IndexedDB con transacciones y rollback.
const vm = require('node:vm'), fs = require('node:fs'), path = require('node:path');
const { webcrypto } = require('node:crypto');
function indexedDBModel(databases) {
  return { open(name) {
    const request = {};
    setImmediate(() => {
      const fresh = !databases.has(name);
      if (fresh) databases.set(name, { stores: new Map(), queue: Promise.resolve() });
      const data = databases.get(name);
      const connection = {
        get objectStoreNames() { const names = [...data.stores.keys()]; names.contains = n => names.includes(n); return names; },
        createObjectStore(n, {keyPath}) { data.stores.set(n,{keyPath,rows:new Map()});return {createIndex(){}}; }, close() {},
        transaction(names, mode = 'readonly') {
          const list = Array.isArray(names) ? names : [names];
          const tx = { error:null, commands:[], aborted:false, abort(){this.aborted=true;}, objectStore(n) {
            if(!list.includes(n)||!data.stores.has(n))throw Error('Missing object store');
            const command = (kind,value) => {const r={};tx.commands.push({n,kind,value:structuredClone(value),r});return r;};
            return {get:k=>command('get',k),getAll:()=>command('all'),put:v=>command('put',v),delete:k=>command('delete',k),clear:()=>command('clear')};
          }};
          data.queue = data.queue.then(()=>new Promise(done=>{
            const working = new Map(list.map(n=>[n,structuredClone(data.stores.get(n))]));
            const step = () => {
              try {
                if(tx.aborted)throw Error('Transaction aborted');
                const c=tx.commands.shift();
                if(!c){if(mode==='readwrite')for(const [n,s]of working)data.stores.set(n,s);tx.oncomplete?.();done();return;}
                const store=working.get(c.n);
                if(c.kind==='get')c.r.result=structuredClone(store.rows.get(c.value));
                if(c.kind==='all')c.r.result=structuredClone([...store.rows.values()]);
                if(c.kind==='put')store.rows.set(c.value[store.keyPath],c.value);
                if(c.kind==='delete')store.rows.delete(c.value);
                if(c.kind==='clear')store.rows.clear();
                c.r.onsuccess?.();setImmediate(step);
              } catch(error){tx.error=error;tx.onerror?.();tx.onabort?.();done();}
            };setImmediate(step);
          }));
          return tx;
        }
      };
      request.result=connection;
      if(fresh)request.onupgradeneeded?.();request.onsuccess?.();
    });
    return request;
  }};
}
function createPhone(root, fetch) {
  const databases=new Map(), values=new Map();let context,modules;
  const reset=()=>{
    class Storage {
      getItem(k){return values.get(String(k))??null;}
      setItem(k,v){k=String(k);values.set(k,String(v));Object.defineProperty(this,k,{value:String(v),writable:true,configurable:true,enumerable:true});}
      clear(){for(const k of [...values.keys()])this.removeItem(k);}
      removeItem(k){values.delete(String(k));delete this[k];}
      key(i){return [...values.keys()][i]??null;}get length(){return values.size;}
    }
    const storage=new Storage();for(const [k,v]of values)storage.setItem(k,v);
    const win=new EventTarget();
    class Node extends EventTarget {
      constructor(){super();this.nodes=new Map();this.children=[];this.isConnected=false;this.checked=false;this.disabled=false;}
      set innerHTML(value){this.html=value;this.nodes.clear();}get innerHTML(){return this.html||'';}
      querySelector(selector){if(!this.nodes.has(selector))this.nodes.set(selector,new Node());return this.nodes.get(selector);}
      append(...nodes){for(const node of nodes){node.isConnected=true;this.children.push(node);}}
      setAttribute(){}showModal(){}close(){this.dispatchEvent(new Event('close'));}remove(){this.isConnected=false;}
    }
    const body=new Node();

    context=vm.createContext({console,crypto:webcrypto,Blob,Headers,Request,Response,URL,TextEncoder,TextDecoder,AbortController,Event,CustomEvent:class extends Event{},URLSearchParams,Storage,localStorage:storage,sessionStorage:new Storage(),navigator:{onLine:true,clipboard:{async writeText(){}}},document:{body,createElement:()=>new Node(),hidden:true,addEventListener(){},querySelector(){return null;}},location:{hash:'',reload(){}},fetch,indexedDB:indexedDBModel(databases),setTimeout:()=>0,clearTimeout(){},setInterval:()=>0,clearInterval(){},addEventListener:win.addEventListener.bind(win),dispatchEvent:win.dispatchEvent.bind(win)});
    context.window=context;modules=new Map();
  };
  const get=async file=>{
    file=path.resolve(file);if(modules.has(file))return modules.get(file);
    const mod=new vm.SourceTextModule(fs.readFileSync(file,'utf8'),{context,identifier:file,initializeImportMeta(meta){meta.url='http://localhost/ui/'+path.basename(file);},importModuleDynamically:async(spec,parent)=>{
      const child=await get(resolve(spec,parent));if(child.status==='unlinked')await child.link(link);if(child.status==='linked')await child.evaluate();return child;
    }});modules.set(file,mod);return mod;
  };
  const resolve=(spec,parent)=>spec.startsWith('/')?path.join(root,spec):path.resolve(path.dirname(parent.identifier),spec);
  const link=(spec,parent)=>get(resolve(spec,parent));reset();
  return {async evaluate(fn,arg){context.__argument=arg;return vm.runInContext('('+fn.toString()+')(__argument)',context,{importModuleDynamically:async spec=>{const mod=await get(path.join(root,spec));if(mod.status==='unlinked')await mod.link(link);if(mod.status==='linked')await mod.evaluate();return mod;}});},async reload(){reset();}};
}
module.exports={createPhone};
