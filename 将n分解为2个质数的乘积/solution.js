const isPrime = function (n) {
  if (n < 2) {
    return false;
  }
  const max = Math.sqrt(n);
  for (let i = 3; i < max; i = i + 2) {
    if (n % i === 0) {
      return false;
    }
  }
  return true;
};

const find2number = function (n) {
  const max = Math.sqrt(n);
  for (let b = 2; b <= max; b++) {
    if (n % b === 0) {
      if (isPrime(b)) {
        const a = n / b;
        if (isPrime(a)) {
          return [a, b];
        }
      }
    }
  }
  return false;
};


// 测试
const test = function () {
  const testCases = [
    4,
    10,
    35,
    52211,
    7514542333,
    756792121819,
    21368154662219
  ];
  testCases.forEach(function (testCase) {
    const result = find2number(testCase);
    if (result && result[0] * result[1] === testCase) {
      console.log("pass:" + testCase, result);
    } else {
      console.warn("fail:" + testCase);
    }
  });
};
test();