import { gql } from 'apollo-boost';
const ListEventGQL = gql`
	query($keyword: String, $type: [ID]) {
		event_list(key: { keyword: $keyword, type: $type }) {
			id
			name
			start_date
			end_date
			ticket_link
			description
			address
			image
			latitude
			longitude
			open
			vendor {
				id
				name
				cover
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
			liked
		}
	}
`;
export default ListEventGQL;
