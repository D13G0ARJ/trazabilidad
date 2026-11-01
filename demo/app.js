/* ============================================================
   CSLogi · Trazabilidad — aplicación de demostración
   ============================================================ */

/* ---------- Reloj simulado ---------- */
const T0_REAL = Date.now();
const T0_SIM  = new Date('2026-10-23T14:30:00').getTime();
const ahora = () => new Date(T0_SIM + (Date.now() - T0_REAL));

/* ---------- Estado ---------- */
const S = {
  autenticado: false,
  usuario: USUARIOS[3],          // Cesar Simón, admin
  vista: 'inicio',
  gestionId: null,
  filtro: { q: '', tipo: '', estado: '' },
  reporte: { modo: 'barras', cliente: '', desde: '2026-10-01', hasta: '2026-10-31' },
  bitacora: [],
  correos: [],
  nueva: null,
  tema: (() => { try { return localStorage.getItem('cslogi-tema') || 'light'; } catch { return 'light'; } })(),
};
document.documentElement.dataset.theme = S.tema;

const NAV = [
  { id: 'inicio',    label: 'Inicio',         ico: 'home',    roles: ['admin','empleado','soporte'] },
  { id: 'gestiones', label: 'Gestiones',      ico: 'folder',  roles: ['admin','empleado'] },
  { id: 'clientes',  label: 'Clientes',       ico: 'users',   roles: ['admin','empleado'] },
  { id: 'dashboard', label: 'Dashboard',      ico: 'grid',    roles: ['admin'] },
  { id: 'reportes',  label: 'Reportería',     ico: 'chart',   roles: ['admin'] },
  { id: 'asistencia',label: 'Asistencia',     ico: 'clock',   roles: ['admin','empleado','soporte'] },
  { id: 'config',    label: 'Configuración',  ico: 'cog',     roles: ['admin','soporte'] },
];

/* ---------- Iconos (SVG, trazo 1.5) ---------- */
const PATHS = {
  home:   '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/>',
  folder: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2.5h8a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  users:  '<circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5"/><path d="M16.5 5.3a3.2 3.2 0 0 1 0 5.9"/><path d="M18 14.9c2 .8 3 2.6 3 5.1"/>',
  grid:   '<rect x="3" y="3" width="7.5" height="7.5" rx="1.4"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="1.4"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="1.4"/><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.4"/>',
  chart:  '<path d="M4 20V10"/><path d="M10 20V4"/><path d="M16 20v-7"/><path d="M22 20H2"/>',
  clock:  '<circle cx="12" cy="12" r="9"/><path d="M12 7v5.2l3.4 2"/>',
  cog:    '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-2.9 1.2 2 2 0 1 1-4 0 1.7 1.7 0 0 0-2.9-1.2l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.7 1.7 0 0 0 3 15a2 2 0 1 1 0-4 1.7 1.7 0 0 0 1.2-2.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.7 1.7 0 0 0 10 4.6a2 2 0 1 1 4 0 1.7 1.7 0 0 0 2.9 1.2l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1A1.7 1.7 0 0 0 21 11a2 2 0 1 1 0 4z"/>',
  check:  '<path d="M20 6 9 17l-5-5"/>',
  play:   '<path d="M7 4.5 19 12 7 19.5z"/>',
  square: '<rect x="5.5" y="5.5" width="13" height="13" rx="1.6"/>',
  alert:  '<path d="M10.3 3.9 2.4 17.2A2 2 0 0 0 4.1 20h15.8a2 2 0 0 0 1.7-2.8L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
  dot:    '<circle cx="12" cy="12" r="3.4"/>',
  minus:  '<path d="M5 12h14"/>',
  undo:   '<path d="M3 7v6h6"/><path d="M3.5 13a9 9 0 1 0 2.2-7.3L3 9"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.6-3.6"/>',
  plus:   '<path d="M12 5v14"/><path d="M5 12h14"/>',
  sun:    '<circle cx="12" cy="12" r="4.2"/><path d="M12 2v2M12 20v2M4.9 4.9l1.5 1.5M17.6 17.6l1.5 1.5M2 12h2M20 12h2M4.9 19.1l1.5-1.5M17.6 6.4l1.5-1.5"/>',
  moon:   '<path d="M20.5 14.3A8.6 8.6 0 0 1 9.7 3.5a8.6 8.6 0 1 0 10.8 10.8z"/>',
  mail:   '<rect x="2.5" y="5" width="19" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  doc:    '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/>',
  down:   '<path d="M12 4v12"/><path d="m7 11 5 5 5-5"/><path d="M4 20h16"/>',
  back:   '<path d="M19 12H5"/><path d="m11 18-6-6 6-6"/>',
  eye:    '<path d="M2 12s3.8-6.5 10-6.5S22 12 22 12s-3.8 6.5-10 6.5S2 12 2 12z"/><circle cx="12" cy="12" r="2.8"/>',
  shield: '<path d="M12 2.5 4.5 5.8v5.4c0 4.6 3.1 8.9 7.5 10.3 4.4-1.4 7.5-5.7 7.5-10.3V5.8z"/><path d="m9.2 12 2 2 3.6-3.8"/>',
  info:   '<circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><path d="M12 8h.01"/>',
  lock:   '<rect x="4.5" y="10.5" width="15" height="10" rx="2"/><path d="M8 10.5V7a4 4 0 0 1 8 0v3.5"/>',
  logout: '<path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3"/><path d="M10 17l-5-5 5-5"/><path d="M5 12h11"/>',
  x:      '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
};
function ico(n, s = 16) {
  const fill = (n === 'play' || n === 'dot') ? 'currentColor' : 'none';
  return `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="${fill}" stroke="currentColor"
    stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${PATHS[n] || ''}</svg>`;
}

/* ---------- Utilidades ---------- */
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c]));
const h2 = (n) => (n == null ? '—' : Number(n).toFixed(2));
const cliente = (id) => CLIENTES.find(c => c.id === id);
const user    = (id) => USUARIOS.find(u => u.id === id);
const gestion = (id) => GESTIONES.find(g => g.id === id);
const MESES = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
const fFecha = (d) => d ? `${String(d.getDate()).padStart(2,'0')} ${MESES[d.getMonth()]}` : '—';
const fHora  = (d) => d ? `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}` : '—';
const fFull  = (d) => d ? `${fFecha(d)} ${d.getFullYear()} · ${fHora(d)}` : '—';
const iniciales = (n) => n.split(' ').slice(0,2).map(p => p[0]).join('').toUpperCase();

/** Resumen de tiempos de una gestión: solo sus propios pasos. */
function resumen(g) {
  const t = ahora();
  let consumido = 0, esperadoIniciados = 0, esperadoTotal = 0, retrasados = 0, porVencer = 0;
  g.pasos.forEach(p => {
    if (p.noAplica || p.pendiente) return;
    if (p.esp != null) esperadoTotal += p.esp;
    if (!p.inicio) return;
    consumido += horasHabiles(p.inicio, p.fin || t);
    p.intentos?.forEach(i => { consumido += i.horas; });
    if (p.esp != null) esperadoIniciados += p.esp;
    const e = estadoPaso(p, t);
    if (e === 'late') retrasados++;
    if (e === 'warn') porVencer++;
  });
  consumido = Math.round(consumido * 100) / 100;
  const dif = Math.round((esperadoIniciados - consumido) * 100) / 100;
  let estado = 'ok';
  if (consumido > esperadoIniciados) estado = 'late';
  else if (consumido >= esperadoIniciados * CFG.umbralAviso) estado = 'warn';
  return { consumido, esperadoIniciados, esperadoTotal, dif, estado, retrasados, porVencer };
}

function pasoActivo(g) {
  return g.pasos.find(p => p.inicio && !p.fin && !p.noAplica);
}
function siguientePaso(g) {
  return g.pasos.find(p => !p.inicio && !p.noAplica && !p.pendiente);
}
function progreso(g) {
  const total = g.pasos.filter(p => !p.pendiente).length;
  const hechos = g.pasos.filter(p => p.fin || p.noAplica).length;
  return { total, hechos, pct: total ? Math.round(hechos / total * 100) : 0 };
}
function estadoGestion(g) {
  if (g.estado === 'finalizado') return { txt: 'Finalizada', cls: 'b-ok', ico: 'check' };
  if (g.estado === 'porRevisar') return { txt: 'Por revisar', cls: 'b-warn', ico: 'eye' };
  const r = resumen(g);
  return { txt: ESTADO_INFO[r.estado].txt === 'Cumplido' ? 'En tiempo' : ESTADO_INFO[r.estado].txt,
           cls: ESTADO_INFO[r.estado].cls, ico: ESTADO_INFO[r.estado].ico };
}

/* ---------- Bitácora ---------- */
function log(gid, tipo, texto, extra = {}) {
  S.bitacora.unshift({ gid, tipo, texto, cuando: ahora(), por: S.usuario.id, ...extra });
}
function bitacoraDe(gid) {
  const propios = S.bitacora.filter(b => b.gid === gid);
  const g = gestion(gid);
  const base = [];
  if (!g) return propios;
  base.push({ gid, tipo: 'crear', texto: `Gestión guardada · file ${g.file}`, cuando: g.t2, por: g.creadaPor });
  base.push({ gid, tipo: 'crear', texto: 'Se seleccionó el tipo de trámite y comenzó la creación', cuando: g.t1, por: g.creadaPor });
  g.pasos.forEach(p => {
    if (p.inicio) base.push({ gid, tipo: 'inicio', texto: `Paso ${p.n} · ${p.nombre || 'sin definir'} · inicia`, cuando: p.inicio, por: g.creadaPor, resp: p.responsable });
    if (p.fin)    base.push({ gid, tipo: 'fin',    texto: `Paso ${p.n} · ${p.nombre || 'sin definir'} · finaliza · ${h2(horasHabiles(p.inicio, p.fin))} h`, cuando: p.fin, por: g.creadaPor });
    p.intentos?.forEach(i => base.push({ gid, tipo: 'reinicio', texto: `Paso ${p.n} · reiniciado · se anula un intento de ${h2(i.horas)} h`, cuando: i.cuando, por: i.por, motivo: i.motivo }));
    if (p.noAplica && p.naCuando) base.push({ gid, tipo: 'na', texto: `Paso ${p.n} · marcado como no aplica`, cuando: p.naCuando, por: p.naPor, motivo: p.naMotivo });
  });
  if (g.finalizadaEl) base.push({ gid, tipo: 'fin', texto: 'Gestión finalizada', cuando: g.finalizadaEl, por: g.finalizadaPor });
  return [...propios, ...base].sort((a, b) => b.cuando - a.cuando);
}

/* ---------- Avisos ---------- */
function toast(txt, kind = 'ok') {
  const el = document.createElement('div');
  el.className = `toast toast-${kind}`;
  el.innerHTML = `${ico(kind === 'mail' ? 'mail' : 'check', 16)}<span>${esc(txt)}</span>`;
  document.getElementById('toasts').appendChild(el);
  setTimeout(() => { el.style.opacity = '0'; el.style.transition = 'opacity .25s'; setTimeout(() => el.remove(), 260); }, 3600);
}
function enviarCorreo(para, asunto, gid) {
  S.correos.unshift({ para, asunto, cuando: ahora(), gid });
  if (gid) log(gid, 'correo', `Correo enviado a ${para} · ${asunto}`);
  toast(`Correo enviado a ${para}`, 'mail');
}

