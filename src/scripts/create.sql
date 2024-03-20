-- SQL Scripts
CREATE TABLE IF NOT EXISTS eiai_key (
    id serial PRIMARY KEY,
    group_id int DEFAULT 0,
    api_key varchar(64) NOT NULL,
    key_type int DEFAULT 0,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS eiai_model (
    id serial PRIMARY KEY,
    name varchar(64) NOT NULL,
    config jsonb NOT NULL,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS eiai_key_model (
    id serial PRIMARY KEY,
    key_id int NOT NULL,
    model_id int NOT NULL,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS eiai_session (
    id serial PRIMARY KEY,
    key varchar(128) NOT NULL,
    title varchar(64) NOT NULL,
    key_id int NOT NULL,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS eiai_history (
    id serial PRIMARY KEY,
    prompt text NULL,
    completion text NULL,
    prompt_tokens int NOT NULL DEFAULT 0,
    completion_tokens int NOT NULL DEFAULT 0,
    key_id int NOT NULL,
    model_id int NOT NULL,
    session_id int NOT NULL,
    price decimal(10, 2) NOT NULL DEFAULT 0.00,
    fee decimal(10, 2) NOT NULL DEFAULT 0.00,
    currency char(3) NOT NULL DEFAULT 'USD',
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);