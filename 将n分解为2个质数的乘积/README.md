## 问题：将n分解为2个质数的乘积
`n = a * b`，其中 `n` 为自然数，`a`、`b`为质数。已知`n`的值，求 `a`、`b`。  

**示例1：**
```
输入：4
输出：[2,2]
```
**示例2：**
```
输入：35
输出：[7,5]
```
**说明:**  4 <= n <= 21368154662219。

## 传统方法

**步骤：**    
> 1、求出小于 `n` 的所有质数。    
> 2、循环相乘，找到乘积等于`n`的一对数字。    

重点是求所有质数，对于`求小于n的所有质数`的方案，已经有很多文章讨论，这里就不提了。     
参考那些资料，运用到本题上发现，n 上亿时，就会遇到瓶颈。（本题`n`取到 `2万亿`）   

## 巧妙方法

**分析：**    

> 判断一个数是不是质数，需要较长的时间`O(sqrt(n))`，`n`个数就是`O(n*sqrt(n))`；如果空间换时间的话，空间复杂度`O(n)`（内存爆了）。    
> `n = a * b`，可以推断 `a = n / b`，并且 `min(a,b) <= sqrt(n)`。    
> 判断一个数能否被`n`整除，只需要运算1次，循环n次，`O(n)`。   

我们可以先进行求余运算，满足`n % b == 0`后，再判断`b`是否是质数（`isPrime(b)`），由于大部分数字是不能被`n`整除的，所以他们不需要被`isPrime`，节省了很多时间。   
根据这些信息，可以总结出方法：   

> 1、从第一个质数`2`开始，循环到`sqrt(n)`，找到可以把 `n`整除的数 `b`。   
> 2、判断 当前的 `b` 和 `n / b` 是否是 质数 ，如果是则得到答案，如果不是则下一次循环。  

流程图：  

<img src="https://raw.githubusercontent.com/KawayAlpaka/calculation/master/将n分解为2个质数的乘积/img/flowchart.png" /> 

javascript代码：
```javascript
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
```
测试代码：  
```javascript
const testCases = [
  4,10,35,52211,7514542333,756792121819,21368154662219
];
testCases.forEach(function (testCase) {
  const result = find2number(testCase);
  if (result && result[0] * result[1] === testCase) {
    console.log("pass:" + testCase, result);
  } else {
    console.warn("fail:" + testCase);
  }
});
```

## 补充
进一步研究发现，两个质数`a`、`b`的乘积 `n`，只有`1`、`a`、`b`、`n`这几个约数。    
也就是说只要确定`n`是两个不同质数的乘积，则只存在唯一的一对大于1的整数`a`、`b`满足 `a * b = n`。    
这就更简单了，只要找到一个大于1的整数`b`，满足`n % b = 0`，则`b` 和 `n / b`就是答案。（完全不需要计算质数了）     

javascript代码：
```javascript
const find2number = function (n) {
  const max = Math.sqrt(n);
  for (let b = 2; b <= max; b++) {
    if (n % b === 0) {
      return [n / b, b];
    }
  }
  return false;
};
```
