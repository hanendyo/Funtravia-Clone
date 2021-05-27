import { gql } from "apollo-boost";
const post = gql`
  query($limit: Int, $offset: Int, $user_id: ID!) {
    user_post_album(user_id: $user_id, limit: $limit, offset: $offset) {
      page_info {
        hasNextPage
        offset
      }
      datas {
        id
        title
        cover
        type
        user {
          id
          first_name
          last_name
          username
          picture
          picture
        }
        created_at
      }
    }
  }
`;
export default post;
