-- =============================================================================
-- CVRF Nyttokalkyl — Initial database schema
-- =============================================================================

-- Profiles (mirrors auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- =============================================================================
-- CVRF Analyses
-- =============================================================================

CREATE TABLE cvrf_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Ny nyttokalkyl',
  description TEXT,
  status TEXT DEFAULT 'draft',
  current_phase INTEGER DEFAULT 1,
  current_step INTEGER DEFAULT 1,

  -- Step 1: Problem & goals
  problem_description TEXT,
  strategic_alignment TEXT,
  null_alternative TEXT,
  smart_goals JSONB DEFAULT '[]'::jsonb,

  -- Step 2: Alternatives
  alternatives JSONB DEFAULT '[]'::jsonb,

  -- Step 7: Financial parameters
  time_horizon INTEGER DEFAULT 6,
  discount_rate NUMERIC DEFAULT 0.03,

  -- Step 8: Calculated KPIs
  npv NUMERIC,
  bcr NUMERIC,
  irr NUMERIC,
  sroi NUMERIC,
  payback_years NUMERIC,

  -- Gate decisions
  gate1_passed BOOLEAN DEFAULT FALSE,
  gate1_date TIMESTAMPTZ,
  gate2_passed BOOLEAN DEFAULT FALSE,
  gate2_date TIMESTAMPTZ,
  gate3_passed BOOLEAN DEFAULT FALSE,
  gate3_date TIMESTAMPTZ,
  gate4_passed BOOLEAN DEFAULT FALSE,
  gate4_date TIMESTAMPTZ,
  gate5_passed BOOLEAN DEFAULT FALSE,
  gate5_date TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE cvrf_analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own analyses"
  ON cvrf_analyses FOR ALL
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

-- Shared access (for collaboration)
CREATE TABLE cvrf_analysis_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id UUID NOT NULL REFERENCES cvrf_analyses(id) ON DELETE CASCADE,
  shared_with UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'viewer', -- 'viewer' | 'editor'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(analysis_id, shared_with)
);

ALTER TABLE cvrf_analysis_shares ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owner can manage shares"
  ON cvrf_analysis_shares FOR ALL
  USING (
    analysis_id IN (SELECT id FROM cvrf_analyses WHERE owner_id = auth.uid())
  );

CREATE POLICY "Shared users can view their shares"
  ON cvrf_analysis_shares FOR SELECT
  USING (shared_with = auth.uid());

-- Allow shared users to read analyses
CREATE POLICY "Shared users can view analyses"
  ON cvrf_analyses FOR SELECT
  USING (
    id IN (SELECT analysis_id FROM cvrf_analysis_shares WHERE shared_with = auth.uid())
  );

-- Allow editors to update shared analyses
CREATE POLICY "Editors can update shared analyses"
  ON cvrf_analyses FOR UPDATE
  USING (
    id IN (
      SELECT analysis_id FROM cvrf_analysis_shares
      WHERE shared_with = auth.uid() AND role = 'editor'
    )
  );

-- =============================================================================
-- Value Map nodes & edges
-- =============================================================================

CREATE TABLE cvrf_nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id UUID NOT NULL REFERENCES cvrf_analyses(id) ON DELETE CASCADE,
  node_type TEXT NOT NULL, -- 'activity' | 'output' | 'effect' | 'benefit' | 'cost' | 'goal'
  title TEXT NOT NULL DEFAULT 'Ny nod',
  description TEXT,
  position_x INTEGER DEFAULT 0,
  position_y INTEGER DEFAULT 0,

  -- Classification (Step 6)
  benefit_category TEXT,
  time_perspective TEXT,
  confidence TEXT,
  stakeholder_id UUID,

  -- Assumptions
  assumption_text TEXT,
  assumption_validated BOOLEAN DEFAULT FALSE,

  -- Linking (standalone: no external FKs, just UUIDs for future use)
  linked_risk_id UUID,
  linked_effect_goal_id UUID,
  linked_budget_id UUID,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE cvrf_nodes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage nodes via analysis"
  ON cvrf_nodes FOR ALL
  USING (
    analysis_id IN (
      SELECT id FROM cvrf_analyses WHERE owner_id = auth.uid()
      UNION
      SELECT analysis_id FROM cvrf_analysis_shares WHERE shared_with = auth.uid() AND role = 'editor'
    )
  );

