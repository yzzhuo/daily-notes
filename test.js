var a = [5, 3, 1, 6, 5, 3, 4, 8, 7, 9];
var k = 10;

// 快速排序
function qsort(array) {
  if (array.length < 2) {
    return array;
  }
  var pivot = array.splice(0, 1)[0];
  var left = array.filter(function(item) {
    return item <= pivot;
  });
  var right = array.filter(function(item) {
    return item > pivot;
  });
  return qsort(left).concat([pivot], qsort(right));
}

// 二分查找法
function findNumber(array, k) {
  if (array.length < 0) {
    return false;
  }
  if (array.length === 1) {
    return array[0] === k;
  }
  var middle_index = Math.floor(array.length / 2);
  var middle = array[middle_index];
  if (middle === k) {
    return true;
  }
  if ( k < middle) {
    return findNumber(array.slice(0, middle_index - 1), k);
  } else {
    return findNumber(array.slice(middle_index - 1, array.length - 1), k);
  }
}


console.log(findNumber(qsort(a), k));