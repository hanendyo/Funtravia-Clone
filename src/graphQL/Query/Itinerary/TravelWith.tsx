import { gql } from "apollo-boost";
const TravelWith = gql`
  query($keyword: String) {
    search_travelwith(keyword: $keyword) {
      id
      username
      first_name
      last_name
      picture
      bio
    }
  }
`;
export default TravelWith;
