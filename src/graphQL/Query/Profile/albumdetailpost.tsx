import { gql } from "apollo-boost";
const album = gql`
  query($id: ID!) {
    all_albums_post_v2(album_id: $id) {
      id
      post_id
      album_id
      type
      filepath
      created_at
      updated_at
      created_by
      is_posted
      user_by {
        id
        first_name
        last_name
        username
        picture
        bio
        status_follower
        status_following
      }
    }
  }
`;
export default album;
