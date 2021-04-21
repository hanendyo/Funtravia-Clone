import { gql } from "apollo-boost";
const detail_travelgoal = gql`
  query($article_id: ID!) {
    detail_travelgoal(article_id: $article_id) {
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