CREATE POLICY "Viewers can read nodes"
  ON cvrf_nodes FOR SELECT
  USING (
    analysis_id IN (
      SELECT analysis_id FROM cvrf_analysis_shares WHERE shared_with = auth.uid()
    )
  );

CREATE TABLE cvrf_edges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id UUID NOT NULL REFERENCES cvrf_analyses(id) ON DELETE CASCADE,
  source_node_id UUID NOT NULL REFERENCES cvrf_nodes(id) ON DELETE CASCADE,
  target_node_id UUID NOT NULL REFERENCES cvrf_nodes(id) ON DELETE CASCADE,
  edge_type TEXT,
  label TEXT,
  assumption TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE cvrf_edges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage edges via analysis"
  ON cvrf_edges FOR ALL
  USING (
    analysis_id IN (
      SELECT id FROM cvrf_analyses WHERE owner_id = auth.uid()
      UNION
      SELECT analysis_id FROM cvrf_analysis_shares WHERE shared_with = auth.uid() AND role = 'editor'
    )
  );

CREATE POLICY "Viewers can read edges"
  ON cvrf_edges FOR SELECT
  USING (
    analysis_id IN (
      SELECT analysis_id FROM cvrf_analysis_shares WHERE shared_with = auth.uid()
    )
  );

-- =============================================================================
-- Stakeholders (per analysis)
-- =============================================================================

CREATE TABLE cvrf_stakeholders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id UUID NOT NULL REFERENCES cvrf_analyses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT,
  description TEXT,
  influence_level INTEGER,
  interest_level INTEGER,
  engagement_plan TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE cvrf_stakeholders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Manage stakeholders via analysis"
  ON cvrf_stakeholders FOR ALL
  USING (
    analysis_id IN (
      SELECT id FROM cvrf_analyses WHERE owner_id = auth.uid()
      UNION
      SELECT analysis_id FROM cvrf_analysis_shares WHERE shared_with = auth.uid() AND role = 'editor'
    )
  );

-- =============================================================================
-- Benefit values (per node per year) — Step 7
-- =============================================================================

