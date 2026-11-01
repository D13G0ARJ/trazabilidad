# Sistema de Trazabilidad de Tiempos Operativos — CSLogi

**Especificación funcional** · 31 de octubre de 2026

> Documento base para cotización. Elaborado a partir del archivo `Esquema_Tiempos_Operativos_Ordenado.xlsx`,
> del correo de Cesar Simón (23-oct-2026) y de la reunión de levantamiento con el cliente.

---

## 1. Objetivo del sistema

El sistema mide, en horas hábiles, cuánto tarda cada paso del proceso aduanal de importación de CSLogi,
alerta cuando un paso se pasa del tiempo esperado y emite evidencia defendible de dónde se consumió el tiempo.

Cesar Simón lo planteó en tres objetivos (correo del 23 de octubre de 2026):

1. **Operación de un clic.** Servicio al Cliente alimenta los pasos con un solo clic y nada más, pero ve en todo
   momento cuáles de sus gestiones están terminadas, en tiempo o retrasadas. Gerencia ve lo mismo.
2. **Reportes que defiendan.** Informes de tiempo profesionales que permitan responder a un cliente que acusa a
   CSLogi de atraso. Este es el objetivo con más peso y el que menos desarrollado está en el instructivo original.
3. **Radar de operación.** Un panel donde SC sepa qué trámites tiene en proceso, identificados por el número de file.

### Qué resuelve que hoy no existe

Hoy el control vive en un Excel con cronómetros manuales. El sistema aporta cuatro cosas que la hoja no puede dar:
hora de servidor no manipulable, alertas que salen solas sin que nadie mire la pantalla, histórico acumulado entre
files, y atribución del tiempo entre CSLogi, el cliente y terceros (SAT, Combex, navieras, autoridades).

### Alcance

**Entra:** importaciones por los cuatro tipos de trámite (aéreo, consolidado marítimo, contenedor completo marítimo
y frontera), para las rutas verde y roja del selectivo.

**No entra**, salvo que se acuerde aparte: exportaciones, facturación o contabilidad, integración con sistemas de
SAT, y portal de consulta para el cliente final (el cliente recibe correos e informes en PDF, no accede al sistema).

---

## 2. Glosario

El dominio es agenciamiento aduanal de importaciones en Guatemala. Quien desarrolle necesita estos términos.

| Término | Qué es |
| --- | --- |
| **File** | El expediente de una importación. Es la unidad que se cronometra. Código interno tipo `A26I10001`. |
| **Gestión** | Como le llama el cliente al trámite completo de un file, desde que se crea hasta que se factura. |
| **Tipo de trámite** | Aéreo, consolidado marítimo, contenedor completo marítimo o frontera. Define qué pasos aplican. |
| **SAT** | Superintendencia de Administración Tributaria. La aduana guatemalteca. Externa a CSLogi. |
| **DUCA** | Declaración Única Centroamericana. El documento con que se declara la mercancía. |
| **Pre DUCA** | Borrador de la DUCA que se arma y se autoriza antes de la firma y el pago de impuestos. |
| **Selectivo** | Resultado automático que asigna SAT después de pagar impuestos. **Verde** = libre, sin revisión. **Rojo** = revisión física y documental. Determina la ruta que sigue el file. |
| **Combex** | Combex-Im, la terminal de carga aérea del aeropuerto La Aurora. "Retiro de Combex" es sacar la mercancía de ahí. |
| **SC** | Servicio al Cliente. El área operativa que alimenta el sistema. |
| **Gestor aduanal** | Quien tramita la DUCA ante SAT. |
| **Horas hábiles** | Tiempo contado solo dentro de la jornada laboral, de lunes a viernes y sin feriados. Es la unidad de medida de todo el sistema. |
| **Tiempo esperado** | El SLA de cada paso, en horas hábiles. Lo define CSLogi. Si se supera, el paso entra en retraso. |
| **MAGA-OIRSA / DIPAFRONT-SGAIA** | Autoridades sanitarias y de frontera que intervienen en algunos trámites. Externas. |

---

## 3. Roles y permisos

El cliente mencionó tres roles pero nombró dos: **admin** y **operativo**. Falta confirmar el tercero, que por el
correo y por la regla de alertas del instructivo debería ser **gerencia** o **administración** (quien recibe las
alertas de retraso). Administrador de sistema y área de administración no son lo mismo.

| Acción | Operativo | Admin | Gerencia |
| --- | --- | --- | --- |
| Crear gestión y guardar el file | Sí | Sí | Por confirmar |
| Iniciar / finalizar paso | Sí | Sí | Por confirmar |
| Marcar un paso como "no aplica" | Por confirmar | Sí | — |
| Reiniciar un paso | **Por confirmar** | Sí | — |
| Cambiar el selectivo ya marcado | No | **Sí** (confirmado) | — |
| Reabrir una gestión finalizada | Por confirmar | Sí | — |
| Corregir una fecha u hora mal marcada | Por confirmar | Sí | — |
| Ver la bitácora completa del file | Por confirmar | **Sí** (confirmado) | Por confirmar |
| Ver el resumen de tiempos del file | Por confirmar | **Sí** (confirmado) | Por confirmar |
| Crear y editar clientes | Por confirmar | Sí | — |
| Definir los tiempos esperados (SLA) | No | Por confirmar | Por confirmar |
| Administrar feriados y jornada | No | Sí | — |
| Crear usuarios y asignar roles | No | Sí | — |
| Emitir el informe ejecutivo | Por confirmar | Sí | Sí |
| Ver dashboard y reportería de todos los files | **Por confirmar** | Sí | Sí |

### Decisiones que faltan y por qué importan

