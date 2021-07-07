import { gql } from "apollo-boost";
const LeftItinerary = gql`
    mutation($itinerary_id: ID!) {
        left_itinerary_buddy(itinerary_id: $itinerary_id) {
            response_time
            message
            code
        }
    }
`;
export default LeftItinerary;
