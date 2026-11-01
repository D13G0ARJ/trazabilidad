# Trazabilidad de Tiempos Operativos — CSLogi

Sistema para medir, en horas hábiles, cuánto tarda cada paso del proceso aduanal de importación de
**CSLogi**; alertar cuando un paso se pasa del tiempo esperado; y producir la evidencia con que
gerencia puede responder a un cliente que reclama un atraso.

**Estado:** levantamiento terminado, demo funcional lista, pendiente de aprobación del cliente.

> ⚠️ **Repositorio interno.** Contiene la cotización, el análisis comercial y las notas de la
> negociación. No hacer público.

---

## Contenido

| Carpeta | Qué hay |
| --- | --- |
| [`demo/`](demo/) | Demo funcional en HTML. Abrir `demo/index.html` con doble clic |
| [`docs/`](docs/) | Especificación funcional, catálogo de pasos, puntos abiertos, análisis del Excel y cotización |
| [`PRODUCT.md`](PRODUCT.md) | Contexto de producto: usuarios, posicionamiento, restricciones y principios |
| `Esquema_Tiempos_Operativos_Ordenado.xlsx` | Instructivo original entregado por el cliente |

## Documentos

| Archivo | Para qué sirve |
| --- | --- |
| [docs/README.md](docs/README.md) | Índice y resumen de una página |
| [docs/01_ESPECIFICACION_FUNCIONAL.md](docs/01_ESPECIFICACION_FUNCIONAL.md) | La especificación completa, 22 secciones |
| [docs/02_CATALOGO_PASOS.md](docs/02_CATALOGO_PASOS.md) | Los 86 pasos por tipo de trámite y ruta |
| [docs/03_PUNTOS_ABIERTOS.md](docs/03_PUNTOS_ABIERTOS.md) | 31 preguntas pendientes, en formato checklist |
| [docs/04_ANALISIS_EXCEL.md](docs/04_ANALISIS_EXCEL.md) | Fórmulas del Excel, lógica a portar y 10 problemas detectados |
| [docs/05_COTIZACION.md](docs/05_COTIZACION.md) | Propuesta comercial |
| [docs/plantilla_tiempos_esperados.csv](docs/plantilla_tiempos_esperados.csv) | Plantilla para que el cliente cargue los SLA |

## La demo

Abrir [`demo/index.html`](demo/index.html). No necesita servidor, instalación ni base de datos.

Es funcional de verdad: el motor de horas hábiles descuenta fines de semana y feriados, los estados
se recalculan solos y los cronómetros corren en vivo. La guía de qué probar está en
[demo/LEEME.md](demo/LEEME.md).

## El dominio en una línea

Agenciamiento aduanal de importaciones en Guatemala. La unidad de trabajo es el **file**, un
expediente con código tipo `A26I10001` que recorre entre 15 y 25 pasos según su tipo de trámite
—aéreo, consolidado marítimo, contenedor completo marítimo o frontera— y según el resultado del
**selectivo** que asigna SAT en el paso 10, que define si el file sigue la ruta verde o la roja.