- **Reiniciar paso.** Si el operativo puede reiniciar sin aprobación, el cronómetro queda a su criterio. Mitigado
  en parte porque todo reinicio notifica al jefe y queda en bitácora, pero conviene decidirlo explícitamente.
- **Alcance de la vista del operativo.** Si ve todos los files, el radar y el dashboard son una sola pantalla.
  Si ve solo los suyos, son dos vistas distintas y el costo sube.

### Datos del usuario

Cada usuario necesita **nombre y código de empleado**, porque ambos se graban en cada acción de la bitácora.
No basta con el usuario de acceso.

---

## 4. Flujo general

La pantalla de inicio tiene dos acciones: **Nueva gestión** y **Buscar gestión**. Debajo de ambas va la lista de
files activos con su semáforo, que es el radar del objetivo 3.

```
  login (t0)
      |
  [ + Nueva gestión ]   [ Buscar gestión ]   + lista de files activos (radar)
      |                        |
      |                        +--> file interno o nombre de cliente
      |                             --> abre el file EN EL PASO QUE VA
      |
  elige tipo de servicio (t1)
      |   Aéreo / Consolidado marítimo / Contenedor completo / Frontera
      |
  elige cliente (busca por código o nombre)
      |   --> file interno AUTOGENERADO
      |   --> rango de files: MANUAL
      |
  [ Guardar gestión ] (t2)  --> graba quién, t1 y t2
      |
  PASOS COMUNES 1 -> 10
      |   cada paso: [responsable v] [> Iniciar] [# Finalizar] [o Reiniciar] [- No aplica]
      |
  PASO 10: resultado del selectivo
      |
      +--- VERDE ---> bloque verde del tipo de trámite
      |
      +--- ROJO ----> bloque rojo del tipo de trámite
      |
  último paso = Liquidación y facturación
      |
  [ Revisar ] --> si falta algo, se reabre para corregir
      |
  [ Finalizar gestión ] --> habilita el informe ejecutivo
```

1. **Login.** Desde aquí arranca la trazabilidad: queda registrada la hora de entrada del usuario.
2. **Inicio.** Dos botones y, debajo, los files activos con su estado.
3. **Nueva gestión** → elige el tipo de servicio → elige el cliente buscando por código o nombre → el sistema
   autogenera el file interno → el usuario ingresa el rango de files → **Guardar gestión**.
4. **Buscar gestión** → por número de file interno o nombre de cliente → al abrir, el file se posiciona en el
   paso donde va.
5. **Pasos comunes 1 a 10.** Por cada paso: responsable, iniciar, finalizar. Al cerrar uno se habilita el siguiente.
6. **Paso 10, resultado del selectivo.** Al marcar Verde o Rojo, el sistema despliega el bloque de pasos que
   corresponde al tipo de trámite y a esa ruta. Nunca muestra las dos rutas.
7. **Pasos de la ruta** (entre 5 y 16 según tipo y ruta), con el mismo mecanismo.
8. **Revisar.** Al cerrar el último paso, el file queda a la espera de revisión. Si falta algo, se reabre.
9. **Finalizar gestión.** Cierra el file y habilita el informe ejecutivo.

### Dos observaciones sobre el flujo

**No son dos módulos separados.** El cliente habló primero de un módulo de "pasos comunes" y otro de "gestión",
pero después describió que al buscar un file este se abre en el paso donde va. Se construye como **una sola vista
del file** con la línea de tiempo completa: arriba los pasos comunes, debajo el bloque de la ruta una vez definido
el selectivo. Si se prefiere conservar dos opciones de menú, ambas deben llevar a la misma vista.

**El selectivo nace vacío.** Aunque en el instructivo aparece en la sección de datos del file, no se conoce al
crear la gestión: lo asigna SAT hasta el paso 9. El campo existe desde el inicio pero se habilita en el paso 10,
y solo entonces define la ruta.

---

## 5. Módulo de clientes

El instructivo trae cuatro campos. El cliente pidió ampliarlo para que sea más profesional.

| Campo | Origen | Notas |
| --- | --- | --- |
| Razón social | Instructivo | ¿Se separa de nombre comercial? Por confirmar |
| Código de cliente | Instructivo | **Autoasignado por el sistema**, único, no repetible |
| Correo para notificaciones | Instructivo | Recibe los avisos de avance de los pasos |
| Correo para informes | Instructivo | Recibe el informe ejecutivo en PDF |
| Nombre del encargado | Pedido en reunión | |
| Teléfono del encargado | Pedido en reunión | |
| Teléfono de la empresa | Pedido en reunión | |
| Dirección de la empresa | Pedido en reunión | |
| NIT | Propuesto | Recomendado: el informe va dirigido a un importador guatemalteco |
| Estado activo / inactivo | Propuesto | Ver abajo |

### Código de cliente

El sistema lo asigna solo y garantiza que no se repita. **La estructura todavía no está definida**: el cliente la
está evaluando y por ahora trabaja con `001`, `002`, etc.

Esto tiene una consecuencia que conviene prever desde el diseño: **el código de cliente va incrustado en el código
del file**. Con cliente `1` el file es `A26I10001`; con cliente `001` sería `A26I0010001`, y los files ya creados
quedarían con otro formato.

**Solución:** el sistema usa un **identificador interno invisible** para todas las relaciones, y el código visible
es solo presentación, con el largo de cada segmento configurable. Así CSLogi puede arrancar con `001` sin
comprometerse, y cuando definan la estructura final se cambia la configuración sin romper lo ya cargado.

### Contactos

