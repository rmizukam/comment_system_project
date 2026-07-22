
DROP DATABASE IF EXISTS comments_db;
CREATE DATABASE comments_db;

\c comments_db;

DROP TABLE IF EXISTS user_posts;

CREATE TABLE user_posts (
    id INT PRIMARY KEY,
    author VARCHAR(100),
    post_text TEXT,
    created_at TIMESTAMPTZ,
    likes INT,
    image_url TEXT
);

DROP TABLE IF EXISTS json_stage;

CREATE TABLE IF NOT EXISTS json_stage (
    raw_content TEXT
);

DROP TABLE IF EXISTS raw_lines;

CREATE TABLE IF NOT EXISTS raw_lines (
    line TEXT
);

\COPY raw_lines FROM './comment_system_project/setup/comments.json' WITH (FORMAT text);

INSERT INTO json_stage (raw_content)
SELECT string_agg(line, E'\n') FROM raw_lines;

DROP TABLE IF EXISTS raw_lines;

INSERT INTO user_posts (id, author, post_text, created_at, likes, image_url)
SELECT 
    (item->>'id')::INT,
    (item->>'author')::VARCHAR(100),
    (item->>'text')::TEXT,
    (item->>'date')::TIMESTAMPTZ,
    (item->>'likes')::INT,
    (item->>'image')::TEXT
FROM (SELECT raw_content::JSONB FROM json_stage) AS stage,
LATERAL jsonb_array_elements(raw_content -> 'comments') AS item
ON CONFLICT (id) DO NOTHING;

DROP TABLE IF EXISTS json_stage;