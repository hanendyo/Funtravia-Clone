import { gql } from "apollo-boost";
const FeedByID = gql`
  query($post_id: ID!) {
    feed_post_byid(post_id: $post_id) {
      id
      caption
      longitude
      latitude
      location_name
      liked
      comment_count
      response_count
      media_orientation
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
      day {
        id
        date
        day
        total_hours
      }
      album {
        id
        title
        cover
        itinerary {
          id
          name
        }
      }
    }
  }
`;
export default FeedByID;
