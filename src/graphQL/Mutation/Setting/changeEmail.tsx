import {gql} from 'apollo-boost';

const changeEmail = gql`
mutation($oldEmail: String!, $newEmail: String!) {
    changemail(old_email : $oldEmail new_email: $newEmail){
        id
        response_time
        message
        code
        }
    }`;
    export default changeEmail;