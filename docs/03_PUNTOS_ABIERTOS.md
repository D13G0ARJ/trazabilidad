# Puntos abiertos — checklist para el cliente

Lista accionable para la próxima reunión con CSLogi. Ordenada por impacto.
Marcá la casilla y anotá la respuesta al lado.

---

## 🔴 Bloquean la cotización

- [ ] **1. ¿Una gestión es UN file o VARIOS?**
  El sistema autogenera un file interno, pero el usuario teclea un rango desde–hasta (ej. `A26I10001` a
  `A26I10020`). ¿Son 20 trámites independientes, cada uno con su cronómetro y sus 15-25 pasos, o es una sola
  gestión que ampara 20 files de embarque? *Cambia el modelo de datos completo.*
  **Respuesta:**

- [ ] **2. ¿Algún paso corre en paralelo?**
  Es pendiente del propio instructivo. Si la respuesta es sí, el total deja de ser una suma simple y hay que medir
  camino crítico; si no, se contaría tiempo doble.
  **Respuesta:**

- [ ] **3. ¿Pantalla de administración del catálogo de pasos, o lo carga el proveedor?**
  Si CSLogi quiere agregar, renombrar y reordenar pasos por su cuenta, cuesta más arriba y les ahorra después.
  Si lo carga el proveedor, abarata el arranque y cada cambio futuro es soporte.
  **Respuesta:**

- [ ] **4. ¿El operativo ve todos los files o solo los suyos?**
  Define si el radar y el dashboard son una sola pantalla o dos vistas distintas.
  **Respuesta:**

- [ ] **5. ¿Dónde corre el sistema y con qué volumen?**
  Nube o servidor propio. Files por mes, usuarios de SC concurrentes, clientes en el maestro.
  **Respuesta:**

- [ ] **6. ¿Se usa desde el celular?**
  Varios pasos ocurren en puerto, aeropuerto o frontera, no en una oficina. Si se marca desde el teléfono, la
  interfaz debe pensarse así desde el inicio.
  **Respuesta:**

---

## 🟠 Afectan el cálculo de TODOS los tiempos

- [ ] **7. ¿Se descuenta la hora de almuerzo?**
  Hoy la jornada cuenta 8:00–17:00 = **9 horas corridas**. Si almuerzan de 12 a 13, la jornada real son 8 horas y
  todos los tiempos esperados que ponga el jefe quedan mal calibrados de entrada. *La más urgente.*
  **Respuesta:**

- [ ] **8. ¿Trabajan medio día el 24 y el 31 de diciembre?**
  Si es así, el calendario no puede ser "hábil sí o no": necesita jornadas especiales con horario reducido.
  **Respuesta:**

- [ ] **9. ¿Aplican asuetos locales?**
  El 15 de agosto es asueto solo en la capital. Si hay personal en puerto o frontera, el calendario podría no ser
  el mismo para todos.
  **Respuesta:**

- [ ] **10. ¿El tiempo de un intento reiniciado suma al total o se descuenta?**
  Las dos opciones son defendibles, pero hay que elegir una y que el informe la explique.
  **Respuesta:**

- [ ] **11. ¿El tiempo de SAT, Combex y del propio cliente se descuenta del "tiempo de CSLogi"?**
  Es el corazón del objetivo 2 del correo: la defensa ante acusaciones de atraso.
  **Respuesta:**

---

## 🟡 De proceso

- [ ] **12. ¿Cuál es el tercer rol?** Se mencionaron 3 pero se nombraron 2 (admin y operativo).
  ¿Y quién recibe las alertas de retraso: administración, gerencia, una persona fija?
  **Respuesta:**

- [ ] **13. ¿Quién puede reiniciar un paso, reabrir una gestión y corregir una marca de tiempo?**
  (Ya confirmado: cambiar el selectivo es solo admin.)
  **Respuesta:**

- [ ] **14. ¿"Por revisar" es un estado formal del file?**
  ¿Es el file que terminó todos sus pasos y espera el botón Revisar? Si es así hay que sumarlo al semáforo y a los
  filtros.
  **Respuesta:**

