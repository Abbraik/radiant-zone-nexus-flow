-- Continue adding column descriptions to remaining tables

-- compass_weights table
COMMENT ON COLUMN compass_weights.id IS 'Unique identifier for the compass weights configuration';
COMMENT ON COLUMN compass_weights.loop_id IS 'Foreign key reference to the associated loop';
COMMENT ON COLUMN compass_weights.w_population IS 'Weight factor for population-related indicators';
COMMENT ON COLUMN compass_weights.w_domains IS 'Weight factor for domain-related indicators';
COMMENT ON COLUMN compass_weights.w_institutions IS 'Weight factor for institution-related indicators';
COMMENT ON COLUMN compass_weights.w_legitimacy IS 'Weight factor for legitimacy-related indicators';
COMMENT ON COLUMN compass_weights.user_id IS 'User who configured these weights';
COMMENT ON COLUMN compass_weights.created_at IS 'Timestamp when these weights were created';
COMMENT ON COLUMN compass_weights.updated_at IS 'Timestamp when these weights were last updated';

-- consent_cells table
COMMENT ON COLUMN consent_cells.cell_id IS 'Unique identifier for the consent measurement cell';
COMMENT ON COLUMN consent_cells.region IS 'Geographic region this consent cell represents';
COMMENT ON COLUMN consent_cells.domain IS 'Policy domain this consent measurement covers';
COMMENT ON COLUMN consent_cells.as_of IS 'Date this consent measurement was taken';
COMMENT ON COLUMN consent_cells.consent_score IS 'Numeric consent score for this cell';
COMMENT ON COLUMN consent_cells.sources IS 'JSON object containing data sources for this measurement';
COMMENT ON COLUMN consent_cells.user_id IS 'User who created this consent cell';
COMMENT ON COLUMN consent_cells.created_at IS 'Timestamp when this consent cell was created';

-- controller_tunings table
COMMENT ON COLUMN controller_tunings.id IS 'Unique identifier for the controller tuning';
COMMENT ON COLUMN controller_tunings.loop_code IS 'Loop code this tuning applies to';
COMMENT ON COLUMN controller_tunings.indicator IS 'Indicator being tuned';
COMMENT ON COLUMN controller_tunings.before IS 'JSON object containing controller parameters before tuning';
COMMENT ON COLUMN controller_tunings.after IS 'JSON object containing controller parameters after tuning';
COMMENT ON COLUMN controller_tunings.rationale IS 'Reason for this controller tuning change';
COMMENT ON COLUMN controller_tunings.rmse_delta IS 'Change in root mean square error from this tuning';
COMMENT ON COLUMN controller_tunings.oscillation_delta IS 'Change in oscillation behavior from this tuning';
COMMENT ON COLUMN controller_tunings.effective_from IS 'Timestamp when this tuning becomes effective';
COMMENT ON COLUMN controller_tunings.user_id IS 'User who performed this tuning';
COMMENT ON COLUMN controller_tunings.created_at IS 'Timestamp when this tuning was created';

-- de_bands table
COMMENT ON COLUMN de_bands.id IS 'Unique identifier for the DE band configuration';
COMMENT ON COLUMN de_bands.loop_id IS 'Foreign key reference to the loop this band applies to';
COMMENT ON COLUMN de_bands.indicator IS 'Name of the indicator this band monitors';
COMMENT ON COLUMN de_bands.lower_bound IS 'Lower threshold for the acceptable band';
COMMENT ON COLUMN de_bands.upper_bound IS 'Upper threshold for the acceptable band';
COMMENT ON COLUMN de_bands.asymmetry IS 'Asymmetry factor for band calculations';
COMMENT ON COLUMN de_bands.smoothing_alpha IS 'Alpha parameter for exponential smoothing';
COMMENT ON COLUMN de_bands.notes IS 'Additional notes about this DE band configuration';
COMMENT ON COLUMN de_bands.user_id IS 'User who created this DE band';
COMMENT ON COLUMN de_bands.updated_by IS 'User who last updated this DE band';
COMMENT ON COLUMN de_bands.created_at IS 'Timestamp when this DE band was created';
COMMENT ON COLUMN de_bands.updated_at IS 'Timestamp when this DE band was last updated';

-- de_bands_5c table
COMMENT ON COLUMN de_bands_5c.id IS 'Unique identifier for the 5C DE band configuration';
COMMENT ON COLUMN de_bands_5c.loop_id IS 'Foreign key reference to the 5C loop this band applies to';
COMMENT ON COLUMN de_bands_5c.indicator IS 'Name of the indicator this 5C band monitors';
COMMENT ON COLUMN de_bands_5c.lower_bound IS 'Lower threshold for the acceptable 5C band';
COMMENT ON COLUMN de_bands_5c.upper_bound IS 'Upper threshold for the acceptable 5C band';
COMMENT ON COLUMN de_bands_5c.asymmetry IS 'Asymmetry factor for 5C band calculations';
COMMENT ON COLUMN de_bands_5c.smoothing_alpha IS 'Alpha parameter for 5C exponential smoothing';
COMMENT ON COLUMN de_bands_5c.notes IS 'Additional notes about this 5C DE band configuration';
COMMENT ON COLUMN de_bands_5c.user_id IS 'User who created this 5C DE band';
COMMENT ON COLUMN de_bands_5c.updated_by IS 'User who last updated this 5C DE band';
COMMENT ON COLUMN de_bands_5c.created_at IS 'Timestamp when this 5C DE band was created';
COMMENT ON COLUMN de_bands_5c.updated_at IS 'Timestamp when this 5C DE band was last updated';