import { gql } from "apollo-boost";
const MovieLocationFirstQuery = gql`
  query($countries_id: ID!) {
    movie_most_populer(countries_id: $countries_id) {
      id
      title
      description
      cover
      destination_count
    }
  }
`;
export default MovieLocationFirstQuery;
