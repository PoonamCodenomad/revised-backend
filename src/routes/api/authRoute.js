import express from "express";
import Validator from "../../middlewares/Validator";
import { accountExist, userExist } from "../../middlewares/ScopeChecker";
import AuthController from "../../controllers/AuthController";
import DataChecker from "../../middlewares/DataChecker";
import inputError from "../../middlewares/inputError";
import verifyToken from "../../middlewares/verifyToken";
import Response from "../../helpers/Response";
import httpStatus from "http-status";

const path = require('path');

const multer = require('multer')

const Storage = multer.diskStorage({
  
  destination(req, file, callback) {
    callback(null, 'public');
  },
  filename(req, file, callback) {
    let name = `${file.fieldname}_${Date.now()}_${file.originalname.replace(/ /g,"")}`
    callback(null, `${name}`);

  },
});
const upload = multer({storage: Storage}).single('picture');

const authRouter = express.Router();

/**
 * @swagger
 *
 * /api/v1/auth/signup:
 *   post:
 *     security: []
 *     summary: Account registration
 *     description: Users should be able to create an account before they start chatting
 *     tags:
 *       - Auth
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               username:
 *                 type: string
 *     produces:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: string
 *               message:
 *                 type: string
 *
 *     responses:
 *       201:
 *         description: Account created successfully!
 */

authRouter.post(
  "/signup",
  Validator.signupRules(),
  Validator.validateInput,
  accountExist,
  AuthController.signup
);

/**
 * @swagger
 *
 * /api/v1/auth/login:
 *   post:
 *     security: []
 *     summary: User Login
 *     description: Login a user
 *     tags:
 *       - Auth
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     produces:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: string
 *               message:
 *                 type: string
 *
 *     responses:
 *       200:
 *         description: Logged in successfully!
 */

authRouter.post(
  "/login",
  Validator.loginRules(),
  inputError,
  DataChecker.validateCredentials,
  AuthController.login
);





 authRouter.post(
  "/uploadFile",
  AuthController.uploadFile
);

authRouter.post('/fileUpload' ,multer({storage: Storage}).single('picture'), (req , res) => {
    
    upload(req, res, function (err) {

      if (!req.file) {
        return res.send('Please select an image to upload');
      } else if (err instanceof multer.MulterError) {
        return res.send(err);
      } else if (err) {
        return res.send(err);
      }
      // Display uploaded image for user validation
      return Response.successMessage(
        res,
        "uploaded successfully",
        req.file.path.replace("public","static"),
        httpStatus.OK
      ); // send uploaded image
    });


})


/**
 * @swagger
 *
 * /api/v1/auth/users:
 *   get:
 *     security: []
 *     summary: Get users alongside DMs
 *     description: Get users alongside DMs
 *     tags:
 *      - Auth
 *     parameters:
 *        - name: x-auth-token
 *          in : header
 *          description: authorization header
 *          required: true
 *          type: string
 *     produces:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: string
 *               message:
 *                 type: string
 *
 *     responses:
 *       200:
 *         description: Users retrived
 */

authRouter.get(
  "/users",
  verifyToken,
  AuthController.viewAllUsers
);
export default authRouter;
