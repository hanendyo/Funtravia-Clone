import { gql } from "apollo-boost";
const DestinationMoviePopuler = gql`
  query($countries_id: ID!) {
    destination_populer_with_movie(countries_id: $countries_id) {
      id
      name
      description
      cover
    }
  }
`;
export default DestinationMoviePopuler;
