const spinBtn = document.getElementById('spin-btn');
const message = document.getElementById('result-message');

const images = [
    document.getElementById('img1'),
    document.getElementById('img2'),
    document.getElementById('img3')
];
const names = [
    document.getElementById('name1'),
    document.getElementById('name2'),
    document.getElementById('name3')
];

// カウンターのデータを保持する変数
let winCounts = {};
let isCounterInitialized = false;

spinBtn.addEventListener('click', async () => {
    spinBtn.disabled = true;
    message.textContent = "抽選中...";
    message.className = "message";
    
    names.forEach(el => el.textContent = "???");

    try {
        const response = await fetch('/api/spin');
        const data = await response.json();

        if (data.success) {
            
            // 初回の1回目だけ、サーバーから届いた犬種リストを使ってカウンターを「0」で作る
            if (!isCounterInitialized && data.breedList) {
                const countsContainer = document.getElementById('win-counts');
                data.breedList.forEach(breed => {
                    winCounts[breed] = 0; // データを0にセット
                    const li = document.createElement('li'); // HTMLのリスト(li)を作る
                    li.id = `count-${breed}`;
                    li.textContent = `${breed}：0`;
                    countsContainer.appendChild(li);
                });
                isCounterInitialized = true;
            }

            data.results.forEach((result, index) => {
                images[index].src = result.imageUrl;
                names[index].textContent = result.breedName;
            });

            if (data.isWin) {
                // 当たった犬種のカウントを増やす
                const winner = data.results[0].breedName;
                if (winCounts[winner] !== undefined) {
                    winCounts[winner]++; // +1する
                    // 画面の数字を更新
                    document.getElementById(`count-${winner}`).textContent = `${winner}：${winCounts[winner]}`;
                }

                message.innerHTML = `🔥❤️‍🔥🐶 大当たりだワン 🐶❤️‍🔥🔥`;
                message.classList.add("win", "rainbow");
            } else {
                message.textContent = "はずれだワン";
            }
        }
    } catch (error) {
        console.error(error);
        message.textContent = "エラーが発生しました";
    } finally {
        spinBtn.disabled = false;
    }
});