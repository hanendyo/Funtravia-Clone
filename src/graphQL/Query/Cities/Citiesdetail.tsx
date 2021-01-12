import { gql } from 'apollo-boost';
const CitiesInformation = gql`
	query($id: ID!) {
		CitiesInformation(id: $id) {
			id
			name
			code
			latitude
			longitude
			description
			countries {
				id
				name
				flag
			}
			map
			cover {
				image
			}
			images {
				image
			}
			article_header {
				id
				title
				type
				position
				relation_id
				content {
					id
					type
					title
					text
					image
					order
				}
			}
			destination_type {
				id
				name
				icon
			}
			journal {
				id
				title
				text
				picture
				liked
			}
			event {
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
						id
						name
					}
					country {
						id
						name
					}
					description
					image
					latitude
					longitude
					address
					vendor {
						id
						name
						cover
					}
					open
					ticket {
						id
						name
						price
						description
					}
					images {
						image
					}
					liked
				}
			}
		}
	}
`;
export default CitiesInformation;
