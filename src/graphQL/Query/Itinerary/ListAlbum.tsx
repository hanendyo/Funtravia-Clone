import { gql } from "apollo-boost";
const ListAlbum = gql`
  query($user_id: ID!) {
    list_albums(user_id: $user_id) {
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
      count_foto
    }
  }
`;
export default ListAlbum;