/* ============================================================
   Render
   ============================================================ */
const root = () => document.getElementById('root');

function render() {
  root().innerHTML = S.autenticado ? vistaApp() : vistaLogin();
  conectar();
}

/* ---------- Login ---------- */
function vistaLogin() {
  return `
  <div class="login-screen">
    <div class="login-card">
      <div class="login-brand">
        <div class="brand-mark">CS</div>
        <div>
          <div class="brand-name">CSLogi</div>
          <div class="brand-sub">Trazabilidad de tiempos operativos</div>
        </div>
      </div>
      <div class="card">
        <div class="card-body stack">
          <div class="field">
            <label class="label" for="li-cod">Código de empleado</label>
            <input class="input mono" id="li-cod" value="ADM-001" autocomplete="off">
          </div>
          <div class="field">
            <label class="label" for="li-pw">Contraseña</label>
            <input class="input" id="li-pw" type="password" value="demostracion">
          </div>
          <div class="note">${ico('info',15)}<div>Demostración: el acceso registra la hora de entrada y, desde ese momento, toda acción queda en bitácora. Podés cambiar de rol una vez dentro.</div></div>
          <button class="btn btn-primary btn-lg" data-act="login">Iniciar sesión</button>
        </div>
      </div>
      <p class="tiny muted" style="text-align:center;margin-top:14px">Datos de demostración. Ningún dato aquí es real.</p>
    </div>
  </div>`;
}

/* ---------- Armazón ---------- */
function vistaApp() {
  const vistasPorRol = NAV.filter(n => n.roles.includes(S.usuario.rol));
  const atrasados = GESTIONES.filter(g => g.estado === 'abierto' && resumen(g).estado === 'late').length;

  const nav = vistasPorRol.map(n => `
    <button class="nav-item" data-nav="${n.id}" ${S.vista === n.id ? 'aria-current="page"' : ''}>
      ${ico(n.ico,17)}<span>${n.label}</span>
      ${n.id === 'gestiones' && atrasados ? `<span class="nav-badge num">${atrasados}</span>` : ''}
    </button>`).join('');

  return `
  <div class="app">
    <aside class="sidebar">
      <div class="brand">
        <div class="brand-mark">CS</div>
        <div>
          <div class="brand-name">CSLogi</div>
          <div class="brand-sub">Trazabilidad</div>
        </div>
      </div>
      <nav class="nav">
        <div class="nav-group-label">Operación</div>
        ${nav}
      </nav>
      <div class="sidebar-foot">
        <div class="role-switch">
          <span class="role-switch-label">Ver como</span>
          <div class="seg">
            ${[['admin','Admin'],['empleado','Empleado'],['soporte','Soporte IT']].map(([r,l]) =>
              `<button data-rol="${r}" aria-pressed="${S.usuario.rol===r}">${l}</button>`).join('')}
          </div>
        </div>
        <div class="user-chip">
          <div class="avatar">${iniciales(S.usuario.nombre)}</div>
          <div style="min-width:0;flex:1">
            <div class="user-name">${esc(S.usuario.nombre)}</div>
            <div class="user-meta mono">${esc(S.usuario.codigo)}</div>
          </div>
          <button class="icon-btn" data-act="tema" title="Cambiar tema" aria-label="Cambiar tema">${ico(S.tema==='light'?'moon':'sun',16)}</button>
          <button class="icon-btn" data-act="salir" title="Cerrar sesión" aria-label="Cerrar sesión">${ico('logout',16)}</button>
        </div>
      </div>
    </aside>
    <main class="main">
      ${barraSuperior()}
      <div class="content">${contenido()}</div>
    </main>
  </div>`;
}

function barraSuperior() {
  const g = S.gestionId ? gestion(S.gestionId) : null;
  let crumb = `<strong>${NAV.find(n => n.id === S.vista)?.label || 'Inicio'}</strong>`;
  if (S.vista === 'file' && g) crumb = `<span>Gestiones</span><span>›</span><strong class="mono">${g.file}</strong>`;
  if (S.vista === 'nueva')     crumb = `<span>Gestiones</span><span>›</span><strong>Nueva gestión</strong>`;
  if (S.vista === 'informe' && g) crumb = `<span>Gestiones</span><span>›</span><span class="mono">${g.file}</span><span>›</span><strong>Informe ejecutivo</strong>`;

  return `
  <header class="topbar">
    <div class="crumb">${crumb}</div>
    <div class="topbar-actions">
      <span class="tiny muted mono" title="Hora del servidor, no del equipo del usuario">
        ${ico('clock',13)} ${fFull(ahora())}
      </span>
    </div>
  </header>`;
}

function contenido() {
  switch (S.vista) {
    case 'inicio':     return vInicio();
    case 'gestiones':  return vGestiones();
    case 'file':       return vFile();
    case 'nueva':      return vNueva();
    case 'clientes':   return vClientes();
    case 'dashboard':  return vDashboard();
    case 'reportes':   return vReportes();
    case 'asistencia': return vAsistencia();
    case 'config':     return vConfig();
    case 'informe':    return vInforme();
    default:           return vInicio();
  }
}

/* ============================================================
   Inicio
   ============================================================ */
function vInicio() {
  const activas = GESTIONES.filter(g => g.estado !== 'finalizado');
  return `
  <div class="page-head">
    <h1 class="page-title">Hola, ${esc(S.usuario.nombre.split(' ')[0])}</h1>
    <p class="page-desc">${activas.length} gestiones en proceso.</p>
  </div>

  <div class="row" style="margin-bottom:20px">
    <button class="btn btn-primary btn-lg" data-act="nueva">${ico('plus',16)} Nueva gestión</button>
    <button class="btn btn-lg" data-nav="gestiones">${ico('search',16)} Buscar gestión</button>
  </div>

  <div class="card">
    <div class="card-head">
      <span class="card-title">Gestiones en proceso</span>
      <span class="spacer"></span>
      <button class="btn btn-sm btn-ghost" data-nav="gestiones">Ver todas</button>
    </div>
    ${tablaGestiones(activas)}
  </div>`;
}

/* ============================================================
   Gestiones
   ============================================================ */
function vGestiones() {
  const f = S.filtro;
  let lista = GESTIONES.filter(g => {
    const c = cliente(g.clienteId);
    const q = f.q.toLowerCase();
    const okQ = !q || g.file.toLowerCase().includes(q) || c.nombre.toLowerCase().includes(q) || c.codigo.includes(q);
    const okT = !f.tipo || g.tipo === f.tipo;
    const okE = !f.estado || (f.estado === 'activas' ? g.estado !== 'finalizado'
               : f.estado === 'finalizadas' ? g.estado === 'finalizado'
               : f.estado === 'retrasadas' ? (g.estado === 'abierto' && resumen(g).estado === 'late') : true);
    return okQ && okT && okE;
  });
  return `
  <div class="page-head">
    <h1 class="page-title">Gestiones</h1>
    <p class="page-desc">Buscá por número de file interno, nombre o código de cliente.</p>
  </div>

  <div class="card" style="margin-bottom:14px">
    <div class="card-body row" style="gap:10px">
      <div class="search-wrap" style="flex:1;min-width:220px">
        ${ico('search',16)}
        <input class="input" id="f-q" placeholder="A26I10001, Importadora Demo, 001…" value="${esc(f.q)}">
      </div>
      <select class="select" id="f-tipo" style="width:auto;min-width:200px">
        <option value="">Todos los trámites</option>
        ${Object.entries(TIPOS).map(([k,v]) => `<option value="${k}" ${f.tipo===k?'selected':''}>${v.nombre}</option>`).join('')}
      </select>
      <select class="select" id="f-estado" style="width:auto;min-width:160px">
        <option value="">Todos los estados</option>
        <option value="activas" ${f.estado==='activas'?'selected':''}>Activas</option>
        <option value="retrasadas" ${f.estado==='retrasadas'?'selected':''}>Retrasadas</option>
        <option value="finalizadas" ${f.estado==='finalizadas'?'selected':''}>Finalizadas</option>
      </select>
      <span class="spacer"></span>
      <button class="btn btn-primary" data-act="nueva">${ico('plus',16)} Nueva gestión</button>
    </div>
  </div>

  <div class="card">${tablaGestiones(lista)}</div>`;
}

function tablaGestiones(lista) {
  if (!lista.length) return `
    <div class="empty">
      <div class="empty-icon">${ico('folder',34)}</div>
      <div class="empty-title">No hay gestiones que coincidan</div>
      <div class="empty-desc">Probá con otro término o quitá los filtros.</div>
    </div>`;

  return `<table class="tbl tbl-rows">
    <thead><tr>
      <th>File interno</th><th>Cliente</th><th>Trámite</th><th>Selectivo</th>
      <th>Paso actual</th><th class="r">Consumido</th><th class="r">Esperado</th><th>Estado</th>
    </tr></thead>
    <tbody>
    ${lista.map(g => {
      const c = cliente(g.clienteId), r = resumen(g), eg = estadoGestion(g);
      const act = pasoActivo(g), pr = progreso(g);
      const sel = g.selectivo ? `<span class="badge ${g.selectivo==='Verde'?'b-verde':'b-rojo'}">${g.selectivo}</span>`
                              : `<span class="tiny muted">Pendiente</span>`;
      return `<tr data-open="${g.id}">
        <td class="mono" style="font-weight:600">${g.file}</td>
        <td>${esc(c.nombre)}<div class="tiny muted mono">${c.codigo}</div></td>
        <td class="tiny">${TIPOS[g.tipo].nombre}</td>
        <td>${sel}</td>
        <td>${act ? `<span class="mono tiny">${act.n}</span> ${esc(act.nombre || 'Sin definir')}`
                  : `<span class="tiny muted">${g.estado==='finalizado'?'Cerrada':'—'}</span>`}
            <div class="tiny muted num">${pr.hechos} de ${pr.total} pasos</div></td>
        <td class="r num" style="font-weight:600">${h2(r.consumido)}</td>
        <td class="r num muted">${h2(r.esperadoIniciados)}</td>
        <td><span class="badge ${eg.cls}">${ico(eg.ico,12)}${eg.txt}</span></td>
      </tr>`;
    }).join('')}
    </tbody></table>`;
}

/* ============================================================
   Vista del file
   ============================================================ */
