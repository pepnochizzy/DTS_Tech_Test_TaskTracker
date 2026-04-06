## Seperation of Concerns

The application follows a seperation of concerns approach. API routes are isolated within the backend, while frontend is structured into distinct layers for data fetching, state management and UI rendering.
Initially, components handled both data fetching and rendering which would make unit testing more difficult.
The architecture was refactored to futher modularise the codebase by introducing a dedicated API layer and custom hooks.

This allowed for clearer responsibility boundaries, improved reusabilty and easier unit testing.
