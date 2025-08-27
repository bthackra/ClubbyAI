-- Enable extensions
create extension if not exists vector;
create extension if not exists "uuid-ossp";

-- Members & Households
create table if not exists households (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  created_at timestamptz default now()
);

create table if not exists members (
  id uuid primary key default uuid_generate_v4(),
  household_id uuid references households(id) on delete set null,
  first_name text not null,
  last_name text not null,
  email text unique,
  phone text,
  role text default 'Member', -- Admin, Staff, Pro, Member
  status text default 'Active',
  created_at timestamptz default now()
);

-- Resources (courts, tee, rooms)
create table if not exists resources (
  id uuid primary key default uuid_generate_v4(),
  type text not null, -- COURT, TEE, POOL, ROOM
  name text not null,
  location text,
  booking_rules_json jsonb default '{}'::jsonb
);

-- Reservations
create table if not exists reservations (
  id uuid primary key default uuid_generate_v4(),
  resource_id uuid not null references resources(id) on delete cascade,
  member_id uuid not null references members(id) on delete cascade,
  start_ts timestamptz not null,
  end_ts timestamptz not null,
  status text default 'BOOKED',
  guests_json jsonb default '[]'::jsonb,
  notes text,
  created_at timestamptz default now()
);

-- Prevent double-booking of same slot for same resource
create unique index if not exists reservations_unique_slot
  on reservations(resource_id, start_ts, end_ts);

-- Billing (very minimal for prototype)
create table if not exists invoices (
  id uuid primary key default uuid_generate_v4(),
  member_id uuid references members(id) on delete set null,
  status text default 'DRAFT', -- DRAFT,SENT,PAID,OVERDUE
  due_date date,
  total_cents integer default 0,
  balance_cents integer default 0,
  external_ref text,
  created_at timestamptz default now()
);

-- Policy docs for RAG (optional)
create table if not exists policy_docs (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  content text not null,
  embedding vector(1536)
);
