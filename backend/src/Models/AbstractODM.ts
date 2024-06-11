import { Model, Schema, model, models } from 'mongoose';

abstract class AbstractODM<T> {
  protected model: Model<T>;
  protected schema: Schema;
  protected modelName: string;

  constructor(schema: Schema, modelName: string) {
    this.schema = schema;
    this.modelName = modelName;
    this.model = models[this.modelName] || model(this.modelName, this.schema);
  }

//   public async create(obj: T): Promise<T> {
//     return await this.model.create({ ...obj });
//   }
}

export default AbstractODM;