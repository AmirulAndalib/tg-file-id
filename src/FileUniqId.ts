import Util from "./Util";
import type FileId from "./FileId";
import {UniqFileIdInfo} from "./types/FileIdInfo";

class FileUniqId {
  public type: number = 0;
  public id?: bigint;
  public volumeId?: bigint;
  public localId?: number | bigint;
  public url?: string;

  static fromFileId(fileId: string) {
    const decoded = Util.decodeFileId(fileId);
    let inst = new FileUniqId();
    inst.id = decoded.id;
    inst.volumeId = decoded.volumeId;
    inst.localId = decoded.localId;
    inst.url = decoded.url;
    inst.type = Util.fileTypeToUniqueType(decoded.typeId, decoded.hasWebLocation);
    return inst;
  }

  static fromFileUniqId(fileUniqId: string) {
    return FileUniqId.buildFromUniqueDecode(Util.decodeUniqueFileId(fileUniqId));
  }

  private static buildFromUniqueDecode(decoded: UniqFileIdInfo) {
    let inst = new FileUniqId();
    inst.id = decoded.id;
    inst.volumeId = decoded.volumeId;
    inst.localId = decoded.localId;
    inst.url = decoded.url;
    inst.type = decoded.typeId;
    return inst;
  }

  static fromFileIdInstance(instance: FileId) {
    let inst = new FileUniqId();
    inst.id = instance.id;
    inst.volumeId = instance.volumeId;
    inst.localId = instance.localId;
    inst.url = instance.url;
    inst.type = Util.fileTypeToUniqueType(instance.typeId, Boolean(instance.url));
    return inst;
  }

  toFileUniqId() {
    let out = Util.to32bitBuffer(this.type);
    if (this.type === Util.UNIQUE_WEB && this.url !== undefined) {
      out += Util.packTLString(Buffer.from(this.url));
    } else if (
      this.type === Util.UNIQUE_PHOTO
      && this.volumeId !== undefined
      && this.localId !== undefined
    ) {
      out += Util.to64bitBuffer(this.volumeId);
      out += Util.to32bitSignedBuffer(Number(this.localId));
    } else if (this.id !== undefined) {
      out += Util.to64bitBuffer(this.id)
    } else {
      throw new Error("Missing data for unique file id");
    }

    return Util.base64UrlEncode(Util.rleEncode(out));
  }
}

export default FileUniqId;
