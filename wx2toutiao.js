var fs = require('fs');
var path = require('path');


// 把所有的后缀都改成ttss以及ttml
function fileDisply( filePath ){
    fs.readdir(filePath,function(err,files){
        if(err){
            console.warn(err)
        }else{
            //遍历读取到的文件列表
            files.forEach(function(filename){
                //获取当前文件的绝对路径
                var filedir = path.join(filePath,filename);
                //根据文件路径获取文件信息，返回一个fs.Stats对象
                fs.stat(filedir,function(eror,stats){
                    if(eror){
                        console.warn('获取文件stats失败');
                    }else{
                        var isFile = stats.isFile();//是文件
                        var isDir = stats.isDirectory();//是文件夹
                        if(isFile){
                            var regcss = /(wxss)$/;
                            var regswan = /(wxml)$/
                            var regjs = /(js)$/
                            
                            //如果是wxss则转成ttss
                            if( regcss.test( filedir ) ){
                                let newPath = filedir.replace(regcss,'ttss');
                                reNameFile( filedir, newPath )
                            }
                            //如果是swan的文件转成ttml
                            if( regswan.test( filedir ) ){
                                let newPath = filedir.replace(regswan,'ttml');
                                /* 在修改好文件内容后执行的回调函数，修改文件名 */
                                let callback = function(){
                                    reNameFile( filedir, newPath )
                                }
                                /* 在修改好文件内容后执行的回调函数，修改文件名 */
                                amendText( filedir, callback )
                            }
                            //如果是js文件则将所有的swan转成tt
                            if( regjs.test( filedir ) ){
                                amendSwanToTT( filedir )
                            }
                        }
                        if(isDir){
                            fileDisply(filedir);//递归，如果是文件夹，就继续遍历该文件夹下面的文件
                        }
                    }
                })
            })
        }
    })
}

fileDisply( path.resolve( __dirname ))

/**
 * 新的文件路径代替旧的文件路径，如果只是修改可后缀，那么相当于修改文件类型
 * @param {旧的文件路径} path 
 * @param {新文件路径} newPath 
 */
function reNameFile( path,newPath ){
    fs.rename( path, newPath, function(err){
        if(err){
            console.error(err);
            return;
        }
    })
}

/**
 * 修改文件内容
 * @param {需要修改内容的文件} path 
 * @param {文件修改好需要执行的回调} callback 
 */
function amendText( path ,callback){
    fs.readFile(path,'utf8',function(err,files){
        console.log(err,files)
        var result = files.replace(/wx:for/g,'tt:for').replace(/wx:if/g,'tt:if').replace(/wx:for-item/g,'tt:for-item').replace(/wx:for-index/,'tt:for-index').replace(/wx:key/,'tt:key');
        //var result = files.replace(/s-if/g,'tt:if');
        
        fs.writeFile( path, result, 'utf8', function (err) {
            if (err) return console.log(err);
            callback() 
        });
    
    })
}

/**
 * 修改js中的wx全局变量改为tt
 * @param {需要修改的文件} path 
 */
function amendSwanToTT( path ){
    fs.readFile(path,'utf8',function(err,files){
        console.log(err,files)
        var result = files.replace(/wx\./g,'tt.');
        fs.writeFile( path, result, 'utf8', function (err) {
            if (err) return console.log(err);
        });
    
    })
}

   