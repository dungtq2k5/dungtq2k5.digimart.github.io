export function includesSubArr(parentArr, subArr) {
  for(let i=0; i<subArr.length; i++) {
    if(!parentArr.includes(subArr[i])) return false;
  }

  return true;
}