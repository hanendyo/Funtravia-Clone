import { gql } from 'apollo-boost';
const PostMut = gql`
	mutation($caption:String, latitude:String, longitude:String, assets:Upload!){
		create_post(
			input: {caption:$caption, latitude:$latitude, longitude:$longitude, assets:$assets}
		) {
			id
			response_time
			message
			code
		}
	}
`;
export default PostMut;
