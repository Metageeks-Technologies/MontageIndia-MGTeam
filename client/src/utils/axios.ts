
import axios from "axios";


const instance = axios.create({
    // development  
    baseURL: `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1`    ,
    // withCredentials: true,

} );
// const instance = axios.create({
//   baseURL: 'http://localhost:8000/api/v1',
//   withCredentials: true,
// });

export default instance;