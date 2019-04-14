const count1 = function (n, x) {
  const step = 2;     // 奇数数列，步进为2
  let sum = 0;
  for (let i = 1; i <= n; i = i + step) {
    const str = "" + i, xx = "" + x;
    for (let j = 0; j < str.length; j++) {
      if (str[j] === xx) {
        sum++;
      }
    }
  }
  return sum;
};

const count2 = function (n, x) {
  let sum = 0, factor = 1, higher = 0, current = 0, lower = 0, time = 1;
  for (; Math.floor(n / factor) != 0; factor *= 10) {
    higher = Math.floor(n / (factor * 10));
    current = Math.floor((n / factor)) % 10;
    lower = n - Math.floor((n / factor)) * factor;
    if (factor > 1) {           // 奇数序列，除了个位以外，其他位数包含x的数量，会少一半
      time = 0.5;
    } else if (x % 2 === 0) {   // 奇数序列，当x为偶数时，个位数一个都没有，所以跳过个位数的计算
      continue;
    }
    // 当x等于0时，高位相对要减1 ，举例说明：1-200中包含 11~19、111~119这个过程，相对0来说，只包含 101~109 但不会包含 00~09
    if (x === 0) {
      higher--;
    }
    if (current === x) {
      let _t = factor === 1 ? 1 : Math.ceil(lower * time);
      sum += higher * factor * time + _t;
    } else if (current > x) {
      sum += (higher + 1) * factor * time;
    } else if (current < x) {
      sum += higher * factor * time;
    }
  }
  return sum;
};

const test = function () {
  const start = Date.now();
  const testCase = [1, 2, 3, 4, 5, 10, 11, 12, 13, 14, 99, 100, 101, 102, 103, 104, 123, 132, 321, 12345, 54321, 123321, 12300, 12301, 12302, 12303, 12304, 512345];
  const xCase = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  testCase.forEach(function (n) {
    xCase.forEach(function (x) {
      const expect = count1(n, x);
      const result = count2(n, x);
      if (expect === result) {
        console.log(`pass:input=${n},${x};result=${result}`);
      } else {
        console.warn(`error:input=${n},${x};expect=${expect},but result=${result}`);
      }
    });
  });
  const dur = Date.now() - start;
  console.log(dur);
};

test();