El maestro ya contempla dos correos distintos, o sea que en la práctica ya hay dos contactos por cliente. Se
recomienda una **lista de contactos** por cliente (nombre, puesto, correo, teléfono) con dos marcas: *recibe
notificaciones* y *recibe informes*. Cuesta casi lo mismo que campos planos y cubre el caso real de "mandáselo
también a fulano". Si se prefiere mantenerlo plano para la primera versión, se deja previsto.

### Búsqueda e inactivación

La selección de cliente al crear una gestión se hace con un **campo de búsqueda con autocompletado por código o
nombre**, no con una lista desplegable: el maestro va a crecer.

Un cliente con files registrados **no se borra, se inactiva**: deja de aparecer para gestiones nuevas pero el
histórico sobrevive. Lo mismo aplica a la lista de responsables.

---

## 6. Creación de la gestión

El usuario elige el tipo de servicio, elige el cliente y guarda. Todo lo demás lo pone el sistema.

| Campo | Quién lo llena |
| --- | --- |
| Tipo de trámite | Se elige en el paso anterior; se muestra, no se vuelve a preguntar |
| Cliente | Usuario, buscando por código o nombre |
| Código de cliente | Automático al elegir el cliente |
| Nombre del cliente | Automático al elegir el cliente |
| **File interno** | **Automático**: lo genera el sistema |
| Rango de files, desde y hasta | **Manual**, lo ingresa el usuario |
| Resultado del selectivo | Vacío. Se llena hasta el paso 10 |

Al presionar **Guardar gestión** el sistema graba los datos junto con la fecha y hora del guardado y el **nombre y
código de empleado** de quien la creó.

### Trazabilidad de la propia creación

El cliente pidió expresamente registrar dos momentos:

- **t1** — cuando el usuario seleccionó el tipo de trámite, o sea cuando empezó a crear el file
- **t2** — cuando presionó guardar

La diferencia entre ambos mide cuánto tardó el operador en dar de alta el file. Implica que **el registro nace en
t1, antes de guardar**. Falta definir qué pasa si el usuario abandona a medio camino: si el borrador se conserva o
se descarta. Si se conserva sin reglas, la base se llena de files fantasma.

### Pendiente crítico: ¿una gestión es un file o varios?

El sistema autogenera **un** file interno, pero el usuario teclea **un rango** desde–hasta. Si se carga de
`A26I10001` a `A26I10020`, hay dos lecturas posibles:

1. Son **20 trámites independientes**, cada uno con su cronómetro y sus 15 a 25 pasos.
2. Es **una sola gestión** que ampara 20 files de embarque y se cronometra una vez.

Cambia el modelo de datos completo y cambia la cotización. Si fueran 20 independientes, falta además entender de
dónde sale el rango si el correlativo lo genera el sistema solo. **Hay que resolverlo antes de cotizar.**

---

## 7. Motor de pasos y cronómetro

Un solo mecanismo, usado tanto en los pasos comunes como en los de la ruta. No son dos desarrollos: es el mismo
motor alimentado por una tabla de configuración.

### Qué muestra cada paso

Número, nombre del paso, responsable, tiempo esperado, regla de correo al cliente, inicio, fin, horas hábiles
consumidas y estado. Es la misma estructura de columnas del instructivo.

### Acciones por paso

| Acción | Qué hace |
| --- | --- |
| **▶ Iniciar** | Arranca el cronómetro con hora de servidor |
| **■ Finalizar** | Detiene el cronómetro y habilita el paso siguiente |
| **↺ Reiniciar** | Anula el intento en curso y vuelve a arrancar. Notifica al jefe por correo |
| **— No aplica** | Salta el paso sin contar tiempo ni retraso (ver abajo) |

El responsable se elige de una lista desplegable. Para no romper el principio del clic único, **debe venir
sugerido por plantilla** según el paso y cambiarse solo cuando haga falta. En la reunión el cliente cambió en vivo
el responsable del paso 2 de "Documentación" a "CS Logi", o sea que varía, pero tiene un valor por defecto razonable.

### Encadenamiento

Al finalizar un paso se habilita el siguiente. La regla del instructivo dice que un paso inicia al cerrarse el
anterior. Falta confirmar si el encadenamiento es **obligatorio** (no se puede iniciar el paso 5 sin cerrar el 4)
o solo sugerido.

### Pasos que no ejecuta CSLogi

Varios pasos son responsabilidad del cliente (paso 3, corrección de documentos) o de terceros (SAT, Combex,
navieras, autoridades sanitarias). Alguien de CSLogi los marca por ellos, pero **el tiempo se atribuye a quien lo
consumió**. Esta atribución es la base del objetivo 2.

### Pasos que pueden no aplicar

En contenedor completo ruta roja, el paso 11.4 dice literalmente "Cola de ingreso a portuaria **si aplica**".
Existen entonces pasos condicionales, y por eso hace falta el botón **No aplica**: salta el paso, habilita el
siguiente, y no cuenta ni como tiempo ni como retraso. Sin esa opción el operador tendría que marcar iniciar y
finalizar seguidos, ensuciando justo el reporte que debe defender a CSLogi.
**Falta confirmar qué otros pasos pueden no aplicar.**

### Ciclos repetibles

El paso 3, corrección de documentos, puede repetirse, y el instructivo anota que cada ciclo lleva su propio
cronómetro. El modelo de datos debe soportar **varias ejecuciones por paso**, no una sola fila. Lo mismo aplica a
cualquier paso reiniciado.

### Resumen de tiempos del file

Dentro de cada file, visible para admin:

- **Total de horas hábiles consumidas** — suma de los cronómetros de todos los pasos del file
- **Total de horas esperadas** — suma de los tiempos esperados
- **Diferencia** — esperado menos consumido; positivo es adelanto, negativo es retraso
- **Estado del file** — en tiempo, por vencer o retrasado, según esa diferencia

