-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Create app roles enum and user roles table
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Create indicators table
CREATE TABLE public.indicators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'quantity',
  unit TEXT,
  target_value DECIMAL,
  lower_bound DECIMAL,
  upper_bound DECIMAL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indicator values table for time series data
CREATE TABLE public.indicator_values (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  indicator_id UUID NOT NULL REFERENCES public.indicators(id) ON DELETE CASCADE,
  value DECIMAL NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create loops table
CREATE TABLE public.loops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT DEFAULT 'micro',
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create REL tickets table
CREATE TABLE public.rel_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  indicator_id UUID NOT NULL REFERENCES public.indicators(id) ON DELETE CASCADE,
  loop_id UUID REFERENCES public.loops(id) ON DELETE CASCADE,
  stage TEXT NOT NULL DEFAULT 'open',
  severity_score INTEGER DEFAULT 0,
  magnitude DECIMAL DEFAULT 0,
  persistence INTEGER DEFAULT 0,
  cohort TEXT,
  geo TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create gate stacks table
CREATE TABLE public.gate_stacks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  steps JSONB DEFAULT '[]',
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create applied arcs table
CREATE TABLE public.applied_arcs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_id TEXT NOT NULL,
  arc_type TEXT NOT NULL,
  level TEXT NOT NULL,
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create participation packs table
CREATE TABLE public.participation_packs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  hash TEXT UNIQUE,
  participants JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create transparency packs table
CREATE TABLE public.transparency_packs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  hash TEXT UNIQUE NOT NULL,
  content JSONB DEFAULT '{}',
  published_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create meta rels table
CREATE TABLE public.meta_rels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  precedence_state JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create pilots table
CREATE TABLE public.pilots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'planning',
  data_series JSONB DEFAULT '[]',
  summary JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create metrics summary table
CREATE TABLE public.metrics_summary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  overall_health DECIMAL DEFAULT 0,
  trend_direction TEXT DEFAULT 'stable',
  total_indicators INTEGER DEFAULT 0,
  in_band_count INTEGER DEFAULT 0,
  out_of_band_count INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create sprints table
CREATE TABLE public.sprints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  loop_id UUID REFERENCES public.loops(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'planning',
  start_date DATE,
  end_date DATE,
  goals JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create tasks table
CREATE TABLE public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sprint_id UUID REFERENCES public.sprints(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'todo',
  priority TEXT DEFAULT 'medium',
  assigned_to UUID REFERENCES auth.users(id),
  due_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create breach data view
CREATE OR REPLACE VIEW public.vw_breach_current AS
SELECT 
  r.id,
  r.loop_id,
  l.name as loop_name,
  r.severity_score,
  r.magnitude,
  r.persistence,
  r.cohort,
  r.geo,
  r.updated_at,
  CASE 
    WHEN r.magnitude > LAG(r.magnitude) OVER (PARTITION BY r.indicator_id ORDER BY r.updated_at) THEN 'increasing'
    WHEN r.magnitude < LAG(r.magnitude) OVER (PARTITION BY r.indicator_id ORDER BY r.updated_at) THEN 'decreasing'
    ELSE 'stable'
  END as magnitude_change
FROM public.rel_tickets r
LEFT JOIN public.loops l ON r.loop_id = l.id
WHERE r.stage = 'breach'
ORDER BY r.severity_score DESC;

-- Create meta alignment view
CREATE OR REPLACE VIEW public.meta_alignment_vw AS
SELECT 
  72 as overall_alignment,
  69 as population_score,
  74 as domains_balance_score,
  71 as institutions_adaptivity_score,
  now() as updated_at;

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.indicators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.indicator_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rel_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gate_stacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applied_arcs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.participation_packs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transparency_packs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meta_rels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pilots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.metrics_summary ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sprints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Create security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create RLS policies
-- Profiles policies
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User roles policies
CREATE POLICY "Admins can manage all roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);

-- Data access policies (user-specific data)
CREATE POLICY "Users can manage their own indicators" ON public.indicators FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their indicator values" ON public.indicator_values FOR ALL USING (
  auth.uid() = (SELECT user_id FROM public.indicators WHERE id = indicator_id)
);

CREATE POLICY "Users can manage their own loops" ON public.loops FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own rel tickets" ON public.rel_tickets FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own gate stacks" ON public.gate_stacks FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own applied arcs" ON public.applied_arcs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own participation packs" ON public.participation_packs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own transparency packs" ON public.transparency_packs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own meta rels" ON public.meta_rels FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own pilots" ON public.pilots FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own metrics" ON public.metrics_summary FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own sprints" ON public.sprints FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own tasks" ON public.tasks FOR ALL USING (auth.uid() = user_id);

-- Create trigger function for updating timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_indicators_updated_at BEFORE UPDATE ON public.indicators FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_loops_updated_at BEFORE UPDATE ON public.loops FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_rel_tickets_updated_at BEFORE UPDATE ON public.rel_tickets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_gate_stacks_updated_at BEFORE UPDATE ON public.gate_stacks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_participation_packs_updated_at BEFORE UPDATE ON public.participation_packs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_meta_rels_updated_at BEFORE UPDATE ON public.meta_rels FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_pilots_updated_at BEFORE UPDATE ON public.pilots FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_sprints_updated_at BEFORE UPDATE ON public.sprints FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON public.tasks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email));
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();