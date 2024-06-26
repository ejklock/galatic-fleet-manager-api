import mime from 'mime-types';

export default abstract class StorageService {
  abstract upload(
    stream: any,
    filename: string,
    mimetype: string,
    filePath?: string,
    publicStorage?: boolean,
  ): Promise<string>;
  abstract delete(fileName: string, filePath?: string): Promise<any>;
  abstract url(filename: string, filepath?: string): string;
  abstract relativePath(filename: string, filepath?: string): string;
  protected extension(mimetype: string): string | false {
    return mime.extension(mimetype);
  }

  abstract fileExists(
    filename: string,
    filePath: string,
  ): Promise<boolean> | boolean;
}
