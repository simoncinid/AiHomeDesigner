-- Run in DBeaver: tabella lead per sblocco download free generation
-- Tabella: free_generation_leads_aihomedesigner

CREATE TABLE free_generation_leads_aihomedesigner (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR NOT NULL,
    name VARCHAR NOT NULL,
    language VARCHAR NOT NULL,
    ip_hash VARCHAR,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX ix_free_generation_leads_aihomedesigner_email ON free_generation_leads_aihomedesigner (email);
CREATE INDEX ix_free_generation_leads_aihomedesigner_ip_hash ON free_generation_leads_aihomedesigner (ip_hash);
