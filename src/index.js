import Response from './helpers/Response';
import express from 'express'
import bodyParser from 'body-parser';
import router from './routes'
import HttpStatus from 'http-status-codes';
import cors from 'cors';
import { bootStrapSocketIo } from './helpers/socketIoSetup';

const app = express();
//app.use(bodyParser.urlencoded({ extended: true }));
//app.use(bodyParser.text());
app.use(cors())
//app.use(bodyParser.json())
app.use(bodyParser.json({limit:'50mb',extended:true,type: 'application/json'}))
app.use('/', router);
app.use('/static', express.static('public'))


app.get('/', (req, res) =>
  Response.successMessage(
  res, 
  'Welcome to One to One chat app backend!',
  '',
  HttpStatus.OK)
);
app.use('*', (req, res) =>
 Response.errorMessage(
  res, 
  'Oops, this route does not exist',
  HttpStatus.NOT_FOUND)
);
const port = process.env.PORT || 5000;
const serverInstance = app.listen(port, ()=>{
    console.log(`Server is running on PORT ${port}...`);
})
bootStrapSocketIo(serverInstance);
export default app;
