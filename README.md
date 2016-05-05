# Walnut Validator
[![Join the chat at https://gitter.im/xiaojiangang/walnut-validator](https://badges.gitter.im/xiaojiangang/walnut-validator.svg)](https://gitter.im/xiaojiangang/walnut-validator?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

##介绍

Walnut Validator是一个表单验证插件，支持AMD,CMD,CommonJS方式加载。

有什么疑问可以在[issues](https://github.com/xiaojiangang/walnut-validator/issues)中提出。

##安装
##NPM

```
npm install walnut-validator
```
##头部引入

###AMD/CMD

```html
<script type="text/javascript" src="walnut-validator.min.js"></script>
```

###CommonJS

```html
<script type="text/javascript" src="walnut-validator.common.js"></script>
``` 

##使用方法

```javascript
var wdr = new WalnutValidator();
wdr.addField(
	$('field1'),{
		required: true
	},{
		required: "Required."
	}
);

wdr.addField(
	$('field2'),{
		required: true,
		regular: 'email'
	},{
		required: "Required.",
		email: "Enter a valid Email."
	}
);

//提交

$('submitButton').on('click', function(){
	wdr.submit(function(){
		//验证成功执行
	});
});
```




