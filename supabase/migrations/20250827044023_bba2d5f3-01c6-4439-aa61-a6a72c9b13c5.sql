-- Add column descriptions for retune_suggestions table with correct columns only
COMMENT ON COLUMN retune_suggestions.id IS 'Unique identifier for the retune suggestion';
COMMENT ON COLUMN retune_suggestions.loop_id IS 'Foreign key reference to the loop this retune suggestion applies to';
COMMENT ON COLUMN retune_suggestions.user_id IS 'User who created this retune suggestion';
COMMENT ON COLUMN retune_suggestions.suggestion_type IS 'Type of retune suggestion (e.g., parameter, threshold, control)';
COMMENT ON COLUMN retune_suggestions.title IS 'Title or name of the retune suggestion';
COMMENT ON COLUMN retune_suggestions.description IS 'Detailed description of the retune suggestion';
COMMENT ON COLUMN retune_suggestions.rationale IS 'Explanation for why this retune is suggested';
COMMENT ON COLUMN retune_suggestions.risk_score IS 'Risk score for implementing this suggestion (0-1)';
COMMENT ON COLUMN retune_suggestions.confidence IS 'Confidence score for this suggestion (0-1)';
COMMENT ON COLUMN retune_suggestions.expected_improvement IS 'JSON object containing expected improvements from this retune';
COMMENT ON COLUMN retune_suggestions.proposed_changes IS 'JSON object containing the proposed parameter changes';
COMMENT ON COLUMN retune_suggestions.false_positive_risk IS 'Risk of this suggestion being a false positive (0-1)';
COMMENT ON COLUMN retune_suggestions.impact_level IS 'Expected impact level (low, medium, high)';
COMMENT ON COLUMN retune_suggestions.status IS 'Current status of the retune suggestion (pending, approved, rejected, implemented)';
COMMENT ON COLUMN retune_suggestions.applied_at IS 'Timestamp when this suggestion was applied';
COMMENT ON COLUMN retune_suggestions.applied_by IS 'User who applied this suggestion';
COMMENT ON COLUMN retune_suggestions.created_at IS 'Timestamp when this suggestion was created';
COMMENT ON COLUMN retune_suggestions.updated_at IS 'Timestamp when this suggestion was last updated';