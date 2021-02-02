import { gql } from "apollo-boost";
const Getcityfilter = gql`
  query($country_id: ID!) {
    get_filter_city(country_id: $country_id, limit: 6, offset: null) {
      id
      name
      code
      sugestion
      checked
      show
    }
  }
`;
export default Getcityfilter;
