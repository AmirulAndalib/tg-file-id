### tg-file-id 
A Node.js module to decode, encode, and convert Telegram Bot API file IDs.
### install 
```bash 
npm install tg-file-id --save
```
### FileId parameters 
`version` : Number of bot api file_id version. Usually `4`   
`subVersion` : Number of bot api file_id subVersion. Usually `30`.  
`dcId` : The data center where the file is stored.  
`typeId` : File type (number).You can see the list of file type in [here](#filetype).  
`fileType` : File type (string).You can see the list of file type in [here](#filetype).  
`fileReference` : [Telegram file reference.](https://core.telegram.org/api/file_reference)    
`url` : Url web locations.  
`id` : The id of file.  
`accessHash` : The accessHash of file.  
`volumeId` : Volume id of the file. Required for photo file IDs.
`localId` : Local id of the file. Required for photo file IDs.
`photoSizeSource` : Specific photo type (string), the type is same with phototype. You can see list of photoSizeSource in [here](#phototype).  
`photoSizeSourceId` : Specific photo type (number), the number is same with phototype. You can see list of photoSizeSource in [here](#phototype).  
`secret` : Secret id.  
`dialogId` : Chat id. Using to create a file id from photo profile.  
`dialogAccessHash` : Chat accessHash. Using to create a file id from photo profile.  
`isSmallDialogPhoto` : Do you want to make a small photo profile.  
`stickerSetId` : Id of sticker set.  
`stickerSetAccessHash` : Access hash of sticker set.  
`thumbType` : Thumbnail type (string), the type is same with phototype. You can see list of thumbnail type in [here](#phototype).  
`thumbTypeId` : Thumbnail type (number), the number is same with phototype. You can see list of thumbnail type in [here](#phototype).  

### API methods
`decodeFileId(fileId)` : Decode a Bot API file ID.
`encodeFileId(decoded)` : Recreate a file ID from a decoded result.
`decodeUniqFileId(fileUniqueId)` : Decode a unique file ID.
`FileId.fromFileId(fileId)` : Create an editable `FileId` instance.
`FileId.fromDecoded(decoded)` : Create a `FileId` from a decoded result.
`FileId#toFileId()` : Encode the instance as a file ID.
`FileId#toFileUniqId()` : Derive its unique file ID.
`FileUniqId.fromFileUniqId(fileUniqueId)` : Create a unique ID instance.
`FileUniqId#toFileUniqId()` : Encode the unique ID instance.

### fileType 
`thumbnail` : `0`  
`profile_photo` : `1`  
`photo` : `2`  
`voice` : `3`  
`video` : `4`  
`document` : `5`  
`encrypted` : `6`  
`temp` : `7`  
`sticker` : `8`  
`audio` : `9`  
`animation` : `10`  
`encrypted_thumbnail` : `11`  
`wallpaper` : `12`  
`video_note` : `13`  
`secure_raw` : `14`  
`secure` : `15`  
`background` : `16`  
`size` : `17`  
### photoType 
`LEGACY` : `0`  
`THUMBNAIL` : `1`  
`DIALOGPHOTO_SMALL` : `2`  
`DIALOGPHOTO_BIG` : `3`  
`STICKERSET_THUMBNAIL` : `4`  
