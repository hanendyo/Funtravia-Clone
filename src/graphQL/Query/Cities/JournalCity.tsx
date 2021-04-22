import { gql } from "apollo-boost";
const CityJournal = gql`
  query($id: ID!) {
    journal_by_city(city_id: $id) {
      id
      title
      text
      picture
      userby{
        id
        username
        first_name
        last_name
        picture
      }
      liked
    }
  }
`;
export default CityJournal;
