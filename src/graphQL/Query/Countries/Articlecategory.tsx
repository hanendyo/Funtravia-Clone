import { gql } from "apollo-boost";
const categoryArticle = gql`
  query($id: ID!) {
    category_article_bycountry(country_id: $id, withheader: false) {
      id
      name
    }
  }
`;
export default categoryArticle;
