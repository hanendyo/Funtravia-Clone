import { gql } from 'apollo-boost';
const Acomodation = gql`
	query($keyword: String!) {
		listAccommodation_wishlist(keyword: $keyword) {
			id
			name
			rating
			name_type
			latitude
			longitude
			pricerange
			count_review
			facilities_count
			class_count
			cities {
				name
			}
			countries {
				name
			}
			images {
				image
			}
		}
	}
`;
export default Acomodation;
