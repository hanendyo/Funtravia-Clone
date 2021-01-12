import { gql } from 'apollo-boost';
const Transportation = gql`
	query($keyword: String) {
		listtransportation_wishlist(keyword: $keyword) {
			id
			name
			passanger
			suitcases
			cover
			price
			images {
				image
			}
		}
	}
`;
export default Transportation;
