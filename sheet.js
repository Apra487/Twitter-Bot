const { GoogleSpreadsheet } = require('google-spreadsheet');

module.exports = class Sheet {
    constructor() {
        this.doc = new GoogleSpreadsheet(process.env.SHEET_ID);

    }
    async load() {
        await this.doc.useServiceAccountAuth({
              client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
              private_key: process.env.GOOGLE_PRIVATE_KEY,
        });
        // * load directly from json file if not in secure environment
        // await this.doc.useServiceAccountAuth(require('./credentials.json'));
        await this.doc.loadInfo(); // * loads document properties and worksheets
    }
    async addRows(rows) {
        const sheet = this.doc.sheetsByIndex[0];
        await sheet.addRows(rows);
    }
    async getRows() {
        const sheet = this.doc.sheetsByIndex[0];
        return await sheet.getRows();
    }
}
