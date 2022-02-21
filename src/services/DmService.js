import { v4 as uuid } from "uuid";
import { dms } from "../database/models";
import Queries from "./Queries";
import { sendDmNotification } from '../helpers/socketIoSetup';

class DmService {
  /**
   * New DM creation method
   * @static
   * @param {object} req  request object
   * @memberof DmService
   * @returns {object} data
   */
  static async createNewDm(req) {
    const { user: { id, username }} = req;
    const { receiverId, message } = req.body;
    //console.log(receiverId)
    const newDmObject = {
      id: uuid(),
      creatorId: id,
      senderId: id,
      receiverId,
      message
    };
    //console.log(newDmObject)
    const newDm = await Queries.create(dms, newDmObject);

    sendDmNotification(receiverId, newDm.dataValues);
    return newDm;
  }

    /**
   * New DM creation method
   * @static
   * @param {object} req  request object
   * @memberof DmService
   * @returns {object} data
   */
    static async updateDm(req) {
      const { user: { id, username }} = req;
      const dmId = req.body;
     // console.log(id)
      let date = new Date()
      let values = { readAt:date };
      let selector = {
          where: { id: dmId.dmId },
      };
      //const row = await Queries.findOne(dms,selector)
      const newDm = await Queries.update(dms,{ values, selector });
      //console.log(row)
      sendDmNotification(id, dmId.dmId);
      return newDm;
    }
    
    /**
   * New DM creation method
   * @static
   * @param {object} req  request object
   * @memberof DmService
   * @returns {object} data
   */
  static async updateALlDm(req) {
      const { user: { id, username }} = req;
      const recieverId = req.body;
     // console.log(id)
      let date = new Date()
      let values = { readAt:date };
      let selector = {
          where: { receiverId: recieverId.recieverId,senderId:id },
      };
      //const row = await Queries.findOne(dms,selector)
      const newDm = await Queries.update(dms,{ values, selector });
      console.log(row)
      sendDmNotification(id, recieverId.recieverId);
      return newDm;
    }
}
export default DmService;
