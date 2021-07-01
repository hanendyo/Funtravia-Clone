import { gql } from "apollo-boost";
const ListDesAnother = gql`
  query ListDesAnother($id: ID!) {
    destination_another_place(destination_id: $id) {
      id
      name
      rating
      count_review
      liked
      cities {
        id
        name
      }
      countries {
        id
        name
      }
      greatfor {
        id
        name
        slug
        icon
      }
      images {
        image
      }
    }
  }
`;
export default ListDesAnother;
