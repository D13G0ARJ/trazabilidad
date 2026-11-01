# Demo — Sistema de Trazabilidad de Tiempos Operativos · CSLogi

Maqueta funcional para presentar al cliente. **Todos los datos son de demostración.**

## Cómo abrirla

Doble clic en `index.html`. No necesita servidor, instalación ni conexión a base de datos.
(Con internet carga las tipografías Archivo y JetBrains Mono; sin internet usa las del sistema.)

## Qué se puede probar

La demo es **funcional de verdad**, no una imagen: los cronómetros calculan horas hábiles reales
descontando fines de semana y feriados, los estados se recalculan solos y las acciones modifican el estado.

| Acción | Dónde |
| --- | --- |
| Iniciar y finalizar pasos | Abrir cualquier gestión desde Inicio o Gestiones |
| Ver cómo se bifurca la ruta | Avanzar un file hasta el paso 10 y marcar Verde o Rojo |
| Reiniciar un paso con motivo | Botón ↺ en el paso que esté en curso |
| Marcar un paso como no aplica | File `A26I20014`, paso 11.4 (es condicional) |
| Cambiar el responsable de un paso | Desplegable dentro del paso activo |
| Ver la bitácora completa | Botón "Bitácora" dentro de un file, como Admin |
| Revisar y finalizar una gestión | File `A26I30008`, que está en estado "Por revisar" |
| Ver el informe ejecutivo en PDF | Al finalizar una gestión, o botón "Informe ejecutivo" |
| Crear una gestión nueva | Botón "Nueva gestión" en Inicio |
| Crear un cliente | Clientes → "Nuevo cliente" |
| Navegar el dashboard en profundidad | Dashboard → clic en cualquier número o barra |
| Alternar barras y porcentajes | Reportería → control "Presentación" |
| Marcar entrada y salida | Asistencia |
| Administrar las IP por empleado | Asistencia, con el rol Soporte IT |
| Aprobar una solicitud de IP | Asistencia, rol Soporte IT, panel derecho |
| Cambiar entre modo claro y oscuro | Icono de luna/sol, abajo a la izquierda |
| Ver los permisos de cada rol | Selector "Ver como" abajo a la izquierda |

## Los tres roles

- **Admin** — ve todo, incluida la bitácora y el resumen de tiempos de cada file
- **Empleado** — opera gestiones y clientes, marca su asistencia
- **Soporte IT** — administra las IP autorizadas y la configuración; no ve gestiones

## Files cargados en la demo

| File | Cliente | Trámite | Estado |
| --- | --- | --- | --- |
| `A26I10001` | Importadora Demo | Aéreo, verde | En curso, con retraso |
| `A26I20014` | Distribuidora del Valle | Contenedor completo, rojo | En curso, con un paso reiniciado y uno que no aplicó |
| `A26I30008` | Agroexportadora Petén | Consolidado, verde | Terminó sus pasos, **esperando revisión** |
| `A26I40002` | Textiles Quetzal | Aéreo, rojo | Finalizada, con informe disponible |
| `A26I10022` | Importadora Demo | Frontera | En curso, muestra el aviso de pasos pendientes |
| `A26I20019` | Distribuidora del Valle | Consolidado, rojo | En curso, con retraso fuerte |
| `A26I40031`, `A26I30033`, `A26I20034` | varios | varios | Recién creadas, sin selectivo |

## Lo que la demo deja ver y conviene señalar en la presentación

1. **El reloj simulado arranca el viernes 23 de octubre de 2026 a las 14:30** y avanza en tiempo real.
   Los pasos en curso acumulan horas mientras la demo está abierta.
2. **El cálculo de horas hábiles es real.** El paso 3 del file `A26I10001` va del 19 de octubre a las
   4 p.m. al 21 a las 10 a.m. y da 3 horas, porque el 20 es Día de la Revolución.
3. **El paso 10 no se puede cerrar a mano**: se cierra al marcar el selectivo, y ahí se despliega la ruta.
4. **Nada se borra.** Un paso reiniciado conserva su intento anulado y sus horas siguen contando.
5. **El estado nunca se comunica solo por color**: cada semáforo lleva icono y texto.

## Archivos

| Archivo | Contenido |
| --- | --- |
| `index.html` | Documento |
| `styles.css` | Estilos, tokens y los dos temas |
| `datos.js` | Catálogo de los 86 pasos, clientes, feriados y el motor de horas hábiles |
| `app.js` | Vistas, lógica de la aplicación y acciones |

## Lo que la demo todavía no refleja

- El logo real de CSLogi (está un marcador provisional)
- Los tiempos esperados reales de la mayoría de los pasos: solo están cargados los del ejemplo del instructivo
- Los nombres de los pasos del trámite de frontera
- Envío real de correos: los avisos aparecen como notificación en pantalla
