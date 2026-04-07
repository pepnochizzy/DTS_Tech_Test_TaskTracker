# Task Tracker

An application created with Next.Js to track tasks created in the style of a Gov site (this application has no affiliation with Gov.uk)

## Table of contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Setup](#setup)
- [Running the Project](#running-the-project)
- [API endpoints](#api-endpoints)
- [Testing](#testing)
- [Future improvements](#future-improvements)

## Overview

Task Tracker is a simple Next.js application that allows users to create, view, edit and delete tasks efficiently. It demonstrates a modular approach to frontend and backend development, with a focus on separation of concerns and testability.

## Tech Stack

- **Frontend:** React, Next.js, TailwindCSS
- **Backend:** Node.js, PostgreSQL
- **Testing:** Vitest
- **Other tools:** dotenv, cors, lucide-react

## Setup

1. Clone repository:

```
git clone <git@github.com:pepnochizzy/DTS_Tech_Test_TaskTracker.git>
```

2. Install dependencies:

```
npm install
```

3. Create new .env file and configure database credentials
4. Optionally, try it out live with [this link](https://task-tracker-snowy-two.vercel.app/)

## API endpoints

- GET /api/tasks - Get all tasks
- POST /api/tasks - Create new task
- GET /api/tasks/:id - Get a single task by id
- PATCH /api/tasks/:id - Update a task
- DELETE /api/tasks/:id - Delete a task

## Testing

Run tests with Vitest:

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
