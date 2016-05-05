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
		required: true // 必填选项
	},{
		required: "Required."
	}
);

wdr.addField(
	$('field2'),{
		required: true,
		regular: 'email' //正则表达式验证
	},{
		required: "Required.",
		email: "Enter a valid Email."
	}
);

//ajax 验证
wdr.addField(
	$('field3'),{
		remote: '/some_url' //url
	},{
		remote: "ajax validator error."
	}
);

//自定义方法验证
wdr.addField(
	$('field4'),{
		customValidate: function($_fieldBase) {
			return $_fieldBase.val() == "";
		}
	},{
		customValidate: "custom function error."
	}
)

//提交
$('submitButton').on('click', function(){
	wdr.submit(function(){
		//验证成功执行
	});
});
```

## 初始化可配置项

名称 | 参数说明 |
----|---------|
regulars|{Object}配置全局使用的正则表达式验证|
fieldHooks|{Object}配置全局的钩子函数, `afterShowPopup`表示弹出提示框后执行, `afterHidePopup`表示隐藏提示框后执行|





