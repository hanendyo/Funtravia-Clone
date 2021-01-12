import { gql } from 'apollo-boost';
const DetailRent = gql`
	query($id: ID!) {
		transportationById(id: $id) {
			id
			name
			cover
			liked
			phone1
			phone2
			email1
			email2
			latitude
			longitude
			passanger
			suitcases
			description
			address
			price
			with_driver
			driver_price
			status
			created_at
			updated_at
			images {
				image
			}
			meet {
				value
			}
			review {
				name
				ulasan
				rating
			}
			info {
				icon
				value
				icon
			}
			type {
				id
				name
				slug
			}
			categori {
				id
				name
				description
				slug
			}
		}
	}
`;
export default DetailRent;
