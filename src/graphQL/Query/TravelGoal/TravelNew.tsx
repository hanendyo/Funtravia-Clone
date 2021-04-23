import { gql } from "apollo-boost";
const travelgoal_newer = gql`
  query {
    travelgoal_newer(limit: 5) {
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
export default travelgoal_newer;
