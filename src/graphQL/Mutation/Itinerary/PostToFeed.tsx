import { gql } from "apollo-boost";
const Posting = gql`
  mutation(
    $caption: String
    $latitude: String
    $longitude: String
    $location_name: String
    $assets: String!
    $itinerary_id: ID!
    $album_id: ID!
  ) {
    create_post_itinerary_albums(
      input: {
        caption: $caption
        latitude: $latitude
        longitude: $longitude
        location_name: $location_name
        assets: $assets
        itinerary_id: $itinerary_id
        album_id: $album_id
      }
    ) {
      id
      response_time
      message
      code
    }
  }
`;
export default Posting;
