import { gql } from "apollo-boost";
const City = gql`
  query($keyword: String, $countries_id: ID!) {
    cities_search(key: { keyword: $keyword, countries_id: $countries_id }) {
      id
      name
      cover
      latitude
      longitude
      description
    }
  }
`;
export default City;
