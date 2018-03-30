# i-simulator cli工具
该工具主要完成三个功能
1. 交互式选择IOS模拟器
2. 自动安装所需app，
3. 根据所需要的协议打开页面
 
## 必要条件
请确保你的mac安装了xcode
 
## 使用方法
### 安装工具
```
$ npm i i-simulator -g
```
### 初始化配置

```
$ i-simulator config
? input you appname BaiduBoxApp
? download app url http://xxx.xxx.com/BaiduBoxApp.zip
? open schema header baiduboxapp://
```

### 安装 BaiduBoxApp
```
$ i-simulator init
```
 
### 打开url
```
$ i-simulator open
```
 
## Tips
1. 如果app下载速度较慢，建议单独下载，下载后移动至 ~/.ios-simulator， 如果没有该目录，请手动创建
2. 同时，如果觉得config配置命令麻烦，可以将 ios-simulator.config.json 放至~/.ios-simulator


## Last
该工具的功能还比较初级，还有许多可以扩展的地方，欢迎加入一起开发。