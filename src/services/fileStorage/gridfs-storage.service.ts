import httpStatus from "http-status";
import { GridFSBucket, GridFSBucketOptions } from "mongodb";
import mongoose from "mongoose";
import path from "path";
import { Readable } from "stream";
import constants from "../../constants";
import { ApiError } from "../../errors/ApiError";
import { createMetaData, IFile } from "../../models/file.model";
import { FileStorageService } from "./file-storage.service";

export class GridFsStorageService implements FileStorageService {

    private initialised: boolean = false;
    private gridfsBucket!: GridFSBucket;

    constructor(options: GridFSBucketOptions = { bucketName: constants.DEFAULT_FILE_STORAGE_BUCKET_NAME }) {
        const connection = mongoose.connection;
        connection.once("open", () => {
            this.gridfsBucket = new GridFSBucket(connection.db, options);
            this.initialised = true;
        });
    }

    save(file: Express.Multer.File, name: string = (Date.now() + path.extname(file.originalname))): Promise<IFile> {
        return new Promise<IFile>((resolve, reject) => {
            this.isInitialised();
            if (!file) {
                throw new ApiError(httpStatus.BAD_REQUEST, constants.messages.UNDEFINED_FILE_CANNOT_BE_SAVED);
            }

            const stream = this.gridfsBucket.openUploadStream(name, {
                metadata: createMetaData(file),
                contentType: file.mimetype
            });
            stream
                .on("finish", async () => resolve(await this.findFileById(stream.id.toString())))
                .on("error", (error) => reject(new ApiError(httpStatus.BAD_REQUEST, error.message)))
                .write(file.buffer);
            stream.end();
        });
    }

    downloadFile(id: string): Readable {
        this.isInitialised();
        return this.gridfsBucket.openDownloadStream(mongoose.Types.ObjectId(id));
    }

    async findFileById(id: string): Promise<IFile> {
        this.isInitialised();
        const documents = await this.gridfsBucket.find({ _id: mongoose.Types.ObjectId(id) }).toArray();
        if (documents.length === 0) {
            throw new ApiError(httpStatus.BAD_REQUEST, constants.messages.FILE_NOT_FOUND);
        }
        return Promise.resolve(documents[0]);
    }

    async findFiles(condition: any): Promise<IFile[]> {
        this.isInitialised();
        return this.gridfsBucket.find(condition).toArray();
    }

    async deleteFile(id: string): Promise<void> {
        this.isInitialised();
        await this.findFileById(id);
        this.gridfsBucket.delete(mongoose.Types.ObjectId(id), err => {
            if (err) {
                throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, constants.messages.FAILED_TO_DELETE_FILE);
            }
        });
    }

    private isInitialised(): void {
        if (!this.initialised) {
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, constants.messages.DATA_BASE_CONNECTION_NOT_ESTABLISHED);
        }
    }

}