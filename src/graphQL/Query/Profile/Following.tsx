import { gql } from "apollo-boost";
const FollowingQuery = gql`
  query($first: Int!, $after: String) {
    user_following_cursor_based(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
        total
        count
        currentPage
        lastPage
      }
      edges {
        node {
          id
          username
          first_name
          last_name
          picture
          bio
          status_following
          status_follower
        }
        cursor
      }
    }
  }
`;
export default FollowingQuery;
