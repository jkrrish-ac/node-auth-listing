import { Document, FilterQuery, Schema } from "mongoose";
import validator from "validator";
import { ApiPageResponse } from "../../payload/ApiPageResponse";
import { ValidationSchema } from "../../utils/ValidationSchema";
import constants from "../../constants";

export const paginate = <T extends Document<any>>(schema: Schema) => {
    schema.statics.paginate = async function (filter: Filter<T>, options: PaginateOptions): Promise<ApiPageResponse> {
        let sort = "";
        if (options.sort) {
            const sortingCriteria: string[] = [];
            options.sort.split(constants.seperators.COMMA).forEach(opt => {
                const [key, order] = opt.split(constants.seperators.COLON);
                sortingCriteria.push(
                    (order && order.toLowerCase() === "desc" ? "-" : constants.seperators.EMPTY) + key
                );
            });
            sort = sortingCriteria.join(constants.seperators.SPACE);
        }

        const size = options.size ? options.size : constants.DEFAULT_PAGINATION_PAGE_SIZE;
        const page = options.page ? options.page : constants.DEFAULT_PAGINATION_PAGE_NO;
        const skip = (page - 1) * size;

        const query = filter.getQuery();
        const countPromise = this.countDocuments(filter.getQuery()).exec();
        const resultPromise = this.find(query).sort(sort).skip(skip).limit(size).exec();
        return Promise.all([resultPromise, countPromise]).then(values => {
            const [data, totalElements] = values;
            const totalPages = Math.ceil(totalElements / size);
            return Promise.resolve({
                page,
                size,
                numberOfElements: data.length,
                totalPages,
                totalElements,

                first: page === 1,
                last: page === totalPages,
                empty: data.length === 0,
                data
            });
        });
    };
};

export class PaginateOptions {
    constructor(
        readonly page?: number,
        readonly size?: number,
        readonly sort?: string
    ) { }

    static create(obj: any) {
        return new PaginateOptions(
            parseInt(obj.page as string, 10),
            parseInt(obj.size as string, 10),
            obj.sort as string
        );
    }
}

export const pageValidation = new ValidationSchema({
    definition: {
        query: {
            page: { type: String, use: { num: (val) => !val || validator.isInt(val) } },
            size: { type: String, use: { num: (val) => !val || validator.isInt(val) } },
            sort: { type: String }
        }
    },
    message: {
        num: (path) => `${path.substring(path.lastIndexOf(".") + 1)} should be a valid integer`
    }
});

export interface Filter<T extends Document<any>> {
    getQuery(): FilterQuery<T>;
}