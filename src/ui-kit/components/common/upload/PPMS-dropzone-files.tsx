export const checkFileType = (files) => {
  let filteredFiles = [];
  let acceptedFiles = [
    "pdf",
    "doc",
    "docx",
    "xlsx",
    "xls",
    "rtf",
    "csv",
    "txt",
  ];
  let error = [];
  files.forEach((file) => {
    let fileExtension = file.name.split(".").pop();
    if (acceptedFiles.includes(fileExtension)) {
      filteredFiles.push(file);
    } else {
      error.push(file.name);
    }
  });
  let message = "";
  if (error.length > 1) {
    message = error.join(", ") + " are not accepted in Documents.";
  } else if (error.length === 1) {
    message = error.toString() + " is not accepted in Documents.";
  }
  return {
    error: message,
    files: filteredFiles,
  };
};

export const checkXLSFileType = (files) => {
  let filteredFiles = [];
  let acceptedFiles = ["xlsx", "xls"];
  let error = [];
  files.forEach((file) => {
    let fileExtension = file.name.split(".").pop();
    if (acceptedFiles.includes(fileExtension)) {
      filteredFiles.push(file);
    } else {
      error.push(file.name);
    }
  });
  let message = "";
  if (error.length > 1) {
    message = error.join(", ") + " are not accepted in Documents.";
  } else if (error.length === 1) {
    message = error.toString() + " is not accepted in Documents.";
  }
  return {
    error: message,
    files: filteredFiles,
  };
};

export const constructDuplicateFileMsg = (existingFiles) => {
  let error = [];
  for (let x = 0; x < existingFiles.length; x++) {
    error.push(existingFiles[x].name);
  }

  let message = "";
  if (error.length > 1) {
    message = error.join(", ") + " cannot be uploaded as they already exists";
  } else if (error.length === 1) {
    message = error.toString() + " cannot be uploaded as it already exists";
  }
  return {
    error: message,
  };
};

export const checkFileSize = (files, max) => {
  let filteredFiles = [];
  let size = max * 1000000;
  let error = [];
  for (let x = 0; x < files.length; x++) {
    if (files[x].size > size) {
      error.push(files[x].name);
    } else {
      filteredFiles.push(files[x]);
    }
  }
  let message = "";
  if (error.length > 1) {
    message = error.join(", ") + " are too large.";
  } else if (error.length === 1) {
    message = error.toString() + " is too large.";
  }
  return {
    error: message,
    files: filteredFiles,
  };
};
