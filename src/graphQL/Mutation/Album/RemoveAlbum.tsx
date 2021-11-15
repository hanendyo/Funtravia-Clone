import { gql } from "apollo-boost";
const RemoveAlbum = gql`
  mutation($album_id: ID, $post_id: ID) {
    remove_albums_post(input: { album_id: $album_id, post_id: $post_id }) {
      id
      response_time
      message
      code
    }
  }
`;
export default RemoveAlbum;
