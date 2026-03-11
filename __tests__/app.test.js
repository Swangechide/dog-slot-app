const request = require('supertest');
const app = require('../server'); // サーバーファイルを読み込む

describe('犬スロットAPIのテスト', () => {
    it('/api/spin にアクセスすると200 OKとJSONが返ってくる', async () => {
        const response = await request(app).get('/api/spin');
        
        // ステータスコードが200（成功）であること
        expect(response.statusCode).toBe(200);
        // successがtrueであること
        expect(response.body.success).toBe(true);
        // 結果の配列(results)が3つ含まれていること
        expect(response.body.results.length).toBe(3);
    });
});