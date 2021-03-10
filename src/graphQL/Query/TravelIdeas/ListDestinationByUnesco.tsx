import { gql } from "apollo-boost";
const ListDestinationByUnesco = gql`
  query($countries_id: ID!) {
    listdestinasi_unesco(countries_id: $countries_id) {
      id
      name
      rating
      count_review
      liked
      description
      cities {
        id
        name
      }
      province {
        id
        name
      }
      countries {
        id
        name
      }
      greatfor {
        label
        icon
      }
      images {
        image
      }
    }
  }
`;
export default ListDestinationByUnesco;
