-- Seed Golden Path Indicators and Sources for Signals Layer
-- Phase 3: Baseline data for the three golden paths

-- Insert signal sources for the golden paths
INSERT INTO public.source_registry (name, type, provider, schedule_cron, enabled, config, pii_class, user_id) VALUES 
('Childcare Admin System', 'pull', 'Municipal Admin', '0 9 * * *', true, '{"endpoint": "admin.childcare.gov", "api_version": "v2"}', 'none', auth.uid()),
('Educator Pipeline Tracker', 'pull', 'Education Board', '0 8 * * 1', true, '{"endpoint": "educator.tracking.edu", "refresh_hours": 168}', 'low', auth.uid()),
('Labour Market Dashboard', 'pull', 'Employment Services', '0 10 * * 2', true, '{"endpoint": "jobs.labour.gov", "metrics": ["vacancies", "placements"]}', 'none', auth.uid()),
('Service Outage Monitor', 'push', 'Operations Center', null, true, '{"webhook_secret": "auto", "rate_limit": 1000}', 'none', auth.uid()),
('Community Pulse Survey', 'file', 'Community Engagement', null, true, '{"format": "csv", "upload_bucket": "signals"}', 'medium', auth.uid())
ON CONFLICT DO NOTHING;

-- Get the seeded golden path loop IDs
WITH golden_loops AS (
    SELECT id, metadata->>'loop_code' as loop_code
    FROM loops 
    WHERE metadata->>'loop_code' IN ('FER-L01', 'FER-L02', 'LAB-L01', 'LAB-L02', 'SOC-L01')
),
source_ids AS (
    SELECT source_id, name FROM source_registry WHERE name IN (
        'Childcare Admin System', 
        'Educator Pipeline Tracker',
        'Labour Market Dashboard',
        'Service Outage Monitor',
        'Community Pulse Survey'
    )
)
-- Insert indicators for Fertility loops
INSERT INTO public.indicator_registry (indicator_key, loop_id, title, unit, triad_tag, snl_key, notes, user_id)
SELECT 
    'childcare_wait_days',
    gl.id,
    'Childcare Wait Time',
    'days',
    'institution',
    'INST.SERVICE.CHILDCARE',
    'Average wait time for childcare placement from application',
    auth.uid()
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
    auth.uid()
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
    auth.uid()
FROM golden_loops gl WHERE gl.loop_code = 'FER-L02'
UNION ALL
-- Labour Market indicators
SELECT 
    'time_to_fill_days',
    gl.id,
    'Job Vacancy Fill Time',
    'days',
    'institution',
    'INST.LABOUR.MATCHING',
    'Average time to fill job vacancies',
    auth.uid()
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
    auth.uid()
FROM golden_loops gl WHERE gl.loop_code = 'LAB-L02'
UNION ALL
-- Social Cohesion indicators
SELECT 
    'outage_rate',
    gl.id,
    'Service Outage Rate',
    'rate',
    'institution',
    'INST.SERVICE.RELIABILITY',
    'Rate of service interruptions and outages',
    auth.uid()
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
    auth.uid()
FROM golden_loops gl WHERE gl.loop_code = 'SOC-L01'
ON CONFLICT (indicator_key) DO NOTHING;

