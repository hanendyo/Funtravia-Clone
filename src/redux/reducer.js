import {
  SETTOKEN,
  SETUSERSETTING,
  SETNOTIF,
  SETCOUNTMESSAGE,
  SETCOUNTMESSAGEGROUP,
  SET_SEARCH_INPUT,
  SET_SEARCH_EVENT_INPUT,
  SET_SEARCH_DESTINATION_INPUT,
} from "./tipe";

const initData = {
  token: null,
  setting: null,
  notif: null,
  countMessage: null,
  countMessageGroup: null,
  searchInput: null,
  searchEventInput: null,
  searchDestinationInput: null,
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
    case SET_SEARCH_INPUT:
      return { ...state, searchInput: action.data };
    case SET_SEARCH_EVENT_INPUT:
      return { ...state, searchEventInput: action.data };
    case SET_SEARCH_DESTINATION_INPUT:
      return { ...state, searchDestinationInput: action.data };
    default:
      return state;
  }
};
