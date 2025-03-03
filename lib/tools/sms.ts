import { XMLParser } from 'fast-xml-parser'
import { SMS_CONFIG } from '../config/sms'

// XML 解析器
const parser = new XMLParser()

// 发送短信参数
interface SendSMSParams {
    mobile: string | string[]  // 支持单个或多个手机号
    content: string
    sendTime?: string    // 定时发送时间，格式：2024-03-21 10:00:00
    extno?: string      // 扩展子号，最多5位数字
}

// 发送结果
interface SendResult {
    success: boolean
    message: string
    remainpoint?: number  // 剩余点数
    taskID?: string      // 任务ID
    successCounts?: number // 成功发送数量
}

/**
 * 发送短信
 */
export async function sendSMS(params: SendSMSParams): Promise<SendResult> {
    const { mobile, content, sendTime = '', extno = '' } = params


    const mobileStr = Array.isArray(mobile) ? mobile.join(',') : mobile
    console.log(mobileStr, content)

    // 模拟发送成功
    return {
        success: true,
        message: '发送成功',
        remainpoint: 1,
        taskID: "1",
        successCounts: 1
    }
    // try {
    //     const response = await fetch(`${SMS_CONFIG.baseUrl}/sms.aspx`, {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/x-www-form-urlencoded'
    //         },
    //         body: new URLSearchParams({
    //             action: 'send',
    //             userid: SMS_CONFIG.userid,
    //             account: SMS_CONFIG.account,
    //             password: SMS_CONFIG.password,
    //             mobile: mobileStr,
    //             content,
    //             sendTime,
    //             extno
    //         })
    //     })

    //     const xml = await response.text()
    //     const result = parser.parse(xml)
    //     const returnsms = result.returnsms

    //     return {
    //         success: returnsms.returnstatus === 'Success',
    //         message: returnsms.message,
    //         remainpoint: Number(returnsms.remainpoint),
    //         taskID: returnsms.taskID,
    //         successCounts: Number(returnsms.successCounts)
    //     }

    // } catch (error) {
    //     console.error('发送短信失败:', error)
    //     return {
    //         success: false,
    //         message: error instanceof Error ? error.message : '发送短信失败'
    //     }
    // }
}

/**
 * 发送短信验证码
 * @param params 发送参数
 */
export async function sendSmsCode(params: {
    mobile: string;
    templateId: string;
    params: {
        code: string;
        expireMinutes: string;
    }
}): Promise<SendResult> {
    const { mobile, templateId, params: smsParams } = params;
    
    // 构建短信内容（实际应用中会根据模板ID调用相应模板）
    // 这里简化处理，直接拼接内容
    const content = `您的验证码是：${smsParams.code}，${smsParams.expireMinutes}分钟内有效，请勿泄露给他人。`;
    
    // 调用发送短信的基础函数
    return await sendSMS({
        mobile,
        content
    });
}

/**
 * 查询账户余额
 */
export async function queryBalance() {
    try {
        const response = await fetch(`${SMS_CONFIG.baseUrl}/sms.aspx`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                action: 'overage',
                userid: SMS_CONFIG.userid,
                account: SMS_CONFIG.account,
                password: SMS_CONFIG.password
            })
        })

        const xml = await response.text()
        const result = parser.parse(xml)
        const returnsms = result.returnsms

        return {
            success: returnsms.returnstatus === 'Success',
            payinfo: returnsms.payinfo,
            overage: Number(returnsms.overage),
            sendTotal: Number(returnsms.sendTotal)
        }
    } catch (error) {
        console.error('查询余额失败:', error)
        return {
            success: false,
            message: error instanceof Error ? error.message : '查询余额失败'
        }
    }
}

/**
 * 检查短信内容是否包含非法关键词
 */
export async function checkKeyword(content: string) {
    try {
        const response = await fetch(`${SMS_CONFIG.baseUrl}/sms.aspx`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                action: 'checkkeyword',
                userid: SMS_CONFIG.userid,
                account: SMS_CONFIG.account,
                password: SMS_CONFIG.password,
                content
            })
        })

        const xml = await response.text()
        const result = parser.parse(xml)

        return {
            success: true,
            hasIllegal: result.returnsms.message.includes('包含非法字符')
        }
    } catch (error) {
        console.error('检查关键词失败:', error)
        return {
            success: false,
            message: error instanceof Error ? error.message : '检查关键词失败'
        }
    }
} 