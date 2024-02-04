import {usersModel} from '../../../models/mongoose/users.model.js'

class UsersManager {
  async findById(id) {
    const response = await usersModel.findById(id);
    return response;
  }

  async findByEmail(email) {
    const response = await usersModel.findOne({ email });
    return response;
  }

  async createOne(obj) {
    const response = await usersModel.create(obj);
    return response;
  }

  async deleteOne(id) {
    const response = await usersModel.deleteOne(id);
    return response;
  }
}

export const usersManager = new UsersManager();