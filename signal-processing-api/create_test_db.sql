SELECT 'CREATE DATABASE signal_test'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'signal_test')\gexec