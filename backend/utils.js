export function includesSubArr(parentArr, subArr) {
  /**
   * capitalize is matter.
   */
  for(let i=0; i<subArr.length; i++) {
    if(!parentArr.includes(subArr[i])) return false;
  }

  return true;
}

export function toggleEleInArr(arr, ele) {
  /**
   * remove element if exist in array, if not add to the end.
   * capitalize is matter.
   */
  const findIndex = arr.findIndex(e => e === ele);
  if(findIndex!==-1) arr.splice(findIndex, 1);
  else arr.push(ele);
}

export function capitalizeFirstLetter(string) { //ai generate
  return string.replace(/\b\w+/g, function(word) {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });
}