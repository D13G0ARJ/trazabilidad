/* ============================================================
   CSLogi · Trazabilidad — datos y reglas de negocio
   Todos los datos son de DEMOSTRACIÓN.
   ============================================================ */

/* ---------- Parámetros de la empresa ---------- */
const CFG = {
  jornadaInicio: 8,          // 08:00
  jornadaFin: 17,            // 17:00
  umbralAviso: 0.80,         // "por vencer" al 80 % del tiempo esperado
  diasHabiles: [1, 2, 3, 4, 5], // lunes a viernes
  feriados: [
    { f: '2026-01-01', n: 'Año Nuevo' },
    { f: '2026-04-02', n: 'Jueves Santo', validar: true },
    { f: '2026-04-03', n: 'Viernes Santo', validar: true },
    { f: '2026-05-01', n: 'Día del Trabajo' },
    { f: '2026-06-30', n: 'Día del Ejército', validar: true },
    { f: '2026-09-15', n: 'Día de la Independencia' },
    { f: '2026-10-20', n: 'Día de la Revolución' },
    { f: '2026-11-01', n: 'Día de Todos los Santos' },
    { f: '2026-12-25', n: 'Navidad' },
  ],
};

/* ---------- Responsables ---------- */
const RESPONSABLES = [
  'Documentación', 'CS Logi', 'Transporte / Logística', 'Facturación',
  'Administración', 'Gestor aduanal', 'Cliente', 'SAT (externo)',
  'Puerto o Aeropuerto', 'Agente de carga / Naviera', 'MAGA-OIRSA', 'DIPAFRONT-SGAIA',
];

/* ---------- Tipos de trámite ---------- */
const TIPOS = {
  AEREO:        { nombre: 'Aéreo' },
  CONSOLIDADO:  { nombre: 'Consolidado Marítimo' },
  CONTENEDOR:   { nombre: 'Contenedor completo marítimo' },
  FRONTERA:     { nombre: 'Frontera' },
};

/* ---------- Catálogo de pasos ----------
   Los tiempos esperados marcados como null los entrega CSLogi.      */
const PASOS_COMUNES = [
  { n: '1',  nombre: 'Recepción de documentos',   resp: 'Documentación', esp: 3,    correo: 'Al finalizar el paso' },
  { n: '2',  nombre: 'Revisión de documentos',    resp: 'CS Logi',       esp: 4,    correo: 'No' },
  { n: '3',  nombre: 'Corrección de documentos',  resp: 'Cliente',       esp: 4,    correo: 'Al iniciar el paso', repetible: true },
  { n: '4',  nombre: 'Documentos completos',      resp: 'Documentación', esp: 0.5,  correo: 'Al finalizar el paso' },
  { n: '5',  nombre: 'Pre DUCA',                  resp: 'Gestor aduanal',esp: 8,    correo: 'No' },
  { n: '6',  nombre: 'Autorización Pre DUCA',     resp: 'Gestor aduanal',esp: null, correo: 'No' },
  { n: '7',  nombre: 'Firma de DUCA',             resp: 'Gestor aduanal',esp: null, correo: 'No' },
  { n: '8',  nombre: 'Pago de impuestos',         resp: 'Administración',esp: null, correo: 'No' },
  { n: '9',  nombre: 'Selectivo',                 resp: 'SAT (externo)', esp: null, correo: 'No' },
  { n: '10', nombre: 'Resultado del selectivo',   resp: 'SAT (externo)', esp: null, correo: 'No', defineRuta: true },
];

