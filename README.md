# Task Tracker

An application created with Next.Js to track tasks

## Table of contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Setup](#setup)
- [Running the Project](#running-the-project)
- [API endpoints](#api-endpoints)
- [Testing](#testing)
- [Future improvements](#future-improvements)

## Tech Stack

- Frontend: React, Next.js, TailwindCSS
- Backend: Node.js, PostgreSQL
- Testing: Vitest
- Other tools: dotenv, cors, lucide-react

## Setup

- Clone repo
- Install dependencies
- Create a .env file and configure database credentials
- Or, try it out with here: (link)

## API endpoints

- GET /api/tasks - Get all tasks
- POST /api/tasks - Create new task
- GET /api/tasks/:id - Get a single task by id
- PATCH /api/tasks/:id - Update a task
- DELETE /api/tasks/:id - Delete a task

## Testing

- npm run test
- npm run test:watch

## Future improvements

- Add frontend testing
- Add authentication
- Improvemed UI/UX for mobile

## Separation of Concerns

The application follows a seperation of concerns approach. API routes are isolated within the backend, while frontend is structured into distinct layers for data fetching, state management and UI rendering.
Initially, components handled both data fetching and rendering which would make unit testing more difficult.
The architecture was refactored to futher modularise the codebase by introducing a dedicated API layer and custom hooks.

This allowed for clearer responsibility boundaries, improved reusabilty and easier unit testing.
