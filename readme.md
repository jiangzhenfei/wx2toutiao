## 微信小程序迁移到头条小程序

1.下载当前的文件
```node
git clone https://github.com/jiangzhenfei/wx2toutiao.git
```
2.将wx2toutiao.js复制到你微信程序的app.json目录下
```html
    app.json
    wx2toutiao.js
    pages
        --index
        --mine
        ...
```
3.打开命令行执行如下命令
```node
node wx2toutiao.js
```
执行结束后已经将所有微信小程序的转成头条小程序了

#### 注意事项 由于并没有转ttss样式文件中引入其他的样式文件，导致引入报错，请手动把ttss引入其他的@import "color.wxss"等修改为 @import "color.ttss"

##### 微信小程序支持在wxml内部数据绑定中使用function,但是在头条小程序都是不支持的，以下类型都将导致程序报错
```html
<view>{{ (1) }}</view>
<view>{{ foo() }}</view>
<view>{{ a: function () {} }}</view>
<view tt:if="{{ a.indexOf('flag') > 2 }}"></view>
<view class='price'>{{m1.getRealCount(item.item.price)}}</view>
```
应该将所有的方法去掉，才会使得编译通过
