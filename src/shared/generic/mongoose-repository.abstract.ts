import { Model, Document, FilterQuery, UpdateQuery } from 'mongoose'

export class MongooseRepositoryAbstract<Entity, DocumentType extends Entity & Document> {
  constructor(protected model: Model<DocumentType>) {}

  async create(item: Entity): Promise<Entity> {
    const instance = new this.model(item)
    await instance.save()
    return instance.toJSON() as Entity
  }

  async findOneById(id: string | Record<string, unknown>): Promise<Entity> {
    const instance = await this.model.findById(id)

    return instance?.toJSON() as Entity
  }

  async findByQuery(query: FilterQuery<DocumentType>, projection: Record<string, unknown> = {}): Promise<Entity[]> {
    return this.model.find(query, projection).lean()
  }

  async update(query: UpdateQuery<Entity & Document>, item: Partial<Entity>): Promise<Entity> {
    return this.model
      .findOneAndUpdate(query, item as UpdateQuery<DocumentType>)
      .lean()
      .then((result) => result as Entity)
  }

  async remove(query: FilterQuery<DocumentType>): Promise<void | null> {
    return this.model.findOneAndDelete(query)
  }
}
