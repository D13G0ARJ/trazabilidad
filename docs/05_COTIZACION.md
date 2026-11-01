# Propuesta — Sistema de Trazabilidad de Tiempos Operativos

**Preparada para:** CSLogi · Cesar Simón, Gerencia
**Fecha:** 31 de octubre de 2026
**Vigencia de la propuesta:** 30 días

> **Documento en preparación.** Falta definir los montos. El alcance, el esfuerzo y el cronograma
> de este documento ya están cerrados.

---

## 1. Qué resuelve

El sistema mide, en horas hábiles, cuánto tarda cada paso del proceso aduanal de importación,
alerta cuando un paso se pasa del tiempo esperado, y produce la evidencia con que CSLogi puede
responder a un cliente que reclama un atraso.

Los tres objetivos planteados por CSLogi:

1. Servicio al Cliente alimenta los pasos **con un solo clic**, viendo en todo momento qué está
   terminado, en tiempo y retrasado
2. **Reportes profesionales** que permitan defenderse ante acusaciones de atraso
3. Un **radar** para saber qué trámites están en proceso

A eso se suma el **control de asistencia y horas laborales** del personal, solicitado posteriormente.

---

## 2. Alcance

### Fase 1 — Operativo

Lo que permite a CSLogi empezar a trabajar en el sistema y dejar el Excel.

- Acceso con usuario y código de empleado, con tres roles: **administrador**, **empleado** y **soporte IT**
- Maestro de clientes con contactos, código autoasignado y búsqueda por nombre o código
- Catálogo de los **86 pasos** de los cuatro tipos de trámite y sus rutas verde y roja, administrable
  sin programación
- Motor de cálculo de **horas hábiles** con jornada laboral, días hábiles y calendario de feriados
  administrable por año
- Alta de gestión con generación automática del número de file
- **Vista del file y motor de pasos:** iniciar, finalizar, reiniciar y marcar como no aplica, con
  encadenamiento automático y apertura de la ruta correspondiente al marcar el selectivo
- Resumen de tiempos por file: consumido, esperado, diferencia y estado
- **Bitácora por file**, inmutable, con hora de servidor y versionado de cada corrección
- Correos automáticos al cliente configurables por paso, y alertas internas de retraso y de reinicio
- Cierre de gestión con revisión previa y posibilidad de reapertura controlada
- Buscador y radar de files activos
- Interfaz en español, con modo claro y modo oscuro

### Fase 2 — Analítica

- **Informe ejecutivo en PDF** con logo, línea de tiempo paso a paso y **desglose del tiempo por
  responsable**: cuántas horas consumió CSLogi, cuántas el cliente y cuántas terceros como SAT,
  Combex y navieras
- Módulo de reportería con filtros por cliente, file, tipo de trámite y rango de fechas
- Presentación alternable entre porcentajes y gráficos de barras
- Exportación a Excel y PDF
- Dashboard interactivo con navegación en profundidad: cada indicador lleva al detalle y el detalle
  a la bitácora

### Fase 3 — Asistencia y horas laborales

- Marcaje de entrada y salida por empleado, con hora de servidor
- Cálculo de horas laboradas usando el mismo motor de jornada y feriados de la Fase 1
- **Restricción de acceso por dirección IP asignada a cada empleado**, con soporte para rangos
- Pantalla de administración de IPs a cargo del rol **soporte IT**
- Solicitud de acceso temporal cuando la IP del empleado cambia, con aprobación y registro
- Reportes de asistencia: horas por empleado, por período, llegadas tarde y ausencias
- Registro en bitácora de cada marcaje y cada cambio de configuración de IP

---

## 3. Esfuerzo

Medido en días-persona de desarrollo, incluyendo las pruebas de cada módulo.