const PASOS_RUTA = {
  AEREO: {
    VERDE: [
      { n: '11.1', nombre: 'Pagar almacenaje',             resp: 'Administración' },
      { n: '11.2', nombre: 'Coordinar transporte',         resp: 'Transporte / Logística' },
      { n: '11.3', nombre: 'Realizar retiro de Combex',    resp: 'Transporte / Logística' },
      { n: '11.4', nombre: 'Realizar entrega con cliente', resp: 'Transporte / Logística' },
      { n: '11.5', nombre: 'Liquidación y facturación',    resp: 'Facturación', ultimo: true },
    ],
    ROJA: [
      { n: '11.1', nombre: 'Presentar declaración a SAT',   resp: 'Gestor aduanal' },
      { n: '11.2', nombre: 'Proceso de revisión física SAT',resp: 'SAT (externo)' },
      { n: '11.3', nombre: 'Liberación SAT',                resp: 'SAT (externo)' },
      { n: '11.4', nombre: 'Pagar almacenaje',              resp: 'Administración' },
      { n: '11.5', nombre: 'Coordinar transporte',          resp: 'Transporte / Logística' },
      { n: '11.6', nombre: 'Realizar retiro de Combex',     resp: 'Transporte / Logística' },
      { n: '11.7', nombre: 'Realizar entrega con cliente',  resp: 'Transporte / Logística' },
      { n: '11.8', nombre: 'Liquidación y facturación',     resp: 'Facturación', ultimo: true },
    ],
  },
  CONSOLIDADO: {
    VERDE: [
      { n: '11.1', nombre: 'Enviar a Gestor Duca con selectivo y escáner de documentos', resp: 'Documentación' },
      { n: '11.2', nombre: 'Presentar a SAT',                   resp: 'Gestor aduanal' },
      { n: '11.3', nombre: 'Revisión de documentos sin revisión física de carga', resp: 'SAT (externo)' },
      { n: '11.4', nombre: 'Liberación SAT',                    resp: 'SAT (externo)' },
      { n: '11.5', nombre: 'Pago de almacenaje',                resp: 'Administración' },
      { n: '11.6', nombre: 'Coordinar transporte',              resp: 'Transporte / Logística' },
      { n: '11.7', nombre: 'Carga de transporte',               resp: 'Transporte / Logística' },
      { n: '11.8', nombre: 'Llegada a bodega de cliente',       resp: 'Transporte / Logística' },
      { n: '11.9', nombre: 'Liquidación y facturación',         resp: 'Facturación', ultimo: true },
    ],
    ROJA: [
      { n: '11.1', nombre: 'Enviar a Gestor Duca con selectivo y escáner de documentos', resp: 'Documentación' },
      { n: '11.2', nombre: 'Presentar a SAT',                   resp: 'Gestor aduanal' },
      { n: '11.3', nombre: 'Revisión documental y física de la mercancía', resp: 'SAT (externo)' },
      { n: '11.4', nombre: 'Liberación SAT',                    resp: 'SAT (externo)' },
      { n: '11.5', nombre: 'Pago de almacenaje',                resp: 'Administración' },
      { n: '11.6', nombre: 'Coordinar transporte',              resp: 'Transporte / Logística' },
      { n: '11.7', nombre: 'Carga de transporte',               resp: 'Transporte / Logística' },
      { n: '11.8', nombre: 'Llegada a bodega de cliente',       resp: 'Transporte / Logística' },
      { n: '11.9', nombre: 'Liquidación y facturación',         resp: 'Facturación', ultimo: true },
    ],
  },
  CONTENEDOR: {
    VERDE: [
      { n: '11.1',  nombre: 'Enviar a Gestor Duca con selectivo y escáner de documentos', resp: 'Documentación' },
      { n: '11.2',  nombre: 'Presentar a SAT',                                resp: 'Gestor aduanal' },
      { n: '11.3',  nombre: 'Realizar proceso de liberación Autoridad Sanitaria', resp: 'MAGA-OIRSA' },
      { n: '11.4',  nombre: 'Revisión documental de SAT',                     resp: 'SAT (externo)' },
      { n: '11.5',  nombre: 'Liberación SAT y autoridades',                   resp: 'SAT (externo)' },
      { n: '11.6',  nombre: 'Proceso de Panel de movimiento de contenedores', resp: 'Puerto o Aeropuerto' },
      { n: '11.7',  nombre: 'Proceso Carga contenedor',                       resp: 'Puerto o Aeropuerto' },
      { n: '11.8',  nombre: 'Procesos de salida recinto portuario',           resp: 'Puerto o Aeropuerto' },
      { n: '11.9',  nombre: 'Proceso de viaje a bodega destino',              resp: 'Transporte / Logística' },
      { n: '11.10', nombre: 'Proceso descarga en bodega destino',             resp: 'Transporte / Logística' },
      { n: '11.11', nombre: 'Devolución de contenedor',                       resp: 'Agente de carga / Naviera' },
      { n: '11.12', nombre: 'Liquidación y facturación',                      resp: 'Facturación', ultimo: true },
    ],
    ROJA: [
      { n: '11.1',  nombre: 'Enviar a Gestor Duca con selectivo y escáner de documentos', resp: 'Documentación' },
      { n: '11.2',  nombre: 'Presentar a SAT',                                resp: 'Gestor aduanal' },
      { n: '11.3',  nombre: 'Realizar proceso documental de inspección de autoridades', resp: 'MAGA-OIRSA' },
      { n: '11.4',  nombre: 'Cola de ingreso a portuaria',                    resp: 'Puerto o Aeropuerto', condicional: true },
      { n: '11.5',  nombre: 'Proceso de Panel de movimiento de contenedores', resp: 'Puerto o Aeropuerto' },
      { n: '11.6',  nombre: 'Proceso Carga contenedor',                       resp: 'Puerto o Aeropuerto' },
      { n: '11.7',  nombre: 'Proceso de ubicación en rampa',                  resp: 'Puerto o Aeropuerto' },
      { n: '11.8',  nombre: 'Proceso de revisión física y documental SAT + Autoridades', resp: 'SAT (externo)' },
      { n: '11.9',  nombre: 'Liberación SAT y autoridades',                   resp: 'SAT (externo)' },
      { n: '11.10', nombre: 'Proceso de cita para carga de contenedor',       resp: 'Puerto o Aeropuerto' },
      { n: '11.11', nombre: 'Proceso de salida recinto portuario',            resp: 'Puerto o Aeropuerto' },
      { n: '11.13', nombre: 'Proceso de viaje a bodega destino',              resp: 'Transporte / Logística', nota: 'La numeración del instructivo salta del 11.11 al 11.13' },
      { n: '11.14', nombre: 'Proceso descarga en bodega destino',             resp: 'Transporte / Logística' },
      { n: '11.15', nombre: 'Devolución de contenedor',                       resp: 'Agente de carga / Naviera' },
      { n: '11.16', nombre: 'Liquidación y facturación',                      resp: 'Facturación', ultimo: true },
    ],
  },
  FRONTERA: {
    VERDE: Array.from({ length: 8 },  (_, i) => ({ n: `11.${i + 1}`, nombre: null, resp: null, pendiente: true })),
    ROJA:  Array.from({ length: 10 }, (_, i) => ({ n: `11.${i + 1}`, nombre: null, resp: null, pendiente: true })),
  },
};

