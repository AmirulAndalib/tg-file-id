import Util from "./Util";
import FileUniqId from "./FileUniqId";
import {FileIdInfo} from "./types/FileIdInfo";

class FileId {
  public version = 0;
  public subVersion = 0;
  public dcId = 0;
  public typeId = 0;
  public fileType: string | number = '';
  public fileReference?: string;
  public url?: string;
  public id: bigint = BigInt(0)
  public accessHash: bigint = BigInt(0);
  public volumeId?: bigint = BigInt(0);
  public localId?: number | bigint = 0;
  public photoSizeSource?: 'legacy' | 'thumbnail' | 'dialogPhoto' | 'stickerSetThumbnail'
  public photoSizeSourceId?: number;
  public secret?: bigint | number;
  public dialogId?: number | bigint;
  public dialogAccessHash?: number | bigint;
  public isSmallDialogPhoto?: boolean;

  public stickerSetId?: number | bigint;
  public stickerSetAccessHash?: number | bigint;

  public thumbType?: string;
  public thumbTypeId?: number;


  constructor() {
  }

  static fromFileId(fileId: string) {
    try {
      return FileId.fromDecoded(Util.decodeFileId(fileId));
    } catch (e) {
      throw new Error("Invalid fileId")
    }
  }

  static fromDecoded(decoded: FileIdInfo) {
    let inst = new FileId();
    inst.version = decoded.version;
    inst.subVersion = decoded.subVersion;
    inst.dcId = decoded.dcId;
    inst.typeId = decoded.typeId;
    inst.fileType = decoded.fileType;
    inst.fileReference = decoded.fileReference;
    inst.url = decoded.url;
    inst.id = decoded.id;
    inst.accessHash = decoded.access_hash;
    inst.volumeId = decoded.volumeId;
    inst.localId = decoded.localId;
    inst.photoSizeSourceId = decoded.photoSizeSource;

    switch (inst.photoSizeSourceId) {
      case Util.PHOTOSIZE_SOURCE_LEGACY:
        inst.secret = decoded.secret;
        inst.photoSizeSource = 'legacy';
        break;
      case Util.PHOTOSIZE_SOURCE_THUMBNAIL:
        inst.thumbType = decoded.thumbnailType;
        inst.photoSizeSource = 'thumbnail';
        inst.thumbTypeId = decoded.thumbTypeId;
        break;
      case Util.PHOTOSIZE_SOURCE_DIALOGPHOTO_SMALL:
      case Util.PHOTOSIZE_SOURCE_DIALOGPHOTO_BIG:
        inst.photoSizeSource = 'dialogPhoto';
        inst.dialogId = decoded.dialogId;
        inst.dialogAccessHash = decoded.dialogAccessHash
        inst.isSmallDialogPhoto = decoded.photoSizeSource === Util.PHOTOSIZE_SOURCE_DIALOGPHOTO_SMALL;
        break;
      case Util.PHOTOSIZE_SOURCE_STICKERSET_THUMBNAIL:
        inst.photoSizeSource = 'stickerSetThumbnail';
        inst.stickerSetId = decoded.stickerSetId;
        inst.stickerSetAccessHash = decoded.stickerSetAccessHash;
        break;
    }

    return inst;
  }

  toFileId(): string {
    let type = this.typeId;
    if (this.fileReference)
      type |= Util.FLAGS.FILE_REFERENCE_FLAG;
    if (this.url)
      type |= Util.FLAGS.WEB_LOCATION_FLAG;
    let out = '';

    out += Util.to32bitBuffer(type);
    out += Util.to32bitBuffer(this.dcId);
    if (this.fileReference) {
      let tlString = Util.packTLString(Buffer.from(this.fileReference, 'hex'));

      out += tlString.toString('binary')
    }
    if (this.url) {
      let tlString = Util.packTLString(Buffer.from(this.url));
      out += tlString.toString('binary')
      if (this.accessHash) {
        out += Util.to64bitBuffer(this.accessHash);
      }
      return Util.base64UrlEncode(Util.rleEncode(out));
    }

    out += Util.to64bitBuffer(this.id);
    out += Util.to64bitBuffer(this.accessHash);

    if (
      this.typeId <= 2
      && this.volumeId !== undefined
      && this.photoSizeSourceId !== undefined
    ) {
      out += Util.to64bitBuffer(this.volumeId);
      if (this.version >= 4) {
        out += Util.to32bitBuffer(this.photoSizeSourceId);
      }
      switch (this.photoSizeSource) {
        case "legacy":
          if (this.secret === undefined) throw new Error("Missing photo secret");
          out += Util.to64bitBuffer(BigInt(this.secret));
          break;
        case "thumbnail":
          if (this.thumbTypeId === undefined) throw new Error("Missing thumbnail type");
          out += Util.to32bitBuffer(this.thumbTypeId);
          out += this.thumbType?.padEnd(4, "\0");
          break;
        case "dialogPhoto":
          if (this.dialogId === undefined || this.dialogAccessHash === undefined) {
            throw new Error("Missing dialog photo data");
          }
          out += Util.to64bitBuffer(BigInt(this.dialogId));
          out += Util.to64bitBuffer(BigInt(this.dialogAccessHash));
          break;
        case "stickerSetThumbnail":
          if (this.stickerSetId === undefined || this.stickerSetAccessHash === undefined) {
            throw new Error("Missing sticker set data");
          }
          out += Util.to64bitBuffer(BigInt(this.stickerSetId));
          out += Util.to64bitBuffer(BigInt(this.stickerSetAccessHash))
          break;
      }
      if (this.localId === undefined) throw new Error("Missing local id");
      out += Util.to32bitSignedBuffer(Number(this.localId));

    }
    if (this.version >= 4) {
      out += String.fromCharCode(this.subVersion);
    }
    out += String.fromCharCode(this.version);
    return Util.base64UrlEncode(Util.rleEncode(out));
  }

  toFileUniqId() {
    return FileUniqId.fromFileIdInstance(this).toFileUniqId();
  }

  getOwnerId() {
    if (this.typeId === Util.TYPES.indexOf('sticker') && (this.version === 4 || this.version === 2)) {
      let tmp = Buffer.alloc(8);
      tmp.writeBigInt64LE(this.id & BigInt('72057589742960640'));
      return tmp.readUInt32LE(4);
    }
    return 0;
  }
}

export default FileId;
