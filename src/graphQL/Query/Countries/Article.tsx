import { gql } from 'apollo-boost';
const Article = gql`
	query($countries_id: ID!) {
		country_articel(id: $countries_id) {
			id
			type
			title
			text
			image
			order
		}
	}
`;
export default Article;
