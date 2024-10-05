const list = [1,2,3,4,5,6,7,8,9];

function getPage(from, to) {
  return list.slice(from, to);
}

function toggle(arr, ele) {
  const findIndex = arr.findIndex(e => e === ele);
  if(findIndex!==-1) arr.splice(findIndex, 1);
  else arr.push(ele);
}

toggle(list, 10);
console.log(list);