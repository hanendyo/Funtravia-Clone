import { gql } from "apollo-boost";

const DeleteAlbumItinerary = gql`
  mutation($album_id: ID!) {
    delete_albums_with_post(input: { album_id: $album_id }) {
      id
      response_time
      message
      code
    }
  }
`;

export default DeleteAlbumItinerary;