| Módulo | Días |
|---|---:|
| Fundaciones: acceso, roles, permisos, hora de servidor, base de bitácora, tema claro y oscuro | 12–15 |
| Maestro de clientes y contactos | 4–5 |
| Catálogo de pasos, configuración y pantalla de administración | 6–8 |
| Motor de horas hábiles, feriados y jornadas especiales | 4–5 |
| Alta de gestión | 3–4 |
| Vista del file y motor de pasos | 10–12 |
| Bitácora, auditoría y versionado de correcciones | 5–6 |
| Notificaciones y proceso en segundo plano | 6–7 |
| Cierre de gestión | 3–4 |
| Buscador y radar | 3–4 |
| **Fase 1 — Operativo** | **56–70** |
| Informe ejecutivo en PDF | 6–8 |
| Reportería y exportación | 8–10 |
| Dashboard interactivo | 6–8 |
| **Fase 2 — Analítica** | **20–26** |
| Marcaje, cálculo y reportes de asistencia | 10–13 |
| Control de IP por usuario y administración de soporte IT | 5–7 |
| **Fase 3 — Asistencia** | **15–20** |
| Pruebas integrales, despliegue, capacitación y documentación | 8–10 |
| **TOTAL** | **99–126** |

---

## 4. Cronograma

Desarrollo a cargo de **un desarrollador a tiempo completo**, considerando 20 días hábiles por mes.

| Fase | Duración | Acumulado |
|---|---|---|
| Fase 1 — Operativo | 3 a 3.5 meses | 3.5 meses |
| Fase 2 — Analítica | 1 a 1.5 meses | 5 meses |
| Fase 3 — Asistencia | 1 mes | 6 meses |
| Pruebas, despliegue y capacitación | distribuido | — |
| **Total** | **5 a 6.5 meses** | |

Con un segundo desarrollador el calendario se reduce aproximadamente un 40%, quedando entre 3 y 4
meses. No se recomienda comprimirlo más: la utilidad del sistema depende de que sus registros sean
confiables, y eso exige pruebas que no se pueden acortar.

**CSLogi puede empezar a operar al terminar la Fase 1**, sin esperar a las fases siguientes.

---

## 5. Inversión

Montos en dólares estadounidenses.

| Fase | Entregable | Monto |
|---|---|---:|
| Fase 1 — Operativo | El sistema en uso: files, pasos, cronómetros, alertas y cierre | **USD 8,000** |
| Fase 2 — Analítica | Informe ejecutivo, reportería y dashboard | **USD 3,000** |
| Fase 3 — Asistencia | Marcaje, control por IP y reportes de personal | **USD 2,500** |
| | **Total** | **USD 13,500** |

### Forma de pago

| Momento | Monto |
|---|---:|
| A la firma del contrato | USD 3,400 |
| Entrega y aceptación de Fase 1 | USD 4,700 |
| Entrega y aceptación de Fase 2 | USD 2,700 |
| Entrega y aceptación de Fase 3 | USD 2,700 |
| **Total** | **USD 13,500** |

Cada fase se factura contra entrega y aceptación. CSLogi puede detener el proyecto al terminar
cualquier fase sin penalidad, conservando lo ya entregado y en funcionamiento.

### Soporte mensual

**USD 300 al mes**, a partir de la entrega de la Fase 1. Incluye monitoreo de los procesos
automáticos de correo y vigilancia de tiempos, respaldo de la base de datos, corrección de
incidencias y hasta 4 horas mensuales de ajustes menores. Es opcional pero recomendado: el sistema
ejecuta tareas desatendidas que conviene que alguien vigile.

---

## 6. Supuestos

El instructivo entregado por CSLogi está incompleto por indicación del propio cliente. Esta
propuesta se construye sobre los siguientes supuestos, y si alguno cambia se recotiza la parte
afectada:

1. **Una gestión equivale a un file.** Si el rango desde–hasta implica que una gestión administra
   varios files independientes, el modelo de datos cambia y el esfuerzo aumenta entre 15% y 20%.
2. **Los pasos son secuenciales.** Si algún paso puede ejecutarse en paralelo, el cálculo de tiempos
   deja de ser una suma y el esfuerzo aumenta entre 10% y 15%.
