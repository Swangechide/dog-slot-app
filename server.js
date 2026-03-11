const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3000;

app.use(express.static('public'));

// Dog CEO APIで使える犬種リスト
const BREED_LIST = [
    'shiba',      // 柴犬
    //'akita',      // 秋田犬
    //'beagle',     // ビーグル
    //'pug',        // パグ
    //'husky',      // ハスキー
    //'retriever',  // レトリバー
    'corgi',      // コーギー
    'borzoi',     // ボルゾイ
    //'pitbull',    // ピットブル
    'poodle'      // プードル
];

app.get('/api/spin', async (req, res) => {
    try {
        const targetBreeds = [];
        for (let i = 0; i < 3; i++) {
            const idx = Math.floor(Math.random() * BREED_LIST.length);
            targetBreeds.push(BREED_LIST[idx]);
        }

        const isWin = targetBreeds.every(b => b === targetBreeds[0]);       

        const requests = targetBreeds.map(breed => {
            return axios.get(`https://dog.ceo/api/breed/${breed}/images/random`);
        });

        const responses = await Promise.all(requests);

        const results = responses.map((response) => {
            const imageUrl = response.data.message;
            const breedNameFromUrl = imageUrl.split('/')[4]; 

            return {
                imageUrl: imageUrl,
                breedName: breedNameFromUrl
            };
        });

        res.json({
            success: true,
            isWin: isWin,
            results: results,
            breedList: BREED_LIST //フロントエンドに今の犬種一覧を教える
        });

    } catch (error) {
        console.error("API Error:", error.message);
        res.status(500).json({ success: false, message: 'エラーが発生しました' });
    }
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`サーバー起動: http://localhost:${PORT}`);
    });
}
module.exports = app;