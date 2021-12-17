import { createStore } from "redux";
import { reducerApps } from "./reducer";

const storeState = createStore(reducerApps);

export default storeState;
