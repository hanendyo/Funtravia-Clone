import { gql } from 'apollo-boost';
const ItineraryDetails = gql`
	query($id: ID!) {
		itinerary_detail(id: $id) {
			cover
			id
			name
			start_date
			end_date
			status
			isprivate
			created_by
			created_at
			city {
				id
				name
				latitude
				longitude
			}
			country {
				id
				name
				latitude
				longitude
			}
			buddy {
				id
				user_id
				isadmin
				isconfrim
				accepted_at
				rejected_at
				user {
					first_name
					picture
					username
				}
			}
			day {
				id
				itinerary_id
				day
				date
				total_hours
			}
		}
	}
`;
export default ItineraryDetails;
