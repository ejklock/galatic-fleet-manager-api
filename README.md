# Intergalactic Fleet Manager

## Overview

Intergalactic Fleet Manager is a comprehensive application designed to manage fleets, contracts, and space travel. It is built using NestJS, TypeORM, and MySQL 8, running on Node.js 20.14

## Technologies

- **Docker**
- **Docker Compose**
- **TypeScript**
- **NestJS**
- **TypeORM**
- **MySQL 8**
- **Node.js 20.14**

## Getting Started

To get started with the application, follow these steps:

### Prerequisites

Ensure you have Docker and Docker Compose installed on your machine.

### Running the Application

1. **Start the application**:

   ```bash
   docker-compose up --build
   ```

   This command will build and start the application along with its dependencies, including MySQL.

2. **Run the database migrations**:

   ```bash
   docker-compose exec app npm run typeorm:migration:run
   ```

   This command will execute all pending database migrations to set up the schema.

3. **Access the application**:

   Open your browser and go to [http://localhost:3333](http://localhost:3333). You will find the Swagger documentation for the API.

## API Usage

Use Swagger interface to manage ships, pilots, contracts, and travel.

Follow the steps below to use the API:

- Create Ship
- Create Pilot
- Add Credits to Pilot
- Add fuel to Ship
- Create Contract
- Accept Contract
- Create Travel
- Generate Reports

## API Endpoints

### Contracts

- **Create a Contract**

  **POST** `/api/v1/contracts`

  Request Body:

  ```json
  {
    "originPlanetId": 1,
    "destinationPlanetId": 2,
    "pilotId": 1,
    "description": "Contract description",
    "value": 1000,
    "resources": [
      {
        "resourceId": 1,
        "quantity": 10
      },
      {
        "resourceId": 2,
        "quantity": 20
      }
    ]
  }
  ```

- **Get All Contracts**

  **GET** `/api/v1/contracts`

  Query Parameters:
  - `page`: (optional) The page number to retrieve.
  - `limit`: (optional) The number of items per page.

- **Get a Contract by ID**

  **GET** `/api/v1/contracts/{id}`

- **Update a Contract**

  **PATCH** `/api/v1/contracts/{id}`

  Request Body:

  ```json
  {
    "originPlanetId": 1,
    "destinationPlanetId": 2,
    "pilotId": 1,
    "description": "Updated contract description",
    "value": 1500,
    "resources": [
      {
        "resourceId": 1,
        "quantity": 15
      },
      {
        "resourceId": 2,
        "quantity": 25
      }
    ]
  }
  ```

- **Delete a Contract**

  **DELETE** `/api/v1/contracts/{id}`

- **Accept a Contract**

  **PATCH** `/api/v1/contracts/{id}/accept`

### Pilots

- **Create a Pilot**

  **POST** `/api/v1/pilots`

  Request Body:

  ```json
  {
    "locationPlanetId": 1,
    "certification": "1234567",
    "name": "Luke Skywalker",
    "age": 18,
    "shipsId": [1, 2, 3]
  }
  ```

- **Get All Pilots**

  **GET** `/api/v1/pilots`

  Query Parameters:
  - `page`: (optional) The page number to retrieve.
  - `limit`: (optional) The number of items per page.

- **Get a Pilot by ID**

  **GET** `/api/v1/pilots/{id}`

- **Update a Pilot**

  **PATCH** `/api/v1/pilots/{id}`

  Request Body:

  ```json
  {
    "locationPlanetId": 1,
    "certification": "7654321",
    "name": "Han Solo",
    "age": 30,
    "shipsId": [1, 3]
  }
  ```

- **Delete a Pilot**

  **DELETE** `/api/v1/pilots/{id}`

- **Add Credits to a Pilot**

  **PATCH** `/api/v1/pilots/{id}/credits/add`

  Request Body:

  ```json
  {
    "amount": 150
  }
  ```

### Ships

- **Create a Ship**

  **POST** `/api/v1/ships`

  Request Body:

  ```json
  {
    "fuelCapacity": 1000,
    "fuelLevel": 500,
    "weightCapacity": 20000
  }
  ```

- **Get All Ships**

  **GET** `/api/v1/ships`

  Query Parameters:
  - `page`: (optional) The page number to retrieve.
  - `limit`: (optional) The number of items per page.

- **Get a Ship by ID**

  **GET** `/api/v1/ships/{id}`

- **Update a Ship**

  **PATCH** `/api/v1/ships/{id}`

  Request Body:

  ```json
  {
    "fuelCapacity": 1200,
    "fuelLevel": 600,
    "weightCapacity": 22000
  }
  ```

- **Delete a Ship**

  **DELETE** `/api/v1/ships/{id}`

- **Add Fuel to a Ship**

  **PUT** `/api/v1/ships/{id}/add-fuel/{amount}`

### Travel

- **Create a Travel**

  **POST** `/api/v1/travel`

  Request Body:

  ```json
  {
    "contractId": 1,
    "fromPlanetId": 1,
    "toPlanetId": 2,
    "pilotId": 1,
    "shipId": 1
  }
  ```

- **Update a Travel**

  **PATCH** `/api/v1/travel/{id}`

  Request Body:

  ```json
  {
    "contractId": 1,
    "fromPlanetId": 1,
    "toPlanetId": 2,
    "pilotId": 1,
    "shipId": 1
  }
  ```

### Reports

- **Calculate Weight Resources by Planet**

  **GET** `/api/v1/reports/weight-resources-by-planet`

- **Calculate Percentage of Resource Type by Pilot**

  **GET** `/api/v1/reports/percentage-of-resource-type-by-pilot`
