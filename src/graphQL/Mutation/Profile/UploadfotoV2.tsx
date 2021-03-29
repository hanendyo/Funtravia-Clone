import { gql } from "apollo-boost";
const UploadfotoV2 = gql`
  mutation($file: Upload!) {
    update_fotoprofile_v2(file: $file) {
      id
      response_time
      message
      code
      path
    }
  }
`;
export default UploadfotoV2;
