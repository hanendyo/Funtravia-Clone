import { gql } from "apollo-boost";
const ListDestinationByMovie = gql`
  query($movie_id: ID!) {
    listdestinasi_bymovie(movie_id: $movie_id) {
      id
      name
      rating
      cover
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
export default ListDestinationByMovie;
