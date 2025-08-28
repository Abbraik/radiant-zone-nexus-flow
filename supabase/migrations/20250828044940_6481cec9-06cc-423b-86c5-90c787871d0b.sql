-- Fix RLS issues for audit_log and pii_policies tables
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pii_policies ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for audit_log (admin/service access only)
CREATE POLICY "Service role can manage audit logs"
    ON public.audit_log FOR ALL
    USING (current_setting('role', true) = 'service_role');

CREATE POLICY "Users can read their own audit logs"
    ON public.audit_log FOR SELECT
    USING (auth.uid() = user_id);

-- Add RLS policies for pii_policies (admin access)
CREATE POLICY "Service role can manage PII policies"
    ON public.pii_policies FOR ALL
    USING (current_setting('role', true) = 'service_role');

CREATE POLICY "Authenticated users can read PII policies"
    ON public.pii_policies FOR SELECT
    USING (auth.uid() IS NOT NULL);

-- Add comments to these tables for documentation
COMMENT ON TABLE public.audit_log IS 'System audit trail for tracking user actions and system events';
COMMENT ON COLUMN public.audit_log.id IS 'Unique identifier for the audit log entry';
COMMENT ON COLUMN public.audit_log.org_id IS 'Organization identifier associated with the audit event';
COMMENT ON COLUMN public.audit_log.user_id IS 'User who performed the action (null for system actions)';
COMMENT ON COLUMN public.audit_log.resource_type IS 'Type of resource that was accessed or modified';
COMMENT ON COLUMN public.audit_log.resource_id IS 'Identifier of the specific resource instance';
COMMENT ON COLUMN public.audit_log.action IS 'Action performed (create, read, update, delete, etc.)';
COMMENT ON COLUMN public.audit_log.old_values IS 'Previous values before modification (for update/delete actions)';
COMMENT ON COLUMN public.audit_log.new_values IS 'New values after modification (for create/update actions)';
COMMENT ON COLUMN public.audit_log.ip_address IS 'IP address from which the action was performed';
COMMENT ON COLUMN public.audit_log.user_agent IS 'User agent string of the client that performed the action';
COMMENT ON COLUMN public.audit_log.created_at IS 'Timestamp when the audit event occurred';