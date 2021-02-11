import { gql } from "apollo-boost";
const Feedsearchbytag = gql`
  query($limit: Int, $offset: Int, $keyword: String, $orderby: String) {
    feed_search_bytag_paging(
      keyword: $keyword
      orderby: $orderby
      limit: $limit
      offset: $offset
    ) {
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
export default Feedsearchbytag;
