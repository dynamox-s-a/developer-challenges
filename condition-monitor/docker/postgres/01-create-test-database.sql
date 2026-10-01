-- Runs once, when the data volume is created. The test database is separate so that
-- integration tests can reset it freely without touching development data.
CREATE DATABASE condition_monitor_test;
