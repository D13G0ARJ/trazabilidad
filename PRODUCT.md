# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Greenfield. Maquetas de concepto en HTML/CSS estático, sin framework, para presentar al cliente antes de cotizar. El stack de producción aún no se decide.

## Users

**Operativo de Servicio al Cliente (SC)** — usuario principal y el que más horas pasa en el sistema. Registra el avance de los trámites aduanales marcando inicio y fin de cada paso. Trabaja en español, desde una computadora de escritorio en oficina. Patrón de uso mixto confirmado por el cliente: a veces deja el sistema abierto toda la jornada, a veces entra, marca y se sale. Cantidad de files simultáneos por operativo: aún no confirmada; se diseña para el caso medio de 20 a 50, escalable hacia arriba.

**Gerencia (Cesar Simón)** — revisa el estado de la cartera, recibe alertas de retraso y emite los informes con que responde a clientes que reclaman atrasos. Entra a consultar, no a operar.

**Administrador** — configura catálogos, corrige errores que el operativo no puede tocar (como el resultado del selectivo) y consulta la bitácora completa de cada file.

El cliente final de CSLogi **no** accede al sistema: recibe correos automáticos e informes en PDF.

## Product Purpose

Mide en horas hábiles cuánto tarda cada paso del proceso aduanal de importación de CSLogi, alerta cuando un paso se pasa del tiempo esperado, y produce evidencia de dónde se consumió el tiempo.

Éxito es que un operativo registre el avance de un trámite sin pensar, y que gerencia pueda contestar una acusación de atraso con un documento en la mano en lugar de una discusión.

## Positioning

El sistema no solo cronometra: **atribuye el tiempo**. Separa las horas que consumió CSLogi de las que consumió el cliente (esperando que mande documentos) y de las que consumieron terceros (SAT, Combex, navieras, autoridades sanitarias). Un cronómetro genérico dice cuánto se tardó; este dice de quién fue la culpa, con bitácora inmutable y hora de servidor detrás.

Esa atribución es la razón por la que el cliente paga: su objetivo declarado es "poder defenderme ante acusaciones de atraso ante los clientes".

## Operating Context

Agenciamiento aduanal de importaciones en Guatemala. El vocabulario del dominio es parte del producto y no se traduce ni se suaviza: file, gestión, DUCA, Pre DUCA, selectivo rojo/verde, SAT, Combex, liquidación.

**La unidad de trabajo es el file**, un expediente de importación con código tipo `A26I10001`. Cada file recorre entre 15 y 25 pasos según su tipo de trámite y el resultado del selectivo:

- 10 pasos comunes a todos los trámites
- Luego un bloque específico según el tipo (aéreo, consolidado marítimo, contenedor completo marítimo, frontera) y la ruta (verde o roja)
- El paso 10 es la bifurcación: al marcar el selectivo se despliega la ruta que corresponde
- El último paso siempre es liquidación y facturación

86 pasos en total en el catálogo. El trámite más largo es contenedor completo por ruta roja, con 25 pasos.

**El sistema reemplaza un Excel** que el cliente ya usa y conoce: `Esquema_Tiempos_Operativos_Ordenado.xlsx`. Esa hoja tiene cronómetros manuales, fórmulas de horas hábiles que funcionan, y un código de colores por estado que el equipo ya tiene interiorizado.

**Jornada laboral:** lunes a viernes de 08:00 a 17:00, sin feriados. Todo se mide en horas hábiles, nunca corridas. Si se descuenta la hora de almuerzo es una decisión pendiente del cliente.

**Hay pasos que ejecutan terceros.** El paso 3 lo ejecuta el cliente de CSLogi; varios pasos los ejecuta SAT. Alguien de CSLogi los marca por ellos, pero el tiempo se atribuye a quien lo consumió.

## Capabilities and Constraints

Confirmado por el cliente:

