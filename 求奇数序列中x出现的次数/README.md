## 问题：求奇数序列中x出现的次数
已知自然数`n`， `N` 为所有大于等于`1`且小于等于`n`的奇数集合，`x`为整数，`0 <= x <= 9`。      
输入`n`、`x`，要输出 `N` 中 `x`字符出现的次数。  

**示例：**
```
输入：14,1
输出：4
```
**说明：** 示例中 `N` 为 [1,3,5,7,9,11,13]，`x`为`1`，`1` 在 `N` 中出现的次数为 `4`。

## 稳重方法
遍历小于等于`n`的奇数，每个数字都用来与`x`匹配，得到长度，加入到总数中。    
此方法的优点是容易设计，几乎不会出错。缺点也很明显，既运算次数太多，时间复杂度 **O(n * log<sub>2</sub>n)**。    
笔者的计算机测试，当 `n` 达到 **10亿** 时，需要计算的时间是 **100s** 左右。   

javascript代码：
```javascript
const count1 = function (n, x) {
  const step = 2;     // 奇数数列，步进为2
  let sum = 0;
  for (let i = 1; i <= n; i += step) {
    const str = "" + i, xx = "" + x;
    for (let j = 0; j < str.length; j++) {
      if (str[j] === xx) {
        sum++;
      }
    }
  }
  return sum;
};
```
## 巧妙方法
我们可以先把问题化简一下，不再限制`N`为**奇数序列**。并且假设 `x` 为一个普通的个位数 `3`。
再转换一下思路，不循环遍历，而是计算出整个序列中，`3`分别在`个`、`十`、`百`、`千`等位数上出现的次数，再求它们的和。     
以`百位`举例：    
> `n = 12345`时，`3`在`百位`上出现的数字有：**3**00 - **3**99（100），1**3**00 - 1**3**99（100），2**3**00 - 2**3**99（100） ，... ，11**3**00 - 11**3**99（100），12**3**00 - 12**3**45（46）；也就是 `12 * 100 + 46`次。   
> `n = 12245`时，`3`在`百位`上出现的数字有：**3**00 - **3**99（100），1**3**00 - 1**3**99（100），2**3**00 - 2**3**99（100） ，... ，11**3**00 - 11**3**99（100）；也就是 `12 * 100`次。   
> `n = 12445`时，`3`在`百位`上出现的数字有：**3**00 - **3**99（100），1**3**00 - 1**3**99（100），2**3**00 - 2**3**99（100） ，... ，11**3**00 - 11**3**99（100），12**3**00 - 12**3**99（100）；也就是 `(12 + 1) * 100 + 46`次。    

可以得到结论：例`n = 12345`,设`n`在某一位的数字为`current`，当前位的因素为`factor`（百位的`factor`为`100`），高位数字为`higher`（百位的`higher`为`12`），低位数字为`lower`（百位的`lower`为`45`），当前位出现`x`的次数为`bit_sum`。 

> `current = x`时：`bit_sum` = `higher * factor + lower + 1`;      
> `current < x`时：`bit_sum` = `higher * factor`;      
> `current > x`时：`bit_sum` = `(higher + 1) * factor`;      

例如`n = 12345`时，`3`在不同位数上出现的次数分别为：     
> 个位：`1235` = `(1234 + 1) * 1`   
> 十位：`1240` = `(123 + 1) * 10`     
> 百位：`1246` = `12 * 100 + 45 + 1`    
> 千位：`1000` = `1 * 1000`   
> 万位：`0` = `0 * 10000`     
> 总数：`4721` = `1235 + 1240 + 1246 + 1000 + 0`    

可以使用上面的**稳重方法**来验证一下，**暂时**修改代码：
```diff
- const step = 2;     // 奇数数列，步进为2
+ const step = 1;     // 自然数数列，步进为1
```
运行测试：
```javascript
count1(12345,3)       // 4721
```
可见计算结果与推算相同，现在这个算法已经可以适用于`N`为自然数序列，且`x = 3`的情况。    

现在我们升级一下题目，`x`取值范围设定为问题最初时的 `0 - 9` 的整数，要怎么处理呢？来看看有什么变化：   

发现当`x = 0`时，比较特殊：   
> 设`n=12045`时，`0`在`百位`上出现的数字有：1**0**00 - 1**0**99（100），2**0**00 - 2**0**99（100） ，... ，11**0**00 - 11**0**99（100），12**0**00 - 12**0**45（46）；也就是 `11 * 100 + 46`次。   
> 设`n=12145`时，`0`在`百位`上出现的数字有：1**0**00 - 1**0**99（100），2**0**00 - 2**0**99（100） ，... ，11**0**00 - 11**0**99（100）；也就是 `11 * 100`次。    

对比`x=3`和`x=0`可以看出，`x=3`有 **3**00 - **3**99 这些数，而`x=0`却没有 **0**00 - **0**99。可知当`x=0`时，`higher`应该额外减`1`后再用来计算。

继续升级题目，将`N`设定为问题最初时的**奇数序列**，来看看有什么变化：

因为**奇数序列**中数字的所有**个位**都是**奇数**，所以：  
> 当前位是`个位`，且`x`是**偶数**时，`bit_sum` = `0`；    

**奇数序列**长度 约等于 **自然数序列**长度 的 50%；   
> `current != x`，当前位是`个位`时，`bit_sum`不变；   
> `current != x`，当前位`非个位`时，`bit_sum`会减少50%；    
> `current = x`，且当前位是`个位`时，`bit_sum` = `higher * factor + 1`;     
> `current = x`，且当前位`非个位`时，`bit_sum` = `higher * factor * 0.5 + ceil(lower * 0.5)`（进一法）;     

经过这番折腾，算法就可以解决本题了，时间复杂度**O(log<sub>10</sub>n)**（飞速）。    

javascript代码：
```javascript
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
    if (x === 0) {
      // 当x等于0时，高位相对要减1 ，举例说明：1-200中包含 11 - 19、111 - 119这个过程，相对0来说，只包含 101 - 109 但不会包含 00 - 09
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
```

我们认为**稳定方法**性能较差，结果却不会错。这里就用**稳定方法**的输出结果来测试验证新方法。（不要忘了把前面的`step`改回来）

测试代码：  
```javascript
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
```
