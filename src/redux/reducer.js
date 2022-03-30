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
  SET_PACKAGE_CITY,
  SET_JOURNAL_CITY,
  SET_ITINERARY_CITY,
  SET_PACKAGE_PROVINCE,
  SET_JOURNAL_PROVINCE,
  SET_ITINERARY_PROVINCE,
  SET_PACKAGE_COUNTRY,
  SET_JOURNAL_COUNTRY,
  SET_FACT_COUNTRY,
  SET_FETCH_DESTINATION,
  SET_ANOTHER_DESTINATION,
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
  itinerary: null,
  city: {
    packageDetail: {
      listCity: null,
      tab: Array(1).fill(0),
      event: { event: [], month: "" },
    },
    journalCity: null,
    itineraryCity: null,
  },
  province: {
    packageDetail: {
      listProvince: null,
      tab: Array(1).fill(0),
      event: { event: [], month: "" },
    },
    journalProvince: null,
    itineraryProvince: null,
  },
  country: {
    packageDetail: {
      listCountry: null,
      tab: Array(1).fill(0),
    },
    journalProvince: null,
    countryFact: [],
  },
  detailDestination: {
    data: {
      dataDestination: null,
      tab: Array(1).fill(0),
    },
    anotherDestination: [],
  },
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
    case SET_ITINERARY:
      return { ...state, itinerary: action.data };
    case SET_PACKAGE_CITY:
      return {
        ...state,
        city: {
          ...state.city,
          packageDetail: {
            listCity: action.data[0],
            tab: action.data[1],
            event: action.data[2],
          },
        },
      };
    case SET_JOURNAL_CITY:
      return { ...state, city: { ...state.city, journalCity: action.data } };
    case SET_ITINERARY_CITY:
      return { ...state, city: { ...state.city, itineraryCity: action.data } };
    case SET_PACKAGE_PROVINCE:
      return {
        ...state,
        province: {
          ...state.province,
          packageDetail: {
            listProvince: action.data[0],
            tab: action.data[1],
            event: action.data[2],
          },
        },
      };
    case SET_JOURNAL_PROVINCE:
      return {
        ...state,
        province: { ...state.province, journalProvince: action.data },
      };
    case SET_ITINERARY_PROVINCE:
      return {
        ...state,
        province: { ...state.province, itineraryProvince: action.data },
      };
    case SET_PACKAGE_COUNTRY:
      return {
        ...state,
        country: {
          ...state.country,
          packageDetail: {
            listCountry: action.data[0],
            tab: action.data[1],
          },
        },
      };
    case SET_JOURNAL_COUNTRY:
      return {
        ...state,
        country: { ...state.country, journalCountry: action.data },
      };
    case SET_FACT_COUNTRY:
      return {
        ...state,
        country: { ...state.country, countryFact: action.data },
      };

    case SET_FETCH_DESTINATION:
      return {
        ...state,
        detailDestination: {
          ...state.detailDestination,
          data: {
            dataDestination: action.data[0],
            tab: action.data[1],
          },
        },
      };
    case SET_ANOTHER_DESTINATION:
      return {
        ...state,
        detailDestination: {
          ...state.detailDestination,
          anotherDestination: action.data,
        },
      };
    default:
      return state;
  }
};
