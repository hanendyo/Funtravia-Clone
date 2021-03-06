import { gql } from "apollo-boost";
const ListEventGQL = gql`
  query(
    $keyword: String
    $type: [ID]
    $countries: [ID]
    $cities: [ID]
    $province: [ID]
    $price_start: Int
    $price_end: Int
    $date_from: String
    $date_until: String
    $orderby: String
    $years: String
  ) {
    event_list_public(
      key: {
        keyword: $keyword
        type: $type
        countries: $countries
        cities: $cities
        province: $province
        price_start: $price_start
        price_end: $price_end
        date_from: $date_from
        date_until: $date_until
        orderby: $orderby
        years: $years
      }
    ) {
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
export default ListEventGQL;
