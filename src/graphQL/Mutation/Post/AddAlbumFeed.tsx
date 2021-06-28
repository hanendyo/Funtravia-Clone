import { gql } from "apollo-boost";
const AddAlbumFeed = gql`
  mutation($post_id: ID!, $album_id: ID!) {
    link_post_to_album(post_id: $post_id, album_id: $album_id) {
      id
      response_time
      message
      code
    }
  }
`;
export default AddAlbumFeed;
