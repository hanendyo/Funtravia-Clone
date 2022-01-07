import { gql } from "apollo-boost";

const DeleteAlbumAll = gql`
  mutation($album_id: ID!) {
    delete_album_all(input: { album_id: $album_id }) {
      id
      response_time
      message
      code
    }
  }
`;

export default DeleteAlbumAll;
