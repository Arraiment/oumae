import { render } from "solid-js/web";

import "./resources/index.css";
import App from "./App";
import { AppStoreProvider } from "./utils/store"

render(() => 
<AppStoreProvider>
  <App />
</AppStoreProvider>, document.getElementById("root"));
