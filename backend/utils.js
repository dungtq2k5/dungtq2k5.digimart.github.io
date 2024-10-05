export function includesSubArr(parentArr, subArr) {
  for(let i=0; i<subArr.length; i++) {
    if(!parentArr.includes(subArr[i])) return false;
  }

  return true;
}

export function toggleEleInArr(arr, ele) {
  /**
   * remove element if exist in array, if not add to the end.
   */
  const findIndex = arr.findIndex(e => e === ele);
  if(findIndex!==-1) arr.splice(findIndex, 1);
  else arr.push(ele);
}