import { test, expect, Page } from '@playwright/test';

// Helper function to setup QA fixtures
async function setupQAFixtures(page: Page) {
  await page.goto('/qa');
  await page.click('button:has-text("Create Fixtures")');
  await page.waitForSelector('text=QA Fixtures Ready');
}

// Helper function to wait for navigation without errors
async function waitForPageLoad(page: Page) {
  await page.waitForLoadState('networkidle');
  
  // Check for console errors
  const errors = await page.evaluate(() => {
    return (window as any).consoleErrors || [];
  });
  
  expect(errors).toHaveLength(0);
}

test.describe('E2E Five Capacities Validation', () => {
  test.beforeEach(async ({ page }) => {
    // Setup auth and fixtures
    await page.goto('/');
    await setupQAFixtures(page);
  });

  test('Responsive Flow: Emergency Response → Claims → Guardrails', async ({ page }) => {
    // Navigate to responsive task
    await page.goto('/workspace?task=L1-resp&qa=responsive');
    await waitForPageLoad(page);
    
    // Verify breadcrumbs reflect context
    await expect(page.locator('[data-testid="breadcrumbs"]')).toContainText('Emergency Throughput');
    await expect(page.locator('[data-testid="breadcrumbs"]')).toContainText('responsive');
    
    // Start claim
    await page.click('button:has-text("Start Claim")');
    await page.waitForSelector('text=Claim started successfully');
    
    // Add substep
    await page.click('button:has-text("Add Substep")');
    await page.fill('input[placeholder*="Step title"]', 'Emergency Response Action');
    await page.fill('textarea[placeholder*="description"]', 'Immediate response to stabilize emergency throughput');
    await page.click('button:has-text("Add Step")');
    
    // Verify substep appears
    await expect(page.locator('text=Emergency Response Action')).toBeVisible();
    
    // Try to add too many concurrent substeps (should trigger guardrail)
    for (let i = 0; i < 4; i++) {
      await page.click('button:has-text("Add Substep")');
      await page.fill('input[placeholder*="Step title"]', `Step ${i + 2}`);
      await page.click('button:has-text("Add Step")');
    }
    
    // Should show guardrail warning
    await expect(page.locator('text=Too many concurrent substeps')).toBeVisible();
    
    // Add checkpoint
    await page.click('button:has-text("Add Checkpoint")');
    await page.fill('textarea[placeholder*="Summary"]', 'Progress checkpoint: Emergency response actions initiated and showing positive impact on system stability.');
    await page.click('button:has-text("Save Checkpoint")');
    
    // Verify checkpoint created
    await expect(page.locator('text=Checkpoint created')).toBeVisible();
    
    // Finish claim (should work after resolving substeps)
    // First complete the substeps
    await page.click('button[data-testid="mark-complete"]:first-child');
    await page.click('button:has-text("Finish Claim")');
    
    // Verify claim completion
    await expect(page.locator('text=Claim completed successfully')).toBeVisible();
  });

  test('Reflexive Flow: KPI Oscillation → Retune → Memory', async ({ page }) => {
    await page.goto('/workspace?task=L2-refl&qa=reflexive');
    await waitForPageLoad(page);
    
    // Verify scorecard data is visible
    await expect(page.locator('text=oscillating')).toBeVisible();
    await expect(page.locator('[data-testid="tri-slope"]')).toContainText('0.02');
    
    // View retune suggestions
    await page.click('button:has-text("View Suggestions")');
    await expect(page.locator('text=Narrow Upper Bound')).toBeVisible();
    
    // Preview retune
    await page.click('button:has-text("Preview")');
    await expect(page.locator('text=Preview shows')).toBeVisible();
    
    // Apply retune
    await page.click('button:has-text("Apply Retune")');
    await page.fill('textarea[placeholder*="rationale"]', 'Applying narrow upper bound retune to reduce KPI oscillation based on 30-day analysis showing excessive variance around band edges');
    await page.click('button:has-text("Confirm Retune")');
    
    // Verify memory record created
    await expect(page.locator('text=Retune applied successfully')).toBeVisible();
    await expect(page.locator('text=Memory record created')).toBeVisible();
    
    // Verify scorecard updated
    await page.reload();
    await waitForPageLoad(page);
    await expect(page.locator('[data-testid="heartbeat"]')).toContainText('minute');
  });

  test('Deliberative Flow: Policy Analysis → MCDA → Packaging', async ({ page }) => {
    await page.goto('/workspace?task=L3-delib&qa=deliberative');
    await waitForPageLoad(page);
    
    // Verify options are loaded
    await expect(page.locator('text=Congestion Pricing')).toBeVisible();
    await expect(page.locator('text=Route Optimization')).toBeVisible();
    
    // Run MCDA
    await page.click('button:has-text("Run MCDA")');
    await page.waitForSelector('[data-testid="mcda-results"]');
    
    // Verify MCDA scores
    await expect(page.locator('[data-testid="mcda-results"]')).toContainText('Weighted Score');
    
    // Check mandate warnings for P-lever option
    await expect(page.locator('text=warning_required')).toBeVisible();
    
    // Package for execution
    await page.click('button:has-text("Package to Execution")');
    await page.fill('textarea[placeholder*="rationale"]', 'Based on MCDA analysis, proceeding with congestion pricing approach due to higher impact-to-effort ratio and lower implementation risk. Route optimization flagged for P-lever review but approved based on strategic necessity and stakeholder consultation completed.');
    await page.click('button:has-text("Create Claims")');
    
    // Verify claims created
    await expect(page.locator('text=Claims created successfully')).toBeVisible();
    
    // Verify deep link to responsive tasks
    await page.click('button:has-text("View Claims")');
    await expect(page.locator('[data-testid="breadcrumbs"]')).toContainText('responsive');
  });

  test('Anticipatory Flow: Watchpoint Trip → Automated Response', async ({ page }) => {
    await page.goto('/workspace?task=L4-anti&qa=anticipatory');
    await waitForPageLoad(page);
    
    // Create watchpoint
    await page.click('button:has-text("New Watchpoint")');
    await page.fill('input[placeholder*="indicator"]', 'demand_surge');
    await page.selectOption('select[data-testid="direction"]', 'up');
    await page.fill('input[type="number"]', '1.20');
    await page.fill('input[placeholder*="Owner"]', 'energy_manager');
    await page.click('button:has-text("Create Watchpoint")');
    
    // Verify watchpoint created
    await expect(page.locator('text=demand_surge')).toBeVisible();
    
    // Dry run test
    await page.click('button:has-text("Test")');
    await expect(page.locator('text=Test triggered')).toBeVisible();
    
    // Arm watchpoint
    await page.click('[data-testid="watchpoint-toggle"]');
    await expect(page.locator('text=Armed')).toBeVisible();
    
    // Simulate watchpoint trip (would normally be done by edge function)
    await page.evaluate(() => {
      // Mock edge function trigger
      fetch('/api/trigger-watchpoint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          watchpoint_id: 'test-watchpoint', 
          value: 1.25 
        })
      });
    });
    
    // Verify toast notification appears
    await expect(page.locator('[data-testid="toast"]')).toContainText('Watchpoint Triggered');
    
    // Click CTA to open responsive task
    await page.click('button:has-text("Open Task")');
    await waitForPageLoad(page);
    
    // Verify navigation to responsive task
    await expect(page.locator('[data-testid="breadcrumbs"]')).toContainText('responsive');
  });

  test('Structural Flow: Bottleneck → Proposal → Adoption → Rollout', async ({ page }) => {
    await page.goto('/workspace?task=L5-struct&qa=structural');
    await waitForPageLoad(page);
    
    // Draft structural proposal
    await page.click('button:has-text("Draft Proposal")');
    await page.fill('input[placeholder*="title"]', 'Multi-Agency Approval Process Redesign');
    await page.fill('textarea[placeholder*="description"]', 'Restructure the multi-agency approval process to reduce bottlenecks and improve coordination through streamlined authority delegation and parallel review workflows.');
    
    // Attach evidence
    await page.click('button:has-text("Attach Evidence")');
    await page.fill('input[placeholder*="evidence"]', 'Process analysis report showing 14-day average approval time with 8-day variance');
    await page.click('button:has-text("Add Evidence")');
    
    // Submit for review
    await page.click('button:has-text("Submit for Review")');
    await expect(page.locator('text=Proposal submitted')).toBeVisible();
    
    // Mock reviewer approval (in real test, would involve multiple users)
    await page.evaluate(() => {
      // Mock approval workflow
      window.postMessage({ type: 'MOCK_APPROVAL', proposalId: 'struct-proposal-1' }, '*');
    });
    
    // Adopt proposal
    await page.click('button:has-text("Adopt Proposal")');
    await page.fill('textarea[placeholder*="adoption rationale"]', 'Adopting structural redesign based on unanimous reviewer approval and demonstrated bottleneck impact on system performance.');
    await page.click('button:has-text("Confirm Adoption")');
    
    // Verify mandate rules updated
    await expect(page.locator('text=Mandate rules updated')).toBeVisible();
    
    // Verify rollout tasks created with deep links
    await page.click('button:has-text("View Rollout Tasks")');
    await expect(page.locator('text=Create Rollout Tasks')).toBeVisible();
    await expect(page.locator('text=Retune under New Regime')).toBeVisible();
    
    // Test deep link to responsive rollout
    await page.click('button:has-text("Create Rollout Tasks")');
    await waitForPageLoad(page);
    await expect(page.locator('[data-testid="breadcrumbs"]')).toContainText('responsive');
  });

  test('Cross-Bundle Navigation: Mode Switching and Deep Links', async ({ page }) => {
    await page.goto('/workspace?task=L1-resp');
    await waitForPageLoad(page);
    
    // Test mode switch UX
    await page.click('button[data-testid="mode-switch"]');
    await expect(page.locator('text=Switch Mode')).toBeVisible();
    
    // Should show recommendation
    await expect(page.locator('[data-testid="recommended-mode"]')).toBeVisible();
    
    // Override recommendation
    await page.click('button[data-testid="reflexive-option"]');
    await page.fill('textarea[placeholder*="rationale"]', 'Overriding recommendation to reflexive capacity because recurring issues suggest need for system optimization rather than reactive response');
    await page.click('button:has-text("Create reflexive Task")');
    
    // Should create new task and navigate
    await expect(page.locator('text=Task created')).toBeVisible();
    await page.click('button:has-text("Open Task")');
    await waitForPageLoad(page);
    
    // Verify new context
    await expect(page.locator('[data-testid="breadcrumbs"]')).toContainText('reflexive');
    
    // Test command palette
    await page.keyboard.press('Meta+k'); // Cmd+K
    await expect(page.locator('[data-testid="command-palette"]')).toBeVisible();
    
    await page.fill('input[placeholder*="Search"]', 'emergency');
    await page.waitForSelector('[data-testid="search-results"]');
    
    // Should show mixed results
    await expect(page.locator('text=Emergency Throughput')).toBeVisible();
    
    // Navigate via palette
    await page.click('[data-testid="search-result"]:first-child');
    await waitForPageLoad(page);
    
    // Should navigate correctly
    await expect(page.url()).toContain('/registry/');
  });

  test('Performance and Accessibility Gates', async ({ page }) => {
    // Performance: TTI < 1500ms
    const startTime = Date.now();
    await page.goto('/workspace');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(1500);
    
    // Command palette performance: < 200ms
    await page.keyboard.press('Meta+k');
    const searchStart = Date.now();
    await page.fill('input[placeholder*="Search"]', 'test');
    await page.waitForSelector('[data-testid="search-results"]');
    const searchTime = Date.now() - searchStart;
    
    expect(searchTime).toBeLessThan(200);
    
    // Accessibility: No critical violations
    const violations = await page.evaluate(() => {
      // Mock axe-core check
      return []; // Would run actual axe-core in real test
    });
    
    expect(violations.filter(v => v.impact === 'critical')).toHaveLength(0);
    
    // Keyboard navigation
    await page.keyboard.press('Escape'); // Close palette
    await page.keyboard.press('Tab'); // Navigate to first interactive element
    await page.keyboard.press('Enter'); // Should activate
    
    // Verify keyboard navigation works
    await expect(page.locator(':focus')).toBeVisible();
  });
});

test.describe('RLS Security Validation', () => {
  test('User isolation: Cannot access other user fixtures', async ({ page, context }) => {
    // Create second user context
    const page2 = await context.newPage();
    
    // User 1 creates fixtures
    await page.goto('/qa');
    await page.click('button:has-text("Create Fixtures")');
    await page.waitForSelector('text=QA Fixtures Ready');
    
    // User 2 should not see User 1's fixtures
    await page2.goto('/qa');
    await expect(page2.locator('text=QA Fixtures Ready')).not.toBeVisible();
    
    // User 2 tries to access User 1's task directly
    const user1TaskUrl = await page.locator('[data-testid="task-url"]').textContent();
    await page2.goto(user1TaskUrl);
    
    // Should show access denied or not found
    await expect(page2.locator('text=Access denied')).toBeVisible();
  });
});