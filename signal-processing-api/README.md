<h1>Signal Processor API</h1>


- [Setting up the API](#setting-up-the-api)
  - [Using Docker](#using-docker)
- [API Routes](#api-routes)
  - [Simple Data Retrieve Routes](#simple-data-retrieve-routes)
  - [Operations Routes](#operations-routes)
  - [Metrics and metadata routes](#metrics-and-metadata-routes)
- [Running tests](#running-tests)

___


## Setting up the API

### Using Docker

You can run the API using the compose file in root folder as it follows:

```bash
docker compose up -d --build

```

Docker will check if the database service is healthy and so start the API at 127.0.0.1/80

The database is already populated with some air humidity time-series data and this data can be acessed by the following routes.

___

## API Routes

In general, we have 7 routes, correspondig all to time-series related data

### Simple Data Retrieve Routes
- GET: */series/*
  
  This route retrieves all time-series registered in database, exposing only id, sensor name and register date of time-series. It's not necessary passing any parameter to get this data

___

- GET: */series/full_series/*
  
  In another hand, this route retrieves all time-series registered, but with all corresponding measurements. No parameter is necessary

___

- GET: */series/time_series_id*

  In this route we can get the data about a specific time-series passing as parameter its id. The response includes id, sensor, creation date and all related measurements.

___

### Operations Routes
- POST:  */series/* 

  In this route it's possible to create a new time-series record, just passing a json with: sensor and a list of measurements (with its timestamp and air humidity data)

___

- DELETE: */series/time_series_id* 
  
  Here it's possible delete an existent time-series by passing its id. Following this route all related time-series data, like measurements points, are automatically deleted too

___

### Metrics and metadata routes

- GET: */series/metrics/time_series_id*

  This route is a more sofisticated one, here you can pass as parameter the selected time-series id and receive some metrics about the registered measurements as:
  - Min/Max air humidity: showing which was the maximum and minimum air humidity registered by the sensor
  - Avg air humidity: the average of all air humidity measurements
  - Stddev air humidity: which was the standard deviation of all measurements in relation to the average air humidity

- GET: */series/count/*

  If you want to see how many time-series are stored, you can just follow this route without parameters and it returns the total number of registered time-series (ignoring related data)

___

## Running tests

All the project tests are located at tests/ folder.

We made a total of 14 tests, considering success cases and failures cases.

We try to include as many user stories as possible to check the API response.

For more instructions about running tests see [Readme Tests](/signal-processing-api/tests/README.md)