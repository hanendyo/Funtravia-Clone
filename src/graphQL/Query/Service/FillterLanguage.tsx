import { gql } from 'apollo-boost';
const FillterLanguage = gql`
	query {
		service_filter_language {
			id
			name
			sugestion
			checked
			show
		}
	}
`;
export default FillterLanguage;