function vFile() {
  const g = gestion(S.gestionId);
  if (!g) return vGestiones();
  const c = cliente(g.clienteId), r = resumen(g), eg = estadoGestion(g);
  const pr = progreso(g);
  const comunes = g.pasos.filter(p => p.bloque === 'COMUN');
  const ruta    = g.pasos.filter(p => p.bloque === 'RUTA');
  const todosListos = g.pasos.filter(p => !p.pendiente).every(p => p.fin || p.noAplica);
  const puedeFinalizar = g.selectivo && todosListos && g.estado !== 'finalizado';

  return `
  <button class="btn btn-sm btn-ghost" data-nav="gestiones" style="margin-bottom:14px">${ico('back',14)} Gestiones</button>

  <div class="file-head">
    <div>
      <div class="file-code">${g.file}</div>
      <div class="file-meta">
        <span>${esc(c.nombre)}</span><span class="dot-sep">·</span>
        <span>${TIPOS[g.tipo].nombre}</span><span class="dot-sep">·</span>
        ${g.selectivo ? `<span class="badge ${g.selectivo==='Verde'?'b-verde':'b-rojo'}">Selectivo ${g.selectivo}</span>`
                      : `<span class="badge b-idle">Selectivo pendiente</span>`}
        <span class="badge ${eg.cls}">${ico(eg.ico,12)}${eg.txt}</span>
      </div>
      <div class="tiny muted" style="margin-top:6px">
        Rango ${g.rangoDesde} – ${g.rangoHasta} · creada por ${esc(user(g.creadaPor).nombre)} el ${fFull(g.t2)}
      </div>
    </div>
    <div class="file-head-actions">
      ${g.estado === 'finalizado' || g.estado === 'porRevisar'
        ? `<button class="btn" data-act="informe">${ico('doc',15)} Informe ejecutivo</button>` : ''}
      ${S.usuario.rol === 'admin' ? `<button class="btn" data-act="bitacora">${ico('shield',15)} Bitácora</button>` : ''}
      ${puedeFinalizar ? `<button class="btn btn-primary" data-act="revisar">${ico('eye',15)} Revisar y finalizar</button>` : ''}
    </div>
  </div>

  <div class="metrics" style="margin-bottom:8px">
    <div class="metric">
      <div class="metric-label">Horas hábiles consumidas</div>
      <div class="metric-value num">${h2(r.consumido)} <small>h</small></div>
      <div class="metric-note">Suma de los pasos de este file</div>
    </div>
    <div class="metric">
      <div class="metric-label">Esperado de los pasos iniciados</div>
      <div class="metric-value num">${h2(r.esperadoIniciados)} <small>h</small></div>
      <div class="metric-note">Total del trámite: ${h2(r.esperadoTotal)} h</div>
    </div>
    <div class="metric">
      <div class="metric-label">Diferencia</div>
      <div class="metric-value num ${r.dif < 0 ? 'v-late' : 'v-ok'}">${r.dif >= 0 ? '+' : ''}${h2(r.dif)} <small>h</small></div>
      <div class="metric-note">${r.dif >= 0 ? 'Adelanto sobre lo esperado' : 'Retraso sobre lo esperado'}</div>
    </div>
    <div class="metric">
      <div class="metric-label">Avance</div>
      <div class="metric-value num">${pr.pct}<small>%</small></div>
      <div class="metric-note">${pr.hechos} de ${pr.total} pasos · ${r.retrasados} con retraso</div>
    </div>
  </div>

  ${g.estado === 'porRevisar' ? `
    <div class="note note-warn" style="margin:14px 0">${ico('eye',15)}
      <div><strong>Esta gestión terminó todos sus pasos y está esperando revisión.</strong>
      Si falta algo, se pueden reabrir los campos para corregir; si está todo, se finaliza y se habilita el informe.</div>
    </div>` : ''}

  ${g.tipo === 'FRONTERA' ? `
    <div class="note note-warn" style="margin:14px 0">${ico('alert',15)}
      <div><strong>Los pasos del trámite de frontera están pendientes de definición.</strong>
      El instructivo trae la numeración (8 en ruta verde, 10 en roja) pero no los nombres. Logística debe entregarlos.</div>
    </div>` : ''}

  <div class="route-divider"><span class="route-label">Pasos comunes · 1 al 10</span></div>
  <div class="steps">${comunes.map(p => filaPaso(g, p)).join('')}</div>

  ${g.selectivo ? `
    <div class="route-divider">
      <span class="route-label">${TIPOS[g.tipo].nombre} · ruta ${g.selectivo.toLowerCase()}</span>
    </div>
    <div class="steps">${ruta.map(p => filaPaso(g, p)).join('')}</div>`
  : `<div class="note" style="margin-top:18px">${ico('info',15)}
      <div>Al marcar el resultado del selectivo en el paso 10, el sistema habilitará automáticamente
      los pasos de la ruta verde o roja que corresponda a este trámite.</div></div>`}`;
}

function filaPaso(g, p) {
  const t = ahora();
  const est = estadoPaso(p, t);
  const info = ESTADO_INFO[est];
  const activo = !!(p.inicio && !p.fin && !p.noAplica);
  const horas = p.inicio ? horasHabiles(p.inicio, p.fin || t) : null;
  const bloqueado = g.estado === 'finalizado';
  const disponible = !p.inicio && !p.noAplica && !bloqueado && siguientePaso(g)?.n === p.n && !p.pendiente;
  const nombre = p.nombre || `Paso de frontera por definir`;

  let cls = 'step-card';
  if (!p.inicio && !p.noAplica) cls += ' is-pending';
  if (activo) cls += ' is-active';
  if (p.noAplica) cls += ' is-na';

  // Acciones
  let acciones = '';
  if (bloqueado) {
    acciones = `<span class="tiny muted">${ico('lock',13)}</span>`;
  } else if (p.pendiente) {
    acciones = `<span class="tiny muted">Sin definir</span>`;
  } else if (activo && p.defineRuta && !g.selectivo) {
    // El paso 10 no se cierra a mano: se cierra al marcar el resultado del selectivo.
    acciones = `<span class="tiny muted">Marcá el resultado ↓</span>`;
  } else if (activo) {
    acciones = `
      <button class="btn btn-sm btn-primary" data-fin="${p.n}">${ico('square',13)} Finalizar</button>
      <button class="btn btn-sm" data-reiniciar="${p.n}" title="Reiniciar paso">${ico('undo',13)}</button>`;
  } else if (disponible) {
    acciones = `<button class="btn btn-sm btn-primary" data-ini="${p.n}">${ico('play',12)} Iniciar</button>
      ${p.condicional ? `<button class="btn btn-sm" data-na="${p.n}">No aplica</button>` : ''}`;
  } else if (p.fin || p.noAplica) {
    acciones = '';
  } else {
    acciones = `<span class="tiny muted">En espera</span>`;
  }

  const selResp = (activo || disponible)
    ? `<select class="select step-sel" data-resp="${p.n}">
        ${RESPONSABLES.map(r => `<option ${r === p.responsable ? 'selected' : ''}>${r}</option>`).join('')}
       </select>`
    : `<span>${esc(p.responsable || '—')}</span>`;

  const selectivoCtl = (p.defineRuta && p.inicio && !g.selectivo)
    ? `<div style="grid-column:1/-1;border-top:1px solid var(--border);margin-top:4px;padding-top:10px">
         <div class="label" style="margin-bottom:6px">Resultado asignado por SAT</div>
         <div class="row">
           <button class="btn btn-sm" data-selectivo="Verde">Verde · sin revisión</button>
           <button class="btn btn-sm" data-selectivo="Rojo">Rojo · revisión física</button>
           <span class="tiny muted">Define la ruta de los pasos siguientes.</span>
         </div>
       </div>` : '';

  const intentos = p.intentos?.length
    ? `<div class="tiny muted" style="grid-column:1/-1;margin-top:2px">${ico('undo',12)}
        ${p.intentos.length} intento anulado · ${h2(p.intentos.reduce((a,i)=>a+i.horas,0))} h que sí suman al total</div>` : '';

  const naNota = p.noAplica && p.naMotivo
    ? `<div class="tiny muted" style="grid-column:1/-1;margin-top:2px">${ico('minus',12)} ${esc(p.naMotivo)}</div>` : '';

  const notaNum = p.nota ? `<div class="tiny muted" style="grid-column:1/-1">${ico('info',12)} ${esc(p.nota)}</div>` : '';

  return `
  <div class="step" data-step="${p.n}">
    <div class="step-rail">
      <div class="step-marker ${info.m}">
        ${est === 'idle' ? `<span class="num">${p.n.includes('.') ? '•' : p.n}</span>`
          : est === 'run' ? `<span class="ticking">${ico(info.ico,11)}</span>` : ico(info.ico,13)}
      </div>
    </div>
    <div class="step-body">
      <div class="${cls}">
        <div>
          <div class="step-n mono">${p.n}${p.condicional ? ' · condicional' : ''}${p.repetible ? ' · puede repetirse' : ''}</div>
          <div class="step-name">${esc(nombre)}</div>
          <div class="step-resp">${selResp}</div>
        </div>
        <div class="step-col-exp">
          <div class="step-col-label">Inicio / Fin</div>
          <div class="step-time mono">${p.inicio ? `${fFecha(p.inicio)} ${fHora(p.inicio)}` : '—'}</div>
          <div class="step-time mono muted">${p.fin ? `${fFecha(p.fin)} ${fHora(p.fin)}` : (activo ? 'en curso' : '—')}</div>
        </div>
        <div>
          <div class="step-col-label">Horas</div>
          <div class="step-hours num ${est==='late'?'v-late':est==='warn'?'v-warn':''}">
            ${horas != null ? h2(horas) : '—'}
            <small>/ ${p.esp != null ? h2(p.esp) : '—'}</small>
          </div>
        </div>
        <div class="step-col-exp">
          <div class="step-col-label">Estado</div>
          <div style="margin-top:3px"><span class="badge ${info.cls}">${ico(info.ico,12)}${info.txt}</span></div>
        </div>
        <div class="step-actions">${acciones}</div>
        ${notaNum}${intentos}${naNota}${selectivoCtl}
      </div>
    </div>
  </div>`;
}

/* ============================================================
   Nueva gestión
   ============================================================ */
