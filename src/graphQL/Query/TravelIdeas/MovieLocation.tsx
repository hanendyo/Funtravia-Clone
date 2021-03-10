import { gql } from "apollo-boost";
const MovieLocationQuery = gql`
  query($countries_id: ID!) {
    movie_rekomendasi(countries_id: $countries_id) {
      id
      title
      description
      cover
      destination_count
    }
  }
`;
export default MovieLocationQuery;
