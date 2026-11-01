# Análisis técnico del archivo original

`Esquema_Tiempos_Operativos_Ordenado.xlsx` — 1 hoja (`Esquema`), 215 filas × 11 columnas.

Este documento registra lo que se extrajo del archivo: su estructura, las fórmulas, lo que funciona bien y los
errores detectados. Sirve como referencia al implementar, para no perder lógica que ya estaba resuelta.

---

## Qué es el archivo

No es un registro de datos: es una **especificación funcional escrita en Excel**. La fila 2 lo dice textual:
*"Esquema funcional para IT. Léalo de arriba hacia abajo: 1 Datos del file → 2 Resumen → 3 Pasos y cronómetro →
4 Reglas → 5 Anexos."*

Las celdas amarillas con texto azul son datos que alimenta el usuario; los valores azules ya escritos son de
ejemplo.

---

## Mapa de la hoja

| Filas | Contenido |
| --- | --- |
| 1–3 | Título e instrucciones de lectura |
| 5–12 | **Sección 1**: datos del file |
| 14–18 | **Sección 2**: resumen de tiempos (calculado) |
| 21–126 | **Sección 3**: pasos y cronómetro |
| 23–34 | · Bloque A — pasos comunes (1 al 10) |
| 35–51 | · Bloque B — Aéreo (verde 38-42, rojo 44-51) |
| 52–73 | · Bloque C — Consolidado marítimo (verde 55-63, rojo 65-73) |
| 74–104 | · Bloque D — Contenedor completo (verde 77-88, rojo 90-104) |
| 105–126 | · Bloque E — Frontera (verde 108-115, rojo 117-126) — **vacío** |
| 129–140 | **Sección 4**: 11 reglas en prosa |
| 143–211 | **Sección 5**: anexos |
| 145–148 | · Anexo A — horario y parámetros |
| 150–159 | · Anexo A — feriados 2026 |
| 166–197 | · Anexo B — maestro de clientes |
| 199–211 | · Anexo C — lista de responsables |

**Columnas de la tabla de pasos:** A `N.º` · B `Paso` · C `Responsable` · D `Tiempo esperado (h hábiles)` ·
E `Correo automático al cliente` · F `▶ INICIO` · G `■ FIN` · H `⏱ Horas hábiles` · I `Estado` · J `Notas para IT`
· **K (oculta)** = motor del cronómetro vivo.

---

## Las fórmulas

### Resumen del file (sección 2)

```excel
C10 = IF(C9="","",IFERROR(INDEX($B$168:$B$197,MATCH(C9,$C$168:$C$197,0)),"Cliente no registrado"))
C15 = SUM($H$23:$H$126)                          ' total de horas consumidas
C16 = SUMIFS($D$23:$D$126,$F$23:$F$126,"<>")     ' esperado SOLO de los pasos ya iniciados
C17 = C15-C16                                     ' diferencia
C18 = IF(C16=0,"",IF(C15>C16,"⚠ RETRASO",IF(C15>=C16*$C$147,"Por vencer","En tiempo")))
```

### Cronómetro vivo (columna K, oculta)

```excel
K25 = IF(F25="","",IF(G25="",NOW(),G25))
```

Si no hay FIN, el reloj sigue corriendo contra la hora actual. Es el truco que hace que un paso abierto acumule
tiempo. En Excel obliga a presionar F9 para refrescar; en el sistema, justifica el proceso en segundo plano.

### Horas hábiles (columna H) — la pieza que vale la pena portar

```excel
H25 = IF(F25="","",ROUND(24*
        IF(INT(F25)=INT(K25),
           ' mismo día:
           IF(NETWORKDAYS(F25,F25,$C$151:$C$164)=1,
              MAX(0, MIN(MAX(MOD(K25,1),$C$145),$C$146)
                   - MIN(MAX(MOD(F25,1),$C$145),$C$146)), 0),
           ' días distintos: cola + cabeza + días completos intermedios
           IF(NETWORKDAYS(F25,F25,$C$151:$C$164)=1, $C$146-MIN(MAX(MOD(F25,1),$C$145),$C$146), 0)
         + IF(NETWORKDAYS(K25,K25,$C$151:$C$164)=1, MIN(MAX(MOD(K25,1),$C$145),$C$146)-$C$145, 0)
         + MAX(0, NETWORKDAYS(F25,K25,$C$151:$C$164)
                - NETWORKDAYS(F25,F25,$C$151:$C$164)
                - NETWORKDAYS(K25,K25,$C$151:$C$164)) * ($C$146-$C$145)
        ), 2))
```

