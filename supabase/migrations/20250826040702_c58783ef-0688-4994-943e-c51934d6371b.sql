-- Seed Golden Path Indicators and Sources (Fixed user_id handling)
-- Phase 3: Baseline data seeding with conditional authentication

-- Create a seeding function that can be called when a user is authenticated
CREATE OR REPLACE FUNCTION public.seed_signals_golden_paths()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_id uuid := auth.uid();
    v_result jsonb := '{}';
    v_sources_created integer := 0;
    v_indicators_created integer := 0;
    v_observations_created integer := 0;
BEGIN
    -- Check if user is authenticated
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'User must be authenticated to seed signals data';
    END IF;
    
    -- Insert signal sources for the golden paths
    INSERT INTO source_registry (name, type, provider, schedule_cron, enabled, config, pii_class, user_id) 
    SELECT * FROM (VALUES
        ('Childcare Admin System', 'pull', 'Municipal Admin', '0 9 * * *', true, '{"endpoint": "admin.childcare.gov", "api_version": "v2"}', 'none', v_user_id),
        ('Educator Pipeline Tracker', 'pull', 'Education Board', '0 8 * * 1', true, '{"endpoint": "educator.tracking.edu", "refresh_hours": 168}', 'low', v_user_id),
        ('Labour Market Dashboard', 'pull', 'Employment Services', '0 10 * * 2', true, '{"endpoint": "jobs.labour.gov", "metrics": ["vacancies", "placements"]}', 'none', v_user_id),
        ('Service Outage Monitor', 'push', 'Operations Center', null, true, '{"webhook_secret": "auto", "rate_limit": 1000}', 'none', v_user_id),
        ('Community Pulse Survey', 'file', 'Community Engagement', null, true, '{"format": "csv", "upload_bucket": "signals"}', 'medium', v_user_id)
    ) AS t(name, type, provider, schedule_cron, enabled, config, pii_class, user_id)
    WHERE NOT EXISTS (SELECT 1 FROM source_registry WHERE source_registry.name = t.name AND source_registry.user_id = v_user_id);
    
    GET DIAGNOSTICS v_sources_created = ROW_COUNT;
    
    -- Insert indicators for golden path loops
    WITH golden_loops AS (
        SELECT id, metadata->>'loop_code' as loop_code
        FROM loops 
        WHERE metadata->>'loop_code' IN ('FER-L01', 'FER-L02', 'LAB-L01', 'LAB-L02', 'SOC-L01')
          AND user_id = v_user_id
    )
    INSERT INTO indicator_registry (indicator_key, loop_id, title, unit, triad_tag, snl_key, notes, user_id)
    SELECT * FROM (
        SELECT 
            'childcare_wait_days' as indicator_key,
            gl.id as loop_id,
            'Childcare Wait Time' as title,
            'days' as unit,
            'institution' as triad_tag,
            'INST.SERVICE.CHILDCARE' as snl_key,
            'Average wait time for childcare placement from application' as notes,
            v_user_id as user_id
        FROM golden_loops gl WHERE gl.loop_code = 'FER-L01'
        UNION ALL
        SELECT 
            'desired_actual_gap',
            gl.id,
            'Fertility Intention Gap',
            'ratio',
            'population',
            'POP.INTENTION.FERTILITY',
            'Gap between desired and actual fertility rates',
            v_user_id
        FROM golden_loops gl WHERE gl.loop_code = 'FER-L01'
        UNION ALL
        SELECT 
            'educator_credential_latency',
            gl.id,
            'Educator Credential Processing Time',
            'days',
            'institution',
            'INST.PROCESS.CREDENTIAL',
            'Time to process educator credentials and certifications',
            v_user_id
        FROM golden_loops gl WHERE gl.loop_code = 'FER-L02'
        UNION ALL
        SELECT 
            'time_to_fill_days',
            gl.id,
            'Job Vacancy Fill Time',
            'days',
            'institution',
            'INST.LABOUR.MATCHING',
            'Average time to fill job vacancies',
            v_user_id
        FROM golden_loops gl WHERE gl.loop_code = 'LAB-L01'
        UNION ALL
        SELECT 
            'vacancy_unemployment_gap',
            gl.id,
            'Vacancy-Unemployment Mismatch',
            'ratio',
            'domain',
            'DOM.SKILLS.MISMATCH',
            'Ratio indicating skills mismatch in labour market',
            v_user_id
        FROM golden_loops gl WHERE gl.loop_code = 'LAB-L02'
        UNION ALL
        SELECT 
            'outage_rate',
            gl.id,
            'Service Outage Rate',
            'rate',
            'institution',
            'INST.SERVICE.RELIABILITY',
            'Rate of service interruptions and outages',
            v_user_id
        FROM golden_loops gl WHERE gl.loop_code = 'SOC-L01'
        UNION ALL
        SELECT 
            'trust_index',
            gl.id,
            'Community Trust Index',
            'index',
            'population',
            'POP.TRUST.GOVERNMENT',
            'Weekly pulse measurement of community trust levels',
            v_user_id
        FROM golden_loops gl WHERE gl.loop_code = 'SOC-L01'
    ) AS indicators_data
    WHERE NOT EXISTS (
        SELECT 1 FROM indicator_registry 
        WHERE indicator_registry.indicator_key = indicators_data.indicator_key 
          AND indicator_registry.user_id = v_user_id
    );
    
    GET DIAGNOSTICS v_indicators_created = ROW_COUNT;
    
    -- Generate sample historical data
    WITH date_series AS (
        SELECT generate_series(
            (now() - interval '30 days')::date,
            now()::date,
            interval '1 day'
        )::timestamp with time zone as ts
    ),
    user_indicators AS (
        SELECT indicator_key, loop_id FROM indicator_registry WHERE user_id = v_user_id
    ),
    user_sources AS (
        SELECT source_id FROM source_registry WHERE user_id = v_user_id LIMIT 1
    )
    INSERT INTO raw_observations (source_id, indicator_key, ts, value, unit, hash, user_id)
    SELECT 
        s.source_id,
        i.indicator_key,
        ds.ts + (random() * interval '8 hours'), -- Add some time jitter
        CASE 
            WHEN i.indicator_key = 'childcare_wait_days' THEN 
                GREATEST(15, 25 + 10 * sin(extract(epoch from ds.ts) / 86400.0 / 7.0) + (random() - 0.5) * 8)
            WHEN i.indicator_key = 'desired_actual_gap' THEN 
                GREATEST(0.5, 0.8 + 0.2 * sin(extract(epoch from ds.ts) / 86400.0 / 30.0) + (random() - 0.5) * 0.15)
            WHEN i.indicator_key = 'educator_credential_latency' THEN 
                GREATEST(30, 45 + 15 * sin(extract(epoch from ds.ts) / 86400.0 / 14.0) + (random() - 0.5) * 12)
            WHEN i.indicator_key = 'time_to_fill_days' THEN 
                GREATEST(20, 35 + 12 * sin(extract(epoch from ds.ts) / 86400.0 / 21.0) + (random() - 0.5) * 10)
            WHEN i.indicator_key = 'vacancy_unemployment_gap' THEN 
                GREATEST(0.8, 1.2 + 0.3 * sin(extract(epoch from ds.ts) / 86400.0 / 28.0) + (random() - 0.5) * 0.2)
            WHEN i.indicator_key = 'outage_rate' THEN 
                GREATEST(0, 0.02 + 0.01 * sin(extract(epoch from ds.ts) / 86400.0 / 3.0) + (random() - 0.5) * 0.008)
            WHEN i.indicator_key = 'trust_index' THEN 
                GREATEST(0.3, 0.7 + 0.2 * sin(extract(epoch from ds.ts) / 86400.0 / 10.0) + (random() - 0.5) * 0.15)
            ELSE 1.0
        END,
        CASE 
            WHEN i.indicator_key LIKE '%_days' OR i.indicator_key LIKE '%_latency' THEN 'days'
            WHEN i.indicator_key LIKE '%_rate' THEN 'rate' 
            WHEN i.indicator_key LIKE '%_gap' OR i.indicator_key LIKE '%_ratio' THEN 'ratio'
            WHEN i.indicator_key LIKE '%_index' THEN 'index'
            ELSE 'units'
        END,
        encode(sha256((s.source_id::text || i.indicator_key || ds.ts::text || extract(microseconds from ds.ts)::text)::bytea), 'hex'),
        v_user_id
    FROM date_series ds
    CROSS JOIN user_indicators i
    CROSS JOIN user_sources s
    WHERE random() > 0.15 -- Add some realistic data gaps
      AND NOT EXISTS (
        SELECT 1 FROM raw_observations ro2 
        WHERE ro2.indicator_key = i.indicator_key 
          AND ro2.ts::date = ds.ts::date
          AND ro2.user_id = v_user_id
      );
    
    GET DIAGNOSTICS v_observations_created = ROW_COUNT;
    
    -- Set up initial data quality status
    INSERT INTO dq_status (source_id, indicator_key, as_of, missingness, staleness_seconds, schema_drift, outlier_rate, quality, user_id)
    SELECT 
        sr.source_id,
        ir.indicator_key,
        now(),
        0.05, -- Low missingness for seeded data
        1800, -- 30 minutes staleness
        false,
        0.01, -- Low outlier rate
        'good',
        v_user_id
    FROM source_registry sr
    CROSS JOIN indicator_registry ir
    WHERE sr.user_id = v_user_id 
      AND ir.user_id = v_user_id
      AND NOT EXISTS (
        SELECT 1 FROM dq_status ds 
        WHERE ds.source_id = sr.source_id 
          AND ds.indicator_key = ir.indicator_key
          AND ds.user_id = v_user_id
      );
    
    RETURN jsonb_build_object(
        'success', true,
        'sources_created', v_sources_created,
        'indicators_created', v_indicators_created,
        'observations_created', v_observations_created,
        'user_id', v_user_id
    );
    
