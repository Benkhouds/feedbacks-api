import cors from 'cors'

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true//accept cookies from cross origin domain
  //you need to also set it to the client
  //axios has withCredentials option
}

export default cors(corsOptions); 