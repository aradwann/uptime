# Uptime
![Nodejs workflow](https://github.com/aradwann/uptime/actions/workflows/node.js.yml/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/aradwann/uptime/badge.svg?branch=main)](https://coveralls.io/github/aradwann/uptime?branch=main)
## Description

monitoring RESTful API server that allows authenticated users to monitor URLs, and get detailed uptime reports about their availability, average response time, and total uptime/downtime.

## Overview

- Signup with email verification.
- CRUD operations for URL checks (`GET`, `PUT` and `DELETE` can be called only by the user user who created the check).
- Authenticated users can receive a notification whenever one of their URLs goes down or up again:
  - Email.
  - Webhook *(optional)*.
- Authenticated users can get detailed uptime reports about their URLs availability, average response time, and total uptime/downtime.
- Authenticated users can group their checks by tags and get reports by tag.

## Decisions I took 

### using linux CRON job over Nodejs setInterval()
 - I think setInterval wouldn't be as accurate as the CRON job if the node main thread is busy with somthing else due the whole event loops life cycle, thus I delegate polling request every interval of time to a CRON which is more reliable and accurate and making use of linux OS 

## Features

- APIs should be consuming and producing `application/json`.
- Authenication should be stateless.
- Each URL check may have the following options:
  - `name`: The name of the check.
  - `url`: The URL to be monitored.
  - `protocol`: The resource protocol name `HTTP`, `HTTPS`, or `TCP`.
  - `path`: A specific path to be monitored *(optional)*.
  - `port`: The server port number *(optional)*.
  - `webhook`: A webhook URL to receive a notification on *(optional)*.
  - `timeout` *(defaults to 5 seconds)*: The timeout of the polling request *(optional)*.
  - `interval` *(defaults to 10 minutes)*: The time interval for polling requests *(optional)*.
  - `threshold` *(defaults to 1 failure)*: The threshold of failed requests that will create an alert *(optional)*.
  - `authentication`: An HTTP authentication header, with the Basic scheme, to be sent with the polling request *(optional)*.
    - `authentication.username`
    - `authentication.password`
  - `httpHeaders`: A list of key/value pairs custom HTTP headers to be sent with the polling request (optional).
  - `assert`: The response assertion to be used on the polling response (optional).
    - `assert.statusCode`: An HTTP status code to be asserted.
  - `tags`: A list of the check tags (optional).
  - `ignoreSSL`: A flag to ignore broken/expired SSL certificates in case of using the HTTPS protocol.
- Each report may have the following information:
  - `status`: The current status of the URL.
  - `availability`: A percentage of the URL availability.
  - `outages`: The total number of URL downtimes.
  - `downtime`: The total time, in seconds, of the URL downtime.
  - `uptime`: The total time, in seconds, of the URL uptime.
  - `responseTime`: The average response time for the URL.
  - `history`: Timestamped logs of the polling requests.


## Run Local Development environment via docker

```bash
$ docker compose --env-file .env.dev up
```

## Running e2e tests 
requires `pnpm` and `docker`

1) it spawns a test db container
2) create a an instance of the app 
3) run e2e tests 
4) close/destory the app
5) teardown test db

```bash
$ pnpm test:e2e
```

## Test

```bash
# unit tests
$ pnpm run test

# test coverage
$ pnpm run test:cov
```

## Swagger (OpenAPI) documentation 

accessed via the endpoint ` /api` 
