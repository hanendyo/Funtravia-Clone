import { gql } from 'apollo-boost';
const Event = gql`
	query($keyword: String) {
		listevent_wishlist(keyword: $keyword) {
			id
			name
			start_date
			end_date
			ticket_link
			description
			image
			latitude
			longitude
			open
			liked
			vendor {
				id
				name
			}
			category {
				id
				name
			}
			country {
				id
				name
			}
			city {
				id
				name
			}
			images {
				image
			}
			ticket {
				id
				name
				price
				description
			}
		}
	}
`;
export default Event;
