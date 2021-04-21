import { gql } from "apollo-boost";
const detail_travelgoal = gql`
  query {
    detail_travelgoal(article_id: "f91f3e93-9d0b-4e90-943b-3a28725bf960") {
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
      content {
        id
        type
        title
        text
        image
        order
      }
    }
  }
`;
export default detail_travelgoal;
