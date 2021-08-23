## App flow documentation

### Init
App is first mounted on index.html via index.tsx
The main app component is wrapped in a provider, which provides a store context to the entire app. This allows us to manage the global state.

### App
This component handles when to display each child/section based on the fetch status. It also contains and handles logic for search input functionality.

### Search
The flow is as follows:
1. Reads user input after a slight delay
2. Updates signal after input verification
3. Clears state on user command (Unimplemented)

### Autocomplete
This section is responsible for displaying suggested anime titles based on the user's input.
1. When the signal for user input is updated, component re-renders
2. Sets loading state to `true` and calls Jikan's API
3. Updates internal state with API response to render 5 suggestions

### Details
This component accepts a prop of the `Anime` class, using the info provided to fetch scores for the anime from a variety of sources.
1. Observes `props.anime` for changes
2. When change occurs, wipes internal state and calls APIs
3. Re-populates state with new info and re-renders component

### Development notes
These are things I feel the need to comment on during the development process:
- This is a frontend framework, backend http request libraries are either suboptimal (axios) or non-functional (phin), prefer native Fetch Api
- Solid's `store` and `createResource` features are wonky and produce unexpected results, such as losing all functionality after an error is encountered instead of recovering on the next change. I'll aim to phase these out and manually implement functionality.