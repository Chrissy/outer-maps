import { createStore, applyMiddleware } from "redux";
import { createBrowserHistory } from "history";
import thunk from "redux-thunk";
import reducers from "../state/reducers";

export const history = createBrowserHistory();
export const store = createStore(reducers(history), applyMiddleware(thunk));
