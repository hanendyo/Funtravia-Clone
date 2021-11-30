import {gql} from 'apollo-boost';

const addEmail = gql`
mutation($password: String!, $new_email: String!) {
    addemail( new_email: $new_email password:$password){
        id
        response_time
        message
        code
    }
}`;
    export default addEmail;