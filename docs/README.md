# Trazabilidad de tiempos operativos — CSLogi

Documentación del sistema solicitado por **CSLogi** (Cesar Simón, gerencia) para controlar los tiempos del
proceso aduanal de importación en Guatemala.

**Estado:** levantamiento de requerimientos terminado. Pendiente de cotizar.
**Última actualización:** 31 de octubre de 2026.

---

## Archivos

| Archivo | Qué contiene | Para quién |
| --- | --- | --- |
| [01_ESPECIFICACION_FUNCIONAL.md](01_ESPECIFICACION_FUNCIONAL.md) | La especificación completa, 22 secciones: objetivo, roles, flujo, módulos, cálculo de horas, bitácora, informes, dashboard, requisitos y supuestos | Equipo de desarrollo y cotización |
| [02_CATALOGO_PASOS.md](02_CATALOGO_PASOS.md) | Los 86 pasos por tipo de trámite y ruta, con columnas vacías para que el cliente cargue responsables y tiempos esperados | Cliente (a llenar) y desarrollo |
| [03_PUNTOS_ABIERTOS.md](03_PUNTOS_ABIERTOS.md) | 31 preguntas pendientes + lista de insumos a pedir, ordenadas por impacto | Siguiente reunión con el cliente |
| [04_ANALISIS_EXCEL.md](04_ANALISIS_EXCEL.md) | Análisis técnico del archivo original: fórmulas, validaciones, lógica a portar y 10 problemas detectados | Desarrollo |

**Archivo fuente:** `../Esquema_Tiempos_Operativos_Ordenado.xlsx`

---

## Resumen en una página

**Qué pide el cliente.** Un sistema que mida, en horas hábiles, cuánto tarda cada paso del trámite aduanal de
cada file, alerte cuando un paso se pasa del tiempo esperado, y emita informes que le sirvan a gerencia para
defenderse de acusaciones de atraso.

**Los 3 objetivos** (correo del 23-oct):

1. Servicio al Cliente alimenta los pasos **con un solo clic**, viendo qué está terminado, en tiempo y retrasado
2. **Reportes profesionales** que permitan defenderse ante reclamos de clientes
3. Un **radar** para saber qué trámites están en proceso

**El flujo.** Login → nueva gestión o buscar → elige tipo de servicio y cliente → el sistema genera el file →
recorre los pasos comunes 1 a 10 con botones iniciar/finalizar → en el paso 10 se marca el selectivo y se abre la
ruta verde o roja → último paso, revisión, cierre → informe ejecutivo en PDF.

**Lo más importante que NO está en el Excel del cliente:** el informe debe **separar el tiempo por responsable**
(CSLogi / cliente / terceros como SAT y Combex). Esa es la defensa real que pidió Cesar, y es lo que convierte el
sistema en algo que se paga solo la primera vez que hay un reclamo.

---

## Lo que bloquea avanzar

Las seis preguntas que hay que responder antes de poner un precio (detalle en
[03_PUNTOS_ABIERTOS.md](03_PUNTOS_ABIERTOS.md)):

1. ¿Una gestión es un file o varios? (el rango desde–hasta)
2. ¿Algún paso corre en paralelo?
3. ¿Pantalla de administración del catálogo de pasos, o carga por el proveedor?
4. ¿El operativo ve todos los files o solo los suyos?
5. ¿Dónde corre y con qué volumen?
6. ¿Se usa desde el celular?

Y una séptima que afecta todos los números del sistema: **¿se descuenta la hora de almuerzo?**

---

## Nota comercial

Cesar advirtió por escrito que el instructivo que envió **está incompleto** y que el archivo completo llega al
confirmarse la cotización. Se está cotizando sobre información parcial: los supuestos están en la sección 22 de la
especificación y conviene que queden explícitos en la propuesta.
