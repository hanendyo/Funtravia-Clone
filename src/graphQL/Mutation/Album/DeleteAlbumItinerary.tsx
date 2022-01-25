import { gql } from "apollo-boost";

const DeleteAlbumItinerary = gql`
  mutation($album_id: ID!) {
    delete_albums_from_itinerary_v2(input: { album_id: $album_id }) {
      id
      response_time
      message
      code
    }
  }
`;

export default DeleteAlbumItinerary;
