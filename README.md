# Intergalactic Fleet Manager

## Overview

Intergalactic Fleet Manager is a comprehensive application designed to manage fleets, contracts, and space travel. It is built using NestJS, TypeORM, and MySQL 8, running on Node.js 20.14

This project provides a comprehensive solution for managing the transport fleet of goods across four planets in the galaxy. The system allows for efficient management of pilots, ships, transport contracts, and cargo, facilitating smooth interplanetary trade and travel.

## Features
1. Pilot and Ship Management
   - Add pilots and their ships to the system, including details such as pilot certification, name, age, credits, location, ship fuel capacity, fuel level, and weight capacity.
2. Contract Management
   - Publish and list transport contracts detailing the description, payload, origin, destination, and value.
   - Accept contracts and manage their lifecycle until fulfillment.
3. Interplanetary Travel
   - Enable pilots to travel between planets, considering ship limitations and blocked routes.
   - Validate travel routes and update database records accordingly.
4. Fuel Management
   - Register fuel refills when ships are on any planet, with each unit of fuel costing 7 credits.
5. Credits and Transactions
   - Grant credits to pilots upon contract fulfillment.
   - Maintain a transaction ledger of all activities, sorted by date.
6. Reporting
   - Generate reports on the total weight of resources sent and received by each planet.
   - Calculate the percentage of resource types transported by each pilot.
   - Maintain an intergalactic transaction ledger.
  
# Travel Rules
- Different routes have varying distances and fuel costs.
- Certain routes are blocked due to obstacles like asteroid belts or scrapyards.
- The system ensures all travel routes are valid before execution.

# Data Models
- **Pilot**: Contains certification, name, age, credits, and location.
- **Ship**: Includes fuel capacity, fuel level, and weight capacity.
- **Contract**: Describes the transport contract, payload, origin, destination, and value.
- **Resource**: Lists resources (minerals, water, food) and their weights.

# Development Requirements
- Proper programming and architecture techniques.
- Persistence using a database.
- Comprehensive API documentation and usage instructions.
- Mandatory unit and acceptance tests, with at least one end-to-end integration test.
- Simple application setup, preferably with Docker.

# Documentation
Ensure the documentation includes:
- Detailed API endpoints or schema.
- Instructions for setting up and running the application.
- Test coverage and examples of usage.

   
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

4. **Test the application**:

   ```bash
   docker-compose exec app npm run test
   ```

     ```bash
   docker-compose exec app npm run test:e2e
   ```

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
