import Schema, { MessageFunction, SchemaDefinition, ValidationOptions } from "validate";

export class ValidationSchema extends Schema {
    definition!: SchemaDefinition;
    constructor(
        definition: ValidationDef,
        options?: ValidationOptions
    ) {
        super(definition.definition, options);
        if (definition.message) {
            this.message(definition.message);
        }
        this.definition = definition.definition;
    }
}

export interface ValidationDef {
    definition: SchemaDefinition;
    message?: { [validator: string]: string | MessageFunction };
}