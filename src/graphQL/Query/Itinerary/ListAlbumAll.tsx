import { gql } from "apollo-boost";
const ListAlbumAll = gql`
  query($user_id: ID!, $keyword: String) {
    list_all_albums(user_id: $user_id, keyword: $keyword) {
      id
      title
      cover
      user {
        id
        username
        first_name
        last_name
        picture
      }
      firstimg {
        id
        type
        filepath
        order
        is_posted
        post_id
        created_at
      }
      count_foto
    }
  }
`;
export default ListAlbumAll;