Dos correcciones respecto al instructivo, donde la fórmula suma el rango completo de la hoja:

1. El total debe sumar **solo los pasos que aplican a ese file** (sus pasos comunes más los de su tipo y su ruta).
   Sumar todos los bloques haría que un file aéreo arrastre pasos de contenedor marítimo.
2. Hay que definir si el esperado se compara contra **todos los pasos del file** o **solo los ya iniciados**. El
   instructivo usa lo segundo, que es lo correcto para medir avance en curso; lo primero sirve para proyectar el
   total. Conviene mostrar ambos.

---

## 8. Catálogo de pasos

Son **86 pasos** a configurar: 10 comunes más 76 repartidos entre los cuatro tipos de trámite y sus dos rutas.
Un file recorre entre 15 y 25 pasos según su tipo y el resultado del selectivo.

| Tipo de trámite | Ruta verde | Ruta roja | Total del file |
| --- | --- | --- | --- |
| Aéreo | 5 | 8 | 15 / 18 |
| Consolidado marítimo | 9 | 9 | 19 / 19 |
| Contenedor completo marítimo | 12 | 15 | 22 / **25** |
| Frontera | 8 | 10 | 18 / 20 |

> El detalle completo de los 86 pasos está en [02_CATALOGO_PASOS.md](02_CATALOGO_PASOS.md).

### Estructura de la tabla de configuración

Como el motor es uno solo, el catálogo vive en datos:

```
tipo de trámite (o COMÚN) · ruta (verde / roja / ambas) · orden · nombre del paso ·
responsable sugerido · tiempo esperado · regla de correo al cliente · puede no aplicar
```

Consecuencia práctica: **Frontera no es desarrollo, es carga de datos.** Cuando Logística entregue esos pasos se
cargan y funcionan. Lo mismo si mañana agregan exportaciones o cambian un paso de lugar. Si en cambio cada bloque
se programa a mano, cada cambio futuro tiene costo de desarrollo.

---

## 9. Cálculo de horas hábiles

Todo el sistema mide en horas hábiles, nunca en horas corridas. Un paso que empieza un viernes a las 4 p.m. y
termina el lunes a las 9 a.m. consume 2 horas, no 65.

### Parámetros

| Parámetro | Valor actual |
| --- | --- |
| Hora de inicio de jornada | 08:00 |
| Hora de fin de jornada | 17:00 |
| Días hábiles | Lunes a viernes |
| Aviso "por vencer" | Al consumir el 80 % del tiempo esperado |
| Feriados | No cuentan como hábiles |

### Lógica

La lógica del instructivo es correcta y se porta tal cual:

- Si inicio y fin caen el mismo día: se cuenta la intersección del intervalo con la jornada, y cero si el día no
  es hábil.
- Si cruzan días: cola del primer día, más cabeza del último, más los días hábiles intermedios completos.
- Si el paso no ha cerrado, el cronómetro corre contra la hora actual.

**Verificado contra el ejemplo del archivo.** El paso 3 va del 19 de octubre a las 4 p.m. al 21 de octubre a las
10 a.m. y da 3 horas: 1 hora el 19, cero el 20 porque es Día de la Revolución, y 2 horas el 21. El manejo de
feriados funciona.

### Feriados

El instructivo trae nueve feriados de 2026, tres marcados "validar": Jueves Santo, Viernes Santo y Día del Ejército.

| Feriado | Fecha 2026 |
| --- | --- |
| Año Nuevo | 01/01/2026 |
| Jueves Santo *(validar)* | 02/04/2026 |
| Viernes Santo *(validar)* | 03/04/2026 |
| Día del Trabajo | 01/05/2026 |
| Día del Ejército *(validar)* | 30/06/2026 |
| Día de la Independencia | 15/09/2026 |
| Día de la Revolución | 20/10/2026 |
| Día de Todos los Santos | 01/11/2026 |
| Navidad | 25/12/2026 |

El calendario debe ser **administrable por año**, no fijo en el código.

### Tres definiciones pendientes que afectan todos los números

1. **¿Se descuenta la hora de almuerzo?** Hoy la jornada cuenta 8:00 a 17:00 = **9 horas corridas**. Si en la
   práctica almuerzan de 12 a 13, la jornada real son 8 horas y todos los tiempos esperados que defina el jefe
   quedan mal calibrados de entrada. Es el pendiente más urgente de esta sección.
2. **¿Trabajan medio día el 24 y el 31 de diciembre?** Es lo habitual en Guatemala. Si es así, el calendario no
   puede ser un simple "hábil sí o no": necesita **jornadas especiales con horario reducido**.
3. **¿Aplican asuetos locales?** El 15 de agosto es asueto solo en la capital. Si hay personal en puerto o
   frontera, el calendario podría no ser el mismo para todos.

---

## 10. Estados y semáforo

### Estado de cada paso

| Estado | Cuándo | Color |
| --- | --- | --- |
| Sin iniciar | No tiene marca de inicio | Neutro |
| En curso | Iniciado, dentro del tiempo esperado | Azul |
| Por vencer | Consumió el 80 % o más del tiempo esperado, sin cerrar | Ámbar |
| Retrasado | Superó el tiempo esperado | Rojo |
| Cumplido | Cerrado dentro del tiempo esperado | Verde |
| No aplica | Saltado por no corresponder | Gris |

### Corrección al instructivo

