import { gql } from "apollo-boost";
const SearchPostQuery = gql`
  query($keyword: String) {
    search_feed_post(key: { keyword: $keyword }) {
      id
      caption
      longitude
      latitude
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
        picture
      }
    }
  }
`;
export default SearchPostQuery;
