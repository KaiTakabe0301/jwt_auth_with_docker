set -e

psql -v ON_ERROR_STOP=1 --username "${APP_DATABASE_USER}" --dbname "${APP_DATABASE_NAME}" <<-EOSQL
    CREATE TABLE users (id text, name text, email text, password text);
EOSQL
