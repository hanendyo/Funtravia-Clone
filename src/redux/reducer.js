import { SETTOKEN, SETUSERSETTING } from "./tipe";

const initData = {
  token: null,
  setting: null,
};

export const reducerApps = (state = initData, action) => {
  switch (action.type) {
    case SETTOKEN:
      return { ...state, token: action.data };
    case SETUSERSETTING:
      return { ...state, setting: action.data };
    default:
      return state;
  }
};
