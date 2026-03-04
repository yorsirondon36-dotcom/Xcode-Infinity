/*
  # Crear trigger para registrar cambios de balance en actas

  1. Funcionalidad
    - Crea una función `registrar_cambio_balance` que se ejecuta automáticamente
    - Cada vez que el balance en la tabla `usuarios` cambia, se registra en `actas`
    - Se registra: id_usuario, tipo, cantidad y estado
  
  2. Nueva Función PL/pgSQL
    - `registrar_cambio_balance()`: Captura cambios de balance y crea entrada en actas
  
  3. Nuevo Trigger
    - `trigger_balance_change` en tabla `usuarios` AFTER UPDATE
    - Se ejecuta solo cuando la columna `balance` realmente cambia
  
  4. Detalles de Registro
    - tipo: Tipo de cambio (recompensa_video, recarga, retiro, etc)
    - cantidad: Diferencia de balance (NEW.balance - OLD.balance)
    - estado: Siempre 'completado' para cambios de balance confirmados
    - creado_en: Timestamp automático
*/

CREATE OR REPLACE FUNCTION registrar_cambio_balance()
RETURNS TRIGGER AS $$
DECLARE
  diferencia NUMERIC;
  tipo_cambio TEXT;
BEGIN
  diferencia := NEW.balance - OLD.balance;
  
  IF diferencia <> 0 THEN
    IF diferencia > 0 THEN
      tipo_cambio := 'recompensa_video';
    ELSE
      tipo_cambio := 'retiro';
    END IF;

    INSERT INTO actas (id_usuario, tipo, cantidad, estado)
    VALUES (
      NEW.identificacion,
      tipo_cambio,
      ABS(diferencia),
      'completado'
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_balance_change ON usuarios;

CREATE TRIGGER trigger_balance_change
AFTER UPDATE OF balance ON usuarios
FOR EACH ROW
WHEN (OLD.balance IS DISTINCT FROM NEW.balance)
EXECUTE FUNCTION registrar_cambio_balance();
