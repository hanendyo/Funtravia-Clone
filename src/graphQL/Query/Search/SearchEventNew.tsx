import { gql } from "apollo-boost";
const SearchEventQueryNew = gql`
    query($keyword: String, $cities_id: ID, $countries_id: ID) {
        event_searchv2(
            keyword: $keyword
            cities_id: $cities_id
            countries_id: $countries_id
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
        }
    }
`;
export default SearchEventQueryNew;
