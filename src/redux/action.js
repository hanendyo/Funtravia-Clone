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
  SET_COUNTRY,
  SET_PROVINCE,
  SET_CITY,
  SET_PACKAGE_CITY,
  SET_JOURNAL_CITY,
  SET_ITINERARY_CITY,
  SET_CITY_GROUP,
  SET_PACKAGE_PROVINCE,
  SET_PACKAGE_COUNTRY,
  SET_JOURNAL_PROVINCE,
  SET_ITINERARY_PROVINCE,
  SET_JOURNAL_COUNTRY,
  SET_ITINERARY_COUNTRY,
  SET_FACT_COUNTRY,
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

export const setPackageCity = (input) => ({
  type: SET_PACKAGE_CITY,
  data: input,
});

export const setJournalCity = (input) => ({
  type: SET_JOURNAL_CITY,
  data: input,
});

export const setItineraryCity = (input) => ({
  type: SET_ITINERARY_CITY,
  data: input,
});

export const setPackageProvince = (input) => ({
  type: SET_PACKAGE_PROVINCE,
  data: input,
});

export const setJournalProvince = (input) => ({
  type: SET_PACKAGE_PROVINCE,
  data: input,
});

export const setItineraryProvince = (input) => ({
  type: SET_PACKAGE_PROVINCE,
  data: input,
});

export const setPackageCountry = (input) => ({
  type: SET_PACKAGE_COUNTRY,
  data: input,
});

export const setJournalCountry = (input) => ({
  type: SET_JOURNAL_COUNTRY,
  data: input,
});

export const setFactCountry = (input) => ({
  type: SET_FACT_COUNTRY,
  data: input,
});
