-- Create tables for DAN SERVICES

-- Create brand_leads table
create table brand_leads (
    id uuid primary key default uuid_generate_v4(),
    company_name text not null,
    contact_name text not null,
    email text not null,
    phone text,
    budget text,
    platforms text[],
    timeline text,
    goal text,
    calendly_url text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create creator_applications table
create table creator_applications (
    id uuid primary key default uuid_generate_v4(),
    full_name text not null,
    email text not null,
    phone text,
    social_links jsonb default '{}'::jsonb,
    niche text,
    media_kit_url text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create talent_roster table
create table talent_roster (
    id uuid primary key default uuid_generate_v4(),
    full_name text not null,
    platform text not null,
    niche text not null,
    follower_count integer,
    engagement_rate numeric,
    media_kit_url text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create case_studies table
create table case_studies (
    id uuid primary key default uuid_generate_v4(),
    title text not null,
    description text not null,
    client_name text,
    results text,
    platforms text[],
    image_url text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table brand_leads enable row level security;
alter table creator_applications enable row level security;
alter table talent_roster enable row level security;
alter table case_studies enable row level security;

-- Policies for brand_leads
create policy "Allow anonymous inserts on brand_leads"
    on brand_leads
    for insert
    to anon
    with check (true);

create policy "Allow authenticated selects on brand_leads"
    on brand_leads
    for select
    to authenticated
    using (true);

-- Policies for creator_applications
create policy "Allow anonymous inserts on creator_applications"
    on creator_applications
    for insert
    to anon
    with check (true);

create policy "Allow authenticated selects on creator_applications"
    on creator_applications
    for select
    to authenticated
    using (true);

-- Policies for talent_roster
create policy "Allow public selects on talent_roster"
    on talent_roster
    for select
    to anon, authenticated
    using (true);

create policy "Allow authenticated inserts on talent_roster"
    on talent_roster
    for insert
    to authenticated
    with check (true);

-- Policies for case_studies
create policy "Allow public selects on case_studies"
    on case_studies
    for select
    to anon, authenticated
    using (true);

create policy "Allow authenticated inserts on case_studies"
    on case_studies
    for insert
    to authenticated
    with check (true);