const {
    AppError: { ApiError },
} = require('../../helpers');

class BaseRepository {
    constructor(model, name) {
        this.model = model;
        this.name = name;
    }
    GetModel() {
        return this.model;
    }

    async Create(object) {
        try {
            return await this.model.create(object);
        } catch (e) {
            throw new ApiError(`Failed to create ${this.name}`);
        }
    }
    async FindById(id) {
        try {
            return await this.model.findById(id);
        } catch {
            throw new ApiError(`Data not found!`);
        }
    }
    async Find(query, options) {
        try {
            return await this.model.find(query).select(options?.select).populate(options?.populate);
        } catch {
            throw new ApiError('Data not found!');
        }
    }
    async FindOne(query, options) {
        try {
            return await this.model
                .findOne(query)
                .select(options?.select)
                .populate(options?.populate);
        } catch (e) {
            console.log(e);
            throw new ApiError('Data not found!');
        }
    }
    async Update(query, update, options) {
        try {
            return await this.model
                .findOneAndUpdate(query, update, { new: true })
                .populate(options?.populate);
        } catch {
            throw new ApiError('Failed to update data!');
        }
    }
    async DeleteOne(query) {
        try {
            return await this.model.findOneAndDelete(query, { new: true });
        } catch {
            throw new ApiError('Failed to delete data!');
        }
    }
    async DeleteMany(query) {
        try {
            return await this.model.deleteMany(query);
        } catch {
            throw new ApiError();
        }
    }

    async SetData(query, values) {
        try {
            return await this.Update(query, {
                $set: values,
            });
        } catch {
            throw new ApiError('Failed to set data!');
        }
    }
    async UnsetData(query, values) {
        try {
            return await this.Update(query, {
                $unset: values,
            });
        } catch {
            throw new ApiError('Failed to unset data!');
        }
    }
    async PushData(query, values, options) {
        try {
            return await this.Update(
                query,
                {
                    $push: values,
                },
                options
            );
        } catch {
            throw new ApiError('Failed to push data!');
        }
    }
    async PullData(query, values) {
        try {
            return await this.Update(query, {
                $pull: values,
            });
        } catch {
            throw new ApiError('Failed to pull data!');
        }
    }
}

module.exports = BaseRepository;
