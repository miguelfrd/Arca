import { api, snapshot } from './social-v2.js';
import { rotateRecovery, recoveryCode, markRecoverySaved, reconnectKey } from './cloud-v2.js';
import { toast } from './platform-v2.js';

function dialog(title) {
  const node=document.createElement('dialog'); node.className='fui-profile-dialog';
  node.innerHTML='<div class="fui-dialog-head"><h2></h2><button class="icon-btn ghost" data-close aria-label="Cerrar">×</button></div><div data-content></div><p class="fui-form-error" role="alert"></p>';
  node.querySelector('h2').textContent=title;
  node.querySelector('[data-close]').onclick=()=>node.close();
  node.addEventListener('close',()=>node.remove(),{once:true}); document.body.append(node); node.showModal(); return node;
}
async function showDevices() {
  const node=dialog('Dispositivos conectados'),body=node.querySelector('[data-content]');
  const paint=async()=>{
    body.textContent='Comprobando accesos…';
    const {devices}=await api('/account/devices'); body.replaceChildren();
    const intro=document.createElement('p'); intro.textContent='Revocar impide volver a usar el servidor desde ese dispositivo. No borra datos que ya tenga guardados.';body.append(intro);
    for(const device of devices) {
      const row=document.createElement('div'); row.className='fui-device-row';
      const label=document.createElement('strong');label.textContent=device.label+(device.current?' · Este dispositivo':'');
      const detail=document.createElement('p');detail.className='small muted';
      detail.textContent=device.revokedAt?'Acceso revocado':device.expiresAt<Date.now()?'Acceso caducado':device.lastSeen?'Última actividad: '+new Date(device.lastSeen).toLocaleString('es-ES'):'Sin actividad reciente';
      row.append(label,detail);
      if(!device.revokedAt) {
        const rename=document.createElement('button');rename.className='btn secondary';rename.textContent='Cambiar nombre';
        rename.onclick=async()=>{const value=prompt('Nombre de este dispositivo',device.label);if(!value?.trim())return;rename.disabled=true;try{await api('/account/devices/'+device.id,{method:'PATCH',body:{label:value.trim()}});await paint();}catch(e){node.querySelector('[role=alert]').textContent=e.message;rename.disabled=false;}};row.append(rename);
        if(!device.current) {
          const revoke=document.createElement('button');revoke.className='btn secondary';revoke.textContent='Revocar acceso';
          revoke.onclick=async()=>{if(!confirm('¿Revocar este dispositivo? Sus datos locales se conservarán. Si también perdió el código de recuperación, renueva ese código.'))return;revoke.disabled=true;try{await api('/account/devices/'+device.id,{method:'DELETE'});await paint();}catch(e){node.querySelector('[role=alert]').textContent=e.message;revoke.disabled=false;}};row.append(revoke);
        }
      }
      body.append(row);
    }
    const all=document.createElement('button');all.className='btn secondary';all.textContent='Cerrar todos los otros dispositivos';
    all.onclick=async()=>{if(!confirm('¿Cerrar todos los otros dispositivos? Este seguirá conectado.'))return;all.disabled=true;try{await api('/account/devices/revoke-others',{method:'POST',body:{}});await paint();}catch(e){node.querySelector('[role=alert]').textContent=e.message;all.disabled=false;}};body.append(all);
    const note=document.createElement('p');note.className='small muted';note.textContent='Los accesos caducan tras 90 días sin actividad. El código de recuperación permite volver a conectar.';body.append(note);
  };
  try{await paint();}catch(e){body.textContent='No se pudieron consultar los dispositivos.';node.querySelector('[role=alert]').textContent=e.message;}
}
export function renderAccountSecurity(card) {
  if(!snapshot().identity?.registered)return;
  const section=document.createElement('div');section.className='fui-account-security';
  section.innerHTML='<h3>Seguridad de tu cuenta</h3><div class="fui-cloud-actions"><button class="btn secondary" data-devices>Dispositivos conectados</button><button class="btn secondary" data-renew>Renovar código de recuperación</button><button class="btn secondary" data-reconnect>Reconectar este dispositivo</button></div><p class="small muted">Puedes cerrar accesos y renovar la llave de tu cuenta sin perder tu historial.</p>';
  card.append(section);section.querySelector('[data-devices]').onclick=showDevices;
  section.querySelector('[data-renew]').onclick=()=>{
    const node=dialog('Renovar recuperación'),body=node.querySelector('[data-content]');
    body.innerHTML='<p>El código anterior dejará de permitir el acceso. Se cerrarán los otros dispositivos y se cifrará una nueva copia con una clave nueva. Las versiones anteriores seguirán disponibles con el código nuevo.</p><p class="small muted">No puede borrar datos que alguien ya haya descargado. Guarda el código nuevo fuera de Ferrum.</p><button class="btn" data-confirm>Renovar y cerrar otros dispositivos</button>';
    body.querySelector('[data-confirm]').onclick=async event=>{
      event.currentTarget.disabled=true;node.querySelector('[role=alert]').textContent='Preparando y guardando la nueva copia…';
      try{
        await rotateRecovery();const code=await recoveryCode();body.replaceChildren();
        const text=document.createElement('p');text.textContent='Código renovado. Este es el único código válido para recuperar tu cuenta. Guárdalo fuera de Ferrum.';
        const input=document.createElement('textarea');input.readOnly=true;input.rows=5;input.value=code;input.setAttribute('aria-label','Nuevo código de recuperación');
        const copy=document.createElement('button');copy.className='btn';copy.textContent='Copiar código nuevo';
        copy.onclick=async()=>{try{await navigator.clipboard.writeText(code);await markRecoverySaved();toast('Código copiado. Guárdalo fuera de Ferrum.');}catch{input.select();toast('Selecciona y copia el código');}};
        body.append(text,input,copy);node.querySelector('[role=alert]').textContent='';
      }catch(e){node.querySelector('[role=alert]').textContent=e.message;const button=body.querySelector('[data-confirm]');if(button)button.disabled=false;}
    };
  };
  section.querySelector('[data-reconnect]').onclick=()=>{
    const node=dialog('Reconectar este dispositivo'),body=node.querySelector('[data-content]');
    body.innerHTML='<p>Introduce el código de recuperación actual de esta cuenta. Los entrenamientos locales se conservarán; si hay cambios de otro móvil, Ferrum te pedirá revisar las copias.</p><form><label class="f">Código de recuperación<textarea name="code" required rows="5" spellcheck="false" autocomplete="off"></textarea></label><button class="btn">Reconectar</button></form>';
    body.querySelector('form').onsubmit=async event=>{event.preventDefault();const form=event.currentTarget,button=form.querySelector('button');button.disabled=true;try{await reconnectKey(form.elements.code.value);node.close();toast('Acceso conectado');}catch(e){node.querySelector('[role=alert]').textContent=e.message;button.disabled=false;}};
  };
}
