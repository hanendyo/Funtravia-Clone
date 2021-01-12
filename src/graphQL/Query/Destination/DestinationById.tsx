import { gql } from 'apollo-boost';
const DestinationById = gql`
	query DestinationById($id: ID!) {
		destinationById(id: $id) {
			id
			name
			phone1
			phone2
			liked
			email1
			email2
			latitude
			longitude
			description
			address
			weekdayprice
			weekendprice
			openat
			status
			facebook
			instagram
			website
			map
			cities {
				name
			}
			created_at
			updated_at
			images {
				image
			}
			article {
				type
				title
				text
				image
				order
			}
		}
	}
`;
export default DestinationById;
