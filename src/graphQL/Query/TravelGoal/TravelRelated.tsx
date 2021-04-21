import { gql } from "apollo-boost";
const related_travelgoal = gql`
  query {
    related_travelgoal(
      article_id: "f91f3e93-9d0b-4e90-943b-3a28725bf960"
      limit: 5
    ) {
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
    }
  }
`;
export default related_travelgoal;
