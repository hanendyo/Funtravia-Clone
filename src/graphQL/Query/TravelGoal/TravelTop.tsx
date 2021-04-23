import { gql } from "apollo-boost";
const travelgoal_firsts = gql`
  query {
    travelgoal_first {
      id
      title
      firstimg
      firsttxt
      date
      created_at
      updated_at
      category {
        id
        name
        slug
        icon
      }
      cover
      description
    }
  }
`;
export default travelgoal_firsts;
