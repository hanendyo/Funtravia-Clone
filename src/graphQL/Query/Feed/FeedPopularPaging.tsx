import { gql } from "apollo-boost";
const FeedPopularPaging = gql`
  query($limit: Int, $offset: Int) {
    feed_post_populer_paging(limit: $limit, offset: $offset) {
      page_info {
        hasNextPage
        offset
      }
      datas {
        id
        caption
        longitude
        latitude
        location_name
        liked
        comment_count
        response_count
        created_at
        updated_at
        assets {
          id
          type
          filepath
          order
          is_posted
          created_at
        }
        user {
          id
          username
          first_name
          last_name
          picture
          ismyfeed
        }
      }
    }
  }
`;
export default FeedPopularPaging;