/* ---------- Usuarios ---------- */
const USUARIOS = [
  { id: 'u1', codigo: 'EMP-014', nombre: 'Lucía Ramírez',  rol: 'empleado', ip: '190.148.33.72',  ipTipo: 'Oficina' },
  { id: 'u2', codigo: 'EMP-021', nombre: 'Diego Morales',  rol: 'empleado', ip: '181.174.90.0/24', ipTipo: 'Remoto' },
  { id: 'u3', codigo: 'EMP-007', nombre: 'Karla Sandoval', rol: 'empleado', ip: '190.148.33.72',  ipTipo: 'Oficina' },
  { id: 'u4', codigo: 'ADM-001', nombre: 'Cesar Simón',    rol: 'admin',    ip: '—',              ipTipo: 'Sin restricción' },
  { id: 'u5', codigo: 'SIT-002', nombre: 'Marco Pérez',    rol: 'soporte',  ip: '190.148.33.72',  ipTipo: 'Oficina' },
];

/* ---------- Clientes ---------- */
const CLIENTES = [
  { id: 'c1', codigo: '001', nombre: 'Importadora Demo, S.A.',   encargado: 'Ana Lucía Pérez',  telEnc: '+502 5521 8890', telEmp: '+502 2234 7700', dir: '12 Calle 3-45 Zona 10, Ciudad de Guatemala', correoNotif: 'operaciones@demo.com',    correoInf: 'gerencia@demo.com',    activo: true },
  { id: 'c2', codigo: '002', nombre: 'Distribuidora del Valle',  encargado: 'Rodrigo Castillo', telEnc: '+502 4412 0031', telEmp: '+502 2290 1120', dir: 'Km 14.5 Carretera a El Salvador',            correoNotif: 'logistica@delvalle.gt',  correoInf: 'direccion@delvalle.gt', activo: true },
  { id: 'c3', codigo: '003', nombre: 'Agroexportadora Petén',    encargado: 'María Fernanda Ic',telEnc: '+502 5598 4412', telEmp: '+502 7926 3300', dir: '5a Avenida 2-18 Zona 1, Flores, Petén',      correoNotif: 'importaciones@agropeten.gt', correoInf: 'gerencia@agropeten.gt', activo: true },
  { id: 'c4', codigo: '004', nombre: 'Textiles Quetzal',         encargado: 'Jorge Barrientos', telEnc: '+502 5003 7781', telEmp: '+502 2445 9900', dir: 'Calzada Roosevelt 22-43 Zona 11',            correoNotif: 'compras@texquetzal.com', correoInf: 'gerencia@texquetzal.com', activo: true },
  { id: 'c5', codigo: '005', nombre: 'Ferretería Industrial GT', encargado: 'Sandra Juárez',    telEnc: '+502 4477 1209', telEmp: '+502 2380 4455', dir: '8a Avenida 15-20 Zona 12',                   correoNotif: 'bodega@ferrindgt.com',   correoInf: 'admin@ferrindgt.com',  activo: false },
];

