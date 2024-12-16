/*
    自定義的預先處理功能

*/

// 出錯一次就停止
beforeEach(() => {
    cy.on('fail', (error) => {
        // 输出错误信息到控制台
        // alert(error.message);
        cy.screenshot();
        Cypress.runner.stop(); // 停止当前测试
    });
});
