import { gql } from 'apollo-boost';
const Event = gql`
	query($cities_id: ID!) {
		event_list_bycity(cities_id: $cities_id) {
			month
			event {
				id
				name
				category {
					id
					name
				}
				start_date
				end_date
				ticket_link
				city {
					name
				}
				country {
					name
				}
				description
				image
				latitude
				longitude
				address
				vendor {
					name
					image
				}
				open
				ticket {
					name
					price
					description
				}
			}
		}
	}
`;
export default Event;