function vNueva() {
  const n = S.nueva;
  const paso = n.paso;
  return `
  <div class="page-head">
    <h1 class="page-title">Nueva gestión</h1>
    <p class="page-desc">Paso ${paso} de 2 · la trazabilidad de esta creación ya está corriendo.</p>
  </div>

  <div class="card" style="max-width:720px">
    ${paso === 1 ? `
      <div class="card-head"><span class="card-title">¿Qué tipo de trámite va a realizar?</span></div>
      <div class="card-body">
        <div class="grid-2">
          ${Object.entries(TIPOS).map(([k,v]) => `
            <button class="btn btn-lg" data-tipo="${k}" style="justify-content:flex-start;height:auto;padding:14px;text-align:left">
              <div>
                <div style="font-weight:600">${v.nombre}</div>
                <div class="tiny muted" style="font-weight:400">
                  ${k==='FRONTERA' ? 'Pasos pendientes de definición'
                    : `${PASOS_RUTA[k].VERDE.length} pasos en verde · ${PASOS_RUTA[k].ROJA.length} en rojo`}
                </div>
              </div>
            </button>`).join('')}
        </div>
      </div>`
    : `
      <div class="card-head">
        <span class="card-title">Datos del file</span>
        <span class="spacer"></span>
        <span class="badge b-run">${TIPOS[n.tipo].nombre}</span>
      </div>
      <div class="card-body stack">
        <div class="field">
          <label class="label" for="n-cli">Cliente</label>
          <select class="select" id="n-cli">
            <option value="">Buscar por código o nombre…</option>
            ${CLIENTES.filter(c=>c.activo).map(c => `<option value="${c.id}" ${n.clienteId===c.id?'selected':''}>${c.codigo} · ${esc(c.nombre)}</option>`).join('')}
          </select>
        </div>
        <div class="grid-2">
          <div class="field">
            <label class="label">Código de cliente</label>
            <input class="input input-readonly mono" readonly value="${n.clienteId ? cliente(n.clienteId).codigo : '—'}">
            <span class="hint">Automático al seleccionar el cliente</span>
          </div>
          <div class="field">
            <label class="label">File interno</label>
            <input class="input input-readonly mono" readonly value="${n.clienteId ? nuevoFile(n.clienteId) : '—'}">
            <span class="hint">Lo genera el sistema</span>
          </div>
        </div>
        <div class="grid-2">
          <div class="field">
            <label class="label" for="n-d">Rango de files — desde</label>
            <input class="input mono" id="n-d" value="${n.clienteId ? nuevoFile(n.clienteId) : ''}">
          </div>
          <div class="field">
            <label class="label" for="n-h">Rango de files — hasta</label>
            <input class="input mono" id="n-h" placeholder="A26I10020">
          </div>
        </div>
        <div class="field">
          <label class="label">Resultado del selectivo</label>
          <input class="input input-readonly" readonly value="Se define en el paso 10">
          <span class="hint">SAT lo asigna después del pago de impuestos; no se conoce al crear el file.</span>
        </div>
        <div class="note">${ico('info',15)}
          <div>Al guardar queda registrado quién creó la gestión, el momento en que seleccionó el tipo de trámite
          (<span class="mono">${fHora(n.t1)}</span>) y el momento del guardado.</div>
        </div>
      </div>
      <div class="card-foot">
        <button class="btn" data-act="nueva-atras">${ico('back',14)} Atrás</button>
        <span class="spacer"></span>
        <button class="btn btn-primary" data-act="guardar-gestion" ${!n.clienteId?'disabled':''}>Guardar gestión</button>
      </div>`}
  </div>`;
}

function nuevoFile(clienteId) {
  const c = cliente(clienteId);
  const correlativo = String(GESTIONES.length + 30).padStart(4, '0');
  return `A26I${Number(c.codigo)}${correlativo}`;
}

/* ============================================================
   Clientes
   ============================================================ */
function vClientes() {
  return `
  <div class="page-head">
    <h1 class="page-title">Clientes</h1>
    <p class="page-desc">El sistema asigna el código automáticamente y garantiza que no se repita.</p>
  </div>
  <div class="card">
    <div class="card-head">
      <span class="card-title">${CLIENTES.length} clientes</span>
      <span class="spacer"></span>
      <button class="btn btn-sm btn-primary" data-act="cliente-nuevo">${ico('plus',14)} Nuevo cliente</button>
    </div>
    <table class="tbl">
      <thead><tr>
        <th>Código</th><th>Cliente</th><th>Encargado</th><th>Teléfonos</th>
        <th>Correos</th><th class="c">Files</th><th>Estado</th>
      </tr></thead>
      <tbody>
      ${CLIENTES.map(c => `<tr>
        <td class="mono" style="font-weight:600">${c.codigo}</td>
        <td>${esc(c.nombre)}<div class="tiny muted">${esc(c.dir)}</div></td>
        <td>${esc(c.encargado)}</td>
        <td class="mono tiny">${esc(c.telEnc)}<div class="muted">${esc(c.telEmp)}</div></td>
        <td class="tiny">${esc(c.correoNotif)}<div class="muted">${esc(c.correoInf)} · informes</div></td>
        <td class="c num">${GESTIONES.filter(g=>g.clienteId===c.id).length}</td>
        <td><span class="badge ${c.activo?'b-ok':'b-idle'}">${c.activo?'Activo':'Inactivo'}</span></td>
      </tr>`).join('')}
      </tbody>
    </table>
  </div>
  <div class="note" style="margin-top:14px">${ico('info',15)}
    <div>Un cliente con files registrados no se elimina: se inactiva. Así deja de aparecer para gestiones
    nuevas pero el historial se conserva.</div>
  </div>`;
}

/* ============================================================
   Dashboard
   ============================================================ */
function vDashboard() {
  const hoy = GESTIONES.filter(g => ymd(g.t2) === '2026-10-23').length;
  const ayer = GESTIONES.filter(g => ymd(g.t2) === '2026-10-22').length;
  const activas = GESTIONES.filter(g => g.estado !== 'finalizado');
  const atrasadas = activas.filter(g => resumen(g).estado === 'late');
  const porVencer = activas.filter(g => resumen(g).estado === 'warn');
  const porRevisar = GESTIONES.filter(g => g.estado === 'porRevisar');

  // Promedio real contra esperado por paso común
  const prom = PASOS_COMUNES.map(pc => {
    let suma = 0, n = 0, esp = 0;
    GESTIONES.forEach(g => {
      const p = g.pasos.find(x => x.n === pc.n && x.bloque === 'COMUN');
      if (p?.inicio && p?.fin) { suma += horasHabiles(p.inicio, p.fin); n++; if (p.esp != null) esp = p.esp; }
    });
    return { n: pc.n, nombre: pc.nombre, real: n ? suma / n : null, esp: esp || pc.esp, casos: n };
  }).filter(x => x.real != null);

  const maxProm = Math.max(...prom.map(p => Math.max(p.real, p.esp || 0)), 1);

  return `
  <div class="page-head">
    <h1 class="page-title">Dashboard</h1>
    <p class="page-desc">Cada indicador lleva al detalle. Hacé clic en cualquier número o barra.</p>
  </div>

  <div class="metrics" style="margin-bottom:16px">
    <div class="metric is-clickable" data-drill="hoy">
      <div class="metric-label">Gestiones creadas hoy</div>
      <div class="metric-value num">${hoy}</div>
      <div class="metric-note">23 oct 2026</div>
    </div>
    <div class="metric is-clickable" data-drill="ayer">
      <div class="metric-label">Gestiones creadas ayer</div>
      <div class="metric-value num">${ayer}</div>
      <div class="metric-note">22 oct 2026</div>
    </div>
    <div class="metric is-clickable" data-drill="activas">
      <div class="metric-label">Files activos</div>
      <div class="metric-value num">${activas.length}</div>
      <div class="metric-note">En proceso ahora</div>
    </div>
    <div class="metric is-clickable" data-drill="atrasadas">
      <div class="metric-label">Con retraso</div>
      <div class="metric-value num ${atrasadas.length?'v-late':''}">${atrasadas.length}</div>
      <div class="metric-note">${porVencer.length} por vencer</div>
    </div>
    <div class="metric is-clickable" data-drill="porRevisar">
      <div class="metric-label">Por revisar</div>
      <div class="metric-value num ${porRevisar.length?'v-warn':''}">${porRevisar.length}</div>
      <div class="metric-note">Terminaron sus pasos</div>
    </div>
  </div>

  <div class="card">
    <div class="card-head">
      <span class="card-title">Promedio de tiempos · pasos comunes</span>
      <span class="spacer"></span>
      <span class="tiny muted">Real contra esperado · clic en un paso para ver su detalle</span>
    </div>
    <div class="card-body">
      <div class="bars">
        ${prom.map(p => {
          const excede = p.esp && p.real > p.esp;
          return `
          <div class="bar-row is-clickable" data-paso="${p.n}" style="cursor:pointer">
            <div class="bar-pair">
              <div class="bar-label"><span class="mono tiny muted">${p.n}</span> ${esc(p.nombre)}
                ${excede ? `<span class="badge b-late" style="margin-left:6px">${ico('alert',11)}Excede</span>` : ''}</div>
              <div class="bar-track"><div class="bar-fill" style="--p:${Math.min(1, p.real/maxProm).toFixed(3)};background:${excede?'var(--late-fg)':'var(--accent)'}"></div></div>
              <div class="bar-mini num">esperado ${h2(p.esp)} h · ${p.casos} ${p.casos===1?'caso':'casos'}</div>
            </div>
            <div class="bar-val num ${excede?'v-late':''}">${h2(p.real)} h</div>
          </div>`;
        }).join('')}
      </div>
    </div>
  </div>`;
}

/* ============================================================
   Reportería
   ============================================================ */
function vReportes() {
  const r = S.reporte;
  const lista = GESTIONES.filter(g => {
    if (r.cliente && g.clienteId !== r.cliente) return false;
    const d = ymd(g.t2);
    if (r.desde && d < r.desde) return false;
    if (r.hasta && d > r.hasta) return false;
    return true;
  });

  const filas = lista.map(g => {
    const res = resumen(g);
    const c = cliente(g.clienteId);
    const cumplimiento = res.esperadoIniciados ? Math.min(100, Math.round(res.esperadoIniciados / Math.max(res.consumido, .01) * 100)) : 0;
    const atraso = Math.max(0, res.consumido - res.esperadoIniciados);
    return { g, c, res, cumplimiento, atraso };
  });

  const totalConsumido = filas.reduce((a,f) => a + f.res.consumido, 0);
  const totalEsperado  = filas.reduce((a,f) => a + f.res.esperadoIniciados, 0);
  const totalAtraso    = filas.reduce((a,f) => a + f.atraso, 0);
  const enTiempo       = filas.filter(f => f.atraso === 0).length;
  const pctCumple      = filas.length ? Math.round(enTiempo / filas.length * 100) : 0;
  const maxC = Math.max(...filas.map(f => f.res.consumido), 1);

  return `
  <div class="page-head">
    <h1 class="page-title">Reportería</h1>
    <p class="page-desc">Procesos realizados en el período seleccionado, con tiempos promedio y atrasos.</p>
  </div>

  <div class="card" style="margin-bottom:14px">
    <div class="card-body row" style="gap:10px">
      <div class="field" style="min-width:210px"><span class="label">Cliente</span>
        <select class="select" id="r-cli">
          <option value="">Todos los clientes</option>
          ${CLIENTES.map(c => `<option value="${c.id}" ${r.cliente===c.id?'selected':''}>${c.codigo} · ${esc(c.nombre)}</option>`).join('')}
        </select>
      </div>
      <div class="field"><span class="label">Desde</span><input class="input" type="date" id="r-d" value="${r.desde}"></div>
      <div class="field"><span class="label">Hasta</span><input class="input" type="date" id="r-h" value="${r.hasta}"></div>
      <span class="spacer"></span>
      <div class="field"><span class="label">Presentación</span>
        <div class="seg" style="width:188px">
          <button data-modo="barras" aria-pressed="${r.modo==='barras'}">Barras</button>
          <button data-modo="porcentaje" aria-pressed="${r.modo==='porcentaje'}">Porcentajes</button>
        </div>
      </div>
      <div class="field"><span class="label">Exportar</span>
        <div class="row" style="gap:6px">
          <button class="btn btn-sm" data-export="Excel">${ico('down',13)} Excel</button>
          <button class="btn btn-sm" data-export="PDF">${ico('down',13)} PDF</button>
        </div>
      </div>
    </div>
  </div>

  <div class="metrics" style="margin-bottom:16px">
    <div class="metric"><div class="metric-label">Files en el período</div><div class="metric-value num">${filas.length}</div></div>
    <div class="metric"><div class="metric-label">Horas consumidas</div><div class="metric-value num">${h2(totalConsumido)} <small>h</small></div><div class="metric-note">Esperado ${h2(totalEsperado)} h</div></div>
    <div class="metric"><div class="metric-label">Tiempo de atraso</div><div class="metric-value num ${totalAtraso?'v-late':''}">${h2(totalAtraso)} <small>h</small></div><div class="metric-note">Acumulado sobre lo esperado</div></div>
    <div class="metric"><div class="metric-label">Entregados en tiempo</div><div class="metric-value num ${pctCumple>=80?'v-ok':'v-warn'}">${pctCumple}<small>%</small></div><div class="metric-note">${enTiempo} de ${filas.length} files</div></div>
  </div>

  <div class="card">
    <div class="card-head"><span class="card-title">Detalle por file</span></div>
    ${r.modo === 'barras' ? `
      <div class="card-body">
        <div class="bars">
          ${filas.map(f => `
            <div class="bar-row">
              <div class="bar-pair">
                <div class="bar-label"><span class="mono" style="font-weight:600">${f.g.file}</span>
                  <span class="muted"> · ${esc(f.c.nombre)}</span>
                  ${f.atraso ? `<span class="badge b-late" style="margin-left:6px">${ico('alert',11)}+${h2(f.atraso)} h</span>` : ''}</div>
                <div class="bar-track"><div class="bar-fill" style="--p:${(f.res.consumido/maxC).toFixed(3)};background:${f.atraso?'var(--late-fg)':'var(--ok-fg)'}"></div></div>
                <div class="bar-mini num">esperado ${h2(f.res.esperadoIniciados)} h · ${TIPOS[f.g.tipo].nombre}</div>
              </div>
              <div class="bar-val num">${h2(f.res.consumido)} h</div>
            </div>`).join('')}
        </div>
      </div>`
    : `
      <table class="tbl">
        <thead><tr><th>File</th><th>Cliente</th><th>Trámite</th><th class="r">Consumido</th><th class="r">Esperado</th><th class="r">Atraso</th><th class="r">Cumplimiento</th></tr></thead>
        <tbody>
          ${filas.map(f => `<tr>
            <td class="mono" style="font-weight:600">${f.g.file}</td>
            <td>${esc(f.c.nombre)}</td>
            <td class="tiny">${TIPOS[f.g.tipo].nombre}</td>
            <td class="r num">${h2(f.res.consumido)} h</td>
            <td class="r num muted">${h2(f.res.esperadoIniciados)} h</td>
            <td class="r num ${f.atraso?'v-late':''}">${f.atraso ? '+'+h2(f.atraso)+' h' : '—'}</td>
            <td class="r num" style="font-weight:600">${f.cumplimiento}%</td>
          </tr>`).join('')}
        </tbody>
      </table>`}
  </div>`;
}

