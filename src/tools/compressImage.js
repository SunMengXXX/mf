// base64图片转file的方法（base64图片, 设置生成file的文件名）
export function base64ToFile(base64, fileName) {
  // 将base64按照 , 进行分割 将前缀  与后续内容分隔开
  let data = base64.split(",");
  // 利用正则表达式 从前缀中获取图片的类型信息（image/png、image/jpeg、image/webp等）
  let type = data[0].match(/:(.*?);/)[1];
  // 从图片的类型信息中 获取具体的文件格式后缀（png、jpeg、webp）
  let suffix = type.split("/")[1];
  // 使用atob()对base64数据进行解码  结果是一个文件数据流 以字符串的格式输出
  const bstr = window.atob(data[1]);
  // 获取解码结果字符串的长度
  let n = bstr.length;
  // 根据解码结果字符串的长度创建一个等长的整形数字数组
  // 但在创建时 所有元素初始值都为 0
  const u8arr = new Uint8Array(n);
  // 将整形数组的每个元素填充为解码结果字符串对应位置字符的UTF-16 编码单元
  while (n--) {
    // charCodeAt()：获取给定索引处字符对应的 UTF-16 代码单元
    u8arr[n] = bstr.charCodeAt(n);
  }
  // 利用构造函数创建File文件对象
  // new File(bits, name, options)
  const file = new File([u8arr], `${fileName}.${suffix}`, {
    type: type,
  });
  // 将File文件对象返回给方法的调用者
  return file;
}
// 将base64转换为blob
export function convertBase64UrlToBlob(urlData) {
  var arr = urlData.split(',')
  var mime = arr[0].match(/:(.*?);/)[1]
  var bstr = window.atob(arr[1])
  var n = bstr.length
  var u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new Blob([u8arr], { type: mime })
}
// 压缩图片
export function compressImage(path, config) {
  return new Promise((resolve, reject) => {
    var img = new Image()
    img.src = path
    img.onload = function () {
      var that = this
      var w = that.width
      var h = that.height
      var scale = w / h
      w = config.width || config.height * scale
      h = config.height || config.width / scale
      var quality = 0.7 // 默认图片质量为0.7
      // 生成canvas
      var canvas = document.createElement('canvas')
      var ctx = canvas.getContext('2d')
      // 创建属性节点
      var anw = document.createAttribute('width')
      anw.nodeValue = w
      var anh = document.createAttribute('height')
      anh.nodeValue = h
      canvas.setAttributeNode(anw)
      canvas.setAttributeNode(anh)
      ctx.drawImage(that, 0, 0, w, h)
      if (config.quality && config.quality <= 1 && config.quality > 0) {
        quality = config.quality
      }
      var base64 = canvas.toDataURL('image/*', quality)
      // var blob = convertBase64UrlToBlob(base64)
      // 回调函数返回base64的值，也可根据自己的需求返回blob的值
      resolve(base64)
    }
  })
}