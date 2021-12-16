import { SETTOKEN } from "./tipe";

const initData = {
  token: null,
};

export const reducerAPPS = (state = initData, action) => {
  switch (action.type) {
    case SETTOKEN:
      console.log("TAMBAH COUNTER");
      return { ...state, token: action.data };
    default:
      return state;
  }
};
