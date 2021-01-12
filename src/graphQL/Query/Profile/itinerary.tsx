import { gql } from 'apollo-boost';
const itinerary = gql`
	query {
		user_trip {
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
					picture
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