Referencias: `$C$145` = hora de inicio de jornada (08:00) · `$C$146` = hora de fin (17:00) ·
`$C$147` = umbral de aviso (0.8) · `$C$151:$C$164` = rango de feriados.

**Verificado y correcto.** Prueba con el ejemplo del archivo (paso 3): inicio 19-oct 16:00, fin 21-oct 10:00.

| Día | Aporte | Por qué |
| --- | --- | --- |
| 19-oct (lunes) | 1.0 h | De 16:00 a 17:00 |
| 20-oct (martes) | 0.0 h | **Día de la Revolución** — feriado |
| 21-oct (miércoles) | 2.0 h | De 08:00 a 10:00 |
| **Total** | **3.00 h** | Coincide con la celda |

### Estado del paso (columna I)

```excel
I25 = IF(F25="","",
        IF(D25="", IF(G25="","En curso","Finalizado"),
          IF(H25>D25,"⚠ RETRASO",
            IF(H25>=D25*$C$147,"Por vencer",
              IF(G25="","En curso","Cumplido")))))
```

---

## Validaciones y formato

**Listas desplegables:**

| Celda / rango | Opciones |
| --- | --- |
| `C11` | Aéreo, Consolidado Marítimo, Contenedor completo marítimo, Frontera |
| `C12` | Verde, Rojo |
| Columna C de los pasos | `$B$201:$B$215` (lista de responsables) |
| Columna E de los pasos | No, Al iniciar el paso, Al finalizar el paso, Si el paso se retrasa |
| Columna D de los pasos | Decimal ≥ 0 |

**Formato condicional** sobre `C18` y `I23:I126`, seis reglas:

| Valor | Texto | Fondo |
| --- | --- | --- |
| ⚠ RETRASO | `#C00000` | `#F8CBAD` |
| Por vencer | `#7F6000` | `#FFE699` |
| En tiempo | `#375623` | `#C6E0B4` |
| Cumplido | `#375623` | `#C6E0B4` |
| En curso | `#1F3864` | `#BDD7EE` |
| Finalizado | `#375623` | `#C6E0B4` |

**Comentarios encontrados** (filas de encabezado de INICIO y FIN):

> *F24:* "Cómo marcar: Ctrl+; (fecha), espacio, Ctrl+Mayús+; (hora). **En la herramienta será un botón ▶ Iniciar**."
> *G24:* "Igual que INICIO. Si FIN está vacío, el cronómetro sigue corriendo hasta la hora actual (F9 para refrescar)."

---

## Problemas detectados

Estos importan al implementar. No son erratas cosméticas.

### 1. `C15` suma los 104 renglones de todos los bloques

`SUM($H$23:$H$126)` abarca pasos comunes **y** los cuatro tipos de trámite **y** las dos rutas. En Excel funciona
de casualidad porque solo se llena un bloque a la vez. En el sistema el total debe filtrar por `tipo_trámite` +
`ruta`, o un file aéreo sumaría pasos de contenedor marítimo.

### 2. Bug en el orden del `IF` de estado

El paso 1 del ejemplo consumió 2.5 h de 3 h esperadas y **está cerrado** (tiene FIN), pero muestra `Por vencer`
porque la comparación del 80 % se evalúa antes de preguntar si cerró. Un paso cumplido dentro del SLA se pinta en
ámbar.

**Corrección:** primero cerrado → `Cumplido`; el umbral del 80 % solo aplica a pasos abiertos.

### 3. El paso 3 puede repetirse, y una fila no lo soporta

Nota del archivo: *"Solo si la revisión detecta errores; puede repetirse (cada ciclo con su cronómetro)."*
El modelo de datos necesita **N ejecuciones por paso**, no una.

