const list = [1,2,3,4,5,6,7,8,9];

function getPage(from, to) {
  return list.slice(from, to);
}

function toggle(arr, ele) {
  const findIndex = arr.findIndex(e => e === ele);
  if(findIndex!==-1) arr.splice(findIndex, 1);
  else arr.push(ele);
}

function capitalizeFirstLetter(string) { //ai generate
  return string.replace(/\b\w+/g, function(word) {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });
}
console.log(capitalizeFirstLetter("hello world, nice to meet you!"));