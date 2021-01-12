import { gql } from 'apollo-boost';
const CreateServiceItinerary = gql`
	mutation(
		$day_id: [ID]!
		$trans_id: ID!
		$note: String
		$starttime: String
		$endtime: String
		$latitude: String
		$longitude: String
		$meetingpoint_address: String
		$total_price: String
	) {
		add_service(
			input: {
				day_id: $day_id
				service_id: $trans_id
				note: $note
				starttime: $starttime
				endtime: $endtime
				latitude: $latitude
				longitude: $longitude
				meetingpoint_address: $meetingpoint_address
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
export default CreateServiceItinerary;
