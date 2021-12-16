import { createStore } from "redux";
import { reducerAPPS } from "./reducer";
const storeState = createStore(reducerAPPS);
export default storeState;
