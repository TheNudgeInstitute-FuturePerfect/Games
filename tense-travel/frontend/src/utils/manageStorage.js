const setStorage = (data) => {
  const storageData = getStorage();
  const updatedData = { ...storageData, ...data };
  data = JSON.stringify(updatedData);
  sessionStorage.setItem("tesne-travel", data);
};

const getStorage = () => {
  const storageData = sessionStorage.getItem("tesne-travel");
  if (!storageData) {
    return "";
  } else return JSON.parse(storageData);
};

const removeStorage = () => {
  sessionStorage.removeItem("tesne-travel");
};

export { getStorage, removeStorage, setStorage };
