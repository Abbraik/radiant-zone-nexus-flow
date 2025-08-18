-- Insert some sample THINK tasks for testing the Loop Studio
INSERT INTO public.tasks (
  title, 
  description, 
  zone, 
  task_type, 
  status, 
  priority, 
  user_id,
  payload
) VALUES 
(
  'Design Youth Civic Engagement Loop',
  'Create a PAGS loop to model youth civic participation and community engagement dynamics',
  'think',
  'loop_design',
  'todo',
  'high',
  auth.uid(),
  '{
    "loop": {
      "id": "",
      "name": "Youth Civic Engagement Loop",
      "purpose": "Model how youth civic participation affects community development and creates feedback loops for sustainable engagement",
      "steward": "",
      "graph": {
        "nodes": [
          {
            "id": "youth-pop",
            "kind": "Population",
            "label": "Youth (18-25)",
            "tags": ["civic", "engagement", "youth"],
            "position": {"x": 150, "y": 100}
          },
          {
            "id": "civic-domain",
            "kind": "Domain",
            "label": "Civic Participation",
            "tags": ["democracy", "governance"],
            "position": {"x": 350, "y": 150}
          }
        ],
        "edges": []
      },
      "typology": "",
      "structureClass": "",
      "indicators": [
        {
          "id": "civic-participation-rate",
          "label": "Youth Civic Participation Rate",
          "tier": 2,
          "band": {
            "method": "zscore",
            "target": 0.65,
            "upper": 0.8,
            "lower": 0.5,
            "hysteresis": 0.03
          },
          "guardrails": {
            "soft": [-1, 1],
            "hard": [-2, 2]
          },
          "dataRef": "civic.youth_participation"
        }
      ],
      "meadowsLevers": [],
      "instrumentFamilies": [],
      "publishToMonitor": false
    }
  }'::jsonb
),
(
  'Analyze Urban Housing Dynamics',
  'Design a comprehensive loop to understand housing affordability and urban development patterns',
  'think',
  'define_tension',
  'todo',
  'medium',
  auth.uid(),
  '{
    "loop": {
      "id": "",
      "name": "Urban Housing Dynamics",
      "purpose": "",
      "steward": "",
      "graph": {"nodes": [], "edges": []},
      "typology": "",
      "structureClass": "",
      "indicators": [],
      "meadowsLevers": [],
      "instrumentFamilies": [],
      "publishToMonitor": false
    }
  }'::jsonb
),
(
  'Model Climate Resilience Systems',
  'Create PAGS loops to model community climate resilience and adaptation strategies',
  'think',
  'loop_design',
  'todo',
  'critical',
  auth.uid(),
  '{
    "loop": {
      "id": "",
      "name": "Climate Resilience Loop",
      "purpose": "",
      "steward": "",
      "graph": {"nodes": [], "edges": []},
      "typology": "",
      "structureClass": "",
      "indicators": [],
      "meadowsLevers": [],
      "instrumentFamilies": [],
      "publishToMonitor": false
    }
  }'::jsonb
);