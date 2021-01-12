import { gql } from 'apollo-boost';
const Uplaodcover = gql`
	mutation($itinerary_id: ID!, $cover: String!) {
		upload_cover_itinerary(itinerary_id: $itinerary_id, cover: $cover) {
			id
			response_time
			message
			code
		}
	}
`;
export default Uplaodcover;
