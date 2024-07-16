/* eslint-disable cypress/unsafe-to-chain-command */
/* eslint-disable cypress/no-unnecessary-waiting */
/* eslint-disable cypress/no-assigning-return-values */
import testData from '../../fixtures/0.0.0-sample.json';
import { solver } from '../CAPTCHAsolver';

var longSleep = 3000;

var newRecord = true; // 新增 or 修改
var editOrderNo = 1;
var mainStep = 1; // 大步驟, 修改才有用
/**
 * 1-資料輸入
 * 2-文件預覽
 * 3-電子簽名
 * 4-上傳文件
 * 5-確認投保
 */

var step = 1; // 資料輸入 的 小步驟, 修改才有用
/**
 * 1-被保險人
 * 2-要保人
 * 3-風險屬性
 * 4-保險種類
 * 5-要保人帳戶
 * 6-自動墊繳
 * 7-受益人
 * 8-告知事項
 * 9-重要事項
 * 10-客戶投保權益 FATCA CRS
 * 11-W-8BEN
 * 12-CRS自我證明
 * 13-審閱期
 * 14-業務員
 * 15-財務狀況告知書
 * 16-業務員核保報告書
 * 17-疾病問卷
 * 18-已做完又重新回來
 */

describe('輸入測試', () => {
  it('登入', () => {
    cy.visit('https://mposuat.transglobe.com.tw/mbis/#/login')
    cy.get('#uname').type('B113199214');
    cy.get('#pin').type('123456');
    solver();
    cy.get('.btn').click().wait(longSleep)
    cy.visit('https://mposuat.transglobe.com.tw/mbis/#/application/fillforms')
  })

  it('新增行動投保', () => {
    if (newRecord) {
      mainStep = 1;
      step = 1;
      cy.get('.order-lg-1 > .card > .card-body > :nth-child(1) > :nth-child(1) > .me-2 > .row > a > .avatar-md > .avatar-title').click({ force: true })
    }
  })

  it('修改 行動投保', () => {
    if (!newRecord) {
      cy.get(':nth-child(' + editOrderNo + ') > :nth-child(6) > :nth-child(1) > .ri-edit-2-line').click({ force: true })

      cy.isElementExist('app-normal-dialog > div > .btn-primary').then((isExist) => {
        if (isExist) {
          cy.get('app-normal-dialog > div > .btn-primary').click();
        }
      })
    }
  })

  context('資料輸入', () => {
    if (mainStep > 1)
      return;

    it('被保險人', () => {
      if (step > 1)
        return;

      // 網路太慢
      cy.wait(3000)

      // 同意書
      cy.isElementExist('app-preview-dialog > .modal-footer > .row > div > button.btn-success').then((isExist) => {
        cy.get('app-preview-dialog > .modal-body').scrollTo('bottom', { easing: 'linear', duration: 500 }).click();
        if (isExist) {
          cy.get('app-preview-dialog > .modal-footer > .row > div > button.btn-success').click({ force: true });
        }
      });

      cy.get('input[name="baseInfoName"]').type(testData.insured.baseInfoName);
      cy.get('input[name="baseInfoGender"]').first().click();
      cy.get('input[name="baseInfoPersonId"]').type(testData.insured.baseInfoPersonId);
      cy.get('input[name="baseInfoRomanName"]').type(testData.insured.baseInfoName);

      // 日期(切換成成年日期)
      cy.get('.mat-datepicker-input').type(testData.insured.baseInfoBirthday);

      cy.get('select[name="baseInfoMarry"]').select(testData.insured.baseInfoMarry);
      cy.get('select[name="baseInfoNationality"]').select(testData.insured.baseInfoNationality);
      cy.get('input[name="serviceUnit"]').type(testData.insured.serviceUnit);
      cy.get('input[name="jobType"]').type(testData.insured.jobType);
      cy.get('input[name="workDetail"]').type(testData.insured.workDetail);
      cy.get('input[name="partTimeDetail"]').type(testData.insured.partTimeDetail);

      // 正職職業代碼 A101
      cy.get('button[name="jobInfoCareerFull"]').click();
      cy.get('button.btn-info').eq(0).click().wait(200);
      cy.get('tbody > :nth-child(1) > .align-items-center > .form-check-input').click();
      cy.get('.modal-footer > .btn').click();

      // 間職職業代碼 A102
      cy.get('button[name="parttimeJobOccupyFull"]').click();
      cy.get('button.btn-info').eq(0).click().wait(200);
      cy.get('tbody > :nth-child(1) > .align-items-center > .form-check-input').click();
      cy.get('.modal-footer > .btn').click();

      // 電話
      cy.get('input[name="phoneNumberLightArea"]').type(testData.insured.phoneNumberLightArea);
      cy.get('input[name="phoneNumberLight"]').type(testData.insured.phoneNumberLight);
      cy.get('input[name="phoneNumberLightExt"]').type(testData.insured.phoneNumberLightExt);
      cy.get('input[name="phoneNumberNightArea"]').type(testData.insured.phoneNumberNightArea);
      cy.get('input[name="phoneNumberNight"]').type(testData.insured.phoneNumberNight);
      cy.get('input[name="phoneNumberNightExt"]').type(testData.insured.phoneNumberNightExt);
      cy.get('select[name="cellphone"]').select(testData.insured.cellphone);
      cy.get('input[name="cellphoneNumberNation"]').type(testData.insured.cellphoneNumberNation).trigger('change');
      cy.get('input[name="cellphoneNumber"]').type(testData.insured.cellphoneNumber);

      // 地址
      cy.get('select[name="addCity"]').select(testData.insured.addCity);
      cy.get('select[name="addDistrict"]').select(testData.insured.addDistrict);
      cy.get('input[name="addressBar"]').type(testData.insured.addressBar);

      cy.get('input[name="emailLocal"]').type(testData.insured.emailLocal);
      cy.get('input[name="emailDomain"]').type(testData.insured.emailDomain);

      // finally
      cy.get('.page__content__btn > button.btn-danger').click();
      cy.get('.modal-footer > .btn-primary').click();

      step++;
    })
  })
})  