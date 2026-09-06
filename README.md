# tg-file-id

[![Test](https://github.com/smaznet/tg-file-id/actions/workflows/npm.yml/badge.svg)](https://github.com/smaznet/tg-file-id/actions/workflows/npm.yml)
[![npm version](https://badge.fury.io/js/tg-file-id.svg)](https://badge.fury.io/js/tg-file-id)

Decode, encode, inspect, and convert Telegram Bot API `file_id` and
`file_unique_id` values.

## Requirements

- Node.js 20.19 or newer
- CommonJS or TypeScript

## Installation

```bash
npm install tg-file-id
```

## Quick start

```js
const {
  decodeFileId,
  decodeUniqFileId,
  encodeFileId,
  FileId,
} = require('tg-file-id');

const fileId =
  'AwACAgQAAxkBAAEE3SZgO-PbHlWtxRt5cPWvXlGRWHXM3AACuwgAAj0d4FF_jv-i_-7iQR4E';
const decoded = decodeFileId(fileId);

console.log(decoded.fileType); // voice
console.log(decoded.dcId); // 4
console.log(decoded.id); // 5899747659685562555n
console.log(encodeFileId(decoded) === fileId); // true

const uniqueFileId = FileId.fromFileId(fileId).toFileUniqId();
console.log(uniqueFileId); // AgADuwgAAj0d4FE
console.log(decodeUniqFileId(uniqueFileId));
// { typeId: 2, type: 'document', id: 5899747659685562555n }
```

## API

### `decodeFileId(fileId)`

Decodes a Bot API `file_id` into an object containing its type, data center,
file reference, numeric identifiers, and type-specific fields.

```js
const { decodeFileId } = require('tg-file-id');

const decoded = decodeFileId(
  'AwACAgQAAxkBAAEE3SZgO-PbHlWtxRt5cPWvXlGRWHXM3AACuwgAAj0d4FF_jv-i_-7iQR4E',
);

console.log(decoded);
```

Output:

```js
{
  version: 4,
  subVersion: 30,
  typeId: 3,
  dcId: 4,
  hasReference: true,
  hasWebLocation: false,
  fileType: 'voice',
  fileReference: '010004dd26603be3db1e55adc51b7970f5af5e51915875ccdc',
  id: 5899747659685562555n,
  access_hash: 4747619738920652415n
}
```

### `encodeFileId(decoded)`

Encodes an object returned by `decodeFileId`. You can modify the decoded
object before encoding it, but all fields required by that file type must
remain present.

```js
const { decodeFileId, encodeFileId } = require('tg-file-id');

const original =
  'AwACAgQAAxkBAAEE3SZgO-PbHlWtxRt5cPWvXlGRWHXM3AACuwgAAj0d4FF_jv-i_-7iQR4E';
const encoded = encodeFileId(decodeFileId(original));

console.log(encoded === original); // true
```

### `decodeUniqFileId(fileUniqueId)`

Decodes a Bot API `file_unique_id`. Depending on its type, the result contains
an `id`, a `volumeId` and `localId`, or a URL.

```js
const { decodeUniqFileId } = require('tg-file-id');

const decoded = decodeUniqFileId('AgADuwgAAj0d4FE');

console.log(decoded);
// { typeId: 2, type: 'document', id: 5899747659685562555n }
```

### `FileId`

`FileId` provides an editable representation of a `file_id`.

#### Parse, edit, and encode

```js
const { FileId } = require('tg-file-id');

const value =
  'AwACAgQAAxkBAAEE3SZgO-PbHlWtxRt5cPWvXlGRWHXM3AACuwgAAj0d4FF_jv-i_-7iQR4E';
const file = FileId.fromFileId(value);

console.log(file.fileType); // voice
console.log(file.accessHash); // 4747619738920652415n
console.log(file.toFileId() === value); // true
```

#### Create from decoded data

```js
const { decodeFileId, FileId } = require('tg-file-id');

const value =
  'AwACAgQAAxkBAAEE3SZgO-PbHlWtxRt5cPWvXlGRWHXM3AACuwgAAj0d4FF_jv-i_-7iQR4E';
const file = FileId.fromDecoded(decodeFileId(value));

console.log(file.toFileId() === value); // true
```

#### Convert to `file_unique_id`

```js
const { FileId } = require('tg-file-id');

const file = FileId.fromFileId(
  'AwACAgQAAxkBAAEE3SZgO-PbHlWtxRt5cPWvXlGRWHXM3AACuwgAAj0d4FF_jv-i_-7iQR4E',
);

console.log(file.toFileUniqId()); // AgADuwgAAj0d4FE
```

#### Build a document ID manually

This is useful when converting a Telegram MTProto document into Bot API
format. Numeric 64-bit values must be passed as `bigint`.

```js
const { FileId } = require('tg-file-id');

const file = new FileId();
file.version = 4;
file.subVersion = 30;
file.typeId = 5;
file.fileType = 'document';
file.dcId = 4;
file.id = 1234567890123456789n;
file.accessHash = 987654321098765432n;
file.fileReference = '01020304';

const fileId = file.toFileId();
console.log(fileId);
```

`getOwnerId()` returns the embedded owner ID for supported sticker IDs. It
returns `0` when the value is not available.

```js
const { FileId } = require('tg-file-id');

const sticker = FileId.fromFileId(
  'CAACAgIAAxkBAAIEVF9Do80olppb0490gLH2I1cszuoMAALcCQACAoujAAEqUB3Wl6aD6BsE',
);

console.log(sticker.getOwnerId()); // 10717954
```

### `FileUniqId`

`FileUniqId` represents a `file_unique_id`. `UniqueFileId` is an alias for the
same class.

#### Convert from a `file_id`

```js
const { FileUniqId } = require('tg-file-id');

const unique = FileUniqId.fromFileId(
  'AwACAgQAAxkBAAEE3SZgO-PbHlWtxRt5cPWvXlGRWHXM3AACuwgAAj0d4FF_jv-i_-7iQR4E',
);

console.log(unique.toFileUniqId()); // AgADuwgAAj0d4FE
```

#### Parse and re-encode a `file_unique_id`

```js
const { FileUniqId } = require('tg-file-id');

const unique = FileUniqId.fromFileUniqId('AgADuwgAAj0d4FE');

console.log(unique.type); // 2 (document)
console.log(unique.id); // 5899747659685562555n
console.log(unique.toFileUniqId()); // AgADuwgAAj0d4FE
```

#### Build a `file_unique_id` manually

```js
const { FileUniqId } = require('tg-file-id');

const unique = new FileUniqId();
unique.type = 2; // document
unique.id = 5899747659685562555n;

console.log(unique.toFileUniqId()); // AgADuwgAAj0d4FE
```

## Decoded fields

Common `file_id` fields:

| Field | Type | Description |
| --- | --- | --- |
| `version` | `number` | Bot API file ID format version. |
| `subVersion` | `number` | File ID format sub-version. |
| `typeId` | `number` | Numeric file type. |
| `fileType` | `string` | Human-readable file type. |
| `dcId` | `number` | Telegram data center ID. |
| `hasReference` | `boolean` | Whether a file reference is included. |
| `hasWebLocation` | `boolean` | Whether the ID points to a web location. |
| `fileReference` | `string` | File reference encoded as hexadecimal. |
| `url` | `string` | Web location, when present. |
| `id` | `bigint` | Telegram file identifier. |
| `access_hash` | `bigint` | Access hash returned by `decodeFileId`. |

Photo IDs can also contain:

| Field | Type | Description |
| --- | --- | --- |
| `volumeId` | `bigint` | Photo volume identifier. |
| `localId` | `number` | Photo identifier within the volume. |
| `photoSizeSource` | `number` | Numeric photo source type. |
| `secret` | `bigint` or `number` | Secret used by legacy photo IDs. |
| `thumbnailType` | `string` | Thumbnail size code. |
| `thumbTypeId` | `number` | Numeric type of the thumbnail's file. |
| `photoSize` | `small` or `big` | Profile photo size. |
| `dialogId` | `bigint` or `number` | Dialog identifier for profile photos. |
| `dialogAccessHash` | `bigint` or `number` | Dialog access hash for profile photos. |
| `stickerSetId` | `bigint` or `number` | Sticker set identifier for its thumbnail. |
| `stickerSetAccessHash` | `bigint` or `number` | Sticker set access hash. |
| `stickerSetVersion` | `number` | Sticker set thumbnail version, when present. |

On a `FileId` instance, the decoded `access_hash` field is available as
`accessHash`. The instance also uses `photoSizeSourceId` for the numeric source
and `photoSizeSource` for its name.

## File types

| ID | Name | ID | Name |
| ---: | --- | ---: | --- |
| 0 | `thumbnail` | 9 | `audio` |
| 1 | `profile_photo` | 10 | `animation` |
| 2 | `photo` | 11 | `encrypted_thumbnail` |
| 3 | `voice` | 12 | `wallpaper` |
| 4 | `video` | 13 | `video_note` |
| 5 | `document` | 14 | `secure_raw` |
| 6 | `encrypted` | 15 | `secure` |
| 7 | `temp` | 16 | `background` |
| 8 | `sticker` | 17 | `size` |

Unique file ID types:

| ID | Name |
| ---: | --- |
| 0 | `web` |
| 1 | `photo` |
| 2 | `document` |
| 3 | `secure` |
| 4 | `encrypted` |
| 5 | `temp` |

Photo source types:

| ID | Name |
| ---: | --- |
| 0 | `legacy` |
| 1 | `thumbnail` |
| 2 | `dialogPhoto` (small) |
| 3 | `dialogPhoto` (big) |
| 4 | `stickerSetThumbnail` |

## TypeScript

The package includes declarations for all exports. `FileIdInfo` and
`UniqFileIdInfo` can be imported when decoded values need explicit types.

```ts
import {
  decodeFileId,
  decodeUniqFileId,
  type FileIdInfo,
  type UniqFileIdInfo,
} from 'tg-file-id';

const file: FileIdInfo = decodeFileId(
  'AwACAgQAAxkBAAEE3SZgO-PbHlWtxRt5cPWvXlGRWHXM3AACuwgAAj0d4FF_jv-i_-7iQR4E',
);
const unique: UniqFileIdInfo = decodeUniqFileId('AgADuwgAAj0d4FE');

console.log(file.fileType, unique.type);
```

## Working with `bigint`

Telegram's 64-bit identifiers are returned as JavaScript `bigint` values.
`JSON.stringify` does not serialize `bigint` by default. Convert them to
strings when producing JSON:

```js
const json = JSON.stringify(decoded, (_key, value) =>
  typeof value === 'bigint' ? value.toString() : value,
);
```

## Error handling

Parsing malformed or unsupported IDs throws an `Error`. If IDs come from an
external source, handle the error explicitly:

```js
const { decodeFileId } = require('tg-file-id');

try {
  const decoded = decodeFileId(valueFromUser);
  console.log(decoded);
} catch (error) {
  console.error('Invalid Telegram file ID:', error.message);
}
```

## License

[MIT](LICENSE)
