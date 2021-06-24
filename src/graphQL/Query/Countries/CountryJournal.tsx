import { gql } from "apollo-boost";
const journal_by_country = gql`
  query($id: ID!) {
    journal_by_country(country_id: $id) {
      id
      title
      text
      picture
      liked
    }
  }
`;
export default journal_by_country;