3. **Cuatro tipos de trámite y dos rutas**, con el catálogo de 86 pasos documentado. Pasos
   adicionales se cargan como configuración, sin costo de desarrollo, siempre que conserven la misma
   estructura.
4. **Solo importaciones.** Exportaciones no están contempladas.
5. **El cliente final no accede al sistema.** Recibe correos e informes en PDF.
6. **Sin integración** con sistemas de SAT, contabilidad o facturación.
7. **La asistencia no alimenta la planilla.** Si debe calcular sueldos, el módulo crece entre 40% y 60%.
8. **Uso desde computadora de escritorio.** El uso desde teléfono aumenta el esfuerzo entre 25% y 30%.
9. **Los tiempos esperados de los 86 pasos los entrega CSLogi.** No se incluye el análisis para
   definirlos.

---

## 7. Lo que CSLogi debe entregar

El sistema puede construirse sin estos insumos, pero no puede operar sin ellos:

| Insumo | Cuándo se necesita |
|---|---|
| Tabla de tiempos esperados de los 86 pasos | Antes del cierre de Fase 1 |
| Nombres de los pasos de Frontera: 8 en ruta verde, 10 en roja | Antes del cierre de Fase 1 |
| Responsable y tiempo esperado de los pasos 6 al 10 | Antes del cierre de Fase 1 |
| Logo en alta resolución y colores corporativos | Antes del inicio de Fase 2 |
| Calendario oficial de feriados, con los tres pendientes de validar | Al inicio |
| Destinatarios de las alertas de retraso | Al inicio |
| Maestro de clientes inicial | Al inicio |
| Lista de usuarios con nombre y código de empleado | Al inicio |
| Cuenta de correo corporativo para los envíos automáticos | Al inicio |
| Dirección IP de la oficina y de cada empleado remoto | Antes del inicio de Fase 3 |
| El archivo completo del instructivo | A la firma |

Las alertas de retraso y los semáforos permanecen inactivos hasta que se cargue la tabla de tiempos
esperados. No es una falla del sistema: es información que solo CSLogi puede definir.

---

## 8. No incluido

- Hosting, dominio y servicio de correo saliente — costo recurrente a cargo de CSLogi
- Diseño de logo o material de marca
- Migración de los datos históricos del Excel, si se requiere
- Integración con sistemas contables, de facturación o de planilla
- Aplicación móvil
- Mantenimiento y soporte posteriores a la entrega, que se cotizan por separado como servicio mensual

---

## 9. Garantía y soporte

- **90 días de garantía** sobre defectos a partir de la entrega de cada fase, sin costo
- Capacitación incluida para los tres roles
- Documentación de uso y manual de administración
- Soporte mensual posterior, cotizado aparte. Se recomienda contratarlo: el sistema ejecuta procesos
  automáticos de correo y vigilancia de tiempos que requieren monitoreo.

---

## 10. Advertencias técnicas

Dos puntos que conviene que CSLogi conozca antes de firmar:

**Sobre el control por IP.** Las direcciones IP residenciales en Guatemala son dinámicas: el
proveedor de internet las cambia periódicamente. Un empleado remoto con IP fija asignada quedará
bloqueado cada vez que eso ocurra. Por eso la propuesta incluye soporte para rangos de IP y un flujo
de solicitud de acceso temporal. Aun así, soporte IT tendrá carga de trabajo recurrente por este
motivo. La restricción por IP impide marcar desde fuera del lugar autorizado, pero **no verifica la
identidad de quien marca**: para eso se requiere PIN personal, fotografía al marcar o un lector
biométrico, que pueden incorporarse como adicional.

**Sobre la evidencia.** Todas las marcas de tiempo las registra el servidor, nunca la computadora
del usuario, y la bitácora no admite edición ni borrado por ningún rol, incluido el administrador.
Esto es deliberado: un registro que se puede retocar no sirve para defenderse ante un reclamo.
