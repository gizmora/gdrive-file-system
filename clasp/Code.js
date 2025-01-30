function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
}

function doGet() {
  let template = HtmlService.createTemplateFromFile('index');

  return template.evaluate();
}

function getRootList() {
  const rootFolder = DriveApp.getRootFolder();
  const files = rootFolder.getFiles();
  const folders = rootFolder.getFolders();
  let items = [];

  while (folders.hasNext()) {
    let curr = folders.next();
    let mimeType = 'folder';
    
    items.push({
      type: 'folder',
      name: curr.getName(),
      treeLevel: 0,
      mimeType: mimeType,
      mimeClass: getIconClass(mimeType),
      id: curr.getId(),
      // lastUpdated: curr.getLastUpdated()
    })
  }

  while (files.hasNext()) {
    let curr = files.next();
    let mimeType = curr.getMimeType();

    items.push({
      type: 'file',
      name: curr.getName(),
      treeLevel: 0,
      mimeType: mimeType,
      mimeClass: getIconClass(mimeType),
      id: curr.getId(),
      // lastUpdated: curr.getLastUpdated()
    })
  }

  console.log(items)

  return items;
}

function getFolderContents(fileId, treeLevel = 1) {
  const folder = DriveApp.getFolderById(fileId);
  const files = folder.getFiles();
  const folders = folder.getFolders();
  const contents = [];

  while (folders.hasNext()) {
    let currFolder = folders.next();
    let mimeType = 'folder';
    // let folderContents = getFolderContents(currFolder, treeLevel + 1);

    contents.push ({
      type: 'folder',
      name: currFolder.getName(),
      treeLevel: treeLevel,
      mimeType: mimeType,
      mimeClass: getIconClass(mimeType),
      id: currFolder.getId(),
    });
    
  }

  while (files.hasNext()) {
    let currFile = files.next();
    let mimeType = currFile.getMimeType();

    contents.push ({
      type: 'file',
      name: currFile.getName(),
      treeLevel: treeLevel,
      mimeType: mimeType,
      mimeClass: getIconClass(mimeType),
      id: currFile.getId(),
    });

  }

  return contents;
}

function getIconClass(mimeType) {
  const mimeTypeLookup = {
    'image/jpeg': 'image',
    'image/png': 'image',
    'image/gif': 'image',
    'image/bmp': 'image',
    'image/svg+xml': 'image',
    'video/mp4': 'movie',
    'video/x-msvideo': 'movie',
    'video/quicktime': 'movie',
    'video/webm': 'movie',
    'audio/mpeg': 'music_note',
    'audio/wav': 'music_note',
    'audio/ogg': 'music_note',
    'application/pdf': 'picture_as_pdf',
    'application/msword': 'description',
    'application/vnd.ms-excel': 'list_alt',
    'application/vnd.ms-powerpoint': 'analytics',
    'application/vnd.google-apps.document': 'article',
    'application/vnd.google-apps.spreadsheet': 'list_alt',
    'application/vnd.google-apps.presentation': 'analytics',
    'folder': 'folder',
    'others': 'text_snippet'
  };

  return mimeTypeLookup[mimeType] ? mimeTypeLookup[mimeType] : mimeTypeLookup['others'];
}