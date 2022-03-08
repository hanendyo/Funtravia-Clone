import {
  SETTOKEN,
  SETUSERSETTING,
  SETNOTIF,
  SETCOUNTMESSAGE,
  SETCOUNTMESSAGEGROUP,
  SET_SEARCH_INPUT,
  SET_SEARCH_EVENT_INPUT,
  SET_SEARCH_DESTINATION_INPUT,
  SET_ITINERARY,
} from "./tipe";

export const setTokenApps = (token) => ({
  type: SETTOKEN,
  data: token,
});
export const setSettingUser = (setting) => ({
  type: SETUSERSETTING,
  data: setting,
});
export const setNotifApps = (notif) => ({
  type: SETNOTIF,
  data: notif,
});
export const setCountMessage = (countMessage) => ({
  type: SETCOUNTMESSAGE,
  data: countMessage,
});
export const setCountMessageGroup = (countMessageGroup) => ({
  type: SETCOUNTMESSAGEGROUP,
  data: countMessageGroup,
});

export const setSearchInput = (input) => ({
  type: SET_SEARCH_INPUT,
  data: input,
});

export const setSearchEventInput = (input) => ({
  type: SET_SEARCH_EVENT_INPUT,
  data: input,
});

export const setSearchDestinationInput = (input) => ({
  type: SET_SEARCH_DESTINATION_INPUT,
  data: input,
});

export const setItinerary = (input) => ({
  type: SET_ITINERARY,
  data: input,
});
