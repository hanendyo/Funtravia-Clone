import { gql } from 'apollo-boost';
const ListService = gql`
	query($type_id: ID!, $languagefilter: [ID], $keyword: String, $city_id: ID) {
		service_list(
			key: {
				type_id: $type_id
				languagefilter: $languagefilter
				keyword: $keyword
				city_id: $city_id
			}
		) {
			id
			name
			price
			rating
			count_review
			cover
		}
	}
`;
export default ListService;
