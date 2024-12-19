/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

// 檢查元素在不在, true=在
Cypress.Commands.add('isElementExist', (element) => {
  cy.window().then(() => {
    const identifiedElement = Cypress.$(element)
    if (identifiedElement && identifiedElement.length > 0) {
      return true;
    }
    return false;
  });
})

// 迴圈
Cypress.Commands.add('recursionLoop', { times: 'optional' }, function (fn, times) {
  if (typeof times === 'undefined') {
    times = 0;
  }

  cy.then(() => {
    const result = fn(++times);
    if (result !== false) {
      cy.recursionLoop(fn, times);
    }
  });
});

// 迴圈按pdf下一頁
Cypress.Commands.add('pdfNextStepLoop', () => {
  var waitingTime = 300
  // 迴圈按 下一頁
  let needClick = true;
  cy.recursionLoop(times => {
      cy.wait(waitingTime);
      // 有滾輪
      cy.isElementExist('app-preview-dialog > .modal-body').then((isExist) => {
        if (isExist) {
          cy.get('app-preview-dialog > .modal-body').scrollTo('bottom', { easing: 'linear', duration: waitingTime }).click();     
              
          // 有關閉, 直接關閉結束
          cy.isElementExist('app-preview-dialog > .modal-footer > .row > div > .btn.btn-secondary').then((isExist) => {
            if (isExist) {
              cy.get('app-preview-dialog > .modal-footer > .row > div > .btn.btn-secondary').click();
              needClick = false;
            } else {
              // 有下一頁
              cy.isElementExist('app-preview-dialog > .modal-footer > .row > div > .btn.btn-primary').then((isExist) => {
                if (isExist) {
                  cy.get('app-preview-dialog > .modal-footer > .row > div > .btn.btn-primary').click();
                  needClick = true;
                } else {
                  cy.get('app-preview-dialog > .modal-footer > .row > div > .btn.btn-success').click();
                  needClick = false;
                }
              });
            }
          });
        }
      })
      
      return needClick;
  });
})

/* 
  尋找左邊工具列有沒有符合名稱的按鈕
  @return object-找到 null-沒找到
*/
Cypress.Commands.add('findLeftSideBar', (btnName) => {
  return cy.get('.page__sidebar-items').children().then(($children)=>{
    let found = null
    $children.each( (index, $el) => {
      if ($el.innerText.indexOf(btnName)>-1) {
        found = Cypress.$($el)
        return false
      }
    })
    return found
  })
})