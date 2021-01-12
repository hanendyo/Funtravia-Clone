import { gql } from 'apollo-boost';
const ListItinerary = gql`
	query($status: String!) {
		#   status : A/D/F
		itinerary_list_bystatus(status: $status) {
			id
			name
			cover
			country {
				id
				name
			}
			city {
				id
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
			day {
				id
				day
				date
			}
		}
	}
`;
export default ListItinerary;
