import { SETTOKEN } from "./tipe";

export const setTokenApps = (token) => ({
  type: SETTOKEN,
  data: token,
});
