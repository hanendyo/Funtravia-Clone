import {
  SETTOKEN,
  SETUSERSETTING,
  SETNOTIF,
  SETCOUNTMESSAGE,
  SETCOUNTMESSAGEGROUP,
  SET_SEARCH_INPUT,
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
