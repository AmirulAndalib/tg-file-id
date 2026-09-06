import Util from './Util';

import FileId from "./FileId";
import FileUniqId from "./FileUniqId";
import {FileIdInfo} from "./types/FileIdInfo";

export const decodeFileId = Util.decodeFileId;
export const decodeUniqFileId = Util.decodeUniqueFileId;
export const encodeFileId = (decoded: FileIdInfo) => FileId.fromDecoded(decoded).toFileId();
export {FileId, FileUniqId, FileUniqId as UniqueFileId};
export type {FileIdInfo, UniqFileIdInfo} from "./types/FileIdInfo";
