import { gql } from "apollo-boost";
const MovieLocationByIDQuery = gql`
  query($movie_id: ID!) {
    movie_byid(movie_id: $movie_id) {
      id
      title
      description
      cover
      destination_count
    }
  }
`;
export default MovieLocationByIDQuery;
