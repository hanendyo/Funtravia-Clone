import { SETTOKEN, SETUSERSETTING, SETNOTIF } from "./tipe";

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
