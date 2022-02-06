import { gql } from "apollo-boost";
const NotificationCursorBased = gql`
  query($first: Int!, $after: String) {
    list_notification_cursor_based(first: $first, after: $after) {
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
          ids
          notification_type
          isread
          itinerary_buddy {
            id
            itinerary_id
            user_id
            isadmin
            isconfrim
            myuser {
              id
              username
              first_name
              last_name
              picture
            }
            userinvite {
              id
              username
              first_name
              last_name
              picture
            }
            accepted_at
            rejected_at
          }
          comment_feed {
            id
            post_id
            text
            user {
              id
              username
              first_name
              last_name
              picture
            }
            post {
              assets {
                id
                type
                filepath
              }
            }
            post_asset {
              id
              type
              filepath
            }
            created_at
            updated_at
          }
          like_feed {
            id
            post_id
            response
            user {
              id
              username
              first_name
              last_name
              picture
            }
            post_asset {
              type
              filepath
            }
          }

          follow_user {
            user_req
            user_follow
            status
            user {
              id
              username
              first_name
              last_name
              picture
              status_following
              status_follower
            }
          }
          tgl_buat
          created_at
          updated_at
        }
        cursor
      }
    }
  }
`;

export default NotificationCursorBased;
