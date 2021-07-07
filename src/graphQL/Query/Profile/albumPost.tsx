import { gql } from "apollo-boost";
const post = gql`
  query($limit: Int, $offset: Int, $user_id: ID!) {
    user_post_album_v2(user_id: $user_id, limit: $limit, offset: $offset) {
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
        itinerary {
          id
          name
          cover
          start_date
          end_date
          isprivate
          status
        }
      }
    }
  }
`;
export default post;