EXCEPTION WHEN OTHERS THEN
    RETURN jsonb_build_object(
        'success', false,
        'error', SQLERRM,
        'user_id', v_user_id
    );
END;
$$;

-- Create a view for loop action readiness that includes all loops
CREATE OR REPLACE VIEW public.loop_action_readiness AS
SELECT 
    l.id as loop_id,
    l.name as loop_name,
    COALESCE(lar.auto_ok, true) as auto_ok,
    COALESCE(lar.reasons, ARRAY[]::text[]) as reasons,
    COALESCE(lar.bad_sources, 0) as bad_sources,
    COALESCE(lar.stale_indicators, 0) as stale_indicators,
    COALESCE(lar.drift_indicators, 0) as drift_indicators,
    COALESCE(lar.checked_at, now()) as checked_at,
    l.user_id
FROM loops l
LEFT JOIN LATERAL (
    SELECT 
        (get_loop_action_readiness(l.id)->>'auto_ok')::boolean as auto_ok,
        array(select jsonb_array_elements_text(get_loop_action_readiness(l.id)->'reasons')) as reasons,
        (get_loop_action_readiness(l.id)->>'bad_sources')::integer as bad_sources,
        (get_loop_action_readiness(l.id)->>'stale_indicators')::integer as stale_indicators,
        (get_loop_action_readiness(l.id)->>'drift_indicators')::integer as drift_indicators,
        (get_loop_action_readiness(l.id)->>'checked_at')::timestamp with time zone as checked_at
) lar ON true;