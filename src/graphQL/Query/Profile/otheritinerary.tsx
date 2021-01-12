import { gql } from 'apollo-boost';
const itinerary = gql`
	query($id: ID!) {
		user_tripbyid(id: $id) {
			id
			name
			cover
			country {
				name
			}
			city {
				name
			}
			buddy {
				id
				user {
					username
					first_name
				}
			}
			start_date
			end_date
			isprivate
			status
		}
	}
`;
export default itinerary;
