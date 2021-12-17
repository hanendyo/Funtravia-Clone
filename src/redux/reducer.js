import { SETTOKEN } from "./tipe";

const initData = {
  token: null,
};

export const reducerApps = (state = initData, action) => {
  switch (action.type) {
    case SETTOKEN:
      return { ...state, token: action.data };
    default:
      return state;
  }
};
