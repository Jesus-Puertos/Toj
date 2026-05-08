-- ESQUEMA PARA EVENT-DRIVEN ARCHITECTURE (TOJ)
-- Este script crea la infraestructura para que Supabase dispare eventos a n8n.

-- 1. Tabla de Eventos de Dominio
-- Centraliza todo lo que pasa en la plataforma para que n8n solo escuche una tabla.
CREATE TABLE IF NOT EXISTS public.eventos_dominio (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    aggregate_type TEXT NOT NULL, -- 'pago', 'ciudadano', 'carga_masiva', 'ia'
    aggregate_id TEXT NOT NULL,   -- ID del registro relacionado
    tipo_evento TEXT NOT NULL,    -- 'PAGO_CONFIRMADO', 'KYC_COMPLETADO', 'ALERTA_IA'
    payload JSONB DEFAULT '{}'::jsonb,
    origen TEXT DEFAULT 'nextjs',
    leido_por_n8n BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS (solo servicio puede escribir)
ALTER TABLE public.eventos_dominio ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Servicio puede todo" ON public.eventos_dominio FOR ALL USING (true);

-- 2. Índices para rendimiento
CREATE INDEX IF NOT EXISTS idx_eventos_tipo ON public.eventos_dominio(tipo_evento);
CREATE INDEX IF NOT EXISTS idx_eventos_aggregate ON public.eventos_dominio(aggregate_type, aggregate_id);

-- 3. Comentario para n8n
COMMENT ON TABLE public.eventos_dominio IS 'Tabla central de eventos para disparar webhooks hacia n8n';

-- 4. Buckets de Storage (Ejecutar en la consola de Storage o vía SQL si es posible)
-- Nota: Supabase Storage suele requerir configuración vía UI o API específica.
-- Estos son los nombres de los buckets que el código espera:
     'kyc-selfies'
     'kyc-documentos'

-- 5. Trigger automático (Opcional)
-- Si quieres que un cambio en la tabla 'pagos' cree automáticamente un evento:

CREATE OR REPLACE FUNCTION fn_pago_confirmado_evento()
RETURNS TRIGGER AS $$
BEGIN
    IF (OLD.estado_conciliacion != 'Conciliado' AND NEW.estado_conciliacion = 'Conciliado') THEN
        INSERT INTO public.eventos_dominio (aggregate_type, aggregate_id, tipo_evento, payload)
        VALUES ('pago', NEW.id, 'PAGO_CONFIRMADO', jsonb_build_object('monto', NEW.monto_transferido));
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_pago_confirmado
AFTER UPDATE ON public.pagos
FOR EACH ROW EXECUTE FUNCTION fn_pago_confirmado_evento();

