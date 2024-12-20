/*
    自定義的預先處理功能

*/

// 出錯一次就停止
beforeEach(() => {
    cy.on('fail', (error) => {
        console.log(error.message); // 输出错误信息到控制台
        Cypress.runner.stop(); // 停止当前测试
        throw error; // 斷言故意失敗, 輸出(X)
    });
});
