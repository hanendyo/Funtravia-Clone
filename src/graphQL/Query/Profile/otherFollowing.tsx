import { gql } from "apollo-boost";
const FollowingQueryCursorBased = gql`
  query($id: ID!, $first: Int!, $after: String) {
    user_followingbyid_cursor_based(id: $id, first: $first, after: $after) {
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
export default FollowingQueryCursorBased;
