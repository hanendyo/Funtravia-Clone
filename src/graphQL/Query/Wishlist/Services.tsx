import { gql } from 'apollo-boost';
const Services = gql`
	query($keyword: String) {
		listservice_wishlist(keyword: $keyword) {
			id
			name
			price
			# liked
			rating
			count_review
			cover
		}
	}
`;
export default Services;
