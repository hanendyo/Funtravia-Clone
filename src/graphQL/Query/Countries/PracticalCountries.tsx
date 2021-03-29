import { gql } from "apollo-boost";
const PracticalCountries = gql`
  query($id: ID!) {
    list_practical_article_country(country_id: $id) {
      id
      name
      information_id
      article_id
      name
      description
      icon
      information_article_detail {
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
export default PracticalCountries;
