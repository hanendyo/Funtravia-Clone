import { gql } from 'apollo-boost';
const review = gql`
	query {
		user_review {
			id
			name
			rating
			ulasan
			isfrom
			create_at
			images
		}
	}
`;
export default review;
