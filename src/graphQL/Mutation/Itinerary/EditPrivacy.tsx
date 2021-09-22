
import { gql } from 'apollo-boost';
const UpdatePrivacy = gql`
	mutation($id: ID!, $is_private: Boolean!) {
        itinerary_is_public(itinerary_id: $id, is_private: $is_private){
            response_time
            message
            status
            code
          }
	}
`;
export default UpdatePrivacy;