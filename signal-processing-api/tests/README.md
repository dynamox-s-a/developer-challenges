# Running tests

Run the follow command in your terminal:

```bash
> uv run pytest -v --cov

or

> pytest -v --cov
```

If you want to see the tests coverage, run:

```bash
> uv run coverage html

or

> pytest --cov=my_project --cov-report html

```
---

# About the tests

We have two groups of tests:
- Routes tests (*tests/_test_api.py*)
- Latency tests (*tests/test_latency.py*)

## Routes tests

- CREATING ROUTES
  1. test_create_timeseries_route : Here we check if the user can add a time-series with its measurements
  2. test_fail_creating_route : Here the user tries to add a time-series, but he can't because the created_at attribute is in wrong format
   
- READING ROUTES
  1. test_count_timeseries_route : checks if the it returns the number of time-series registered
  2. test_metrics_route : check if it returns the metrics about a determined time-series
  3. test_non_existent_timeseries_metrics : tries retrieve metrics about a time-series that not exists
  4. test_read_timeseries : the user tries to read a registered time-series
  5. test_cannot_read_timeseries : the user tries to read a time-series that is not registered
  6. test_read_all_timeseries : tries to retrieve a list of all time-series, but not showing the measurements, check the response data type
  7. test_read_full_timeseries : tries to retrieve a list of all time-series showing all related measurements and validate the response data type
  8. test_non_existent_full_timeseries : tries to retrieve a list of all time-series with measurements, but there's no time-series registered


- DELETING ROUTES
  1. test_failed_delete_timeseries : tries to delete a time-series that does not exists, checks the response
  2. test_delete_timeseries : tries to delete a existent time-series and checks the response

## Latency tests

The latency tests checks the response time for all routes, trying to be below 350ms per request