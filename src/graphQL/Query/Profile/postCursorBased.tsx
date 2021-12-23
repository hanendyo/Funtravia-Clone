import { gql } from "apollo-boost";
const PostCursorBased = gql`
  query($first: Int!, $after: String, $user_id: ID!) {
    user_post_cursor_based(user_id: $user_id, first: $first, after: $after) {
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
        cursor
        node {
          id
          caption
          longitude
          latitude
          location_name
          liked
          media_orientation
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
          is_single
          itinerary {
            id
            name
            country {
              id
              name
            }
            city {
              id
              name
            }
            start_date
            end_date
            isprivate
            status
            cover
            liked
            categori {
              id
              name
              icon
              slug
            }
            user_created {
              id
              username
              first_name
              last_name
              picture
            }
          }
          album {
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
            itinerary {
              id
              name
            }
          }
        }
      }
    }
  }
`;
export default PostCursorBased;
