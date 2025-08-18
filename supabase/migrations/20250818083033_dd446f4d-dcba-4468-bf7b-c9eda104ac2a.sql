-- Phase 1: Database Schema Migration for Capacity-Mode Architecture (Updated)

-- Create enum types for the new capacity system (only if they don't exist)
DO $$ BEGIN
    CREATE TYPE public.capacity_type AS ENUM ('responsive', 'reflexive', 'deliberative', 'anticipatory', 'structural');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.loop_type AS ENUM ('reactive', 'structural', 'perceptual');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.scale_type AS ENUM ('micro', 'meso', 'macro');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.leverage_type AS ENUM ('N', 'P', 'S');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.task_status AS ENUM ('open', 'claimed', 'active', 'done', 'blocked');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.claim_status AS ENUM ('draft', 'pending', 'approved', 'rejected', 'implemented');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.mandate_status AS ENUM ('allowed', 'restricted', 'forbidden');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Update existing loops table with new fields if they don't exist
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'loops' AND column_name = 'loop_type') THEN
        ALTER TABLE public.loops ADD COLUMN loop_type loop_type DEFAULT 'reactive';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'loops' AND column_name = 'scale') THEN
        ALTER TABLE public.loops ADD COLUMN scale scale_type DEFAULT 'micro';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'loops' AND column_name = 'leverage_default') THEN
        ALTER TABLE public.loops ADD COLUMN leverage_default leverage_type DEFAULT 'N';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'loops' AND column_name = 'metadata') THEN
        ALTER TABLE public.loops ADD COLUMN metadata JSONB DEFAULT '{}'::jsonb;
    END IF;
END $$;

-- Create new tables only if they don't exist

-- Create shared_nodes table
CREATE TABLE IF NOT EXISTS public.shared_nodes (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    label TEXT NOT NULL,
    domain TEXT,
    description TEXT,
    user_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create loop_shared_nodes junction table
CREATE TABLE IF NOT EXISTS public.loop_shared_nodes (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    loop_id UUID NOT NULL,
    node_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(loop_id, node_id)
);

-- Create de_bands table
CREATE TABLE IF NOT EXISTS public.de_bands (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    loop_id UUID NOT NULL,
    indicator TEXT NOT NULL,
    lower_bound NUMERIC,
    upper_bound NUMERIC,
    asymmetry NUMERIC DEFAULT 0,
    notes TEXT,
    user_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create srt_windows table
CREATE TABLE IF NOT EXISTS public.srt_windows (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    loop_id UUID NOT NULL,
    window_start TIMESTAMP WITH TIME ZONE NOT NULL,
    window_end TIMESTAMP WITH TIME ZONE NOT NULL,
    reflex_horizon INTERVAL DEFAULT '1 hour',
    user_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tri_events table
CREATE TABLE IF NOT EXISTS public.tri_events (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    loop_id UUID NOT NULL,
    task_id UUID,
    t_value NUMERIC NOT NULL DEFAULT 0,
    r_value NUMERIC NOT NULL DEFAULT 0,
    i_value NUMERIC NOT NULL DEFAULT 0,
    at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    user_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create band_crossings table
CREATE TABLE IF NOT EXISTS public.band_crossings (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    loop_id UUID NOT NULL,
    direction TEXT NOT NULL, -- 'upper', 'lower', 'return'
    value NUMERIC NOT NULL,
    at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    user_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create claims table
CREATE TABLE IF NOT EXISTS public.claims (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    task_id UUID NOT NULL,
    loop_id UUID NOT NULL,
    assignee UUID NOT NULL,
    raci JSONB DEFAULT '{}'::jsonb,
    leverage leverage_type NOT NULL DEFAULT 'N',
    mandate_status mandate_status DEFAULT 'allowed',
    evidence JSONB DEFAULT '{}'::jsonb,
    sprint_id UUID,
    status claim_status DEFAULT 'draft',
    user_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create interventions table
CREATE TABLE IF NOT EXISTS public.interventions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    claim_id UUID NOT NULL,
    label TEXT NOT NULL,
    description TEXT,
    effort INTEGER DEFAULT 1,
    impact INTEGER DEFAULT 1,
    ordering INTEGER DEFAULT 0,
    user_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create mandate_rules table
CREATE TABLE IF NOT EXISTS public.mandate_rules (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    actor TEXT NOT NULL,
    allowed_levers TEXT[] DEFAULT ARRAY[]::TEXT[],
    restrictions JSONB DEFAULT '{}'::jsonb,
    user_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create loop_scorecards table
CREATE TABLE IF NOT EXISTS public.loop_scorecards (
    loop_id UUID NOT NULL PRIMARY KEY,
    last_tri JSONB DEFAULT '{}'::jsonb,
    de_state TEXT DEFAULT 'stable',
    claim_velocity NUMERIC DEFAULT 0,
    fatigue INTEGER DEFAULT 0,
    user_id UUID NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Update existing tasks table with new capacity fields
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tasks' AND column_name = 'capacity') THEN
        ALTER TABLE public.tasks ADD COLUMN capacity capacity_type;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tasks' AND column_name = 'loop_id') THEN
        ALTER TABLE public.tasks ADD COLUMN loop_id UUID;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tasks' AND column_name = 'type') THEN
        ALTER TABLE public.tasks ADD COLUMN type loop_type;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tasks' AND column_name = 'scale') THEN
        ALTER TABLE public.tasks ADD COLUMN scale scale_type;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tasks' AND column_name = 'leverage') THEN
        ALTER TABLE public.tasks ADD COLUMN leverage leverage_type;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tasks' AND column_name = 'tri') THEN
        ALTER TABLE public.tasks ADD COLUMN tri JSONB DEFAULT '{}'::jsonb;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tasks' AND column_name = 'de_band_id') THEN
        ALTER TABLE public.tasks ADD COLUMN de_band_id UUID;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tasks' AND column_name = 'srt_id') THEN
        ALTER TABLE public.tasks ADD COLUMN srt_id UUID;
    END IF;
END $$;