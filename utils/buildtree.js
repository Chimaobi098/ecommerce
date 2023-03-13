export function buildTree(info) {
  console.log(info);
  let obj = {};
  let rootValues = info.filter((item) => item.isRootCategory === true);

  function recurse(value) {
    if (!value.children || value.children.length === 0) {
      return { [value.title]: {} };
    }

    let children = {};

    for (let child of value.children) {
      for (let item of info) {
        if (child.title === item.title) {
          let childObj = recurse(item);
          children = { ...children, ...childObj };
        }
      }
    }

    return { [value.title]: children };
  }

  for (let root of rootValues) {
    obj = { ...obj, ...recurse(root) };
  }

  return obj;
}
