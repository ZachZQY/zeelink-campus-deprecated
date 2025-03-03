import * as qiniu from 'qiniu';
import { uploadTokenConfig, downloadPathConfig } from '../config/qiniu';


// 创建鉴权对象
const mac = new qiniu.auth.digest.Mac(uploadTokenConfig.accessKey, uploadTokenConfig.secretKey);


// 获取上传凭证
export function getUploadToken(key: string) {
    const putPolicy = new qiniu.rs.PutPolicy({
        scope: `${uploadTokenConfig.bucket}:${key}`,
        expires: 3600
    });
    return putPolicy.uploadToken(mac);
}

// 生成唯一的文件名
export function generateKey(filename: string, basePath: string = downloadPathConfig.basePath) {
    const ext = filename.split('.').pop();
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `${basePath}/${timestamp}-${random}.${ext}`;
}




// 上传单个文件
export async function uploadFile(file: File, basePath: string = downloadPathConfig.basePath): Promise<string> {
    // 生成文件名和上传凭证
    const key = generateKey(file.name, basePath)
    const token = getUploadToken(key)

    // 转换文件为 Buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // 配置上传
    const config = new qiniu.conf.Config()
    config.zone = null

    const formUploader = new qiniu.form_up.FormUploader(config)
    const putExtra = new qiniu.form_up.PutExtra()

    return new Promise((resolve, reject) => {
        formUploader.put(token, key, buffer, putExtra, (err, body, info) => {
            if (err) {
                console.error('上传失败:', err)
                reject(new Error('上传失败'))
                return
            }

            if (info.statusCode === 200) {
                resolve(key)
            } else {
                reject(new Error(`上传失败: ${info.statusCode}`))
            }
        })
    })
}

// 批量上传文件
export async function uploadFiles(files: File[], basePath: string = "") {
    const results = await Promise.all(files.map(file => uploadFile(file, basePath)))
    return results
}


