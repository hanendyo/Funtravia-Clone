import { gql } from 'apollo-boost';
const Deletesaved = gql`
	mutation($id: ID!) {
		delete_activity_saved(id: $id) {
			data_activity {
				id
				title
				note
				time
				qty
				duration
				address
				latitude
				longitude
				total_price
				images
			}
			response_time
			message
			code
		}
	}
`;
export default Deletesaved;