/* ============================================================
   Asistencia
   ============================================================ */
function vAsistencia() {
  const hoy = '2026-10-23';
  const miMarca = ASISTENCIA.find(a => a.usuario === S.usuario.id && a.fecha === hoy);
  const esSoporte = S.usuario.rol === 'soporte' || S.usuario.rol === 'admin';
  const empleados = USUARIOS.filter(u => u.rol !== 'admin');

  const marcajeSeccion = `
    <div class="card" style="margin-bottom:16px">
      <div class="card-head"><span class="card-title">Mi marcaje de hoy</span>
        <span class="spacer"></span>
        <span class="tiny muted mono">IP detectada: ${esc(S.usuario.ip)}</span>
      </div>
      <div class="card-body row" style="gap:18px">
        <div>
          <div class="metric-label">Entrada</div>
          <div class="metric-value num">${miMarca?.entrada || '—'}</div>
        </div>
        <div>
          <div class="metric-label">Salida</div>
          <div class="metric-value num">${miMarca?.salida || '—'}</div>
        </div>
        <div>
          <div class="metric-label">Horas hábiles acumuladas</div>
          <div class="metric-value num">${miMarca?.entrada
            ? h2(horasHabiles(new Date(`${hoy}T${miMarca.entrada}`), miMarca.salida ? new Date(`${hoy}T${miMarca.salida}`) : ahora()))
            : '0.00'} <small>h</small></div>
        </div>
        <span class="spacer"></span>
        ${!miMarca ? `<button class="btn btn-primary btn-lg" data-act="marcar-entrada">${ico('play',15)} Marcar entrada</button>`
          : !miMarca.salida ? `<button class="btn btn-lg" data-act="marcar-salida">${ico('square',15)} Marcar salida</button>`
          : `<span class="badge b-ok">${ico('check',12)}Jornada completa</span>`}
      </div>
      <div class="card-foot">
        <span class="tiny muted">${ico('shield',13)} El marcaje solo se habilita desde la IP autorizada para tu usuario, y la hora la pone el servidor.</span>
      </div>
    </div>`;

  const adminSeccion = !esSoporte ? '' : `
    <div class="grid-3" style="align-items:start">
      <div class="card" style="grid-column:span 2">
        <div class="card-head"><span class="card-title">Registro de asistencia</span>
          <span class="spacer"></span>
          <button class="btn btn-sm" data-export="Excel">${ico('down',13)} Excel</button>
        </div>
        <table class="tbl">
          <thead><tr><th>Fecha</th><th>Empleado</th><th>Entrada</th><th>Salida</th><th class="r">Horas</th><th>IP</th><th>Estado</th></tr></thead>
          <tbody>
          ${ASISTENCIA.map(a => {
            const u = user(a.usuario);
            const horas = a.entrada ? horasHabiles(new Date(`${a.fecha}T${a.entrada}`), a.salida ? new Date(`${a.fecha}T${a.salida}`) : ahora()) : 0;
            const tarde = a.entrada > '08:15';
            return `<tr>
              <td class="mono tiny">${a.fecha}</td>
              <td>${esc(u.nombre)}<div class="tiny muted mono">${u.codigo}</div></td>
              <td class="mono ${tarde?'v-late':''}" style="font-weight:600">${a.entrada}</td>
              <td class="mono">${a.salida || `<span class="muted">en curso</span>`}</td>
              <td class="r num">${h2(horas)}</td>
              <td class="mono tiny muted">${a.ip}</td>
              <td>${tarde ? `<span class="badge b-warn">${ico('clock',11)}Tarde</span>` : `<span class="badge b-ok">${ico('check',11)}A tiempo</span>`}</td>
            </tr>`;
          }).join('')}
          </tbody>
        </table>
      </div>

      <div class="stack">
        <div class="card">
          <div class="card-head"><span class="card-title">IP autorizada por empleado</span></div>
          <table class="tbl">
            <thead><tr><th>Empleado</th><th>IP / rango</th><th></th></tr></thead>
            <tbody>
            ${empleados.map(u => `<tr>
              <td>${esc(u.nombre)}<div class="tiny muted">${u.ipTipo}</div></td>
              <td class="mono tiny">${esc(u.ip)}</td>
              <td class="r"><button class="btn btn-sm btn-ghost" data-editip="${u.id}">Editar</button></td>
            </tr>`).join('')}
            </tbody>
          </table>
          <div class="card-foot">
            <span class="tiny muted">Solo soporte IT administra estas asignaciones.</span>
          </div>
        </div>

        ${SOLICITUDES_IP.filter(s => s.estado === 'pendiente').length ? `
        <div class="card">
          <div class="card-head"><span class="card-title">Solicitudes de acceso</span>
            <span class="nav-badge num">${SOLICITUDES_IP.filter(s=>s.estado==='pendiente').length}</span></div>
          <div class="card-body stack">
            ${SOLICITUDES_IP.filter(s => s.estado === 'pendiente').map(s => `
              <div class="note">
                ${ico('alert',15)}
                <div style="flex:1">
                  <div><strong>${esc(user(s.usuario).nombre)}</strong> solicita autorizar
                    <span class="mono">${s.ipNueva}</span></div>
                  <div class="tiny" style="margin-top:3px">“${esc(s.motivo)}”</div>
                  <div class="row" style="margin-top:8px">
                    <button class="btn btn-sm btn-primary" data-aprobar="${s.id}">Aprobar</button>
                    <button class="btn btn-sm" data-rechazar="${s.id}">Rechazar</button>
                  </div>
                </div>
              </div>`).join('')}
          </div>
        </div>` : ''}

        <div class="note note-warn">${ico('alert',15)}
          <div><strong>Las IP residenciales en Guatemala son dinámicas.</strong> Por eso se admiten rangos
          y existe el flujo de solicitud: de lo contrario, cada cambio de IP del proveedor deja al empleado
          remoto sin poder marcar.</div>
        </div>
      </div>
    </div>`;

  return `
  <div class="page-head">
    <h1 class="page-title">Asistencia</h1>
    <p class="page-desc">Marcaje de entrada y salida restringido por dirección IP, con el mismo horario y calendario de feriados del sistema.</p>
  </div>
  ${marcajeSeccion}
  ${adminSeccion}`;
}

/* ============================================================
   Configuración
   ============================================================ */