- Login con nombre y **código de empleado**; la trazabilidad arranca desde el inicio de sesión
- Pantalla de inicio con dos acciones: **nueva gestión** y **buscar gestión**
- Al buscar un file, se abre **en el paso donde va**
- Por cada paso: desplegable de responsable, botón iniciar, botón finalizar, botón reiniciar
- Al finalizar un paso se habilita el siguiente
- Estados: en proceso, retrasado, cumplido; más "por vencer" al 80 % del tiempo esperado
- Resumen de tiempos por file: horas consumidas, horas esperadas, diferencia y estado
- Correo de alerta cuando un paso supera su tiempo esperado; si no hay retraso, no se envía nada
- Correo de aviso al jefe cuando se reinicia un paso
- Correo automático al cliente de CSLogi, configurable por paso en cuatro modos
- Bitácora por file visible para el admin: quién hizo qué y cuándo
- Solo el admin puede corregir el resultado del selectivo
- Botón **revisar** al terminar todos los pasos, con posibilidad de reabrir y corregir, antes de **finalizar gestión**
- Informe ejecutivo en PDF con logo
- Dashboard interactivo con drill-down: cada número lleva al detalle y el detalle a la bitácora
- Reportería con filtros, exportación a Excel y PDF, y dos presentaciones: porcentajes o barras
- **Modo claro y modo oscuro**, el oscuro en gris suave tipo grafito, no negro puro
- Buscador de files por número interno, nombre o código de cliente

Restricciones técnicas derivadas del propósito:

- **Hora de servidor siempre**, nunca la de la computadora del usuario: un cronómetro alimentado por el reloj del cliente no es evidencia
- **La bitácora es solo-agregar**: no se edita ni se borra, ni por el admin
- Las correcciones quedan versionadas con valor anterior, valor nuevo, usuario, hora y motivo
- Un proceso en segundo plano vigila los cronómetros abiertos y dispara alertas sin que nadie tenga la pantalla abierta

Explícitamente sin decidir:

- Si una gestión equivale a un file o a varios (el rango desde–hasta)
- Si algún paso puede correr en paralelo
- El largo definitivo del código de cliente
- Si el sistema se usa también desde el celular
- Si se descuenta la hora de almuerzo

## Brand Commitments

**CSLogi** (cslogi.com.gt). El logo en alta resolución y los colores corporativos **todavía no fueron entregados** por el cliente. El diseño debe funcionar con un logo por definir y permitir aplicar la paleta corporativa cuando llegue.

Registro visual elegido por el usuario: **herramienta operativa moderna** — densa, precisa, jerarquía clara, color reservado para estado. No estética de ERP tradicional, no réplica visual del Excel.

**Convención como compromiso.** Ante la ronda de dirección visual, el usuario eligió deliberadamente el estándar de la categoría: barra lateral, encabezado con semáforo y métricas, stepper vertical de pasos. Se ejecuta en serio y completo, sin ironía ni rarezas infiltradas. El sistema debe poder sentarse al lado de **Linear, Stripe Dashboard y Vercel**: ese es el nivel de oficio exigido — densidad precisa, tipografía impecable, jerarquía por espacio y no por adorno, cero ornamento, interacción rápida. Familiar en estructura, impecable en ejecución.

## Evidence on Hand

- `Esquema_Tiempos_Operativos_Ordenado.xlsx` — el instructivo funcional del cliente, con un file de ejemplo parcialmente completado
- `docs/01_ESPECIFICACION_FUNCIONAL.md` — especificación completa derivada del Excel y de la reunión de levantamiento
- `docs/02_CATALOGO_PASOS.md` — los 86 pasos reales, con sus nombres exactos
- `docs/04_ANALISIS_EXCEL.md` — fórmulas y lógica verificada del archivo original

**No existe todavía:** logo, colores corporativos, la tabla de tiempos esperados de los 86 pasos (solo 5 tienen valor, en el ejemplo), los nombres de los pasos de Frontera, y datos reales de files. Cualquier dato que aparezca en una maqueta es de demostración y debe rotularse como tal.

## Product Principles

1. **Un clic y nada más.** El operativo marca el avance sin llenar formularios. Cada campo que se le pide en la operación diaria es una falla de diseño, no una funcionalidad.
2. **El tiempo tiene dueño.** Toda hora medida se atribuye a CSLogi, al cliente o a un tercero. Esa separación es el producto.
3. **Nada se borra.** Corregir es agregar una corrección, no reescribir el pasado. Lo que hace valioso al reporte es que no se puede retocar.
4. **Retomar sin releer.** El usuario deja el sistema abierto o se sale y vuelve; al volver debe ver en un segundo dónde quedó cada cosa, sin reconstruir contexto.
5. **El retraso se ve antes de ocurrir.** Avisar cuando ya se incumplió sirve para reportar; avisar cuando falta poco sirve para reaccionar.

## Accessibility & Inclusion

El estado de un paso o de un file **nunca se comunica solo por color**: el semáforo siempre va acompañado de texto o forma. Es requisito funcional, no cortesía — el sistema se usa en modo claro y oscuro, y los colores del Excel original pierden contraste sobre fondo gris.

Interfaz íntegramente en español de Guatemala.
