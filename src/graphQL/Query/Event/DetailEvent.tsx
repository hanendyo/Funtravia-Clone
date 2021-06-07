import { gql } from "apollo-boost";
const DetailEvent = gql`
  query($event_id: ID!) {
    event_detail(event_id: $event_id) {
      id
      name
      start_date
      end_date
      ticket_link
      description
      image
      latitude
      longitude
      open
      address
      price
      cover
      vendor {
        id
        name
        cover
      }
      category {
        id
        name
      }
      country {
        id
        name
      }
      city {
        id
        name
      }
      images {
        image
      }
      ticket {
        id
        name
        price
        description
      }
      liked
      is_repeat
    }
  }
`;
export default DetailEvent;