La fórmula actual evalúa el umbral del 80 % **antes** de preguntar si el paso ya cerró. Por eso en el ejemplo el
paso 1, que consumió 2.5 horas de 3 esperadas y está terminado, aparece como "Por vencer" en ámbar en lugar de
"Cumplido" en verde.

El orden correcto es: **si el paso cerró dentro del tiempo, es Cumplido**; el umbral del 80 % solo aplica a pasos
abiertos, porque es una advertencia, no un resultado.

### Estado del file

Sale del resumen de tiempos: se compara el total consumido contra el total esperado y el file queda **en tiempo**,
**por vencer** o **retrasado**. El instructivo pide marcarlo con un indicador gráfico visible para que SC y
gerencia lo vean de un vistazo.

Falta confirmar un estado más: el cliente mencionó **"por revisar"**. Si se refiere al file que terminó todos sus
pasos y espera el botón de revisión final, entonces es un estado del **file**, distinto de los estados del paso, y
debe agregarse al semáforo y a los filtros.

---

## 11. Notificaciones

Hay dos circuitos de correo distintos: alertas internas y avisos al cliente.

### Alertas internas

| Evento | Destinatario | Estado |
| --- | --- | --- |
| Un paso supera su tiempo esperado | Administración o el jefe | Confirmado |
| Un paso es reiniciado | El jefe | Confirmado |
| Un paso llega al 80 % del tiempo | Por definir | **Por confirmar** |

Si no hay retraso, no se envía nada. El cliente fue explícito: el correo solo sale cuando hay problema.

**Momento del envío.** La alerta debe salir **apenas el cronómetro cruza el tiempo esperado**, no al cerrar el
paso. Si avisa al cerrar, llega tarde para reaccionar. Esto implica un **proceso en segundo plano** que revisa
periódicamente los cronómetros abiertos y dispara los correos sin que nadie tenga la pantalla abierta. Es trabajo
real y va en la cotización.

**Aviso previo.** El instructivo contempla el estado "por vencer" al 80 % del tiempo, pero el cliente no pidió
correo para ese caso. Vale preguntarlo: avisar antes de retrasarse sirve más que avisar después.

**Destinatario.** Falta definir si la alerta llega siempre a la misma persona o cambia según el paso o el tipo de
trámite.

### Correos automáticos al cliente

Cada paso lleva configurada una de cuatro reglas, tal como en el instructivo:

- **No** — no se envía nada
- **Al iniciar el paso**
- **Al finalizar el paso**
- **Si el paso se retrasa**

Se envían al **correo para notificaciones** del maestro de clientes, no al de informes. En el ejemplo del
instructivo: el paso 1 avisa al finalizar, el paso 3 al iniciar (porque el cliente debe actuar) y el paso 4 al
finalizar.

### Registro

Todo correo enviado queda en la bitácora: a quién, cuándo y por qué motivo. Sirve para demostrar que al cliente se
le avisó en su momento, que es parte del objetivo 2.

---

## 12. Bitácora y auditoría

Cada pedido tiene una sección de bitácora donde el admin ve el detalle completo de quién hizo qué y cuándo.
Es lo que convierte el informe en evidencia y no en un reporte más.

### Qué se registra

| Evento | Datos |
| --- | --- |
| Inicio de sesión | Usuario, código de empleado, fecha y hora |
| Selección del tipo de trámite (t1) | Usuario, hora |
| Guardado de la gestión (t2) | Usuario, hora, datos guardados |
| Inicio de un paso | Usuario, hora, paso, responsable asignado |
| Fin de un paso | Usuario, hora, horas hábiles resultantes |
| Cambio de responsable | Valor anterior y nuevo, usuario, hora |
| Reinicio de un paso | Usuario, hora, **motivo**, tiempo del intento anulado |
| Paso marcado "no aplica" | Usuario, hora, motivo |
| Cambio del selectivo | Usuario (admin), hora, valor anterior y nuevo |
| Reapertura y correcciones | Campo, valor anterior, valor nuevo, usuario, hora, motivo |
| Correo enviado | Destinatario, hora, motivo del envío |
| Cierre de la gestión | Usuario, hora |
| Emisión del informe | Usuario, hora, destinatario |

### Tres reglas que hacen que sirva

1. **La bitácora es solo-agregar.** No se edita ni se borra, ni siquiera por el admin. Si un dato estaba mal, se
   corrige el dato y queda registrada la corrección. Una bitácora que se puede limpiar no defiende a nadie.
2. **La hora la pone el servidor, no la computadora del usuario.** Si el reloj saliera del equipo del operador,
   cualquiera podría cambiar la hora de Windows y el cronómetro mentiría. Con hora de servidor los tiempos son
   defendibles ante un reclamo.
3. **Cada acción guarda nombre y código de empleado**, no solo el usuario de acceso.

### Visibilidad

Confirmado: el **admin** ve la bitácora completa dentro de cada pedido. Falta definir si el operativo la ve, si ve
solo sus propias acciones o si no la ve, y si gerencia entra como admin o como un rol aparte que consulta sin
poder corregir.

### Relación con el informe al cliente

Recomendación: el informe que recibe el cliente lleva la línea de tiempo limpia (paso, responsable, inicio, fin,
horas). La bitácora completa queda **interna** y se presenta solo si hay un reclamo. Ahí es donde gana la discusión.

---

## 13. Cierre de la gestión

Al marcar como cumplido el último paso de la ruta (liquidación y facturación), el file no se cierra solo: pasa por
una revisión.

1. **Revisar.** El usuario revisa el file completo. El cliente lo justificó así: a veces falta algo extraordinario.
2. **Si falta algo**, se reabren los campos para corregir.
3. **Si está todo**, se presiona **Finalizar gestión**.
4. Al finalizar, el sistema habilita el informe de efectividad de tiempos.

