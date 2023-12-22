const { contextBridge, ipcRenderer } = require("electron");
// const node = () => process.versions.node;
const displaySomething = (data) => {
  ipcRenderer.invoke("proba", data);
};
contextBridge.exposeInMainWorld("doSomething", {
  // node: node,
  // chrome: () => process.versions.chrome,
  // electron: () => process.versions.electron,
  writeFile: (data1) => ipcRenderer.invoke("writeFile", data1),
  readData: (file) => ipcRenderer.invoke("readFile", file),
  checkFileExist: (file) => ipcRenderer.invoke("checkFile", file),
  checkFolder: (folder) => ipcRenderer.invoke("checkFolder", folder),
  createFolder: (folder) => ipcRenderer.invoke("createFolder", folder),
  // we can also expose variables, not just functions
});
