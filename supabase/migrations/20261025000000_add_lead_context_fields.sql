-- Add context fields captured by the intake forms.
-- brand_leads: website (step 1) and interested_creator (Book Creator / ROI prefill context)
alter table brand_leads
    add column if not exists website text,
    add column if not exists interested_creator text;

-- creator_applications: location (step 1)
alter table creator_applications
    add column if not exists location text;