### Reapertura y correcciones

Reabrir es necesario y está bien, pero choca de frente con el objetivo 2 si se hace sin dejar rastro: un informe
que se puede editar libremente no sirve como evidencia.

La forma de tener las dos cosas: **cada corrección queda versionada** con qué decía antes, qué dice ahora, quién
la hizo, cuándo y por qué. El informe puede mostrar, cuando corresponda, que un dato fue corregido. Con rastro, el
reporte queda blindado en vez de debilitado.

### Reinicio de paso

Mismo principio. El botón de reinicio existe porque a veces se equivocan, pero **el intento anulado no se borra**:
queda guardado con su motivo y notifica al jefe por correo.

Falta definir una cosa: **¿el tiempo del intento anulado suma al total del file o se descuenta?** Las dos opciones
son defendibles, pero hay que elegir una y que el informe la explique.

### Pendientes de esta sección

- ¿Quién puede reabrir una gestión ya finalizada?
- ¿Una gestión finalizada se puede reabrir siempre, o se congela después de cierto tiempo?
- ¿"Por revisar" es un estado formal del file que aparece en el radar y en los filtros?

---

## 14. Informe ejecutivo

El entregable del objetivo 2. PDF con el logo de la empresa, profesional y entendible, dirigido al cliente final.

### Estructura propuesta

1. **Encabezado** — logo de CSLogi, número de file, cliente, tipo de trámite, resultado del selectivo, fecha de
   emisión
2. **Resumen** — apertura y cierre del file, horas hábiles consumidas contra esperadas, estado general
3. **Desglose del tiempo por responsable** — cuántas horas consumió CSLogi, cuántas el cliente y cuántas los
   terceros
4. **Línea de tiempo paso a paso** — paso, responsable, inicio, fin, horas hábiles y estado, con el código de
   colores
5. **Observaciones** — notas, pasos reiniciados y pasos que no aplicaron
6. **Pie** — emitido por, fecha y hora, folio del informe

### El punto 3 es el que gana las discusiones

No está en el instructivo y es la pieza que responde a lo que Cesar pidió en su correo. El resto del informe es un
reporte bien presentado; ese punto es el que contesta la acusación.

El anexo de responsables ya separa naturalmente tres grupos: **CSLogi** (documentación, gestor aduanal, transporte,
facturación, administración), **el cliente** (paso 3, corrección de documentos) y **terceros** (SAT, puerto o
aeropuerto, naviera, MAGA-OIRSA, DIPAFRONT-SGAIA).

En un contenedor completo por ruta roja, de los 15 pasos de la ruta hay cerca de 6 que son SAT y autoridades. El
informe que muestra *"de 40 horas, 22 fueron esperando documentos del cliente y 12 fueron SAT; CSLogi consumió 6"*
es exactamente la defensa que se pidió.

### Emisión

Se emite al cerrar el file. El instructivo también contempla emitirlo **bajo demanda** a mitad del trámite, que es
justo cuando se necesita durante un reclamo. Por confirmar si se mantiene.

**Envío:** va al **correo para informes** del maestro de clientes, distinto del de notificaciones. Falta definir si
se envía automáticamente al cerrar o solo se descarga.

El PDF siempre sale en versión clara, sin importar el tema que use el operador en pantalla.

### Pendientes

- Logo en alta resolución y colores corporativos. **Conviene pedirlo ya**, suele ser lo que más tarda en llegar.
- ¿Lleva folio, firma o sello? Si el informe va a usarse como respaldo ante un cliente molesto, un número de folio
  y la línea "emitido el X por Y" le dan peso.
- ¿Quién puede emitirlo: solo admin y gerencia, o también el operativo?

---

## 15. Reportería

Módulo de consulta histórica, separado del informe ejecutivo de un file.

### Filtros

Por cliente · por file interno · por rango de fechas · por tipo de trámite. Muestra los procesos realizados dentro
del rango seleccionado.

### Métricas

- Tiempos promedio
- Tiempo de atraso
- Cumplimiento contra el tiempo esperado

### Dos formas de presentación

El mismo dato se alterna entre **porcentajes** y **gráfico de barras**, con un control para cambiar de vista.

Falta definir **porcentaje de qué**, porque hay tres lecturas y cada una cuenta otra historia:

| Lectura | Ejemplo | Para quién |
| --- | --- | --- |
| % de cumplimiento | "el 82 % de los files se entregó en tiempo" | Reunión con el cliente |
| % de desviación | "el paso 2 se pasa un 30 % del tiempo esperado" | Corrección interna |
| % del tiempo por responsable | "45 % CSLogi, 35 % cliente, 20 % SAT" | **Objetivo 2** |

Si hubiera que elegir uno solo para el reporte que ve el cliente final, el tercero.

### Exportación

Confirmado: **Excel y PDF**.

### Promedios

El cliente decidió dejar el análisis de promedios para más adelante, aunque sí los quiere en el dashboard.
Importante: **postergar el reporte está bien, postergar la captura no**. El dato debe guardarse correctamente desde
el primer día o en seis meses no habrá histórico que analizar. No cuesta más, pero hay que preverlo en el modelo
de datos.

Valor que queda disponible después: comparar el tiempo real promedio contra el esperado permite **recalibrar los
SLA con datos propios**, en lugar de con los estimados a ojo que se cargarán al inicio.

---

## 16. Dashboard

Moderno e interactivo. El principio es que **todo número sea clickeable** y lleve al detalle: ese es el sentido de
"interactivo" en lo que pidió el cliente.

### Indicadores

