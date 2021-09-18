import { Readable } from "stream";
import { IFile } from "../../models/file.model";

export interface FileStorageService {
    save(file: Express.Multer.File, filename?: string): Promise<IFile>;
    downloadFile(id: string): Readable;
    findFileById(id: string): Promise<IFile>;
    findFiles(condition: any): Promise<IFile[]>;
    deleteFile(id: string): Promise<void>;
}