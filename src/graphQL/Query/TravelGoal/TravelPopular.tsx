import { gql } from "apollo-boost";
const travelgoal_populer = gql`
  query {
    travelgoal_populer(limit: 5) {
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
export default travelgoal_populer;
