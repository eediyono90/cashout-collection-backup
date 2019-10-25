# CashOut Collection API

## Setup
1. Ensure `node (>8.6 and <= 10)` and `npm` are installed
2. Run `npm install`
3. Run `npm test`
4. Run `npm start`
5. Hit the server to test health `curl localhost:8010/health` and expect a `200` response 

## Project Overview
This project is developed based on service repository design pattern. API Service running on [express](https://expressjs.com/) application.
Application will load the API, and API will then abstract the business logic in service layer. Access to database is abstracted in repository layer.

## Project Structure
.
├── src                 -> source files
│   ├── apis            -> API
│   ├── models          -> data models
│   └── repositories    -> abstraction for data access layer
│   └── services        -> abstraction for business logic
│   └── shared          -> common / shared class utilities
│   └── specs           -> API request spec
│── app.ts              -> Unit testing
│── schemas.ts          -> Unit testing
└── tests               -> Unit testing
