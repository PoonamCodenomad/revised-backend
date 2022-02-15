import express from "express";
import Validator from "../../middlewares/Validator";
import DmController from "../../controllers/DmController";
import verifyToken from "../../middlewares/verifyToken";

const dmRoutes = express.Router();

/**
 * @swagger
 *
 * /api/v1/dms:
 *   post:
 *     security: []
 *     summary: Send a DM
 *     description: Users should be able to create send dm to any user
 *     tags:
 *       - DMs
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               receiverId:
 *                 type: string
 *               message:
 *                 type: string
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
 *       201:
 *         description: DM created successfully!
 */

 dmRoutes.post(
  "/",
  Validator.dmRules(),
  Validator.validateInput,
  verifyToken,
  DmController.createDm
);


/**
 * @swagger
 *
 * /api/v1/dms/read:
 *   post:
 *     security: []
 *     summary: Mark a DM read
 *     description: Users should be able to update dm to read
 *     tags:
 *       - DMs
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dmId:
 *                 type: string
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
 *               dmId:
 *                 type: string
 *     responses:
 *       201:
 *         description: DM updated successfully!
 */

 dmRoutes.post(
  "/read",
  Validator.validateInput,
  verifyToken,
  DmController.updateDm
);



/**
 * @swagger
 *
 * /api/v1/dms/readAll:
 *   post:
 *     security: []
 *     summary: Mark a DM read
 *     description: Users should be able to update dm to read
 *     tags:
 *       - DMs
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               recieverId:
 *                 type: string
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
 *               recieverId:
 *                 type: string
 *     responses:
 *       201:
 *         description: DM updated successfully!
 */

 dmRoutes.post(
  "/readAll",
  Validator.validateInput,
  verifyToken,
  DmController.updateAllDm
);

export default dmRoutes;
