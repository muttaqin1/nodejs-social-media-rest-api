const {
    AppError: { ApiError },
} = require('../../helpers')

class BaseRepository {
    constructor(model, name) {
        this.model = model
        this.name = name
    }
    GetModel() {
        return this.model
    }

    async Create(object) {
        try {
            return await this.model.create(object)
        } catch (e) {
            throw new ApiError(`Failed to create ${this.name}`)
        }
    }
    async FindById(id) {
        return await this.model.findById(id)
    }
    async Find(object = {}) {
        return await this.model.find(object)
    }
    async FindOne(query, select) {
        return await this.model.findOne(query).select(select)
    }
    async Update(query, update) {
        return await this.model.findOneAndUpdate(query, update, { new: true })
    }
    async DeleteOne(query) {
        return await this.model.deleteOne(query)
    }

    async SetData(query, values) {
        return await this.Update(query, {
            $set: values,
        })
    }
    async UnsetData(query, values) {
        return await this.Update(query, {
            $unset: values,
        })
    }
    async PushData(query, values) {
        return await this.Update(query, {
            $push: values,
        })
    }
    async PullData(query, values) {
        return await this.Update(query, {
            $pull: values,
        })
    }
}

module.exports = BaseRepository
