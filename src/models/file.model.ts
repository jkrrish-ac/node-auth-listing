import { Document, model, Model, Schema } from "mongoose";

export interface IFileMetaData extends Document<any> {
    originalname: string;
    encoding: string;
}

export interface IFile extends Document<any> {
    length: number;
    chunkSize: number;
    uploadDate: Date;
    fileName: number;
    md5: string;
    contentType: string;
    metadata: IFileMetaData;
}

export const createMetaData = (file: Express.Multer.File): IFileMetaData => {
    return {
        originalname: file.originalname,
        encoding: file.encoding
    } as IFileMetaData;
};