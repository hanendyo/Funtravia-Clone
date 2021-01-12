import { gql } from 'apollo-boost';
const CreateRentItinerary = gql`
	mutation(
		$day_id: [ID]!
		$trans_id: ID!
		$note: String
		$starttime: String
		$endtime: String
		$latitude: String
		$longitude: String
		$address_pickup: String
		$with_driver: Boolean!
		$total_price: String
	) {
		add_rent(
			input: {
				day_id: $day_id
				trans_id: $trans_id
				note: $note
				starttime: $starttime
				endtime: $endtime
				latitude: $latitude
				longitude: $longitude
				address_pickup: $address_pickup
				with_driver: $with_driver
				total_price: $total_price
			}
		) {
			day_id
			response_time
			message
			code
		}
	}
`;
export default CreateRentItinerary;
