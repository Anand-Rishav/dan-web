-- creator_applications: the application form collects audience demographics
-- (step 3 textarea), but the original schema never created the column.
alter table creator_applications
    add column if not exists audience_demographics text;
