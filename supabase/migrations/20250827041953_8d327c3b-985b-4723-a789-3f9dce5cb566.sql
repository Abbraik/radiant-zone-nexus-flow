-- Add descriptions for the final remaining tables

-- Transparency and accountability
COMMENT ON TABLE transparency_packs IS 'Packaged transparency reports and accountability documentation';

-- TRI system snapshots
COMMENT ON TABLE tri_snapshots IS 'Point-in-time snapshots of TRI (Tension-Response-Impact) system state';

-- Trigger management
COMMENT ON TABLE trigger_rules IS 'Rules and conditions that define system triggers';
COMMENT ON TABLE trigger_templates IS 'Reusable templates for creating trigger configurations';

-- User preferences and settings
COMMENT ON TABLE user_settings IS 'Individual user preferences and configuration settings';

-- Monitoring and alerting
COMMENT ON TABLE watchpoints IS 'System monitoring watchpoints for alerts and notifications';