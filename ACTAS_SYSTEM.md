# Sistema de Actas - Documentación

## Descripción General

El sistema de actas registra automáticamente todos los cambios de balance en la tabla `usuarios`. Cada cambio se registra con detalles como tipo de transacción, cantidad, estado y fecha.

## Tabla `actas`

### Estructura
```sql
CREATE TABLE actas (
  identificacion uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  id_usuario uuid NOT NULL,
  tipo text NOT NULL,
  cantidad numeric NOT NULL,
  estado text DEFAULT 'pendiente',
  método_pago text NULL,
  comprobante_url text NULL,
  creado_en timestamptz DEFAULT now()
)
```

### Columnas
- **identificacion**: ID único del registro (UUID)
- **id_usuario**: Referencia al usuario en tabla `usuarios`
- **tipo**: Tipo de transacción (recompensa_video, recarga, retiro, comision_referido, compra_nivel)
- **cantidad**: Monto de la transacción
- **estado**: Estado actual (completado, pendiente, cancelado)
- **método_pago**: Método de pago usado (opcional)
- **comprobante_url**: URL del comprobante de pago (opcional)
- **creado_en**: Timestamp de creación automático

## Trigger Automático

### Función: `registrar_cambio_balance()`

Se ejecuta automáticamente cada vez que el balance en `usuarios` es actualizado.

**Comportamiento:**
- Calcula la diferencia entre balance nuevo y anterior
- Si hay cambio, determina el tipo automáticamente:
  - Si el balance aumenta → `recompensa_video`
  - Si el balance disminuye → `retiro`
- Registra la transacción en `actas` con estado `completado`

**Ejemplo:**
```sql
-- Cuando se ejecuta:
UPDATE usuarios SET balance = balance + 500 WHERE identificacion = 'user-id'

-- Se crea automáticamente:
INSERT INTO actas (id_usuario, tipo, cantidad, estado)
VALUES ('user-id', 'recompensa_video', 500, 'completado')
```

## Funciones de TypeScript

### Ubicación
`/src/lib/actas.ts`

### Funciones Disponibles

#### `crearActa(params)`
Crea un registro manual en actas.

```typescript
import { crearActa } from '@/lib/actas';

await crearActa({
  idUsuario: 'user-123',
  tipo: 'recarga',
  cantidad: 1000,
  estado: 'completado',
  metodoPago: 'nequi'
});
```

#### `obtenerActasUsuario(idUsuario)`
Obtiene todos los registros de actas de un usuario.

```typescript
const actas = await obtenerActasUsuario('user-123');
```

#### `obtenerActasPorTipo(idUsuario, tipo)`
Obtiene actas filtradas por tipo.

```typescript
const recompensas = await obtenerActasPorTipo('user-123', 'recompensa_video');
```

#### `obtenerActasEnRangoFecha(idUsuario, fechaInicio, fechaFin)`
Obtiene actas dentro de un rango de fechas.

```typescript
const actas = await obtenerActasEnRangoFecha(
  'user-123',
  new Date('2026-03-01'),
  new Date('2026-03-04')
);
```

#### `calcularTotalPorTipo(idUsuario, tipo)`
Calcula el total acumulado por tipo de transacción.

```typescript
const totalRecompensas = await calcularTotalPorTipo('user-123', 'recompensa_video');
```

#### `actualizarEstadoActa(identificacionActa, nuevoEstado)`
Actualiza el estado de una acta.

```typescript
await actualizarEstadoActa('acta-id', 'cancelado');
```

### Funciones Convenientes

#### `registrarRecompensaVideo(idUsuario, cantidad)`
```typescript
await registrarRecompensaVideo('user-123', 500);
```

#### `registrarRecarga(idUsuario, cantidad, metodoPago)`
```typescript
await registrarRecarga('user-123', 5000, 'nequi');
```

#### `registrarRetiro(idUsuario, cantidad, metodoPago?)`
```typescript
await registrarRetiro('user-123', 3000, 'transferencia');
```

#### `registrarComisionReferido(idUsuario, cantidad)`
```typescript
await registrarComisionReferido('user-123', 250);
```

#### `registrarCompraLevel(idUsuario, cantidad)`
```typescript
await registrarCompraLevel('user-123', 10000);
```

## Tipos Disponibles

```typescript
type TipoActa =
  | 'recompensa_video'
  | 'recarga'
  | 'retiro'
  | 'comision_referido'
  | 'compra_nivel';

type EstadoActa = 'completado' | 'pendiente' | 'cancelado';
```

## Ejemplos de Uso

### Registrar ganancia de video
```typescript
import { registrarRecompensaVideo } from '@/lib/actas';

// Cuando un usuario completa un video
await registrarRecompensaVideo(usuarioId, 500);
```

### Obtener historial de transacciones
```typescript
import { obtenerActasUsuario } from '@/lib/actas';

const historial = await obtenerActasUsuario(usuarioId);
historial.forEach(acta => {
  console.log(`${acta.tipo}: ${acta.cantidad}`);
});
```

### Calcular ingresos diarios
```typescript
import { obtenerActasEnRangoFecha, obtenerActasPorTipo } from '@/lib/actas';

const hoy = new Date();
hoy.setHours(0, 0, 0, 0);
const manana = new Date(hoy);
manana.setDate(manana.getDate() + 1);

const actasHoy = await obtenerActasEnRangoFecha(usuarioId, hoy, manana);
const totalHoy = actasHoy.reduce((sum, acta) => sum + acta.cantidad, 0);
```

## Notas Importantes

1. **Trigger Automático**: El trigger `trigger_balance_change` se ejecuta automáticamente cuando se actualiza el balance. No necesitas llamarlo manualmente.

2. **Tipos de Transacción**: Usa los tipos predefinidos para mantener consistencia en los registros.

3. **Estado Automático**: Al crear actas manualmente, el estado por defecto es `'completado'`. Usa `'pendiente'` para transacciones que aún no se han procesado.

4. **Auditoría**: El sistema registra automáticamente el timestamp de creación. No es necesario proporcionarlo.

5. **Transacciones**: Los cambios se registran en tiempo real. Para análisis histórico, usa las funciones de consulta proporcionadas.

## Seguridad (RLS)

Todos los accesos a actas están protegidos por Row Level Security. Los usuarios solo pueden ver sus propias actas.
