import { gql } from 'apollo-boost';
const Article = gql`
	query($id: ID!) {
		cities_articel(id: $id) {
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
