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
      movie_location {
        id
        title
        description
        cover
        is_populer
        populer_order
      }
    }
  }
`;
export default ListDesAnother;
