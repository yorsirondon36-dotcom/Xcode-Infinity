# Base de Datos Xcode-infinity - Configuración Completa

## Estado: ACTIVA Y FUNCIONAL

La base de datos Supabase está completamente configurada y lista para usar.

## Tablas Activas

### 1. users
- Almacena información de usuarios registrados
- RLS: Habilitado
- Campos principales: id, phone, full_name, balance, total_income, current_level_id, banking_info, referral_code, referred_by_code
- Triggers activos:
  - Generación automática de código de referido
  - Actualización automática de updated_at

### 2. levels
- Almacena los niveles VIP disponibles
- RLS: Habilitado
- Niveles pre-cargados:
  - VIP 1: $120,000 (5 videos/día)
  - VIP 2: $300,000 (10 videos/día)
  - VIP 3: $600,000 (15 videos/día)
  - VIP 4: $1,000,000 (20 videos/día)

### 3. recharges
- Registra todas las recargas de saldo
- RLS: Habilitado
- Trigger activo: Actualiza balance automáticamente cuando status = 'completed'

### 4. withdrawals
- Registra todas las solicitudes de retiro
- RLS: Habilitado
- Estados: 'pending', 'completed'

### 5. daily_income
- Registra ingresos diarios por tareas/videos
- RLS: Habilitado
- Se actualiza automáticamente con la función record_daily_income()

### 6. referrals
- Registra el sistema de referidos
- RLS: Habilitado
- Comisión automática: $5,000 por referido

### 7. user_levels
- Registra los niveles comprados por usuarios
- RLS: Habilitado

## Funciones Automáticas

### 1. record_daily_income(user_id, amount, source)
- Registra ingresos diarios y actualiza balance automáticamente
- Uso: Cuando un usuario completa una tarea o ve un video

### 2. purchase_level(user_id, level_id)
- Procesa la compra de un nivel VIP
- Valida saldo suficiente
- Actualiza balance y current_level_id automáticamente

### 3. process_referral(new_user_id, referral_code)
- Procesa referidos nuevos
- Da comisión de $5,000 al referidor automáticamente
- Crea registro en tabla referrals

### 4. process_recharge_approval()
- Trigger automático al aprobar recargas
- Actualiza balance y total_income

## Seguridad (RLS)

Todas las tablas tienen Row Level Security (RLS) habilitado:

- Los usuarios solo pueden ver y modificar sus propios datos
- Las políticas están configuradas correctamente para INSERT, SELECT, UPDATE
- Los niveles VIP son visibles para todos los usuarios autenticados

## Variables de Entorno

Las variables están configuradas en `.env`:
- VITE_SUPABASE_URL: Conectado
- VITE_SUPABASE_ANON_KEY: Configurado

## Índices de Rendimiento

Se han creado índices en:
- users.phone
- users.referral_code
- recharges.user_id
- withdrawals.user_id
- daily_income.user_id y created_at
- referrals (referrer_id y referred_user_id)
- user_levels.user_id

## Estado de Datos

- Niveles VIP: 4 registrados
- Usuarios: 0 (listo para registro)
- Sistema completamente funcional

## Próximos Pasos

El sistema está listo para:
1. Registro de nuevos usuarios
2. Compra de niveles VIP
3. Procesamiento automático de recargas
4. Sistema de referidos funcional
5. Seguimiento de ingresos diarios

Todo está configurado para que los datos se guarden automáticamente sin interrupciones.
