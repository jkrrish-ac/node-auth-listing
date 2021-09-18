import constants from "../../constants";
import { ValidationSchema } from "../../utils/ValidationSchema";

export class ApiValidator {
    static readonly array = (elementSchema: ValidationSchema) => {
        return (elements: any[]): boolean => {
            return elements.every(element => {
                const errors: any[] = elementSchema.validate(element, { strip: false });
                if (errors && errors.length >= 1) {
                    throw new Error(errors.map(error => error.message).join(constants.seperators.COMMA_SPACE));
                }
                return true;
            });
        };
    }

    static readonly isPositiveOrZero = () => (val: number) => val >= 0;
    static readonly isNegativeOrZero = () => (val: number) => val <= 0;
    static readonly isPositive = () => (val: number) => val > 0;
    static readonly isNegative = () => (val: number) => val < 0;
}