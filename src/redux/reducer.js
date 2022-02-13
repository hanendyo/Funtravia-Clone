import {
  SETTOKEN,
  SETUSERSETTING,
  SETNOTIF,
  SETCOUNTMESSAGE,
  SETCOUNTMESSAGEGROUP,
} from "./tipe";

const initData = {
  token: null,
  setting: null,
  notif: null,
  countMessage: null,
  countMessageGroup: null,
};

export const reducerApps = (state = initData, action) => {
  switch (action.type) {
    case SETTOKEN:
      return { ...state, token: action.data };
    case SETUSERSETTING:
      return { ...state, setting: action.data };
    case SETNOTIF:
      return { ...state, notif: action.data };
    case SETCOUNTMESSAGE:
      return { ...state, countMessage: action.data };
    case SETCOUNTMESSAGEGROUP:
      return { ...state, countMessageGroup: action.data };
    default:
      return state;
  }
};