- [ ] **15. ¿Qué otros pasos pueden "no aplicar"?**
  Confirmado uno: "Cola de ingreso a portuaria si aplica" (contenedor completo, ruta roja).
  **Respuesta:**

- [ ] **16. ¿El encadenamiento es obligatorio?**
  ¿Se puede iniciar el paso 5 sin haber cerrado el 4, o el sistema lo impide?
  **Respuesta:**

- [ ] **17. ¿Falta el paso 11.12 de contenedor completo ruta roja, o es solo la numeración?**
  La secuencia salta de 11.11 a 11.13.
  **Respuesta:**

- [ ] **18. ¿Qué pasa con un borrador abandonado entre t1 y t2?**
  Si el usuario elige el tipo de trámite y nunca guarda, ¿se conserva el borrador o se descarta?
  **Respuesta:**

- [ ] **19. ¿Se envía correo al llegar al 80 % del tiempo esperado, además de al superarlo?**
  Avisar antes de retrasarse sirve más que avisar después.
  **Respuesta:**

- [ ] **20. ¿El informe ejecutivo se emite también bajo demanda, no solo al cerrar el file?**
  A mitad de un reclamo es justo cuando se necesita.
  **Respuesta:**

- [ ] **21. ¿El informe se envía automático por correo al cerrar, o solo se descarga?**
  Si es automático va al "correo para informes" del maestro.
  **Respuesta:**

- [ ] **22. ¿El informe lleva folio, firma o sello?**
  **Respuesta:**

- [ ] **23. ¿Quién puede emitir el informe: solo admin y gerencia, o también el operativo?**
  **Respuesta:**

- [ ] **24. ¿El tema claro/oscuro lo elige cada usuario o lo define la empresa?**
  **Respuesta:**

- [ ] **25. ¿Porcentaje de qué, en la reportería?**
  Tres lecturas posibles: % de cumplimiento ("82 % de los files en tiempo"), % de desviación ("el paso 2 se pasa
  un 30 %"), o % del tiempo por responsable ("45 % CSLogi, 35 % cliente, 20 % SAT"). ¿Cuál, o las tres?
  **Respuesta:**

- [ ] **26. ¿El dashboard es solo para admin y gerencia, o el operativo tiene el suyo?**
  **Respuesta:**

---

## ⚪ Del instructivo original, aún sin responder

- [ ] **27. ¿El correlativo del file reinicia cada año?** `A26I10001` → en 2027 ¿vuelve a 0001 o sigue?
  **Respuesta:**

- [ ] **28. ¿Cuál es el largo definitivo del código de cliente?** Hoy se trabaja con `001` provisionalmente.
  **Respuesta:**

- [ ] **29. ¿Los pasos 1 a 10 son realmente iguales en los cuatro tipos de trámite?**
  **Respuesta:**

- [ ] **30. ¿Se separa razón social de nombre comercial en el maestro de clientes? ¿Se incluye NIT?**
  **Respuesta:**

- [ ] **31. ¿Un cliente se puede borrar, o solo inactivar?**
  Recomendación: inactivar, para no perder el histórico.
  **Respuesta:**

---

## 📦 Insumos que hay que pedirle a CSLogi

- [ ] Tabla completa de **tiempos esperados** de los 86 pasos *(prometida al aprobarse el sistema)*
- [ ] **Pasos de Frontera**: 8 ruta verde, 10 ruta roja *(pendiente de Logística)*
- [ ] **Responsable y tiempo de los pasos 6 a 10** (faltan en el instructivo)
- [ ] **Logo en alta resolución** y colores corporativos *(suele ser lo que más tarda: pedirlo ya)*
- [ ] **Calendario oficial de feriados**, con los tres marcados "validar" confirmados
- [ ] **Destinatarios de las alertas** de retraso
- [ ] **Maestro de clientes** inicial
- [ ] **Lista de usuarios** con nombre y código de empleado
- [ ] **Cuenta de correo** desde la que se envían las notificaciones
- [ ] **El archivo completo** del instructivo (Cesar dijo que lo manda al confirmarse la cotización)
