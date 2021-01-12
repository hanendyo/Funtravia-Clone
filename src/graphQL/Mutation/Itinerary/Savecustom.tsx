import { gql } from 'apollo-boost';
const SaveCustom = gql`
	mutation(
		$title: String!
		$icon: String!
		$qty: String
		$address: String!
		$latitude: String!
		$longitude: String!
		$note: String
		$time: String
		$duration: String
		$total_price: String
	) {
		save_custom(
			input: {
				title: $title
				icon: $icon
				qty: $qty
				address: $address
				latitude: $latitude
				longitude: $longitude
				note: $note
				time: $time
				duration: $duration
				total_price: $total_price
			}
		) {
			id
			response_time
			message
			code
		}
	}
`;
export default SaveCustom;
