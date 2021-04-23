import { gql } from "apollo-boost";
const related_travelgoal = gql`
  query($article_id: ID!) {
    related_travelgoal(article_id: $article_id, limit: 5) {
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
export default related_travelgoal;
