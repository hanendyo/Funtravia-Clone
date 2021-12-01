import { gql } from "apollo-boost";

const RenameAlbumTitle = gql`
  mutation($album_id: ID!, $title: String!) {
    rename_album_itinerary(album_id: $album_id, title: $title) {
      id
      response_time
      message
      code
    }
  }
`;

export default RenameAlbumTitle;
