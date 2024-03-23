export default {
    genApiKey() {

        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let key = '';
        const keyLength = 29; // 设置 API 密钥长度

        for (let i = 0; i < keyLength; i++) {
            key += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return "br-" + key;

    }
}