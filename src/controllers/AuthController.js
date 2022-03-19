import httpStatus from "http-status";
import AuthService from "../services/AuthService";
import Response from "../helpers/Response";
import TokenAuthenticator from "../helpers/TokenAuthenticator";

const multer = require('multer')
const bodyParser = require('body-parser')

require("dotenv").config();
const S3 = require("aws-sdk/clients/s3");
const fs = require("fs");
const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;
const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey,
});


multer({
  limits: {fieldSize: 25 * 1024 * 1024},
});
const Storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, './images');
  },
  filename(req, file, callback) {
    callback(null, `${file.fieldname}_${Date.now()}_${file.originalname}`);
  },
});


/**
 * Auth controller
 */
class AuthController {

  /**
   * @param {object} req
   * @param {object} res
   * @returns {object} function to create new account
   */
  static async signup(req, res) {
    const newUser = await AuthService.signup(req);
    const { password, ...data } = newUser.dataValues;
    const token = TokenAuthenticator.tokenGenerator(data);
    data.token = token;
    Response.successMessage(
      res,
      "Account created successfully!",
      { token },
      httpStatus.CREATED
    );
  }

  /**
   * User can be able to log in
   * @description POST /api/auth/signin
   * @static
   * @param {object} req request object
   * @param {object} res response object
   * @returns {object} data
   */
  static async login(req, res) {
    const { result } = req;

    const { password: pwd, ...data } = result.dataValues;
    const token = TokenAuthenticator.signToken(data);
    return Response.successMessage(
      res,
      "Logged in successfully",
      { token },
      httpStatus.OK
    );
  }


  static async uploadFile(req, res) {
    console.log(req.file)
    // let upload = multer({storage: Storage}).single('picture');
    // upload(req, res, function (err) {
    //   console.log(err)
    //   if (!req.file) {
    //     return res.send('Please select an image to upload');
    //   } else if (err instanceof multer.MulterError) {
    //     return res.send(err);
    //   } else if (err) {
    //     return res.send(err);
    //   }
    //   // Display uploaded image for user validation
    //   return Response.successMessage(
    //     res,
    //     "uploaded successfully",
    //     "fileName" ,
    //     httpStatus.OK
    //   ); // send uploaded image
    // });
   //console.log(req)
    //const fileStream = fs.createReadStream(file.path);
    // const uploadParams = {
    //   Bucket: bucketName,
    //   Body: fileStream,
    //   Key: file.filename,
    // };
    // let path = await s3.upload(uploadParams).promise(); // this will upload file to S3
    
  }




  /**
   * @param {object} req
   * @param {object} res
   * @returns {object} function to retrieve all users and my dms to them
   */
  static async viewAllUsers(req, res) {
    const availableUsers = await AuthService.viewUsersAlongsideDms(req);

    Response.successMessage(
      res,
      "All users and your dms retieved successfully!",
      availableUsers ,
      httpStatus.OK
    );
  }
}

export default AuthController;