function vConfig() {
  const sinTiempo = [...PASOS_COMUNES, ...Object.values(PASOS_RUTA).flatMap(r => [...r.VERDE, ...r.ROJA])]
    .filter(p => p.esp == null).length;
  const total = 10 + Object.values(PASOS_RUTA).reduce((a,r) => a + r.VERDE.length + r.ROJA.length, 0);

  return `
  <div class="page-head">
    <h1 class="page-title">Configuración</h1>
    <p class="page-desc">Todo lo que cambia con el tiempo vive aquí, sin tocar el código.</p>
  </div>

  <div class="note note-warn" style="margin-bottom:16px">${ico('alert',15)}
    <div><strong>${sinTiempo} de ${total} pasos no tienen tiempo esperado definido.</strong>
    Las alertas de retraso y los semáforos permanecen inactivos en esos pasos hasta que CSLogi entregue la tabla.</div>
  </div>

  <div class="grid-3" style="align-items:start">
    <div class="card" style="grid-column:span 2">
      <div class="card-head"><span class="card-title">Catálogo de pasos</span>
        <span class="spacer"></span>
        <span class="tiny muted">${total} pasos · 4 trámites · 2 rutas</span>
      </div>
      <table class="tbl">
        <thead><tr><th>Trámite</th><th>Ruta</th><th class="c">Pasos</th><th class="c">Con tiempo</th><th></th></tr></thead>
        <tbody>
          <tr><td>Comunes a todos</td><td>—</td><td class="c num">10</td>
              <td class="c num">${PASOS_COMUNES.filter(p=>p.esp!=null).length}</td>
              <td class="r"><button class="btn btn-sm btn-ghost">Editar</button></td></tr>
          ${Object.entries(PASOS_RUTA).flatMap(([k,r]) => ['VERDE','ROJA'].map(ruta => `
            <tr><td>${TIPOS[k].nombre}</td>
                <td><span class="badge ${ruta==='VERDE'?'b-verde':'b-rojo'}">${ruta==='VERDE'?'Verde':'Roja'}</span></td>
                <td class="c num">${r[ruta].length}</td>
                <td class="c num">${r[ruta].filter(p=>p.esp!=null).length}</td>
                <td class="r">${r[ruta][0].pendiente
                  ? `<span class="badge b-warn">${ico('alert',11)}Por definir</span>`
                  : `<button class="btn btn-sm btn-ghost">Editar</button>`}</td></tr>`)).join('')}
        </tbody>
      </table>
    </div>

    <div class="stack">
      <div class="card">
        <div class="card-head"><span class="card-title">Jornada laboral</span></div>
        <div class="card-body">
          <dl class="kv">
            <dt>Inicio de jornada</dt><dd class="mono">08:00</dd>
            <dt>Fin de jornada</dt><dd class="mono">17:00</dd>
            <dt>Días hábiles</dt><dd>Lunes a viernes</dd>
            <dt>Aviso “por vencer”</dt><dd class="num">80 % del tiempo esperado</dd>
            <dt>Hora de almuerzo</dt><dd class="muted">Por definir con el cliente</dd>
          </dl>
        </div>
      </div>

      <div class="card">
        <div class="card-head"><span class="card-title">Feriados 2026</span>
          <span class="spacer"></span><span class="tiny muted">${CFG.feriados.length} cargados</span></div>
        <table class="tbl">
          <tbody>
          ${CFG.feriados.map(f => `<tr>
            <td class="mono tiny">${f.f}</td>
            <td>${esc(f.n)}</td>
            <td class="r">${f.validar ? `<span class="badge b-warn">Validar</span>` : ''}</td>
          </tr>`).join('')}
          </tbody>
        </table>
      </div>

      <div class="card">
        <div class="card-head"><span class="card-title">Usuarios y roles</span></div>
        <table class="tbl">
          <tbody>
          ${USUARIOS.map(u => `<tr>
            <td>${esc(u.nombre)}<div class="tiny muted mono">${u.codigo}</div></td>
            <td class="r"><span class="badge b-idle">${u.rol === 'soporte' ? 'Soporte IT' : u.rol === 'admin' ? 'Admin' : 'Empleado'}</span></td>
          </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>
  </div>`;
}

/* ============================================================
   Informe ejecutivo
   ============================================================ */
function vInforme() {
  const g = gestion(S.gestionId);
  const c = cliente(g.clienteId), r = resumen(g);
  const pasos = g.pasos.filter(p => p.inicio || p.noAplica);
  const t = ahora();

  return `
  <div class="row" style="margin-bottom:16px">
    <button class="btn btn-sm btn-ghost" data-act="volver-file">${ico('back',14)} Volver al file</button>
    <span class="spacer"></span>
    <button class="btn btn-sm" data-export="PDF">${ico('down',13)} Descargar PDF</button>
    <button class="btn btn-sm btn-primary" data-act="enviar-informe">${ico('mail',13)} Enviar al cliente</button>
  </div>

  <div class="sheet">
    <div class="sheet-brand">
      <div class="sheet-logo">CS</div>
      <div style="flex:1">
        <h1>Informe ejecutivo de tiempos</h1>
        <div style="color:#58616d;font-size:11.5px">CSLogi · Agenciamiento aduanal</div>
      </div>
      <div style="text-align:right;font-size:10.5px;color:#58616d">
        <div>Folio <strong class="mono">INF-2026-0${g.id.slice(1)}4</strong></div>
        <div>${fFull(t)}</div>
      </div>
    </div>

    <table style="margin-top:20px">
      <tbody>
        <tr><td style="width:150px;color:#58616d">File interno</td><td><strong class="mono">${g.file}</strong></td>
            <td style="width:120px;color:#58616d">Trámite</td><td>${TIPOS[g.tipo].nombre}</td></tr>
        <tr><td style="color:#58616d">Cliente</td><td>${esc(c.nombre)}</td>
            <td style="color:#58616d">Selectivo</td><td>${g.selectivo || '—'}</td></tr>
        <tr><td style="color:#58616d">Rango de files</td><td class="mono">${g.rangoDesde} – ${g.rangoHasta}</td>
            <td style="color:#58616d">Apertura</td><td>${fFull(g.t2)}</td></tr>
      </tbody>
    </table>

    <h2 style="font-size:13px;margin:26px 0 9px;letter-spacing:-.01em">Resumen de tiempos</h2>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px">
      ${[['Horas hábiles consumidas', h2(r.consumido)+' h', ''],
         ['Tiempo esperado', h2(r.esperadoIniciados)+' h', ''],
         ['Diferencia', (r.dif>=0?'+':'')+h2(r.dif)+' h', r.dif>=0?'#0f6b40':'#b3261e']].map(([l,v,col]) => `
        <div style="border:1px solid #e3e6ea;border-radius:6px;padding:10px 12px">
          <div style="font-size:10px;color:#58616d;text-transform:uppercase;letter-spacing:.05em">${l}</div>
          <div style="font-size:20px;font-weight:650;letter-spacing:-.03em;margin-top:2px;${col?`color:${col}`:''}" class="num">${v}</div>
        </div>`).join('')}
    </div>

    <h2 style="font-size:13px;margin:26px 0 9px;letter-spacing:-.01em">Línea de tiempo del trámite</h2>
    <table>
      <thead><tr><th style="width:42px">N.º</th><th>Paso</th><th style="width:118px">Responsable</th>
        <th style="width:86px">Inicio</th><th style="width:86px">Fin</th>
        <th style="width:52px;text-align:right">Horas</th><th style="width:72px">Estado</th></tr></thead>
      <tbody>
      ${pasos.map(p => {
        const e = estadoPaso(p, t), i = ESTADO_INFO[e];
        const col = e==='late' ? '#b3261e' : e==='warn' ? '#8a5900' : e==='ok' ? '#0f6b40' : '#58616d';
        return `<tr>
          <td class="mono">${p.n}</td>
          <td>${esc(p.nombre || 'Por definir')}</td>
          <td style="color:#58616d">${esc(p.responsable || '—')}</td>
          <td class="mono">${p.inicio ? fFecha(p.inicio)+' '+fHora(p.inicio) : '—'}</td>
          <td class="mono">${p.fin ? fFecha(p.fin)+' '+fHora(p.fin) : '—'}</td>
          <td class="mono" style="text-align:right;font-weight:600">${p.inicio ? h2(horasHabiles(p.inicio, p.fin||t)) : '—'}</td>
          <td style="color:${col};font-weight:600">${i.txt}</td>
        </tr>`;
      }).join('')}
      </tbody>
    </table>

    ${(() => {
      const obs = [];
      g.pasos.forEach(p => {
        p.intentos?.forEach(i => obs.push(`Paso ${p.n}: reiniciado el ${fFull(i.cuando)}. ${i.motivo}`));
        if (p.noAplica && p.naMotivo) obs.push(`Paso ${p.n}: no aplicó. ${p.naMotivo}`);
      });
      return obs.length ? `
        <h2 style="font-size:13px;margin:26px 0 9px;letter-spacing:-.01em">Observaciones</h2>
        <ul style="margin:0;padding-left:17px;color:#58616d;line-height:1.65">
          ${obs.map(o => `<li>${esc(o)}</li>`).join('')}
        </ul>` : '';
    })()}

    <div class="sheet-foot">
      <div>Emitido por ${esc(S.usuario.nombre)} · ${esc(S.usuario.codigo)}</div>
      <div style="margin-left:auto">Los tiempos se calculan en horas hábiles: lunes a viernes de 08:00 a 17:00, sin feriados.</div>
    </div>
  </div>

  <p class="tiny muted" style="text-align:center;margin-top:16px">
    Vista previa del documento que se genera en PDF. Pendiente el logo definitivo de CSLogi.
  </p>`;
}

/* ============================================================
   Modales
   ============================================================ */
function abrirModal(html) {
  document.getElementById('modal-root').innerHTML = `<div class="overlay" data-overlay>${html}</div>`;
  conectarModal();
}
function cerrarModal() { document.getElementById('modal-root').innerHTML = ''; }

function modalBitacora(gid) {
  const g = gestion(gid);
  const items = bitacoraDe(gid);
  const ICOS = { inicio:'play', fin:'check', reinicio:'undo', na:'minus', crear:'plus', correo:'mail', selectivo:'shield', correccion:'undo', revision:'eye' };
  return `
  <div class="modal is-wide">
    <div class="modal-head">
      <div>
        <div class="modal-title">Bitácora · ${g.file}</div>
        <div class="tiny muted">Registro de quién hizo qué y cuándo. No se edita ni se borra.</div>
      </div>
      <span class="spacer"></span>
      <button class="icon-btn" data-cerrar>${ico('x',17)}</button>
    </div>
    <div class="modal-body">
      <div class="log">
        ${items.map(b => `
          <div class="log-row">
            <div class="log-time mono">${fFull(b.cuando)}</div>
            <div class="log-ico">${ico(ICOS[b.tipo] || 'dot', 14)}</div>
            <div>
              <div class="log-txt">${esc(b.texto)}</div>
              <div class="log-who">${esc(user(b.por)?.nombre || '—')} · ${esc(user(b.por)?.codigo || '')}${b.resp ? ` · responsable: ${esc(b.resp)}` : ''}</div>
              ${b.motivo ? `<div class="log-diff">Motivo: ${esc(b.motivo)}</div>` : ''}
              ${b.antes ? `<div class="log-diff"><div><s>${esc(b.antes)}</s></div><div><b>${esc(b.despues)}</b></div></div>` : ''}
            </div>
          </div>`).join('')}
      </div>
    </div>
    <div class="modal-foot">
      <span class="tiny muted" style="margin-right:auto">${ico('shield',13)} Hora de servidor · registro inalterable</span>
      <button class="btn" data-cerrar>Cerrar</button>
    </div>
  </div>`;
}

function modalReiniciar(n) {
  return `
  <div class="modal">
    <div class="modal-head"><div class="modal-title">Reiniciar paso ${n}</div>
      <span class="spacer"></span><button class="icon-btn" data-cerrar>${ico('x',17)}</button></div>
    <div class="modal-body stack">
      <div class="note note-warn">${ico('alert',15)}
        <div>El intento actual no se borra: queda registrado como anulado y sus horas siguen contando en el total.
        Se enviará aviso al jefe.</div></div>
      <div class="field">
        <label class="label" for="m-motivo">Motivo del reinicio</label>
        <textarea class="input" id="m-motivo" rows="3" style="height:auto;padding:8px 10px"
          placeholder="Ej.: se marcó el paso equivocado"></textarea>
      </div>
    </div>
    <div class="modal-foot">
      <button class="btn" data-cerrar>Cancelar</button>
      <button class="btn btn-danger" data-confirmar-reinicio="${n}">Reiniciar paso</button>
    </div>
  </div>`;
}

function modalNoAplica(n) {
  return `
  <div class="modal">
    <div class="modal-head"><div class="modal-title">Marcar paso ${n} como no aplica</div>
      <span class="spacer"></span><button class="icon-btn" data-cerrar>${ico('x',17)}</button></div>
    <div class="modal-body stack">
      <div class="note">${ico('info',15)}<div>El paso se salta y habilita el siguiente. No cuenta tiempo ni genera retraso.</div></div>
      <div class="field">
        <label class="label" for="m-motivo">Motivo</label>
        <textarea class="input" id="m-motivo" rows="3" style="height:auto;padding:8px 10px"
          placeholder="Ej.: el contenedor ingresó sin cola ese día"></textarea>
      </div>
    </div>
    <div class="modal-foot">
      <button class="btn" data-cerrar>Cancelar</button>
      <button class="btn btn-primary" data-confirmar-na="${n}">Marcar como no aplica</button>
    </div>
  </div>`;
}

function modalRevisar(gid) {
  const g = gestion(gid), r = resumen(g);
  return `
  <div class="modal">
    <div class="modal-head"><div class="modal-title">Revisar gestión ${g.file}</div>
      <span class="spacer"></span><button class="icon-btn" data-cerrar>${ico('x',17)}</button></div>
    <div class="modal-body stack">
      <dl class="kv">
        <dt>Pasos completados</dt><dd class="num">${progreso(g).hechos} de ${progreso(g).total}</dd>
        <dt>Horas consumidas</dt><dd class="num">${h2(r.consumido)} h</dd>
        <dt>Tiempo esperado</dt><dd class="num">${h2(r.esperadoIniciados)} h</dd>
        <dt>Pasos con retraso</dt><dd class="num ${r.retrasados?'v-late':''}">${r.retrasados}</dd>
      </dl>
      <div class="note">${ico('info',15)}
        <div>Si algo quedó mal, podés reabrir los campos para corregir. Toda corrección queda versionada
        con su valor anterior, el nuevo, quién la hizo y por qué.</div></div>
    </div>
    <div class="modal-foot">
      <button class="btn" data-reabrir="${gid}">Reabrir para corregir</button>
      <span class="spacer"></span>
      <button class="btn btn-primary" data-finalizar="${gid}">Finalizar gestión</button>
    </div>
  </div>`;
}

function modalDrill(titulo, lista) {
  return `
  <div class="modal is-wide">
    <div class="modal-head"><div class="modal-title">${esc(titulo)}</div>
      <span class="spacer"></span><button class="icon-btn" data-cerrar>${ico('x',17)}</button></div>
    <div class="modal-body" style="padding:0">${tablaGestiones(lista)}</div>
    <div class="modal-foot"><button class="btn" data-cerrar>Cerrar</button></div>
  </div>`;
}

function modalPasoDetalle(n) {
  const filas = [];
  GESTIONES.forEach(g => {
    const p = g.pasos.find(x => x.n === n && x.bloque === 'COMUN');
    if (!p?.inicio) return;
    const t = ahora(), e = estadoPaso(p, t), i = ESTADO_INFO[e];
    filas.push({ g, p, horas: horasHabiles(p.inicio, p.fin || t), i });
  });
  const pc = PASOS_COMUNES.find(x => x.n === n);
  return `
  <div class="modal is-wide">
    <div class="modal-head">
      <div><div class="modal-title">Paso ${n} · ${esc(pc.nombre)}</div>
      <div class="tiny muted">Todos los files que pasaron por aquí</div></div>
      <span class="spacer"></span><button class="icon-btn" data-cerrar>${ico('x',17)}</button></div>
    <div class="modal-body" style="padding:0">
      <table class="tbl">
        <thead><tr><th>File</th><th>Cliente</th><th>Responsable</th><th>Inicio</th><th>Fin</th>
          <th class="r">Horas</th><th class="r">Esperado</th><th>Estado</th></tr></thead>
        <tbody>
        ${filas.map(f => `<tr>
          <td class="mono" style="font-weight:600">${f.g.file}</td>
          <td>${esc(cliente(f.g.clienteId).nombre)}</td>
          <td class="tiny">${esc(f.p.responsable)}</td>
          <td class="mono tiny">${fFecha(f.p.inicio)} ${fHora(f.p.inicio)}</td>
          <td class="mono tiny">${f.p.fin ? fFecha(f.p.fin)+' '+fHora(f.p.fin) : '—'}</td>
          <td class="r num" style="font-weight:600">${h2(f.horas)}</td>
          <td class="r num muted">${h2(f.p.esp)}</td>
          <td><span class="badge ${f.i.cls}">${ico(f.i.ico,11)}${f.i.txt}</span></td>
        </tr>`).join('')}
        </tbody>
      </table>
    </div>
    <div class="modal-foot"><button class="btn" data-cerrar>Cerrar</button></div>
  </div>`;
}

function modalEditarIP(uid) {
  const u = user(uid);
  return `
  <div class="modal">
    <div class="modal-head"><div class="modal-title">IP autorizada · ${esc(u.nombre)}</div>
      <span class="spacer"></span><button class="icon-btn" data-cerrar>${ico('x',17)}</button></div>
    <div class="modal-body stack">
      <div class="field">
        <label class="label" for="ip-val">Dirección IP o rango</label>
        <input class="input mono" id="ip-val" value="${esc(u.ip)}">
        <span class="hint">Se admite una IP exacta (190.148.33.72) o un rango en notación CIDR (181.174.90.0/24).</span>
      </div>
      <div class="field">
        <label class="label" for="ip-tipo">Ubicación</label>
        <select class="select" id="ip-tipo">
          ${['Oficina','Remoto','Sin restricción'].map(t => `<option ${u.ipTipo===t?'selected':''}>${t}</option>`).join('')}
        </select>
      </div>
      <div class="note">${ico('info',15)}<div>El cambio queda registrado en bitácora con tu usuario y la hora del servidor.</div></div>
    </div>
    <div class="modal-foot">
      <button class="btn" data-cerrar>Cancelar</button>
      <button class="btn btn-primary" data-guardar-ip="${uid}">Guardar</button>
    </div>
  </div>`;
}

function modalCliente() {
  return `
  <div class="modal">
    <div class="modal-head"><div class="modal-title">Nuevo cliente</div>
      <span class="spacer"></span><button class="icon-btn" data-cerrar>${ico('x',17)}</button></div>
    <div class="modal-body stack">
      <div class="grid-2">
        <div class="field"><label class="label" for="c-nom">Nombre o razón social</label>
          <input class="input" id="c-nom" placeholder="Importadora…"></div>
        <div class="field"><label class="label">Código</label>
          <input class="input input-readonly mono" readonly value="${String(CLIENTES.length+1).padStart(3,'0')}">
          <span class="hint">Lo asigna el sistema, sin repetirse</span></div>
      </div>
      <div class="grid-2">
        <div class="field"><label class="label" for="c-enc">Nombre del encargado</label><input class="input" id="c-enc"></div>
        <div class="field"><label class="label" for="c-tel">Teléfono del encargado</label><input class="input mono" id="c-tel" placeholder="+502 "></div>
      </div>
      <div class="grid-2">
        <div class="field"><label class="label" for="c-tele">Teléfono de la empresa</label><input class="input mono" id="c-tele" placeholder="+502 "></div>
        <div class="field"><label class="label" for="c-dir">Dirección</label><input class="input" id="c-dir"></div>
      </div>
      <div class="grid-2">
        <div class="field"><label class="label" for="c-cn">Correo para notificaciones</label><input class="input" id="c-cn" type="email"></div>
        <div class="field"><label class="label" for="c-ci">Correo para informes</label><input class="input" id="c-ci" type="email"></div>
      </div>
    </div>
    <div class="modal-foot">
      <button class="btn" data-cerrar>Cancelar</button>
      <button class="btn btn-primary" data-guardar-cliente>Guardar cliente</button>
    </div>
  </div>`;
}

/* ============================================================
   Acciones
   ============================================================ */
function iniciarPaso(g, n) {
  const p = g.pasos.find(x => x.n === n);
  p.inicio = ahora();
  log(g.id, 'inicio', `Paso ${p.n} · ${p.nombre || 'sin definir'} · inicia`, { resp: p.responsable });
  if (p.correo === 'Al iniciar el paso') {
    enviarCorreo(cliente(g.clienteId).correoNotif, `Su trámite ${g.file} avanzó: ${p.nombre}`, g.id);
  }
  render();
}

function finalizarPaso(g, n) {
  const p = g.pasos.find(x => x.n === n);
  p.fin = ahora();
  const horas = horasHabiles(p.inicio, p.fin);
  const est = estadoPaso(p, ahora());
  log(g.id, 'fin', `Paso ${p.n} · ${p.nombre || 'sin definir'} · finaliza · ${h2(horas)} h`);

  if (est === 'late') {
    enviarCorreo('administracion@cslogi.com.gt', `RETRASO · ${g.file} · paso ${p.n} ${p.nombre}`, g.id);
  }
  if (p.correo === 'Al finalizar el paso') {
    enviarCorreo(cliente(g.clienteId).correoNotif, `Su trámite ${g.file} avanzó: ${p.nombre}`, g.id);
  }
  // ¿Todos listos?
  const todos = g.pasos.filter(x => !x.pendiente).every(x => x.fin || x.noAplica);
  if (todos && g.selectivo) { g.estado = 'porRevisar'; toast('Todos los pasos completados. La gestión pasa a revisión.'); }
  render();
  const el = document.querySelector(`[data-step="${CSS.escape(n)}"] .step-card`);
  if (el) { el.classList.add('step-done-flash'); setTimeout(() => el.classList.remove('step-done-flash'), 620); }
}

function conectar() {
  const r = root();

  r.querySelectorAll('[data-nav]').forEach(b => b.onclick = () => { S.vista = b.dataset.nav; S.gestionId = null; render(); });
  r.querySelectorAll('[data-rol]').forEach(b => b.onclick = () => {
    const rol = b.dataset.rol;
    S.usuario = USUARIOS.find(u => u.rol === rol);
    if (!NAV.find(n => n.id === S.vista)?.roles.includes(rol) && S.vista !== 'file') S.vista = 'inicio';
    render();
  });
  r.querySelectorAll('[data-open]').forEach(t => t.onclick = () => { S.gestionId = t.dataset.open; S.vista = 'file'; render(); });
  r.querySelectorAll('[data-drill]').forEach(t => t.onclick = () => {
    const k = t.dataset.drill;
    const mapa = {
      hoy:        ['Gestiones creadas hoy',  GESTIONES.filter(g => ymd(g.t2) === '2026-10-23')],
      ayer:       ['Gestiones creadas ayer', GESTIONES.filter(g => ymd(g.t2) === '2026-10-22')],
      activas:    ['Files activos',          GESTIONES.filter(g => g.estado !== 'finalizado')],
      atrasadas:  ['Files con retraso',      GESTIONES.filter(g => g.estado === 'abierto' && resumen(g).estado === 'late')],
      porRevisar: ['Files por revisar',      GESTIONES.filter(g => g.estado === 'porRevisar')],
    }[k];
    abrirModal(modalDrill(mapa[0], mapa[1]));
  });
  r.querySelectorAll('[data-paso]').forEach(t => t.onclick = () => abrirModal(modalPasoDetalle(t.dataset.paso)));
  r.querySelectorAll('[data-modo]').forEach(b => b.onclick = () => { S.reporte.modo = b.dataset.modo; render(); });
  r.querySelectorAll('[data-export]').forEach(b => b.onclick = () => toast(`Archivo ${b.dataset.export} generado`));
  r.querySelectorAll('[data-editip]').forEach(b => b.onclick = () => abrirModal(modalEditarIP(b.dataset.editip)));
  r.querySelectorAll('[data-aprobar]').forEach(b => b.onclick = () => {
    const s = SOLICITUDES_IP.find(x => x.id === b.dataset.aprobar);
    s.estado = 'aprobada'; user(s.usuario).ip = s.ipNueva;
    toast(`IP autorizada para ${user(s.usuario).nombre}`); render();
  });
  r.querySelectorAll('[data-rechazar]').forEach(b => b.onclick = () => {
    SOLICITUDES_IP.find(x => x.id === b.dataset.rechazar).estado = 'rechazada';
    toast('Solicitud rechazada'); render();
  });

  // Filtros
  const q = r.querySelector('#f-q');
  if (q) { q.oninput = () => { S.filtro.q = q.value; const p = q.selectionStart; render(); const n = root().querySelector('#f-q'); n.focus(); n.setSelectionRange(p,p); }; }
  const ft = r.querySelector('#f-tipo');   if (ft) ft.onchange = () => { S.filtro.tipo = ft.value; render(); };
  const fe = r.querySelector('#f-estado'); if (fe) fe.onchange = () => { S.filtro.estado = fe.value; render(); };
  const rc = r.querySelector('#r-cli');    if (rc) rc.onchange = () => { S.reporte.cliente = rc.value; render(); };
  const rd = r.querySelector('#r-d');      if (rd) rd.onchange = () => { S.reporte.desde = rd.value; render(); };
  const rh = r.querySelector('#r-h');      if (rh) rh.onchange = () => { S.reporte.hasta = rh.value; render(); };

  // Pasos
  const g = S.gestionId ? gestion(S.gestionId) : null;
  if (g) {
    r.querySelectorAll('[data-ini]').forEach(b => b.onclick = () => iniciarPaso(g, b.dataset.ini));
    r.querySelectorAll('[data-fin]').forEach(b => b.onclick = () => finalizarPaso(g, b.dataset.fin));
    r.querySelectorAll('[data-reiniciar]').forEach(b => b.onclick = () => abrirModal(modalReiniciar(b.dataset.reiniciar)));
    r.querySelectorAll('[data-na]').forEach(b => b.onclick = () => abrirModal(modalNoAplica(b.dataset.na)));
    r.querySelectorAll('[data-resp]').forEach(s => s.onchange = () => {
      const p = g.pasos.find(x => x.n === s.dataset.resp);
      log(g.id, 'correccion', `Paso ${p.n} · cambio de responsable`, { antes: p.responsable, despues: s.value });
      p.responsable = s.value; toast('Responsable actualizado'); render();
    });
    r.querySelectorAll('[data-selectivo]').forEach(b => b.onclick = () => {
      const v = b.dataset.selectivo;
      g.selectivo = v;
      const p10 = g.pasos.find(x => x.n === '10');
      p10.fin = ahora();
      PASOS_RUTA[g.tipo][v === 'Verde' ? 'VERDE' : 'ROJA'].forEach(p =>
        g.pasos.push({ ...p, bloque: 'RUTA', esp: p.esp ?? null, responsable: p.resp, inicio: null, fin: null, noAplica: false, intentos: [] }));
      log(g.id, 'selectivo', `Resultado del selectivo: ${v} · se habilita la ruta ${v.toLowerCase()}`);
      toast(`Selectivo ${v}. Se habilitaron ${PASOS_RUTA[g.tipo][v==='Verde'?'VERDE':'ROJA'].length} pasos.`);
      render();
    });
    const bi = r.querySelector('[data-act="bitacora"]'); if (bi) bi.onclick = () => abrirModal(modalBitacora(g.id));
    const rv = r.querySelector('[data-act="revisar"]');  if (rv) rv.onclick = () => abrirModal(modalRevisar(g.id));
    const inf = r.querySelector('[data-act="informe"]'); if (inf) inf.onclick = () => { S.vista = 'informe'; render(); };
  }

  // Acciones generales
  const act = (name, fn) => { const b = r.querySelector(`[data-act="${name}"]`); if (b) b.onclick = fn; };
  const entrar = () => { S.autenticado = true; S.vista = 'inicio'; toast('Sesión iniciada · la trazabilidad comenzó'); render(); };
  act('login', entrar);
  r.querySelectorAll('#li-cod, #li-pw').forEach(i => i.onkeydown = (e) => { if (e.key === 'Enter') entrar(); });
  act('salir', () => { S.autenticado = false; render(); });
  act('tema', () => {
    S.tema = S.tema === 'light' ? 'dark' : 'light';
    document.documentElement.dataset.theme = S.tema;
    try { localStorage.setItem('cslogi-tema', S.tema); } catch {}
    render();
  });
  act('nueva', () => { S.nueva = { paso: 1, tipo: null, clienteId: null, t1: ahora() }; S.vista = 'nueva'; render(); });
  act('nueva-atras', () => { S.nueva.paso = 1; render(); });
  act('volver-file', () => { S.vista = 'file'; render(); });
  act('cliente-nuevo', () => abrirModal(modalCliente()));
  act('enviar-informe', () => {
    const gg = gestion(S.gestionId);
    enviarCorreo(cliente(gg.clienteId).correoInf, `Informe ejecutivo · ${gg.file}`, gg.id);
  });
  act('marcar-entrada', () => {
    ASISTENCIA.unshift({ usuario: S.usuario.id, fecha: '2026-10-23', entrada: fHora(ahora()), salida: null, ip: S.usuario.ip });
    toast(`Entrada marcada a las ${fHora(ahora())}`); render();
  });
  act('marcar-salida', () => {
    const a = ASISTENCIA.find(x => x.usuario === S.usuario.id && x.fecha === '2026-10-23');
    a.salida = fHora(ahora()); toast(`Salida marcada a las ${a.salida}`); render();
  });

  r.querySelectorAll('[data-tipo]').forEach(b => b.onclick = () => {
    S.nueva.tipo = b.dataset.tipo; S.nueva.paso = 2; render();
  });
  const nc = r.querySelector('#n-cli');
  if (nc) nc.onchange = () => { S.nueva.clienteId = nc.value || null; render(); };
  act('guardar-gestion', () => {
    const n = S.nueva, c = cliente(n.clienteId);
    const file = nuevoFile(n.clienteId);
    const nueva = {
      id: 'g' + (GESTIONES.length + 1), file,
      rangoDesde: root().querySelector('#n-d')?.value || file,
      rangoHasta: root().querySelector('#n-h')?.value || file,
      clienteId: n.clienteId, tipo: n.tipo, selectivo: null, estado: 'abierto',
      creadaPor: S.usuario.id, t1: n.t1, t2: ahora(),
      pasos: construirPasos(n.tipo, null),
    };
    GESTIONES.push(nueva);
    log(nueva.id, 'crear', `Gestión guardada · file ${file}`);
    toast(`Gestión ${file} creada`);
    S.gestionId = nueva.id; S.vista = 'file'; S.nueva = null; render();
  });
}

function conectarModal() {
  const m = document.getElementById('modal-root');
  m.querySelectorAll('[data-cerrar]').forEach(b => b.onclick = cerrarModal);
  m.querySelector('[data-overlay]')?.addEventListener('click', e => { if (e.target.dataset.overlay !== undefined) cerrarModal(); });

  const g = S.gestionId ? gestion(S.gestionId) : null;

  m.querySelectorAll('[data-confirmar-reinicio]').forEach(b => b.onclick = () => {
    const n = b.dataset.confirmarReinicio;
    const p = g.pasos.find(x => x.n === n);
    const motivo = m.querySelector('#m-motivo').value.trim() || 'Sin motivo indicado';
    const horas = horasHabiles(p.inicio, ahora());
    p.intentos.push({ inicio: p.inicio, fin: ahora(), horas, motivo, por: S.usuario.id, cuando: ahora() });
    p.inicio = ahora(); p.fin = null;
    log(g.id, 'reinicio', `Paso ${p.n} · reiniciado · se anula un intento de ${h2(horas)} h`, { motivo });
    enviarCorreo('gerencia@cslogi.com.gt', `Paso reiniciado · ${g.file} · paso ${p.n}`, g.id);
    cerrarModal(); render();
  });

  m.querySelectorAll('[data-confirmar-na]').forEach(b => b.onclick = () => {
    const n = b.dataset.confirmarNa;
    const p = g.pasos.find(x => x.n === n);
    p.noAplica = true;
    p.naMotivo = m.querySelector('#m-motivo').value.trim() || 'Sin motivo indicado';
    p.naPor = S.usuario.id; p.naCuando = ahora();
    log(g.id, 'na', `Paso ${p.n} · marcado como no aplica`, { motivo: p.naMotivo });
    cerrarModal(); toast(`Paso ${n} marcado como no aplica`); render();
  });

  m.querySelectorAll('[data-finalizar]').forEach(b => b.onclick = () => {
    const gg = gestion(b.dataset.finalizar);
    gg.estado = 'finalizado'; gg.finalizadaPor = S.usuario.id; gg.finalizadaEl = ahora();
    log(gg.id, 'fin', 'Gestión finalizada');
    enviarCorreo(cliente(gg.clienteId).correoInf, `Informe ejecutivo · ${gg.file}`, gg.id);
    cerrarModal(); S.vista = 'informe'; render();
  });

  m.querySelectorAll('[data-reabrir]').forEach(b => b.onclick = () => {
    const gg = gestion(b.dataset.reabrir);
    gg.estado = 'abierto';
    log(gg.id, 'revision', 'Gestión reabierta para corrección tras la revisión');
    cerrarModal(); toast('Gestión reabierta. Las correcciones quedan versionadas.'); render();
  });

  m.querySelectorAll('[data-guardar-ip]').forEach(b => b.onclick = () => {
    const u = user(b.dataset.guardarIp);
    const antes = u.ip;
    u.ip = m.querySelector('#ip-val').value.trim();
    u.ipTipo = m.querySelector('#ip-tipo').value;
    toast(`IP de ${u.nombre} actualizada`);
    cerrarModal(); render();
  });

  m.querySelectorAll('[data-guardar-cliente]').forEach(b => b.onclick = () => {
    const v = (id) => m.querySelector(id)?.value.trim() || '';
    if (!v('#c-nom')) { toast('Falta el nombre del cliente'); return; }
    CLIENTES.push({
      id: 'c' + (CLIENTES.length + 1), codigo: String(CLIENTES.length + 1).padStart(3,'0'),
      nombre: v('#c-nom'), encargado: v('#c-enc'), telEnc: v('#c-tel'), telEmp: v('#c-tele'),
      dir: v('#c-dir'), correoNotif: v('#c-cn'), correoInf: v('#c-ci'), activo: true,
    });
    cerrarModal(); toast('Cliente creado'); render();
  });

  document.onkeydown = (e) => { if (e.key === 'Escape') cerrarModal(); };
}

/* ---------- Reloj en vivo ---------- */
setInterval(() => {
  if (!S.autenticado) return;
  if (S.vista === 'file' || S.vista === 'asistencia' || S.vista === 'inicio') {
    const abierto = document.getElementById('modal-root').children.length > 0;
    if (!abierto && !document.activeElement?.closest('input,select,textarea')) render();
  }
}, 30000);

render();
