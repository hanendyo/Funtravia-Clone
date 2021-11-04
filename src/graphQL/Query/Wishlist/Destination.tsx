import { gql } from "apollo-boost";
const Destination = gql`
  query($keyword: String) {
    listdetination_wishlist(keyword: $keyword) {
      id
      name
      cover
      rating
      count_review
      liked
      type {
        id
        name
        icon
      }
      cities {
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
      movie_location {
        id
        title
        description
        cover
      }
    }
  }
`;
export default Destination;
