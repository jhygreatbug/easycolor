# easycolor

## 说明

Easycolor是一个用于处理CSS颜色的库。它允许多种形式的输入，可以对颜色进行修改和转换，同时提供了颜色相关的方法。

### 兼容性

支持IE9+。

## 用法

### 快速上手

下载[easycolor.js](https://github.com/jhygreatbug/easycolor/releases/download/v0.0.1/easycolor.js)或[easycolor.min.js](https://github.com/jhygreatbug/easycolor/releases/download/v0.0.1/easycolor.min.js)

使用script标签引入

```html
<script src="easycolor.js"></script>
```

开始使用

```js
// 输入
easycolor('rgb(100,200,133)');
easycolor('#64c885');
easycolor({ r: 100, g: 100, b: 100, a: .5 });
new easycolor('rgb(100,200,133)');

// 转换为字符串
easycolor({ r: 100, g: 100, b: 100, a: .5 }).toString();	// 'rgba(100,100,100,.5)'

// 修改
var color = easycolor('rgb(100,200,133)');
color.r = 120;
color.toRgbString();			// 'rgb(120,200,133)'
color.red += 20;
color.toRgbString();			// 'rgb(140,200,133)'
color.hue = 0;
color.toRgbString();			// 'rgb(200,133,133)'
```

### 输入

支持rgb、hex、hsl、hsv和keyword颜色。

输入格式在[CSS color](https://drafts.csswg.org/css-color-4/#color-type)规范的基础上，有一定宽松。

#### 接收输入类型

```js
// 字符串
easycolor('rgb(100,200,133)');

// 对象
easycolor({ r: 100, g: 100, b: 100, a: .5 });

// 数组
easycolor([100, 100, 100]);		// '#646464'
easycolor([100, 100, 100, .2]);		// 'rgba(100,100,100,0.2)'

// easycolor实例
var a = easycolor({ r: 100, g: 100, b: 100, a: .5 });
var b = easycolor(a);
a === b;				// false
```

#### 配置参数

##### type

指定color的输出类型。

**合法值**

`'rgb'`, `'hex'`, `'hsl'`, `'hsv'`, `'keyword'`, `'transparent'`

**缺省值**

缺省为识别出的输入类型。特别地，识别为`rgb`类型的color，输出类型会置为`hex`。

**说明**

如果输入类型为字符串和对象，type不影响输入值的解析
如果输入类型为数组，输入将按type指定的类型解析
如果输入类型为easycolor实例，type会被忽略

```js
easycolor('rgb(100,200,133)');					// '#646464' 识别为rgb类型的color，输出类型会置为hex
easycolor('rgb(100,200,133)', { type: 'rgb' });			// 'rgb(100, 200, 133)'
easycolor('rgb(100,200,133)', { type: 'hsl' });			// 'hsl(139.8, 47.619%, 58.824%)'

easycolor([100, 50, 50]);					// '#643232'
easycolor([100, 50, 50], { type: 'hsl'})			// 'hsl(100,50%,50%)' 指定了输入的解析类型

easycolor({ r: 100, g: 100, b: 100 });				// 'rgb(100,100,100)'
easycolor({ r: 100, g: 100, b: 100 }, { type: 'hsl' });		// 'hsl(0,0%,39.216%)'
```

##### percentage

指定`rgb`类型的color，是否按百分比格式输出。

**缺省值**

`false`

```js
easycolor('rgb(51,51,51)');							// '#333333'
easycolor('rgb(51,51,51)', { percentage: true });				// '#333333'
easycolor('rgb(51,51,51)', { type: 'rgb', percentage: true });			// 'rgb(20%,20%,20%)'

easycolor('rgb(50%,100%,80%)', { type: 'rgb' });				// 'rgb(50%,100%,80%)'
easycolor('rgb(50%,100%,80%)', { type: 'rgb', percentage: false });		// 'rgb(128,255,204)'
```

#### CSS Number, CSS Percent

接收整型、浮点数、科学计数法、带符号的数字及百分比。

```js
easycolor({ r: '100', g: '200', b: '133' });
easycolor({ r: '1e1', g: '100e-1', b: '1e+1' });
easycolor({ h: '-100', s: 50, l: 50 });
easycolor({ h: '+100', s: 50, l: 50 });

easycolor({ r: '50.5%', g: '.6%', b: '0.6%' });
easycolor({ r: '50.5%', g: '-.6%', b: '+.6%' });

easycolor({ h: 100, s: '-50%', l: 50 });
```

#### Hue

接收CSS数字，及带角度单位的数字。

```js
easycolor({ h: '100', s: 50, l: 50 });
easycolor({ h: '100.5', s: 50, l: 50 });
easycolor({ h: '100deg', s: 50, l: 50 });
easycolor({ h: '100grad', s: 50, l: 50 });
easycolor({ h: '2rad', s: 50, l: 50 });
easycolor({ h: '0.5turn', s: 50, l: 50 });
```

#### Alpha

接收CSS数字及百分比。范围为0 ~ 1。

```js
easycolor({ r: 100, g: 100, b: 100, a: '0.5' });
easycolor({ r: 100, g: 100, b: 100, a: '50%' });
```

#### RGB & RGBA

r, g, b的数字范围为0 ~ 255，百分比范围为0 ~ 100。

```js
/* 字符串 */
easycolor('rgb(100,200,133)');
easycolor('rgb( 100	200 133	)');

// 百分比
easycolor('rgb(50%,200%,80.5%)');

// RGBA
easycolor('rgba(100,200,133,.5)');
easycolor('rgba(100 200 133 .5)');
easycolor('rgba(100 200 133 / .5)');
easycolor('rgba(50%,200%,80.5%,50%)');

/* 对象 */
easycolor({ r: 100, g: 100, b: 100, a: .5 });

/* 数组 */
easycolor([100, 100, 100], { type: 'rgb' });	// '#646464'
easycolor([100, 100, 100, .2]);	// rgba(100,100,100,0.2)
```

#### HSL & HSLA
```js
easycolor('hsl(100,50%,50%)');
easycolor('hsl( 100	50% 50%	)');

easycolor('hsla(100,50%,50%,.5)');
easycolor('hsla(100 50% 50%  .5)');
easycolor('hsla(100 50% 50% / .5)');

easycolor({ h: 100, s: 50, l: 50 });
easycolor({ h: '100', s: '50%', l: '50%' });
easycolor({ h: 100, s: 50, l: 50, a: .5 });

easycolor([100, 50, 50], { type: 'hsl'});
easycolor([100, 50, 50, .5], { type: 'hsl'});
```

#### HSV & HSVA
```js
easycolor('hsv(100,50%,50%)');
easycolor('hsv( 100	50% 50%	)');

easycolor('hsva(100,50%,50%,.5)');
easycolor('hsva(100 50% 50%  .5)');
easycolor('hsva(100 50% 50% / .5)');

easycolor({ h: 100, s: 50, v: 50 });
easycolor({ h: '100', s: '50%', v: '50%' });
easycolor({ h: 100, s: 50, v: 50, a: .5 });

easycolor([100, 50, 50], { type: 'hsv'});
easycolor([100, 50, 50, .5], { type: 'hsv'});
```

#### HEX
```js
easycolor('#abc');
easycolor('#abcc');
easycolor('#aabbcc');
easycolor('#aabbcccc');
```

#### Keyword
```js
easycolor('black');
easycolor('orange');
```

#### Transparent
```js
easycolor('transparent');
```

### 修改

想对颜色进行修改，可以直接修改color实例的属性。颜色的每种属性对应color实例的两个属性值，分别为该颜色属性的简写和全称。

支持的属性：
`r`/`red`
`g`/`green`
`b`/`blue`
`h`/`hue`（色相）
`sl`/`sataratel`（hsl模式饱和度）
`l`/`light`（亮度）
`sv`/`sataratev`（hsv模式饱和度）
`v`/`bright`（明度）
`a`/`alpha`（不透明度）

#### r/red, g/green, b/blue

若接收类型为数字，范围为0 ~ 255。小于0置为0，大于255置为255。
若接收类型为百分比，范围为0 ~ 100。小于0置为0，大于100置为100。

```js
var color = easycolor('#000');
color.r = 100;

color.r = -100;
color.r === 0;						// true
color.r = 300;
color.r === 255;					// true
```

#### h/hue
```js
var color = easycolor('red');
color.h = 100;
```

#### sl/sataratel, l/light, sv/sataratev, v/bright

接收数字及百分比，范围为0 ~ 100。小于0置为0，大于100置为100。

```js
var color = easycolor('red');
color.sl = 50;

color.sl = -50;
color.sl === 0;						// true
color.sl = 150;
color.sl === 100;					// true
```

#### a/alpha

接收数字及百分比，范围为0 ~ 1。小于0置为0，大于1置为1。

```js
var color = easycolor('red');
color.a === 1;						// true
color.a = 0.5;
color.a = '50%';

color.a = -1;
color.a === 0;						// true
color.a = 50;
color.a === 1;						// true
```

### 转换为字符串

#### toString

若输出类型为`keyword`，但该颜色值不为任意css keyword颜色，则按`hex`类型输出
若输出类型为`transparent`，但`alpha`不为`0`，则按`hex`类型输出
若输出类型为`hex`，但`alpha`不为`1`，则按`rgb`类型输出

```js
var transparent = easycolor('transparent');
transparent.toString();					// 'transparent'
transparent.a = .5;
transparent.toString();					// 'rgba(0,0,0,0.5)'

var keyword1 = easycolor('silver');
var keyword2 = easycolor('silver');
keyword1.toString();					// 'silver'
keyword1.r = 100;
keyword1.toString();					// '#64c0c0'
keyword2.a = .2;
keyword2.toString();					// 'rgba(192,192,192,0.2)'

var rgb = easycolor('rgb(100,100,100)');
rgb.toString();						// '#646464'

var hsl = easycolor('hsl(100,50%,50%)');
hsl.toString();						// 'hsl(100,50%,50%)'

var hsv = easycolor('hsv(100,50%,50%)');
hsv.toString();						// 'hsv(100,50%,50%)'

var hex = easycolor('#abc');
hex.toString();						// '#aabbcc'
hex.a = .2;
hex.toString();						// 'rgba(170,187,204,0.2)'
easycolor('#0003');					// 'rgba(0, 0, 0, .2)'
```

#### toRgbString

输出时小数部分四舍五入。

```js
var rgb = easycolor('rgb(100,100,100)');
rgb.toRgbString();					// 'rgb(100,100,100)'
rgb.a = .2;
rgb.toRgbString();					// 'rgba(100,100,100,0.2)'

easycolor('rgb(100.1,200.5,133.6)').toRgbString()	// 'rgb(100,201,134)'
easycolor('#abc').toRgbString()				// 'rgb(170,187,204)'
```

#### toRgbPercentString

输出时小数部分保留3位。

```js
var rgbp = easycolor('rgb(20%,20%,20%)');
rgbp.toRgbPercentString();				// 'rgb(20%,20%,20%)'
rgbp.a = .2;
rgbp.toRgbPercentString();				// 'rgba(20%,20%,20%,0.2)'

easycolor('rgb(20.0001%,20.001%,20.50000%)').toRgbPercentString();	// 'rgb(20%,20.001%,20.5%)'
```

#### toHslString
输出时s, l小数部分保留3位。
```js
var hsl = easycolor('hsl(100,50%,50%)');
hsl.toHslString();					// 'hsl(100,50%,50%)'
hsl.a = .2;
hsl.toHslString();					// 'hsla(100,50%,50%,0.2)'

easycolor('hsl(100.0001,20.001%,20.50000%)').toHslString();	// 'hsl(100,20.001%,20.5%)'
```

#### toHsvString
```js
var hsv = easycolor('hsv(100,50%,50%)');
hsv.toHsvString();					// 'hsv(100,50%,50%)'
hsv.a = .2;
hsv.toHsvString();					// 'hsva(100,50%,50%,0.2)'

easycolor('hsv(100.0001,20.001%,20.50000%)').toHsvString();	// 'hsv(100,20.001%,20.5%)'
```

#### toHexString

输出时小数部分四舍五入。

```js
var hex = easycolor('#abc');
hex.toHexString();					// '#aabbcc'
hex.a = .2;
hex.toHexString();					// '#aabbcc33'
hex.r = 170.5;
hex.toHexString();					// '#abbbcc33'
hex.r = 170.4;
hex.toHexString();					// '#aabbcc33'
```

#### toKeyword
```js
var color = easycolor('silver');
color.toKeyword();					// 'silver'
color.r = 0;
color.toKeyword();					// ''
color.g = 0; color.b = 0;
color.toKeyword();					// 'black'
```

### Function

#### random

返回一个随机颜色的实例。

```js
var color = easycolor.random();
color.a === 1;						// always true
```

#### grayed

返回一个新的颜色，新颜色为原颜色对应的黑白色。

```js
var color = easycolor('orange');
color.grayed().toString();				// '#acacac'
```

#### inverting

返回一个新的颜色，新颜色为原颜色相反的颜色。

```js
var color = easycolor('rgba(20%,20%,20%,.2)');
color.inverting().toString()				// 'rgba(80%,80%,80%,0.2)'
```

#### interpolation

输入开始颜色和结束颜色，及数字n，返回长度为n的插值后的颜色数组。

```js
var start = easycolor('#0000');
var end = easycolor('#fff');

easycolor.interpolation(start, end, 4).join(',');	// 'rgba(0,0,0,0),rgba(85,85,85,0.333),rgba(170,170,170,0.667),#ffffff'
start.interpolation(end, 4).join(',');			// 'rgba(0,0,0,0),rgba(85,85,85,0.333),rgba(170,170,170,0.667),#ffffff'

easycolor.interpolation(start, end).join(',');		// ''
easycolor.interpolation(start, end, 1).join(',')	// 'rgba(0,0,0,0)'
```

#### interpolation2d

输入4个颜色（分别为左上，右上，左下，右下），及宽度和高度，返回插值后的二维颜色数组。

```js
var tl = easycolor('#000');
var tr = easycolor('#0f0');
var bl = easycolor('#f00');
var br = easycolor('#ff0');
var parseToString = function(arr) {
	return arr.map(function(item) { return item.join(','); }).join('|');
}

parseToString(easycolor.interpolation2d(tl, tr, bl, br, 4, 4));			// '#000000,#005500,#00aa00,#00ff00|#550000,#555500,#55aa00,#55ff00|#aa0000,#aa5500,#aaaa00,#aaff00|#ff0000,#ff5500,#ffaa00,#ffff00'
parseToString(tl.interpolation2d(tr, bl, br, 4, 4));				// '#000000,#005500,#00aa00,#00ff00|#550000,#555500,#55aa00,#55ff00|#aa0000,#aa5500,#aaaa00,#aaff00|#ff0000,#ff5500,#ffaa00,#ffff00'

parseToString(easycolor.interpolation2d(tl, tr, bl, br, 4, 1));			// '#000000,#555500,#aaaa00,#ffff00'
parseToString(easycolor.interpolation2d(tl, tr, bl, br, 1, 4));			// '#000000|#555500|#aaaa00|#ffff00'

var oneHAndOneW = easycolor.interpolation2d(tl, tr, bl, br, 1, 1);
parseToString(oneHAndOneW);							// '#000000'

parseToString(easycolor.interpolation2d(tl, tr, bl, br));			// ''
parseToString(easycolor.interpolation2d(tl, tr, bl, br, 0, 4));			// ''
parseToString(easycolor.interpolation2d(tl, tr, bl, br, 4, 0));			// ''
```

#### mixAlpha

输入前景色和背景色，返回两个颜色的透明度混合结果。

```js
easycolor.mixAlpha(easycolor('#000'), easycolor('#fff')).toString();		// '#000000'
easycolor.mixAlpha(easycolor('#f003'), easycolor('#0f0')).toString();		// '#33cc00'
easycolor.mixAlpha(easycolor('#f003'), easycolor('#0f0c')).toString();		// 'rgba(61,194,0,0.84)'
```

#### clone

返回一个新的颜色，与原颜色有相同的值。

```js
var color1 = easycolor('red');
var color2 = color1.clone();
color2.r = 100;
color1.toString()			// 'red'
color2.toString()			// '#640000'
```

## 开发

### 目录结构
```
|-- coverage
    |-- lcov-report		// 覆盖率报告
|-- test
    |-- test.js			// 测试用例
|-- easycolor.js			// 源代码
```

### 安装依赖
`npm install`

### 跑测试用例
`npm run test`

### 测试用例覆盖率
`npm run cover`

## 其它

### Todo

- [ ] 更多的function支持
- [ ] 模块拆分，使用rollup打包
- [ ] 翻译成英文
- [ ] 发布npm包

### 工作难度排序

1. 写文档
2. 写测试用例
3. 写代码
