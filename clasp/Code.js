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
    
    console.log(curr.getName());
    items.push({
      type: 'folder',
      name: curr.getName(),
      level: 0,
      contents: getFolderContents(curr)
    })
  }

  while (files.hasNext()) {
    let curr = files.next();

    console.log(curr.getName());
    items.push({
      type: 'file',
      name: curr.getName(),
      level: 0,
      mimeType: curr.getMimeType()
    })
  }

  return items;
}

function getFolderContents(folder, level = 1) {
  const files = folder.getFiles();
  const folders = folder.getFolders();
  const contents = [];

  while (folders.hasNext()) {
    let currFolder = folders.next();
    let folderContents = getFolderContents(currFolder, level + 1);

    contents.push ({
      type: 'folder',
      name: currFolder.getName(),
      contents: folderContents,
      level: level
    });
    
    // console.log('-'.repeat(level) + '[folder]' + currFolder.getName());
  }

  while (files.hasNext()) {
    let currFile = files.next();

    contents.push ({
      type: 'file',
      name: currFile.getName(),
      level: level,
      mimeType: currFile.getMimeType()
    });

    // console.log('-'.repeat(level) + currFile.getName());
  }


  console.log(contents)
  return contents;
}