/* ============================================================
   Motor de horas hábiles
   ============================================================ */
const FERIADOS = new Set(CFG.feriados.map(f => f.f));

function ymd(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
function esHabil(d) {
  return CFG.diasHabiles.includes(d.getDay()) && !FERIADOS.has(ymd(d));
}
/** Horas hábiles entre dos instantes, contando solo jornada laboral. */
function horasHabiles(inicio, fin) {
  if (!inicio || !fin || fin <= inicio) return 0;
  const ini = CFG.jornadaInicio, finJ = CFG.jornadaFin;
  const clamp = (h) => Math.min(Math.max(h, ini), finJ);
  let total = 0;
  const cursor = new Date(inicio.getFullYear(), inicio.getMonth(), inicio.getDate());
  const ultimo = new Date(fin.getFullYear(), fin.getMonth(), fin.getDate());

  while (cursor <= ultimo) {
    if (esHabil(cursor)) {
      const mismoDiaIni = cursor.toDateString() === inicio.toDateString();
      const mismoDiaFin = cursor.toDateString() === fin.toDateString();
      const desde = mismoDiaIni ? clamp(inicio.getHours() + inicio.getMinutes() / 60) : ini;
      const hasta = mismoDiaFin ? clamp(fin.getHours() + fin.getMinutes() / 60)       : finJ;
      total += Math.max(0, hasta - desde);
    }
    cursor.setDate(cursor.getDate() + 1);
  }
  return Math.round(total * 100) / 100;
}

/** Estado de un paso a partir de sus horas y su tiempo esperado. */
function estadoPaso(p, ahora) {
  if (p.noAplica) return 'na';
  if (!p.inicio)  return 'idle';
  const fin = p.fin || ahora;
  const h = horasHabiles(p.inicio, fin);
  if (p.esp == null) return p.fin ? 'ok' : 'run';
  if (h > p.esp)                     return 'late';
  if (p.fin)                         return 'ok';
  if (h >= p.esp * CFG.umbralAviso)  return 'warn';
  return 'run';
}

const ESTADO_INFO = {
  ok:   { txt: 'Cumplido',   cls: 'b-ok',   m: 'm-ok',   ico: 'check' },
  run:  { txt: 'En curso',   cls: 'b-run',  m: 'm-run',  ico: 'play' },
  warn: { txt: 'Por vencer', cls: 'b-warn', m: 'm-warn', ico: 'clock' },
  late: { txt: 'Retraso',    cls: 'b-late', m: 'm-late', ico: 'alert' },
  idle: { txt: 'Sin iniciar',cls: 'b-idle', m: '',       ico: 'dot' },
  na:   { txt: 'No aplica',  cls: 'b-idle', m: 'm-na',   ico: 'minus' },
};

/* ============================================================
   Gestiones de demostración
   ============================================================ */
const D = (s) => new Date(s);

/** Arma los pasos de una gestión a partir del catálogo. */
function construirPasos(tipo, selectivo) {
  const pasos = PASOS_COMUNES.map(p => ({ ...p, bloque: 'COMUN', responsable: p.resp, inicio: null, fin: null, noAplica: false, intentos: [] }));
  if (selectivo) {
    const ruta = PASOS_RUTA[tipo][selectivo === 'Verde' ? 'VERDE' : 'ROJA'];
    ruta.forEach(p => pasos.push({ ...p, bloque: 'RUTA', esp: p.esp ?? null, responsable: p.resp, inicio: null, fin: null, noAplica: false, intentos: [] }));
  }
  return pasos;
}

function aplicar(pasos, marcas) {
  marcas.forEach(([n, ini, fin, extra]) => {
    const p = pasos.find(x => x.n === n);
    if (!p) return;
    if (ini) p.inicio = D(ini);
    if (fin) p.fin = D(fin);
    if (extra) Object.assign(p, extra);
  });
  return pasos;
}

/* --- G1 · Aéreo verde, en curso --- */
const g1 = {
  id: 'g1', file: 'A26I10001', rangoDesde: 'A26I10001', rangoHasta: 'A26I10020',
  clienteId: 'c1', tipo: 'AEREO', selectivo: 'Verde', estado: 'abierto',
  creadaPor: 'u1', t1: D('2026-10-19T08:22:00'), t2: D('2026-10-19T08:29:00'),
};
g1.pasos = aplicar(construirPasos('AEREO', 'Verde'), [
  ['1',    '2026-10-19T08:30', '2026-10-19T11:00'],
  ['2',    '2026-10-19T11:00', '2026-10-19T16:00'],
  ['3',    '2026-10-19T16:00', '2026-10-21T10:00'],
  ['4',    '2026-10-21T10:00', '2026-10-21T10:15'],
  ['5',    '2026-10-21T10:15', '2026-10-21T15:30', { esp: 8 }],
  ['6',    '2026-10-21T15:30', '2026-10-21T16:45', { esp: 2 }],
  ['7',    '2026-10-21T16:45', '2026-10-22T08:30', { esp: 1 }],
  ['8',    '2026-10-22T08:30', '2026-10-22T10:00', { esp: 2 }],
  ['9',    '2026-10-22T10:00', '2026-10-22T11:20', { esp: 1 }],
  ['10',   '2026-10-22T11:20', '2026-10-22T11:25', { esp: 0.25 }],
  ['11.1', '2026-10-22T11:25', '2026-10-22T13:10', { esp: 2 }],
  ['11.2', '2026-10-22T13:10', null,               { esp: 3 }],
  ['11.3', null, null, { esp: 4 }],
  ['11.4', null, null, { esp: 6 }],
  ['11.5', null, null, { esp: 2 }],
]);

/* --- G2 · Contenedor completo rojo, en curso --- */
const g2 = {
  id: 'g2', file: 'A26I20014', rangoDesde: 'A26I20014', rangoHasta: 'A26I20014',
  clienteId: 'c2', tipo: 'CONTENEDOR', selectivo: 'Rojo', estado: 'abierto',
  creadaPor: 'u2', t1: D('2026-10-15T09:02:00'), t2: D('2026-10-15T09:14:00'),
};
g2.pasos = aplicar(construirPasos('CONTENEDOR', 'Rojo'), [
  ['1',    '2026-10-15T09:15', '2026-10-15T11:30'],
  ['2',    '2026-10-15T11:30', '2026-10-15T14:00'],
  ['3',    '2026-10-15T14:00', '2026-10-16T09:30', { intentos: [{ inicio: D('2026-10-15T14:00'), fin: D('2026-10-15T16:00'), horas: 2, motivo: 'El cliente envió el paquete equivocado; se reinicia el conteo.', por: 'u1', cuando: D('2026-10-15T16:05') }] }],
  ['4',    '2026-10-16T09:30', '2026-10-16T09:50'],
  ['5',    '2026-10-16T09:50', '2026-10-16T16:40', { esp: 8 }],
  ['6',    '2026-10-16T16:40', '2026-10-19T09:10', { esp: 2 }],
  ['7',    '2026-10-19T09:10', '2026-10-19T10:00', { esp: 1 }],
  ['8',    '2026-10-19T10:00', '2026-10-19T11:15', { esp: 2 }],
  ['9',    '2026-10-19T11:15', '2026-10-19T13:00', { esp: 1 }],
  ['10',   '2026-10-19T13:00', '2026-10-19T13:05', { esp: 0.25 }],
  ['11.1', '2026-10-19T13:05', '2026-10-19T14:40', { esp: 2 }],
  ['11.2', '2026-10-19T14:40', '2026-10-21T10:20', { esp: 4 }],
  ['11.3', '2026-10-21T10:20', '2026-10-21T16:00', { esp: 6 }],
  ['11.4', null, null, { esp: 3, noAplica: true, naMotivo: 'El contenedor ingresó sin cola ese día.', naPor: 'u2', naCuando: D('2026-10-21T16:05') }],
  ['11.5', '2026-10-21T16:05', '2026-10-22T11:00', { esp: 5 }],
  ['11.6', '2026-10-22T11:00', '2026-10-22T15:30', { esp: 4 }],
  ['11.7', '2026-10-22T15:30', '2026-10-23T09:00', { esp: 3 }],
  ['11.8', '2026-10-23T09:00', null,               { esp: 6 }],
  ['11.9',  null, null, { esp: 4 }],
  ['11.10', null, null, { esp: 3 }],
  ['11.11', null, null, { esp: 2 }],
  ['11.13', null, null, { esp: 5 }],
  ['11.14', null, null, { esp: 3 }],
  ['11.15', null, null, { esp: 2 }],
  ['11.16', null, null, { esp: 2 }],
]);

/* --- G3 · Consolidado verde, esperando revisión --- */
const g3 = {
  id: 'g3', file: 'A26I30008', rangoDesde: 'A26I30008', rangoHasta: 'A26I30008',
  clienteId: 'c3', tipo: 'CONSOLIDADO', selectivo: 'Verde', estado: 'porRevisar',
  creadaPor: 'u3', t1: D('2026-10-12T10:40:00'), t2: D('2026-10-12T10:47:00'),
};
g3.pasos = aplicar(construirPasos('CONSOLIDADO', 'Verde'), [
  ['1',    '2026-10-12T10:50', '2026-10-12T13:20'],
  ['2',    '2026-10-12T13:20', '2026-10-12T16:00'],
  ['3',    '2026-10-12T16:00', '2026-10-13T11:00'],
  ['4',    '2026-10-13T11:00', '2026-10-13T11:20'],
  ['5',    '2026-10-13T11:20', '2026-10-14T09:00', { esp: 8 }],
  ['6',    '2026-10-14T09:00', '2026-10-14T10:30', { esp: 2 }],
  ['7',    '2026-10-14T10:30', '2026-10-14T11:15', { esp: 1 }],
  ['8',    '2026-10-14T11:15', '2026-10-14T12:30', { esp: 2 }],
  ['9',    '2026-10-14T12:30', '2026-10-14T14:00', { esp: 1 }],
  ['10',   '2026-10-14T14:00', '2026-10-14T14:05', { esp: 0.25 }],
  ['11.1', '2026-10-14T14:05', '2026-10-14T15:00', { esp: 1 }],
  ['11.2', '2026-10-14T15:00', '2026-10-15T09:30', { esp: 3 }],
  ['11.3', '2026-10-15T09:30', '2026-10-15T14:00', { esp: 4 }],
  ['11.4', '2026-10-15T14:00', '2026-10-15T16:20', { esp: 3 }],
  ['11.5', '2026-10-15T16:20', '2026-10-16T10:00', { esp: 2 }],
  ['11.6', '2026-10-16T10:00', '2026-10-16T13:00', { esp: 3 }],
  ['11.7', '2026-10-16T13:00', '2026-10-16T16:00', { esp: 3 }],
  ['11.8', '2026-10-16T16:00', '2026-10-19T11:00', { esp: 6 }],
  ['11.9', '2026-10-19T11:00', '2026-10-19T12:30', { esp: 2 }],
]);

/* --- G4 · Aéreo rojo, finalizado --- */
const g4 = {
  id: 'g4', file: 'A26I40002', rangoDesde: 'A26I40002', rangoHasta: 'A26I40002',
  clienteId: 'c4', tipo: 'AEREO', selectivo: 'Rojo', estado: 'finalizado',
  creadaPor: 'u1', t1: D('2026-10-05T08:10:00'), t2: D('2026-10-05T08:18:00'),
  finalizadaPor: 'u4', finalizadaEl: D('2026-10-09T16:40:00'),
};
g4.pasos = aplicar(construirPasos('AEREO', 'Rojo'), [
  ['1',    '2026-10-05T08:20', '2026-10-05T10:40'],
  ['2',    '2026-10-05T10:40', '2026-10-05T14:00'],
  ['3',    '2026-10-05T14:00', '2026-10-06T10:00'],
  ['4',    '2026-10-06T10:00', '2026-10-06T10:20'],
  ['5',    '2026-10-06T10:20', '2026-10-06T16:00', { esp: 8 }],
  ['6',    '2026-10-06T16:00', '2026-10-07T09:00', { esp: 2 }],
  ['7',    '2026-10-07T09:00', '2026-10-07T09:50', { esp: 1 }],
  ['8',    '2026-10-07T09:50', '2026-10-07T11:00', { esp: 2 }],
  ['9',    '2026-10-07T11:00', '2026-10-07T12:10', { esp: 1 }],
  ['10',   '2026-10-07T12:10', '2026-10-07T12:15', { esp: 0.25 }],
  ['11.1', '2026-10-07T12:15', '2026-10-07T14:00', { esp: 2 }],
  ['11.2', '2026-10-07T14:00', '2026-10-08T11:30', { esp: 6 }],
  ['11.3', '2026-10-08T11:30', '2026-10-08T15:00', { esp: 3 }],
  ['11.4', '2026-10-08T15:00', '2026-10-08T16:30', { esp: 2 }],
  ['11.5', '2026-10-08T16:30', '2026-10-09T09:30', { esp: 2 }],
  ['11.6', '2026-10-09T09:30', '2026-10-09T12:00', { esp: 3 }],
  ['11.7', '2026-10-09T12:00', '2026-10-09T15:30', { esp: 4 }],
  ['11.8', '2026-10-09T15:30', '2026-10-09T16:40', { esp: 2 }],
]);

/* --- G5 · Frontera, recién creada, sin selectivo --- */
const g5 = {
  id: 'g5', file: 'A26I10022', rangoDesde: 'A26I10022', rangoHasta: 'A26I10025',
  clienteId: 'c1', tipo: 'FRONTERA', selectivo: null, estado: 'abierto',
  creadaPor: 'u3', t1: D('2026-10-23T08:50:00'), t2: D('2026-10-23T08:58:00'),
};
g5.pasos = aplicar(construirPasos('FRONTERA', null), [
  ['1', '2026-10-23T09:00', '2026-10-23T11:10'],
  ['2', '2026-10-23T11:10', null],
]);

/* --- G6 · Consolidado rojo, en curso con retraso fuerte --- */
const g6 = {
  id: 'g6', file: 'A26I20019', rangoDesde: 'A26I20019', rangoHasta: 'A26I20019',
  clienteId: 'c2', tipo: 'CONSOLIDADO', selectivo: 'Rojo', estado: 'abierto',
  creadaPor: 'u2', t1: D('2026-10-20T09:00:00'), t2: D('2026-10-20T09:06:00'),
};
g6.pasos = aplicar(construirPasos('CONSOLIDADO', 'Rojo'), [
  ['1',    '2026-10-21T08:10', '2026-10-21T10:00'],
  ['2',    '2026-10-21T10:00', '2026-10-21T15:40'],
  ['3',    '2026-10-21T15:40', '2026-10-22T14:00'],
  ['4',    '2026-10-22T14:00', '2026-10-22T14:20'],
  ['5',    '2026-10-22T14:20', '2026-10-23T10:00', { esp: 8 }],
  ['6',    '2026-10-23T10:00', null,               { esp: 2 }],
  ['7',  null, null, { esp: 1 }],
  ['8',  null, null, { esp: 2 }],
  ['9',  null, null, { esp: 1 }],
  ['10', null, null, { esp: 0.25 }],
]);

/* --- G7 · Aéreo recién creado ayer, arrancando --- */
const g7 = {
  id: 'g7', file: 'A26I40031', rangoDesde: 'A26I40031', rangoHasta: 'A26I40031',
  clienteId: 'c4', tipo: 'AEREO', selectivo: null, estado: 'abierto',
  creadaPor: 'u1', t1: D('2026-10-22T15:12:00'), t2: D('2026-10-22T15:19:00'),
};
g7.pasos = aplicar(construirPasos('AEREO', null), [
  ['1', '2026-10-22T15:20', '2026-10-23T09:40'],
  ['2', '2026-10-23T09:40', null],
]);

/* --- G8 · Consolidado creado ayer, en el ciclo documental --- */
const g8 = {
  id: 'g8', file: 'A26I30033', rangoDesde: 'A26I30033', rangoHasta: 'A26I30036',
  clienteId: 'c3', tipo: 'CONSOLIDADO', selectivo: null, estado: 'abierto',
  creadaPor: 'u2', t1: D('2026-10-22T11:05:00'), t2: D('2026-10-22T11:11:00'),
};
g8.pasos = aplicar(construirPasos('CONSOLIDADO', null), [
  ['1', '2026-10-22T11:15', '2026-10-22T13:30'],
  ['2', '2026-10-22T13:30', '2026-10-22T16:10'],
  ['3', '2026-10-22T16:10', null],
]);

/* --- G9 · Contenedor creado hoy --- */
const g9 = {
  id: 'g9', file: 'A26I20034', rangoDesde: 'A26I20034', rangoHasta: 'A26I20034',
  clienteId: 'c2', tipo: 'CONTENEDOR', selectivo: null, estado: 'abierto',
  creadaPor: 'u3', t1: D('2026-10-23T10:28:00'), t2: D('2026-10-23T10:35:00'),
};
g9.pasos = aplicar(construirPasos('CONTENEDOR', null), [
  ['1', '2026-10-23T10:40', null],
]);

const GESTIONES = [g1, g2, g3, g4, g5, g6, g7, g8, g9];

/* ---------- Asistencia ---------- */
const ASISTENCIA = [
  { usuario: 'u1', fecha: '2026-10-23', entrada: '07:58', salida: null,    ip: '190.148.33.72' },
  { usuario: 'u3', fecha: '2026-10-23', entrada: '08:04', salida: null,    ip: '190.148.33.72' },
  { usuario: 'u2', fecha: '2026-10-23', entrada: '08:31', salida: null,    ip: '181.174.90.14' },
  { usuario: 'u5', fecha: '2026-10-23', entrada: '07:50', salida: null,    ip: '190.148.33.72' },
  { usuario: 'u1', fecha: '2026-10-22', entrada: '07:55', salida: '17:02', ip: '190.148.33.72' },
  { usuario: 'u2', fecha: '2026-10-22', entrada: '08:12', salida: '17:00', ip: '181.174.90.9'  },
  { usuario: 'u3', fecha: '2026-10-22', entrada: '08:40', salida: '17:10', ip: '190.148.33.72' },
  { usuario: 'u5', fecha: '2026-10-22', entrada: '07:48', salida: '16:55', ip: '190.148.33.72' },
  { usuario: 'u1', fecha: '2026-10-21', entrada: '08:02', salida: '17:00', ip: '190.148.33.72' },
  { usuario: 'u2', fecha: '2026-10-21', entrada: '09:05', salida: '17:30', ip: '181.174.90.9'  },
  { usuario: 'u3', fecha: '2026-10-21', entrada: '07:57', salida: '16:58', ip: '190.148.33.72' },
];

/* ---------- Solicitudes de acceso por IP ---------- */
const SOLICITUDES_IP = [
  { id: 's1', usuario: 'u2', ipNueva: '181.174.112.40', cuando: D('2026-10-23T08:22:00'), estado: 'pendiente', motivo: 'Mi proveedor cambió la IP esta mañana.' },
];
