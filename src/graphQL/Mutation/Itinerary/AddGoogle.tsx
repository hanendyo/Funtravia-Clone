import { gql } from 'apollo-boost';
const AddGoogle = gql`
	mutation(
		$id: [ID]!
		$title: String!
		$icon: String!
		$address: String!
		$latitude: String!
		$longitude: String!
	) {
		add_google(
			input: {
				day_id: $id
				title: $title
				icon: $icon
				address: $address
				latitude: $latitude
				longitude: $longitude
				status: false
			}
		) {
			id
			response_time
			message
			code
		}
	}
`;
export default AddGoogle;