- Gestiones creadas **hoy** (files internos creados)
- Gestiones creadas **ayer**
- Files activos en este momento
- Files retrasados y files por vencer
- Promedio de tiempos de los pasos comunes, real contra esperado

### Navegación en profundidad

Un número lleva a la lista filtrada, la lista lleva al file, el file lleva a su bitácora:

```
"12 gestiones hoy"   -> las 12 gestiones -> un file -> su bitácora completa
"paso 2 retrasado"   -> todos los files en ese paso, con su estado -> un file -> su bitácora
```

El cliente lo describió así: al dar clic en un paso marcado como retrasado o por revisar, se abre el reporte con
toda la bitácora de esos casos, pudiendo ver cumplidos, en proceso y retrasados.

### Pendiente

**¿El dashboard es solo para admin y gerencia, o el operativo tiene el suyo** con sus propios files? Son dos vistas
distintas y pesa en la cotización. Se relaciona con la decisión de alcance de la sección 3.

---

## 17. Interfaz y experiencia

### Principio rector

Servicio al Cliente alimenta los pasos **con un solo clic y nada más**. Cada campo adicional que haya que llenar en
la operación diaria va en contra del objetivo 1. De ahí salen tres decisiones concretas:

- El tipo de trámite se elige una vez al crear y no se vuelve a preguntar
- El responsable viene sugerido por plantilla y solo se cambia cuando toca
- Al finalizar un paso se habilita el siguiente sin pasos intermedios

### Buscador y radar

Una sola pantalla sirve para las dos cosas: filtrada es buscador, sin filtro es radar.

**Filtros:** número de file interno · nombre o código de cliente · tipo de trámite · estado · rango de fechas ·
operador.

**Columnas de la lista:** file · cliente · tipo · **paso en el que va** · semáforo · horas consumidas contra
esperadas · quién lo tiene.

Por defecto muestra solo los **files activos**, con un filtro para consultar los cerrados. Si aparecieran todos, en
seis meses la pantalla sería inservible.

### Tema claro y oscuro

Ambos temas. El oscuro en **gris suave tipo grafito**, no negro puro, por pedido expreso del cliente.

Dos consecuencias:

- **Los colores del semáforo necesitan variante para el tema oscuro.** Los del instructivo son pasteles
  (verde `#C6E0B4`, ámbar `#FFE699`, rojo `#F8CBAD`) y sobre gris pierden contraste justo en lo que más importa
  distinguir.
- **El PDF siempre se genera en claro**, sin importar el tema de pantalla.

Por confirmar: si cada usuario elige su tema y queda guardado en su perfil, o lo define la empresa para todos.
Lo habitual es por usuario.

---

## 18. Administración y configuración

Todo lo que cambia con el tiempo debe vivir en configuración, no en el código.

| Qué se administra | Por qué importa |
| --- | --- |
| **Catálogo de pasos** | Agregar, renombrar, reordenar pasos por tipo y ruta. Es lo que permite cargar Frontera sin desarrollo |
| **Tiempos esperados (SLA)** | Los entrega CSLogi después; van a cambiar al recalibrarse con datos reales |
| **Reglas de correo por paso** | Las cuatro opciones del instructivo |
| **Responsable sugerido por paso** | Valor por defecto del desplegable |
| **Lista de responsables** | Hoy son 11; crece con el tiempo |
| **Feriados** | Por año, con posibilidad de jornadas especiales |
| **Horario de jornada** | Inicio, fin y tratamiento del almuerzo |
| **Umbral de aviso** | Hoy 80 % del tiempo esperado |
| **Usuarios y roles** | Con código de empleado |
| **Clientes** | Ver sección 5 |
| **Datos de la empresa** | Logo, colores y pie del informe |

### Decisión de alcance

La pregunta que más mueve el precio: **¿se construye una pantalla de administración del catálogo de pasos**, para
que CSLogi lo maneje por su cuenta, **o lo carga el proveedor** y cada cambio futuro se atiende como soporte?

Las dos son válidas. La primera cuesta más al inicio y les ahorra después; la segunda abarata el arranque y
encarece cada cambio. Conviene que la decisión sea explícita y quede en la cotización.

---

## 19. Requisitos técnicos

| Requisito | Detalle |
| --- | --- |
| **Hora de servidor** | Todas las marcas de tiempo las pone el servidor, nunca el equipo del usuario. Si no, basta con cambiar el reloj de Windows para alterar la evidencia |
| **Bitácora inmutable** | Solo-agregar. No se edita ni se borra, ni por el admin |
| **Versionado de correcciones** | Valor anterior, valor nuevo, usuario, hora y motivo |
| **Proceso en segundo plano** | Revisa periódicamente los cronómetros abiertos y dispara alertas sin intervención |
| **Retención del histórico** | Si es la evidencia para defenderse de un reclamo, debe sobrevivir años. Nada se sobrescribe |
| **Envío de correo** | Requiere definir con qué cuenta y servidor se envía |
| **Respaldos** | Por definir según dónde se aloje |

### Por definir

- **¿Dónde corre el sistema?** Nube o servidor propio de CSLogi.
- **¿Qué volumen maneja?** Files por mes, usuarios de SC concurrentes y cantidad de clientes en el maestro.
  Define el dimensionamiento.
- **¿Se usa desde el celular?** Varios pasos ocurren en puerto, aeropuerto o frontera, no en una oficina. Si el
  operador va a marcar desde el teléfono, la interfaz debe estar pensada para eso desde el inicio.
- **¿Integración con el correo corporativo** de CSLogi para las notificaciones?

---

## 20. Lo que debe entregar CSLogi

Sin estos insumos el sistema se puede construir, pero no puede operar.

