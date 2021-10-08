import { gql } from "apollo-boost";
const travelgoal_firsts = gql`
  query($keyword: String) {
    category_travelgoal(keyword: $keyword) {
      id
      name
      icon
      slug
      sugestion
      checked
      show
    }
  }
`;
export default travelgoal_firsts;
