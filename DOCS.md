## App flow documentation

### Init
App is first mounted on index.html via index.tsx
The main app component is wrapped in a provider, which provides a store context to the entire app. This allows us to manage the global state.

### App
This component handles when to display each child component based on the loading state provided by the store. It also contains and handles logic for search input functionality.

### Search
The flow is as follows:
1. Reads user input after a slight delay
2. Updates global state with new user input
3. Clears state on user command

### Autocomplete
This component is responsible for displaying suggested anime titles based on the user's input.
1. When the global state for user input is updated, component re-renders
2. Sets loading state to `true` and calls Jikan's API
3. Updates internal state with API response to render 5 suggestions

### Results