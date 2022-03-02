import { gql } from 'apollo-boost';
const EditCustom = gql`
	mutation(
        $id: ID!
		$day_id: [ID]!
		$title: String!
		$icon: String!
		# $qty: String!
		$address: String!
		$latitude: String!
		$longitude: String!
		$note: String
		$time: String
		$duration: String
		# $status: Boolean!
		$order: [String]!
        # $total_price: String!
        $file: [Upload]
	){
		update_custom(
			input: {
                id: $id
				day_id: $day_id
				title: $title
				icon: $icon
				qty: "1"
				address: $address
				latitude: $latitude
				longitude: $longitude
				note: $note
				time: $time
				duration: $duration
				status: false
				order: $order
				total_price: "100000"
                file: $file
			}
		) {
			data {
				id
				day_id
				title
				icon
				latitude
				longitude
				address
				order
				qty
				time
				duration
				status
			}
			response_time
			message
			code
		}
	}
`;
export default EditCustom;
