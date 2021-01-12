import { gql } from 'apollo-boost';
const album = gql`
	query($itinerary_id: ID!, $day_id: ID!) {
		list_album_itinerary_day(itinerary_id: $itinerary_id, day_id: $day_id) {
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
			day_album {
				id
				day
				date
				album {
					id
					day_id
					assets
					description
					created_by
					photoby {
						id
						username
						first_name
						last_name
						picture
					}
					created_at
				}
			}
		}
	}
`;
export default album;
