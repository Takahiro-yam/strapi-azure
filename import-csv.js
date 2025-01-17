const fs = require('fs');
const csv = require('csv-parser');
const axios = require('axios');

// Strapi API 設定
const STRAPI_URL = 'http://localhost:1337';
const API_TOKEN = '9b2079a61e696644c611ec5754759d22433e95c71cfcc4e2d8e0fbca09c534ad6940e8ec79d1cd3bac654458fb889b0d733fd07906eaa3fe01135163d1097aac80d26280038625f5ff02de099926f0ba8869a9394ee2d518cfb923cd98ac704275349e0fb8260c4d515acdfbc0e23292e595def1efe4a805e7f83fb9efb7ac79'; // ステップ1で取得したトークンをここに記入
const COLLECTION_ENDPOINT = '/api/retails'; // インポート対象のエンドポイント

// CSV ファイルパス
const CSV_FILE_PATH = 'C:\\Users\\takay\\Downloads\\pwc_product_master.csv';

const importCSV = async () => {
  const results = [];
  fs.createReadStream(CSV_FILE_PATH)
    .pipe(csv())
    .on('data', (data) => {
      // データ型を適切に変換
      const record = {
        product_id: data.product_id,
        category: data.category,
        product_name: data.product_name,
        price: parseFloat(data.price.trim()), // 数値型に変換
      };
      results.push(record);
    })
    .on('end', async () => {
      for (const record of results) {
        try {
          // Strapi API にデータを送信
          await axios.post(
            `${STRAPI_URL}${COLLECTION_ENDPOINT}`,
            { data: record },
            { headers: { Authorization: `Bearer ${API_TOKEN}` } }
          );
          console.log('Imported:', record);
        } catch (error) {
          console.error('Error importing:', record, error.response?.data || error.message);
        }
      }
    });
};

importCSV();