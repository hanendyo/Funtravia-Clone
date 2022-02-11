import { SETTOKEN, SETUSERSETTING, SETNOTIF } from "./tipe";

const initData = {
  token: null,
  setting: null,
  notif: null,
};

export const reducerApps = (state = initData, action) => {
  switch (action.type) {
    case SETTOKEN:
      return { ...state, token: action.data };
    case SETUSERSETTING:
      return { ...state, setting: action.data };
    case SETNOTIF:
      return { ...state, notif: action.data };
    default:
      return state;
  }
};
