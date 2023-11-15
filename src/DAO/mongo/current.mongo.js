import UserModel from "./models/user.mongo.model.js";
import { logger } from "../../utils/logger.js";

export default class CurrentMongo {
    getUserByEmail = async (email) => {
        try {
            return await UserModel.findOne({ email }).lean().exec()
        } catch (error) {
            logger.debug("Error al obtener el usuario por el email", error)
        }
    }

    updateUser = async (id, data) => {
        try {
            if (id && data) {
                return await UserModel.findByIdAndUpdate(id, data)
            }
        } catch (error) {
            logger.debug("Error al actualizar el usuario")
        }
    }

    getUserToken = async (resetToken) => {
        try {
            if (resetToken) {
                return await UserModel.findOne({ resetPassToken: resetToken }).lean().exec()
            }
        } catch (error) {
            logger.debug("Error al obtener el token de mongodb")
        }
    }
}