CREATE TABLE cvrf_benefit_values (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id UUID NOT NULL REFERENCES cvrf_analyses(id) ON DELETE CASCADE,
  node_id UUID NOT NULL REFERENCES cvrf_nodes(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  pessimistic NUMERIC DEFAULT 0,
  likely NUMERIC DEFAULT 0,
  optimistic NUMERIC DEFAULT 0,
  actual NUMERIC,
  data_source TEXT,
  calculation_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(node_id, year)
);

ALTER TABLE cvrf_benefit_values ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Manage benefit values via analysis"
  ON cvrf_benefit_values FOR ALL
  USING (
    analysis_id IN (
      SELECT id FROM cvrf_analyses WHERE owner_id = auth.uid()
      UNION
      SELECT analysis_id FROM cvrf_analysis_shares WHERE shared_with = auth.uid() AND role = 'editor'
    )
  );

-- =============================================================================
-- Cost values (per node per year) — Step 7
-- =============================================================================

CREATE TABLE cvrf_cost_values (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id UUID NOT NULL REFERENCES cvrf_analyses(id) ON DELETE CASCADE,
  node_id UUID NOT NULL REFERENCES cvrf_nodes(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  amount NUMERIC DEFAULT 0,
  actual NUMERIC,
  note TEXT,
  cost_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(node_id, year)
);

ALTER TABLE cvrf_cost_values ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Manage cost values via analysis"
  ON cvrf_cost_values FOR ALL
  USING (
    analysis_id IN (
      SELECT id FROM cvrf_analyses WHERE owner_id = auth.uid()
      UNION
      SELECT analysis_id FROM cvrf_analysis_shares WHERE shared_with = auth.uid() AND role = 'editor'
    )
  );

-- =============================================================================
-- Benefit owners — Step 9
-- =============================================================================

CREATE TABLE cvrf_benefit_owners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  node_id UUID NOT NULL REFERENCES cvrf_nodes(id) ON DELETE CASCADE,
  owner_name TEXT NOT NULL,
  owner_role TEXT,
  baseline_value NUMERIC,
  target_value NUMERIC,
  kpi_description TEXT,
  measurement_frequency TEXT,
  first_measurement_date DATE,
  linked_effect_goal_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE cvrf_benefit_owners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Manage benefit owners via node's analysis"
  ON cvrf_benefit_owners FOR ALL
  USING (
    node_id IN (
      SELECT cn.id FROM cvrf_nodes cn
      JOIN cvrf_analyses ca ON cn.analysis_id = ca.id
      WHERE ca.owner_id = auth.uid()
    )
  );

-- =============================================================================
-- Checkpoints — Step 10/11
-- =============================================================================

CREATE TABLE cvrf_checkpoints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id UUID NOT NULL REFERENCES cvrf_analyses(id) ON DELETE CASCADE,
  checkpoint_date DATE NOT NULL,
  checkpoint_type TEXT,
  status TEXT DEFAULT 'planned', -- 'planned' | 'completed'
  overall_realization_percent NUMERIC,
  findings TEXT,
  corrective_actions TEXT,
  completed_at TIMESTAMPTZ,
  completed_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE cvrf_checkpoints ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Manage checkpoints via analysis"
  ON cvrf_checkpoints FOR ALL
  USING (
    analysis_id IN (
      SELECT id FROM cvrf_analyses WHERE owner_id = auth.uid()
      UNION
      SELECT analysis_id FROM cvrf_analysis_shares WHERE shared_with = auth.uid() AND role = 'editor'
    )
  );

-- =============================================================================
-- Lessons learned — Step 12
-- =============================================================================

CREATE TABLE cvrf_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id UUID NOT NULL REFERENCES cvrf_analyses(id) ON DELETE CASCADE,
  category TEXT,
  title TEXT NOT NULL,
  description TEXT,
  impact TEXT,
  recommendation TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE cvrf_lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Manage lessons via analysis"
  ON cvrf_lessons FOR ALL
  USING (
    analysis_id IN (
      SELECT id FROM cvrf_analyses WHERE owner_id = auth.uid()
      UNION
      SELECT analysis_id FROM cvrf_analysis_shares WHERE shared_with = auth.uid() AND role = 'editor'
    )
  );

-- =============================================================================
-- Indexes
-- =============================================================================

CREATE INDEX idx_cvrf_analyses_owner ON cvrf_analyses(owner_id);
CREATE INDEX idx_cvrf_nodes_analysis ON cvrf_nodes(analysis_id);
CREATE INDEX idx_cvrf_edges_analysis ON cvrf_edges(analysis_id);
CREATE INDEX idx_cvrf_benefit_values_analysis ON cvrf_benefit_values(analysis_id);
CREATE INDEX idx_cvrf_cost_values_analysis ON cvrf_cost_values(analysis_id);
CREATE INDEX idx_cvrf_stakeholders_analysis ON cvrf_stakeholders(analysis_id);
CREATE INDEX idx_cvrf_checkpoints_analysis ON cvrf_checkpoints(analysis_id);
CREATE INDEX idx_cvrf_lessons_analysis ON cvrf_lessons(analysis_id);
CREATE INDEX idx_cvrf_analysis_shares_shared ON cvrf_analysis_shares(shared_with);

-- =============================================================================
-- Updated_at trigger
-- =============================================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at BEFORE UPDATE ON cvrf_analyses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON cvrf_nodes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON cvrf_benefit_owners
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON cvrf_checkpoints
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON cvrf_stakeholders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON cvrf_lessons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