-- Generate some historical data for the indicators
WITH date_series AS (
    SELECT generate_series(
        (now() - interval '90 days')::date,
        now()::date,
        interval '1 day'
    )::timestamp with time zone as ts
),
indicators AS (
    SELECT indicator_key, loop_id FROM indicator_registry
),
sources AS (
    SELECT source_id FROM source_registry LIMIT 1
)
INSERT INTO public.raw_observations (source_id, indicator_key, ts, value, unit, hash, user_id)
SELECT 
    s.source_id,
    i.indicator_key,
    ds.ts,
    CASE 
        WHEN i.indicator_key = 'childcare_wait_days' THEN 
            GREATEST(15, 25 + 10 * sin(extract(epoch from ds.ts) / 86400.0 / 7.0) + random() * 5)
        WHEN i.indicator_key = 'desired_actual_gap' THEN 
            0.8 + 0.2 * sin(extract(epoch from ds.ts) / 86400.0 / 30.0) + random() * 0.1
        WHEN i.indicator_key = 'educator_credential_latency' THEN 
            GREATEST(30, 45 + 15 * sin(extract(epoch from ds.ts) / 86400.0 / 14.0) + random() * 8)
        WHEN i.indicator_key = 'time_to_fill_days' THEN 
            GREATEST(20, 35 + 12 * sin(extract(epoch from ds.ts) / 86400.0 / 21.0) + random() * 6)
        WHEN i.indicator_key = 'vacancy_unemployment_gap' THEN 
            1.2 + 0.3 * sin(extract(epoch from ds.ts) / 86400.0 / 28.0) + random() * 0.15
        WHEN i.indicator_key = 'outage_rate' THEN 
            GREATEST(0, 0.02 + 0.01 * sin(extract(epoch from ds.ts) / 86400.0 / 3.0) + random() * 0.005)
        WHEN i.indicator_key = 'trust_index' THEN 
            GREATEST(0.3, 0.7 + 0.2 * sin(extract(epoch from ds.ts) / 86400.0 / 10.0) + random() * 0.1)
        ELSE 1.0
    END,
    CASE 
        WHEN i.indicator_key LIKE '%_days' OR i.indicator_key LIKE '%_latency' THEN 'days'
        WHEN i.indicator_key LIKE '%_rate' THEN 'rate' 
        WHEN i.indicator_key LIKE '%_gap' OR i.indicator_key LIKE '%_ratio' THEN 'ratio'
        WHEN i.indicator_key LIKE '%_index' THEN 'index'
        ELSE 'units'
    END,
    encode(sha256((s.source_id::text || i.indicator_key || ds.ts::text || random()::text)::bytea), 'hex'),
    auth.uid()
FROM date_series ds
CROSS JOIN indicators i
CROSS JOIN sources s
WHERE random() > 0.1 -- Add some data sparsity
ON CONFLICT (hash) DO NOTHING;

-- Process the raw observations to create normalized data
DO $$
DECLARE
    obs_rec RECORD;
    process_result jsonb;
BEGIN
    -- Process each raw observation through the normalization pipeline
    FOR obs_rec IN 
        SELECT obs_id FROM raw_observations 
        WHERE obs_id NOT IN (
            SELECT DISTINCT obs_id FROM raw_observations ro 
            JOIN normalized_observations no ON (
                ro.indicator_key = no.indicator_key 
                AND ro.ts = no.ts
            )
        )
        ORDER BY ts
        LIMIT 500 -- Process in batches to avoid timeout
    LOOP
        BEGIN
            SELECT process_raw_observation(obs_rec.obs_id) INTO process_result;
        EXCEPTION WHEN OTHERS THEN
            -- Skip observations that fail processing (e.g., missing bands)
            CONTINUE;
        END;
    END LOOP;
END $$;

-- Update data quality status for the sources
INSERT INTO public.dq_status (source_id, indicator_key, as_of, missingness, staleness_seconds, schema_drift, outlier_rate, quality, user_id)
SELECT 
    sr.source_id,
    ir.indicator_key,
    now(),
    CASE WHEN count(ro.obs_id) < 30 THEN 0.3 ELSE 0.05 END, -- missingness
    CASE WHEN max(ro.ingested_at) < now() - interval '2 hours' THEN 7200 ELSE 1800 END, -- staleness
    false, -- no schema drift for baseline data
    CASE WHEN random() > 0.95 THEN 0.02 ELSE 0.0 END, -- occasional outliers
    CASE 
        WHEN count(ro.obs_id) < 10 THEN 'warn'
        WHEN max(ro.ingested_at) < now() - interval '6 hours' THEN 'warn'
        ELSE 'good'
    END,
    auth.uid()
FROM source_registry sr
JOIN raw_observations ro ON sr.source_id = ro.source_id
JOIN indicator_registry ir ON ir.indicator_key = ro.indicator_key
GROUP BY sr.source_id, ir.indicator_key
ON CONFLICT (source_id, indicator_key, as_of) DO UPDATE SET
    missingness = EXCLUDED.missingness,
    staleness_seconds = EXCLUDED.staleness_seconds,
    quality = EXCLUDED.quality;