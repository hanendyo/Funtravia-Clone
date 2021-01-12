import { gql } from 'apollo-boost';
const Uploadfoto = gql`
	mutation(
		$itinerary_id: ID!
		$day_id: ID!
		$description: String!
		$assets: String!
	) {
		uploadalbums(
			itinerary_id: $itinerary_id
			day_id: $day_id
			description: $description
			assets: $assets
		) {
			id
			response_time
			message
			code
		}
	}
`;
export default Uploadfoto;
