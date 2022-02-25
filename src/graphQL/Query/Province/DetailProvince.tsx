import { gql } from "apollo-boost";
const province_detail = gql`
  query($id: ID!) {
    province_detail_v2(id: $id) {
      id
      name
      code
      latitude
      longitude
      description
      countries {
        id
        name
        flag
      }
      cover
      destination_group {
        id
        name
        description
        icon
        type {
          type_id
          name
        }
      }
      article_header {
        id
        title
        type
        position
        relation_id
        content {
          id
          type
          title
          text
          image
          order
        }
      }
      journal {
        id
        title
        text
        userby {
          id
          username
          first_name
          last_name
          picture
          bio
        }
        picture
        liked
      }
      event {
        month
        event {
          id
          name
          category {
            id
            name
          }
          is_repeat
          ticket_link
          description
          cover
          liked
        }
      }
      itinerary_populer {
        id
        name
        country {
          id
          name
        }
        city {
          id
          name
          flag
        }
        start_date
        end_date
        isprivate
        status
        cover
        buddy_count
        favorit_count
        liked
        categori {
          id
          name
          icon
        }
        user_created {
          id
          username
          first_name
          last_name
          picture
        }
      }
    }
  }
`;
export default province_detail;
