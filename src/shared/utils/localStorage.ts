export const StorageKeys = {
  CHILDREN_STATE: "project_children_state",
} as const;

export const saveChildrenState = (children: any[]) => {
  try {
    const stateToSave = {
      children,
      timestamp: new Date().getTime(),
    };
    localStorage.setItem(StorageKeys.CHILDREN_STATE, JSON.stringify(stateToSave));
    console.log("Saved children to localStorage:", stateToSave);
  } catch (error) {
    console.error("Error saving children state:", error);
  }
};

export const loadChildrenState = () => {
  try {
    const savedState = localStorage.getItem(StorageKeys.CHILDREN_STATE);
    if (!savedState) return null;

    const parsedState = JSON.parse(savedState);

    // Có thể thêm logic kiểm tra timestamp để loại bỏ dữ liệu cũ
    // const ONE_DAY = 24 * 60 * 60 * 1000;
    // if (new Date().getTime() - parsedState.timestamp > ONE_DAY) {
    //   localStorage.removeItem(StorageKeys.CHILDREN_STATE);
    //   return null;
    // }

    return parsedState.children;
  } catch (error) {
    return null;
  }
};

export const clearChildrenState = () => {
  localStorage.removeItem(StorageKeys.CHILDREN_STATE);
};