### 4. Numeración rota en contenedor completo

- Filas 86 y 99 dicen `11.1` donde debería decir `11.10`. **Artefacto de Excel**, que guardó el valor como número
  y se comió el cero. No es error del cliente.
- Ruta roja: la secuencia salta de `11.11` a `11.13`. **Falta el `11.12`** — 15 pasos numerados hasta el 16.
  Este sí hay que preguntarlo.

### 5. Falta casi toda la tabla de SLAs

Solo 5 de ~86 pasos tienen tiempo esperado (los del ejemplo). Sin esos números no hay alertas ni semáforos.

### 6. Los pasos 6 a 10 están incompletos

Sin responsable, sin tiempo esperado y sin regla de correo. Solo tienen nombre.

### 7. Frontera está vacío

Solo la numeración: 8 verde, 10 rojo. Marcado "POR ALIMENTAR por Logística".

### 8. La regla 6 no se valida

Dice *"un paso inicia al cerrarse el anterior"* pero nada en la hoja lo impide.

### 9. Rangos cableados

`$C$151:$C$164` (14 feriados máx., hay 9 cargados) · `$B$168:$B$197` (30 clientes) · `$B$201:$B$215`
(15 responsables, hay 11). Normal en Excel, inaceptable en el sistema.

### 10. `NOW()` como motor del cronómetro

Obliga a presionar F9. En el sistema es la señal de que hace falta un proceso en segundo plano que evalúe
vencimientos y dispare alertas sin que nadie abra nada.

---

## Las 11 reglas del archivo (sección 4)

1. **Código del file** — `A` + año (2 díg.) + `I` (importación) + código de cliente + correlativo.
   Ej. `A26I10001`. Idealmente el sistema genera el correlativo.
2. **Nombre del cliente** — se autocompleta al indicar el código (maestro del Anexo B).
3. **Tipo de trámite** — lista de 4 opciones, cada una con su bloque de pasos.
4. **Selectivo** — el paso 9 es el Selectivo; el 10 es la lista Rojo/Verde que define la ruta.
5. **Responsable** — cada paso indica quién lo ejecuta (lista del Anexo C).
6. **Cronómetro** — ▶ INICIO al comenzar, ■ FIN al terminar; un paso inicia al cerrarse el anterior.
   *"En la herramienta serán botones."*
7. **Horas hábiles** — solo L-V de 8:00 a 17:00, sin feriados.
8. **Alertas de retraso** — si se supera el tiempo esperado, el paso queda en ⚠ RETRASO y se envía alerta a
   administración. Desde el % de aviso queda "Por vencer".
9. **Correo al cliente** — No / Al iniciar / Al finalizar / Si se retrasa. Va al correo del maestro.
10. **Informe ejecutivo** — PDF con logo, datos del file, resumen de tiempos, línea de tiempo por paso y
    observaciones. *"Se emite al cerrar el file o bajo demanda."*
11. **Pendientes por definir** (del propio cliente) — largo del código de cliente y si el correlativo reinicia
    cada año · definición de "Combex" · calendario oficial de feriados y si se descuenta almuerzo · si los pasos
    1-10 son iguales en todos los trámites · si algún paso puede ser paralelo · logo y colores del informe.

> Sobre el pendiente de "Combex": es **Combex-Im**, la terminal de carga aérea del aeropuerto La Aurora. El paso
> "Realizar retiro de Combex" es retirar la mercancía de ahí.
>
> El pendiente más pesado de los seis es **si algún paso puede ser paralelo**: si la respuesta es sí, el modelo
> deja de ser una lista secuencial y el total deja de ser una suma (habría que medir camino crítico o se contaría
> tiempo doble).

---

## Cómo se extrajo

```python
import openpyxl
wb = openpyxl.load_workbook(ruta, data_only=True)   # valores calculados
wb = openpyxl.load_workbook(ruta, data_only=False)  # fórmulas
```

Revisado: valores de todas las celdas, fórmulas, validaciones de datos (`ws.data_validations`), formato condicional
(`ws.conditional_formatting`), nombres definidos (ninguno) y comentarios de celda.
