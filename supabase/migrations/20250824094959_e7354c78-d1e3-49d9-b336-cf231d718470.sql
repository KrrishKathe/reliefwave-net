-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  age INTEGER,
  phone TEXT,
  location JSONB,
  skills TEXT[],
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'volunteer', 'admin')),
  theme TEXT DEFAULT 'dark' CHECK (theme IN ('dark', 'light')),
  language TEXT DEFAULT 'en' CHECK (language IN ('en', 'hi')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create incidents table
CREATE TABLE public.incidents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('flood', 'earthquake', 'fire', 'cyclone', 'landslide', 'other')),
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'ongoing')),
  description TEXT,
  location JSONB,
  reported_by UUID REFERENCES public.profiles(user_id),
  rescue_eta_minutes INTEGER,
  people_affected INTEGER DEFAULT 0,
  people_rescued INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create resources table
CREATE TABLE public.resources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('shelter', 'food', 'medical', 'transport', 'communication')),
  location JSONB,
  capacity INTEGER,
  available_capacity INTEGER,
  contact_phone TEXT,
  contact_email TEXT,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'full', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create jobs table
CREATE TABLE public.jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  company TEXT,
  location JSONB,
  work_type TEXT CHECK (work_type IN ('full-time', 'part-time', 'contract', 'volunteer')),
  skills_required TEXT[],
  salary_range TEXT,
  created_by UUID REFERENCES public.profiles(user_id),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'closed', 'filled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create saved_jobs table
CREATE TABLE public.saved_jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, job_id)
);

-- Create job_applications table
CREATE TABLE public.job_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  applicant_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  applicant_name TEXT NOT NULL,
  applicant_age INTEGER,
  work_time_preference TEXT,
  cover_letter TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'accepted', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(job_id, applicant_id)
);

-- Create rescue_teams table
CREATE TABLE public.rescue_teams (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'deployed', 'offline')),
  location JSONB,
  assigned_incident_id UUID REFERENCES public.incidents(id),
  eta_minutes INTEGER,
  contact_info JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rescue_teams ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for incidents (public read, authenticated insert)
CREATE POLICY "Anyone can view incidents" ON public.incidents
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create incidents" ON public.incidents
  FOR INSERT WITH CHECK (auth.uid() = reported_by);

CREATE POLICY "Users can update their own incidents" ON public.incidents
  FOR UPDATE USING (auth.uid() = reported_by);

-- Create RLS policies for resources (public read)
CREATE POLICY "Anyone can view resources" ON public.resources
  FOR SELECT USING (true);

-- Create RLS policies for jobs (public read, authenticated write)
CREATE POLICY "Anyone can view jobs" ON public.jobs
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create jobs" ON public.jobs
  FOR INSERT WITH CHECK (auth.uid() = created_by);

-- Create RLS policies for saved_jobs
CREATE POLICY "Users can manage their saved jobs" ON public.saved_jobs
  FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for job_applications
CREATE POLICY "Users can view their applications" ON public.job_applications
  FOR SELECT USING (auth.uid() = applicant_id);

CREATE POLICY "Users can create applications" ON public.job_applications
  FOR INSERT WITH CHECK (auth.uid() = applicant_id);

-- Create RLS policies for rescue_teams (public read for now)
CREATE POLICY "Anyone can view rescue teams" ON public.rescue_teams
  FOR SELECT USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_incidents_updated_at
    BEFORE UPDATE ON public.incidents
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_resources_updated_at
    BEFORE UPDATE ON public.resources
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at
    BEFORE UPDATE ON public.jobs
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_job_applications_updated_at
    BEFORE UPDATE ON public.job_applications
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_rescue_teams_updated_at
    BEFORE UPDATE ON public.rescue_teams
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, username, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || SUBSTRING(NEW.id::text, 1, 8)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample data
INSERT INTO public.incidents (title, type, severity, description, location, people_affected, people_rescued, rescue_eta_minutes) VALUES
('Flood in Downtown Area', 'flood', 'high', 'Severe flooding affecting multiple residential blocks', '{"lat": 40.7128, "lng": -74.0060, "address": "Downtown Manhattan"}', 150, 45, 25),
('Building Fire on 5th Street', 'fire', 'critical', 'Multi-story building fire with people trapped', '{"lat": 40.7580, "lng": -73.9855, "address": "5th Street, NYC"}', 30, 20, 8),
('Earthquake Damage in Suburbs', 'earthquake', 'medium', 'Structural damage to homes and infrastructure', '{"lat": 40.6892, "lng": -74.0445, "address": "Brooklyn Heights"}', 200, 180, 45);

INSERT INTO public.resources (name, type, location, capacity, available_capacity, contact_phone) VALUES
('Central Emergency Shelter', 'shelter', '{"lat": 40.7306, "lng": -73.9352, "address": "Central Park East"}', 500, 320, '+1-555-0123'),
('Mobile Medical Unit #1', 'medical', '{"lat": 40.7589, "lng": -73.9851, "address": "Times Square"}', 50, 25, '+1-555-0124'),
('Food Distribution Center', 'food', '{"lat": 40.6781, "lng": -73.9442, "address": "Brooklyn Bridge Park"}', 1000, 750, '+1-555-0125');

INSERT INTO public.jobs (title, description, company, location, work_type, skills_required, salary_range) VALUES
('Emergency Response Coordinator', 'Coordinate rescue operations and manage team communications', 'Relief Corp', '{"lat": 40.7128, "lng": -74.0060, "address": "Emergency Command Center"}', 'full-time', ARRAY['leadership', 'communication', 'emergency response'], '$60,000 - $80,000'),
('Medical Assistant', 'Assist medical staff in emergency treatment', 'City Hospital', '{"lat": 40.7480, "lng": -73.9857, "address": "NYC General Hospital"}', 'contract', ARRAY['medical training', 'first aid'], '$25/hour'),
('Logistics Volunteer', 'Help distribute supplies and manage inventory', 'Red Cross', '{"lat": 40.7061, "lng": -74.0087, "address": "Volunteer Center"}', 'volunteer', ARRAY['organization', 'physical work'], 'Volunteer');

INSERT INTO public.rescue_teams (name, status, location, eta_minutes, contact_info) VALUES
('Team Alpha', 'deployed', '{"lat": 40.7128, "lng": -74.0060}', 15, '{"radio": "ALPHA-1", "leader": "Captain Smith"}'),
('Team Bravo', 'available', '{"lat": 40.7580, "lng": -73.9855}', 0, '{"radio": "BRAVO-1", "leader": "Captain Johnson"}'),
('Team Charlie', 'deployed', '{"lat": 40.6892, "lng": -74.0445}', 30, '{"radio": "CHARLIE-1", "leader": "Captain Davis"}');