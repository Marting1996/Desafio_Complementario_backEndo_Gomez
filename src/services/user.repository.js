import UserDTO from "../DAO/DTO/user.dto.js";

export default class UserRepository {
    constructor(dao) {
        this.dao = dao;
    }

    getUserByEmail = async (email) => {
        return await this.dao.getUserByEmail(email)
    }

    updateUser = async (id, data) => {
        const user = await this.dao.updateUser(id, data)
        return new UserDTO(user)
    }

    getUserToken = async (resetToken) => {
        return await this.dao.getUserToken(resetToken)
    }
}