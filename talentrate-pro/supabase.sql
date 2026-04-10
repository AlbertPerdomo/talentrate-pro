create table profiles (
  id uuid default gen_random_uuid() primary key,
  name text,
  description text,
  skills text[],
  monthly_rate numeric,
  created_at timestamp default now()
);