| Insumo | Estado | Impacto si no llega |
| --- | --- | --- |
| **Tabla completa de tiempos esperados** (86 pasos) | Prometida al aprobarse el sistema | **Sin ella no hay alertas ni semáforos.** El sistema queda mudo |
| **Pasos de Frontera** (8 verde, 10 rojo) | Pendiente de Logística | Ese tipo de trámite no se puede operar |
| **Responsable y tiempo de los pasos 6 a 10** | Faltan en el instructivo | Esos pasos no generan alerta |
| **Logo en alta resolución y colores** | No entregado | No se puede emitir el informe |
| **Calendario oficial de feriados** | Parcial: 2026 con tres por validar | Cálculo de horas incorrecto |
| **Destinatarios de las alertas** | No definido | No se sabe a quién notificar |
| **Maestro de clientes inicial** | Solo un ejemplo | Carga manual al arrancar |
| **Lista de usuarios con código de empleado** | No entregada | No hay con qué iniciar sesión |
| **Cuenta de correo para envíos** | No definida | No salen notificaciones |

Nota sobre la secuencia: que los tiempos esperados lleguen después no bloquea el desarrollo, porque viven en
configuración. Pero conviene dejarlo escrito en la cotización para que no parezca falla del sistema: *las alertas
se activan al cargar la tabla de tiempos esperados, que entrega el cliente.*

---

## 21. Puntos abiertos

> Lista accionable para llevar al cliente en [03_PUNTOS_ABIERTOS.md](03_PUNTOS_ABIERTOS.md).

### Bloquean la cotización

1. **¿Una gestión es un file o varios?** El sistema genera un file interno pero el usuario teclea un rango
   desde–hasta. Cambia el modelo de datos completo.
2. **¿Algún paso corre en paralelo?** Es pendiente del propio instructivo. Si la respuesta es sí, el total deja de
   ser una suma y hay que medir camino crítico, o se contaría tiempo doble.
3. **¿Pantalla de administración del catálogo de pasos, o carga por el proveedor?**
4. **¿El operativo ve todos los files o solo los suyos?** Define si el radar y el dashboard son una vista o dos.
5. **¿Dónde corre y con qué volumen?** Nube o servidor propio; files por mes y usuarios concurrentes.
6. **¿Se usa desde el celular?** Varios pasos ocurren en puerto, aeropuerto o frontera.

### Afectan el cálculo de todos los tiempos

7. **¿Se descuenta la hora de almuerzo?** Hoy la jornada cuenta 9 horas corridas.
8. **¿Medio día el 24 y el 31 de diciembre?** Requeriría jornadas especiales.
9. **¿Asuetos locales**, como el 15 de agosto en la capital?
10. **¿El tiempo de un intento reiniciado suma al total o se descuenta?**
11. **¿El tiempo de SAT, Combex y del propio cliente se descuenta del tiempo de CSLogi?** Es el corazón del
    objetivo 2.

### De proceso

12. **¿Cuál es el tercer rol** y quién recibe las alertas de retraso?
13. **¿Quién puede reiniciar un paso**, reabrir una gestión y corregir una marca de tiempo?
14. **¿"Por revisar" es un estado formal del file?**
15. **¿Qué otros pasos pueden "no aplicar"**, además de la cola de ingreso a portuaria?
16. **¿El encadenamiento es obligatorio** o se puede iniciar un paso sin cerrar el anterior?
17. **¿Falta el paso 11.12** de contenedor completo ruta roja, o es solo la numeración?
18. **¿Qué pasa con un borrador abandonado** entre t1 y t2?
19. **¿Se envía correo al llegar al 80 %** del tiempo esperado, además de al superarlo?
20. **¿El informe ejecutivo se emite también bajo demanda**, no solo al cerrar?

### Del instructivo, aún sin responder

21. **¿El correlativo del file reinicia cada año?**
22. **¿Cuál es el largo definitivo del código de cliente?**
23. **¿Los pasos 1 a 10 son realmente iguales en los cuatro tipos de trámite?**

---

## 22. Supuestos para la cotización

Cesar Simón advirtió por escrito que el instructivo enviado **está incompleto** y que el archivo completo llega al
confirmarse la cotización. Se cotiza entonces sobre información parcial, y conviene que los supuestos queden
explícitos.

1. **Cuatro tipos de trámite y dos rutas**, con el catálogo de 86 pasos descrito en la sección 8. Si el archivo
   completo agrega tipos, rutas o pasos, se ajusta.
2. **Solo importaciones.** Exportaciones no están contempladas.
3. **Los pasos de Frontera se cargan como datos**, sin desarrollo adicional, siempre que mantengan la misma
   estructura que los demás.
4. **Los tiempos esperados los entrega CSLogi.** No se incluye trabajo de análisis para definirlos.
5. **El cliente final no accede al sistema.** Recibe correos e informes en PDF.
6. **No hay integración con sistemas de SAT** ni con contabilidad o facturación.
7. **Una gestión equivale a un file** mientras no se resuelva el punto 1 de la sección 21.
8. **Los pasos son secuenciales**, sin paralelismo, mientras no se resuelva el punto 2.
9. **El módulo de análisis de promedios queda para una fase posterior**, pero la captura del dato se incluye desde
   el inicio.

### Recomendación comercial

Conviene cotizar **por fases**, con una primera entrega que cubra el ciclo completo de un file (alta, pasos,
cronómetro, alertas, informe) y una segunda con reportería histórica y análisis. Así CSLogi empieza a operar y a
acumular datos antes, y los pendientes que hoy están abiertos se resuelven con el sistema ya funcionando en vez de
retrasar el arranque.
