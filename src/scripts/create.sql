-- SQL Scripts
CREATE TABLE IF NOT EXISTS eiai_key (
    id serial PRIMARY KEY,
    group_id int DEFAULT 0,
    api_key varchar(64) NOT NULL,
    name varchar(255) NOT NULL,
    email varchar(255) NOT NULL,
    role varchar(64) DEFAULT 'user',
    quota INT DEFAULT -1,
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
    title varchar(64) NULL,
    key_id int NOT NULL,
    total_in_tokens int DEFAULT 0,
    total_out_tokens int DEFAULT 0,
    total_fee DECIMAL(16, 10) DEFAULT 0.00,
    currency char(3) NOT NULL DEFAULT 'USD',
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS eiai_thread (
    id serial PRIMARY KEY,
    prompt text NULL,
    completion text NULL,
    whole_prompt text NULL,
    thread_type int DEFAULT 0,
    key_id int NOT NULL,
    model_id int NULL,
    session_id int NULL,
    session_key varchar(128) NULL,
    tokens_in int NULL DEFAULT 0,
    tokens_out int NULL DEFAULT 0,
    price_in decimal(10, 10) NOT NULL DEFAULT 0.00,
    price_out decimal(10, 10) NOT NULL DEFAULT 0.00,
    fee decimal(12, 10) NULL DEFAULT 0.00,
    currency char(3) NULL DEFAULT 'USD',
    invocation_latency INT DEFAULT 0,
    first_byte_latency INT DEFAULT 0,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);