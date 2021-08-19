import { render } from "solid-js/web";

import "./resources/index.css";
import App from "./App";
import { Provider } from "./utils/store";

render(() =>
    <Provider>
        <App />
    </Provider>, 
    document.getElementById("root"));
