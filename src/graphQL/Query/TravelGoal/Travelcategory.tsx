import { gql } from "apollo-boost";
const travelgoal_firsts = gql`
  query {
    category_travelgoal {
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
