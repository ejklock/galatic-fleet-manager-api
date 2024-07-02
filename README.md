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
