import { gql } from 'apollo-boost';
const Event = gql`
	query($countries_id: ID!) {
		event_list_bycountry(countries_id: $countries_id) {
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
