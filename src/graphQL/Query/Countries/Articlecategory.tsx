import { gql } from "apollo-boost";
const categoryArticle = gql`
  query($id: ID!) {
    category_article_bycountry(country_id: $id, withheader: false) {
      id
      name
      article {
        id
        title
        type
        position
        content {
          id
          title
          type
          text
          image
          order
        }
      }
    }
  }
`;
export default categoryArticle;
