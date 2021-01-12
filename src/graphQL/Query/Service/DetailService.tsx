import { gql } from 'apollo-boost';
const DetailService = gql`
	query($id: ID!) {
		service_detail(id: $id) {
			id
			name
			liked
			price
			description
			cover
			vendor {
				id
				name
			}
			country {
				id
				name
			}
			province {
				id
				name
			}
			city {
				id
				name
			}
			type {
				id
				name
				icon
			}
			review {
				name
				ulasan
				rating
			}
			language {
				master_language {
					id
					name
					description
				}
				level
			}
			coverage {
				id
				name
			}
			images {
				image
			}
			info {
				value
				icon
			}
			meet {
				value
			}
		}
	}
`;
export default DetailService;
