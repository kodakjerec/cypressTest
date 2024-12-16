/* eslint-disable cypress/unsafe-to-chain-command */
/* eslint-disable cypress/no-unnecessary-waiting */
/* eslint-disable cypress/no-assigning-return-values */
import testData from '../../fixtures/2-UAT/0.0.0-sample.json';
import { solver } from '../../support/CAPTCHAsolver.js';

var longSleep = 1500;
var pdfWaiting = 300;

describe('輸入測試', () => {
    var newRecord = false; // 新增 or 修改
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
  it('登入', () => {
    cy.visit('/mbis2/#/login')
    cy.get('#uname').type('A134967300');
    cy.get('#pin').type('123456');
    solver();
    cy.get('.btn').click().wait(longSleep)
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

    let testConponentText = ''
    it('被保險人', () => {
        testConponentText = '被保險人'
        cy.findLeftSideBar(testConponentText).then((findItem) =>{
            if (!findItem) {
                // 同意書
                cy.isElementExist('app-preview-dialog > .modal-footer > .row > div > button.btn-success').then((isExist) => {
                    if (isExist) {
                    cy.pdfNextStepLoop();
                    
                    cy.get('app-preview-dialog > .modal-footer > .row > div > button.btn-success').click({ force: true });
                    }
                });

                cy.get('input[formcontrolname="baseInfoName"]').type(testData.insured.baseInfoName);
                cy.get('input[formcontrolname="baseInfoGender"]').first().click();
                cy.get('input[formcontrolname="baseInfoPersonId"]').type(testData.insured.baseInfoPersonId);
                cy.get('input[formcontrolname="baseInfoRomanName"]').type(testData.insured.baseInfoName);

                // 日期(切換成成年日期)
                cy.get('.mat-datepicker-input').type(testData.insured.baseInfoBirthday);

                cy.get('select[formcontrolname="baseInfoMarry"]').select(testData.insured.baseInfoMarry);
                if (testData.insured.baseInfoNationality=="中華民國")
                    cy.get('select[formcontrolname="baseInfoNationalIsROC"]').check();
                else
                    cy.get('select[formcontrolname="baseInfoNationality"]').select(testData.insured.baseInfoNationality);
                cy.get('input[formcontrolname="serviceUnit"]').type(testData.insured.serviceUnit);
                cy.get('input[formcontrolname="jobType"]').type(testData.insured.jobType);
                cy.get('input[formcontrolname="workDetail"]').type(testData.insured.workDetail);
                cy.get('input[formcontrolname="partTimeDetail"]').type(testData.insured.partTimeDetail);

                // 正職職業代碼 A101
                cy.get('button[formcontrolname="jobInfoCareerFull"]').click();
                cy.get('button.btn-info').eq(0).click().wait(200);
                cy.get('tbody > :nth-child(1) > .align-items-center > .form-check-input').click();
                cy.get('.modal-footer > .btn').click();

                // 間職職業代碼 A102
                cy.get('button[formcontrolname="parttimeJobOccupyFull"]').click();
                cy.get('button.btn-info').eq(0).click().wait(200);
                cy.get('tbody > :nth-child(1) > .align-items-center > .form-check-input').click();
                cy.get('.modal-footer > .btn').click();

                // 電話
                cy.get('input[formcontrolname="phoneNumberLightArea"]').type(testData.insured.phoneNumberLightArea);
                cy.get('input[formcontrolname="phoneNumberLight"]').type(testData.insured.phoneNumberLight);
                cy.get('input[formcontrolname="phoneNumberLightExt"]').type(testData.insured.phoneNumberLightExt);
                cy.get('input[formcontrolname="phoneNumberNightArea"]').type(testData.insured.phoneNumberNightArea);
                cy.get('input[formcontrolname="phoneNumberNight"]').type(testData.insured.phoneNumberNight);
                cy.get('input[formcontrolname="phoneNumberNightExt"]').type(testData.insured.phoneNumberNightExt);
                cy.get('select[formcontrolname="cellphone"]').select(testData.insured.cellphone);
                cy.get('input[formcontrolname="cellphoneNumberNation"]').type(testData.insured.cellphoneNumberNation).trigger('change');
                cy.get('input[formcontrolname="cellphoneNumber"]').type(testData.insured.cellphoneNumber);

                // 地址
                cy.get('select[formcontrolname="addCity"]').select(testData.insured.addCity);
                cy.get('select[formcontrolname="addDistrict"]').select(testData.insured.addDistrict);
                cy.get('input[formcontrolname="addressBar"]').type(testData.insured.addressBar);

                cy.get('input[formcontrolname="emailLocal"]').type(testData.insured.emailLocal);
                cy.get('input[formcontrolname="emailDomain"]').type(testData.insured.emailDomain);

                // finally
                cy.get('.page__content__btn > button.btn-danger').click();
                cy.get('.modal-footer > .btn-primary').click();
            } else {
                console.log(`${testConponentText} 已完成`)
            }
        })
    })

    it('要保人', () => {
        testConponentText = '要保人'
        cy.findLeftSideBar(testConponentText).then((findItem) =>{
            if (!findItem) {
                // ***** 以下為要保人輸入 *****
                cy.get('select[formcontrolname="relation"]').select(testData.proposer.relation);
                cy.get('input[formcontrolname="infoName"]').type(testData.proposer.infoName);
                cy.get('input[formcontrolname="infoGender"]').last().click();
                cy.get('input[formcontrolname="infoPersonId"]').type(testData.proposer.infoPersonId);
                cy.get('input[formcontrolname="romanName"]').type(testData.proposer.romanName);

                // 日期(切換成成年日期)
                cy.get('.mat-datepicker-input').type(testData.proposer.infoBirthday);

                // 國籍
                if (testData.proposer.infoNational=="中華民國")
                    cy.get('input[formcontrolname="infoNationalIsROC"]').check();
                else
                    cy.get('select[formcontrolname="infoNationalOtherDesc"]').select(testData.proposer.infoNational);
                cy.get('select[formcontrolname="infoMarry"]').select(testData.proposer.infoMarry);
                cy.get('input[formcontrolname="serviceUnit"]').type(testData.proposer.serviceUnit);
                cy.get('input[formcontrolname="jobType"]').type(testData.proposer.jobType);
                cy.get('input[formcontrolname="workDetail"]').type(testData.proposer.workDetail);
                cy.get('input[formcontrolname="partTimeDetail"]').type(testData.proposer.partTimeDetail);

                // 正職職業代碼 A101
                cy.get('button[formcontrolname="jobOccupyFull"]').click();
                cy.get('button.btn-info').eq(0).click().wait(200);
                cy.get('tbody > :nth-child(1) > .align-items-center > .form-check-input').click();
                cy.get('.modal-footer > .btn').click();

                // 間職職業代碼 A102
                cy.get('button[formcontrolname="parttimeJobOccupyFull"]').click();
                cy.get('button.btn-info').eq(0).click().wait(200);
                cy.get('tbody > :nth-child(1) > .align-items-center > .form-check-input').click();
                cy.get('.modal-footer > .btn').click();

                // 電話
                cy.get('select[formcontrolname="phoneLight"]').select(testData.proposer.phoneLight);
                cy.get('input[formcontrolname="phoneNumberLightArea"]').type(testData.proposer.phoneNumberLightArea);
                cy.get('input[formcontrolname="phoneNumberLight"]').type(testData.proposer.phoneNumberLight);
                cy.get('input[formcontrolname="phoneNumberLightExt"]').type(testData.proposer.phoneNumberLightExt);
                cy.get('select[formcontrolname="phoneNight"]').select(testData.proposer.phoneNight);
                cy.get('input[formcontrolname="phoneNumberNightArea"]').type(testData.proposer.phoneNumberNightArea);
                cy.get('input[formcontrolname="phoneNumberNight"]').type(testData.proposer.phoneNumberNight);
                cy.get('input[formcontrolname="phoneNumberNightExt"]').type(testData.proposer.phoneNumberNightExt);
                cy.get('select[formcontrolname="phoneCellphone"]').select(testData.proposer.phoneCellphone);
                cy.get('input[formcontrolname="cellphoneNumberNation"]').type(testData.proposer.cellphoneNumberNation).trigger('change');
                cy.get('input[formcontrolname="phoneCellphoneNumber"]').type(testData.proposer.phoneCellphoneNumber);

                // 地址
                cy.get('select[formcontrolname="addrCity"]').select(testData.proposer.addrCity);
                cy.get('select[formcontrolname="addrDistrict"]').select(testData.proposer.addrDistrict);
                cy.get('input[formcontrolname="addrAddress"]').type(testData.proposer.addrAddress);

                cy.get('input[formcontrolname="emailLocal"]').type(testData.proposer.emailLocal);
                cy.get('input[formcontrolname="emailDomain"]').type(testData.proposer.emailDomain);
                cy.get('input[formcontrolname="policyType"]').first().check();

                // 風險同意書
                cy.get('#pointer').click();
                cy.get('.col-10 > :nth-child(1) > .form-check-label').last().click();
                cy.get('.modal-footer > .btn').click();

                // finally
                cy.get('.page__content__btn > button.btn-danger').click();
                cy.get('.modal-footer > .btn-primary').click();
            } else {
                console.log(`${testConponentText} 已完成`)
            }
        })
    })

    it('風險屬性', () => {
        testConponentText = '風險屬性'
        cy.findLeftSideBar(testConponentText).then((findItem) =>{
            if (!findItem) {
                cy.get('#isInvestN').check();

                // finally
                cy.get('.page__content__btn > button.btn-danger').click();
            } else {
                console.log(`${testConponentText} 已完成`)
            }
        })
    })

    it('保險種類', () => {
        testConponentText = '保險種類'
        cy.findLeftSideBar(testConponentText).then((findItem) =>{
            if (!findItem) {

                // 點左邊選單, 等待系統讀取合約檔案
                cy.get(':nth-child(4) > .page__sidebar-btn').click().wait(longSleep);

                // 新增主約
                cy.contains('增加主約').parent().click().wait(shortSleep);
                cy.get('.mat-mdc-tab-labels').children().eq(0).click();
                cy.contains('QHD').parent().children().last().find('button.btn-info').click();
                cy.get('.input-group > :nth-child(1) > .form-control').type('150');
                cy.get('.modal-footer > .btn-primary').click();

                cy.get('#question_2_2').check();
                cy.get('#question_5_2').check();

                // finally
                cy.get('.page__content__btn > button.btn-danger').click().wait(shortSleep);
            } else {
                console.log(`${testConponentText} 已完成`)
            }
        })
    })

    it('要保人帳戶資料', () => {
        if (step > 5)
            return;

        cy.isElementExist('.row > :nth-child(2) > .btn').then((isExist) => {
            if (isExist) {
                cy.get('.row > :nth-child(2) > .btn').click();
                cy.get('.row > :nth-child(2) > .btn').click().wait(200);
            }
        })

        // 切換頁籤
        cy.get('.page__sidebar-items').find('.page__sidebar-item').eq((step - 1)).click();

        cy.get('select[formcontrolname="bankCode"]').select(testData.bank.bankCode);
        cy.get('select[formcontrolname="branchCode"]').select(testData.bank.branchCode);
        cy.get('input[formcontrolname="account"]').type(testData.bank.account);

        // finally
        cy.get('.page__content__btn > button.btn-danger').click().wait(shortSleep);
        step++;
    })

    it('自動墊繳', () => {
        if (step > 6)
            return;

        cy.get('#autoPayment_left0').click();
        cy.get('#payer_relations0_1').scrollIntoView().click();

        // finally
        cy.get('.page__content__btn > button.btn-danger').click().wait(shortSleep);
        step++;
    })

    it('受益人', () => {
        if (step > 7)
            return;

        // 切換頁籤
        cy.get('.page__sidebar-items').find('.page__sidebar-item').eq((step - 1)).click();


        cy.get('.mat-mdc-tab-labels').children().each(($tab) => {
            cy.get($tab).click().wait(100);

            // 身故保險金受益人
            cy.get('#cradio1dead' + $tab[0].innerText).check();
            cy.isElementExist('p:contains("身故保險金受益人")').then((isExist) => {
                if (isExist) {
                    cy.get('p:contains("身故保險金受益人")').parent().next().find('button.btn-primary').click();
                    cy.get('#isLegalFalse').check();
                    cy.get('select[formcontrolname="distribution"]').select(testData.beneficiary.distribution);
                    cy.get('input[formcontrolname="aveRatio"]').type(testData.beneficiary.aveRatio);
                    cy.get('select[formcontrolname="relationshipValue"]').select(testData.beneficiary.relationshipValue);
                    cy.get('input[formcontrolname="relationshipValueDesc"]').type(testData.beneficiary.relationshipValueDesc);
                    cy.get('input[formcontrolname="name"]').type(testData.beneficiary.name);
                    cy.get('input[formcontrolname="romanName"]').type(testData.beneficiary.romanName);
                    cy.get('input[formcontrolname="idNo"]').type(testData.beneficiary.idNo);
                    cy.get('select[formcontrolname="infoNational"]').select(testData.beneficiary.infoNational);
                    cy.get('.mat-datepicker-input').type(testData.beneficiary.birthday);
                    cy.get('select[formcontrolname="addrCity"]').select(testData.beneficiary.addrCity);
                    cy.get('select[formcontrolname="addrDistrict"]').select(testData.beneficiary.addrDistrict);
                    cy.get('input[formcontrolname="addrDesc"]').type(testData.beneficiary.addrDesc);
                    cy.get('input[formcontrolname="phoneArea"]').type(testData.beneficiary.phoneArea);
                    cy.get('input[formcontrolname="phoneNumber"]').type(testData.beneficiary.phoneNumber);
                    cy.get('input[formcontrolname="phoneExt"]').type(testData.beneficiary.phoneExt);
                    cy.get('input[formcontrolname="cellPhoneNumber"]').type(testData.beneficiary.cellPhoneNumber);
                    cy.get('input[formcontrolname="assignInsurance"]').type(testData.beneficiary.assignInsurance);
                    cy.get('input[formcontrolname="forPay"]').check();
                    cy.get('input[formcontrolname="quotaInsurance"]').type(testData.beneficiary.quotaInsurance);
                    cy.get('.btn-info').click();
                    cy.get('app-yes-no-dialog > .modal-footer > .btn-secondary').click();
                    cy.get('app-warning-dialog > .modal-footer > .btn-primary').click();
                }
            });

            // 祝壽保險金受益人
            cy.isElementExist('#cradio1birth' + $tab[0].innerText).then((isExist) => {
                if (isExist) {
                    cy.get('#cradio1birth' + $tab[0].innerText).check();
                }
            });

            cy.isElementExist('p:contains("滿期、祝壽保險金受益人")').then((isExist) => {
                if (isExist) {
                    cy.get('p:contains("滿期、祝壽保險金受益人")').parent().next().find('button.btn-primary').click();
                    cy.get('#isLegalFalse').check();
                    cy.get('select[formcontrolname="distribution"]').select(1);
                    cy.get('input[formcontrolname="aveRatio"]').type(testData.beneficiary.aveRatio);
                    cy.get('select[formcontrolname="relationshipValue"]').select(testData.beneficiary.relationshipValue);
                    cy.get('input[formcontrolname="relationshipValueDesc"]').type(testData.beneficiary.relationshipValueDesc);
                    cy.get('input[formcontrolname="name"]').type(testData.beneficiary.name);
                    cy.get('input[formcontrolname="romanName"]').type(testData.beneficiary.romanName);
                    cy.get('input[formcontrolname="idNo"]').type(testData.beneficiary.idNo);
                    cy.get('select[formcontrolname="infoNational"]').select(testData.beneficiary.infoNational);
                    cy.get('.mat-datepicker-input').type(testData.beneficiary.birthday);
                    cy.get('select[formcontrolname="financialData"]').select(testData.bank.bankCode);
                    cy.get('select[formcontrolname="branch"]').select(testData.bank.branchCode);
                    cy.get('input[formcontrolname="accountNumber"]').type(testData.bank.account);

                    cy.get('.btn-info').click();
                    cy.get('app-yes-no-dialog > .modal-footer > .btn-secondary').click();
                    cy.get('app-warning-dialog > .modal-footer > .btn-primary').click();
                }
            });
        });

        // finally
        cy.get('.page__content__btn > button.btn-danger').click().wait(shortSleep);
        step++;
    })

    it('告知事項', () => {
        if (step > 8)
            return;

        cy.isElementExist('input[formcontrolname="height"]').then((isExist) => {
            if (isExist) {
                cy.get('input[formcontrolname="height"]').type(testData.note.height);
                cy.get('input[formcontrolname="weight"]').type(testData.note.weight);
            }
        })

        // 答題
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 8; j++) {
                let elementNameY = 'input[id="' + i.toString() + '_' + j.toString() + '_Y"]';
                let elementNameN = 'input[id="' + i.toString() + '_' + j.toString() + '_N"]';
                let isExistY = cy.isElementExist(elementNameY);
                let isExistN = cy.isElementExist(elementNameN);
                isExistY.then((isExist) => {
                    if (isExist)
                        cy.get(elementNameY).check();
                })
                isExistN.then((isExist) => {
                    if (isExist)
                        cy.get(elementNameN).check();
                })
            }
        }

        // 新增病例
        cy.get('.col-md-2 > .btn').click();
        cy.get('input[formcontrolname="sickName"]').type(testData.sickInfoList.sickName);
        cy.get('input[formcontrolname="hospital"]').type(testData.sickInfoList.hospital);
        cy.get('input[formcontrolname="treatmentYear"]').type(testData.sickInfoList.treatmentYear);
        cy.get('input[formcontrolname="treatmentMonth"]').type(testData.sickInfoList.treatmentMonth);
        cy.get('input[formcontrolname="treatmentDay"]').type(testData.sickInfoList.treatmentDay);
        cy.get('input[formcontrolname="treatmentWay"]').type(testData.sickInfoList.treatmentWay);
        cy.get('input[formcontrolname="treatmentResults"]').type(testData.sickInfoList.treatmentResults);
        cy.get('.modal-footer > :nth-child(2)').click();

        // finally
        cy.get('.page__content__btn > button.btn-danger').click().wait(shortSleep);
        step++;
    })

    it('重要事項', () => {
        if (step > 9)
            return;

        // 同意書
        cy.isElementExist('.btn-success.w-70').then((isExist) => {
            if (isExist)
                cy.get('.btn-success.w-70').click();
        })

        // 全民健保
        cy.isElementExist('input[formcontrolname="healthInsured"]').then((isExist) => {
            if (isExist) {
                cy.get('input[formcontrolname="healthInsured"]').first().click();
                cy.get('input[formcontrolname="confirm"]').click();
            }
        })

        // 重新閱讀
        cy.get('.mb-3 > .d-grid > .btn').click();
        cy.get('button.btn-primary.w-70').contains('下一頁').click();
        cy.get('button.btn-primary.w-70').contains('下一頁').click();
        cy.get('button.btn-secondary.w-70').contains('關閉').click();

        // YES
        cy.get('.col-lg-12 > .d-grid > :nth-child(1)').click();

        // finally
        cy.get('.page__content__btn > button.btn-danger').click().wait(shortSleep);
        step++;
    })

    it('客戶投保權益 FATCA CRS', () => {
        if (step > 10)
            return;

        cy.get('#rightOneY').check();
        cy.get('#rightTwoY').check();
        cy.get('#rightThreeY').check();
        cy.get('#rightFourY').check();
        cy.get('#rightFiveY').check();

        // 法定代理人
        cy.isElementExist('#samePropser').then((isExist) => {
            if (isExist) {
                cy.get('#samePropser').check();
                cy.get('input[formcontrolname="name"]').type(testData.proposer.infoName);
                cy.get('input[formcontrolname="legalRepreRomanName"]').type(testData.proposer.romanName);
                cy.get('.mat-datepicker-input').type(testData.proposer.infoBirthday);
                cy.get('input[formcontrolname="legalRepresentativePersonId"]').type(testData.proposer.infoPersonId);
            }
        })

        // FATCA
        cy.get('#fatcaOptionB').check();
        cy.get('#fatcaBOption1').check();

        // CRS
        cy.get('#crsOptionB').check();

        // finally
        cy.get('.page__content__btn > button.btn-danger').click().wait(shortSleep);
        step++;
    })

    it('W-8BEN', () => {
        if (step > 11)
            return;

        cy.get('input[formcontrolname="name"]').type(testData.insured.baseInfoRomanName);
        cy.get('select[formcontrolname="nationality"]').select(testData.insured.baseInfoNationality);
        cy.get('input[formcontrolname="addr"]').type(testData.insured.engAddress);
        cy.get('input[formcontrolname="city"]').type(testData.insured.engCity);
        cy.get('select[formcontrolname="country"]').select(testData.insured.baseInfoNationality);
        cy.get('input[formcontrolname="diffAddr"]').type(testData.insured.engAddress);
        cy.get('input[formcontrolname="diffCity"]').type(testData.insured.engCity);
        cy.get('select[formcontrolname="diffCountry"]').select(testData.insured.baseInfoNationality);
        // 美國納稅人稅籍號碼
        cy.get('input[formcontrolname="taxNumbere"]').type(testData.insured.taxNumbere);
        cy.get('input[formcontrolname="foreignTaxNumber"]').type(testData.insured.foreignTaxNumber);
        cy.get('input[formcontrolname="referNumber"]').type(testData.insured.referNumber);
        cy.get('.mat-datepicker-input').type(testData.proposer.infoBirthday);
        // 租稅協定優惠
        cy.get('select[formcontrolname="beneficialCountry"]').select(testData.insured.baseInfoNationality);
        cy.get('input[formcontrolname="paragraph"]').type(testData.insured.paragraph);
        cy.get('input[formcontrolname="rate"]').type(testData.insured.rate);
        cy.get('input[formcontrolname="incomeType"]').type(testData.insured.incomeType);
        cy.get('input[formcontrolname="conditions"]').type(testData.insured.conditions);

        // finally
        cy.get('.page__content__btn > button.btn-danger').click().wait(shortSleep);
        step++;
    })

    it('CRS自我證明', () => {
        if (step > 12)
            return;

        // 重要提示
        cy.get('.d-flex > .btn').click();
        cy.get('.modal-footer > .btn').click();
        // 個人帳戶
        cy.get('input[formcontrolname="lastName"]').type(testData.insured.lastName);
        cy.get('input[formcontrolname="firstName"]').type(testData.insured.firstName);
        cy.get('input[formcontrolname="middleName"]').type(testData.insured.middleName);
        cy.get('.mat-datepicker-input').type(testData.proposer.infoBirthday);
        // 現行地址
        cy.get('input[formcontrolname="currentAddress"]').type(testData.insured.engAddress);
        cy.get('input[formcontrolname="currentCity"]').type(testData.insured.engCity);
        cy.get('select[formcontrolname="currentCountry"]').select(testData.insured.baseInfoNationality);
        cy.get('input[formcontrolname="currentZip"]').type(testData.insured.zip);
        // 通訊地址
        cy.get('input[formcontrolname="address"]').type(testData.insured.engAddress);
        cy.get('input[formcontrolname="city"]').type(testData.insured.engCity);
        cy.get('select[formcontrolname="country"]').select(testData.insured.baseInfoNationality);
        cy.get('input[formcontrolname="zip"]').type(testData.insured.zip);
        // 出生地
        cy.get('input[formcontrolname="birthCity"]').type(testData.insured.engCity);
        cy.get('select[formcontrolname="birthCountry"]').select(testData.insured.baseInfoNationality);
        // 稅務識別碼
        cy.get('.text-primary > .btn').click();
        cy.get('select[formcontrolname="liveCountry"]').select(testData.insured.baseInfoNationality);
        cy.get('input[formcontrolname="tin"]').type(testData.proposer.infoPersonId);
        cy.get('.modal-footer > .btn-info').click();

        cy.get('.text-primary > .btn').click();
        cy.get('select[formcontrolname="liveCountry"]').select(testData.insured.liveCountry);
        cy.get('input[formcontrolname="tin"]').type(testData.proposer.infoPersonId);
        cy.get('.modal-footer > .btn-info').click();

        // finally
        cy.get('.page__content__btn > button.btn-danger').click().wait(shortSleep);
        step++;
    })

    it('審閱期聲明', () => {
        if (step > 13)
            return;

        cy.get('.mat-mdc-tab-labels').children().each(($tab) => {
            cy.get($tab).click().wait(100);

            cy.get(':nth-child(1) > .form-check > .form-check-label').click();
            cy.get('.mat-datepicker-input').type('1130510');
        });

        // finally
        cy.get('.page__content__btn > button.btn-danger').click().wait(shortSleep);
        step++;
    })

    it('業務員', () => {
        if (step > 14)
            return;

        cy.get('input[formcontrolname="commiAgentCode2"]').type(testData.agent.agentCode2);
        cy.get('label[for="assignRate2"]').click().wait(500);

        // finally
        cy.get('.page__content__btn > button.btn-danger').click();
        step++;
    })

    it('財務狀況告知書', () => {
        if (step > 15)
            return;
        var count = 0;
        cy.get('.mdc-tab').each(($tab) => {
            cy.get($tab).click().wait(100);

            // 財務狀況
            cy.get('input[formcontrolname="yearIncome"]').type(testData.financial.yearIncome);
            cy.get('input[formcontrolname="otherIncome"]').type(testData.financial.otherIncome);
            cy.get('input[formcontrolname="familyIncome"]').type(testData.financial.familyIncome);
            cy.get('input[formcontrolname="deposit"]').type(testData.financial.deposit);
            cy.get('input[formcontrolname="bankName"]').type(testData.financial.bankName);
            cy.get('input[formcontrolname="movableProperty"]').type(testData.financial.movableProperty);
            // 不動產
            cy.get('input[formcontrolname="estate"]').type(testData.financial.estate);
            cy.get('input[formcontrolname="local"]').type(testData.insured.engAddress);
            cy.get('input[formcontrolname="ping"]').type(testData.financial.ping);
            // 負債
            cy.get('input[formcontrolname="borrowing"]').type(testData.financial.borrowing);
            cy.get('input[formcontrolname="borrowType"]').type(testData.financial.borrowType);

            if (count == 1) {
                cy.get('input[formcontrolname="insuranceFeeSources1"]').check({ force: true });
                cy.get('input[formcontrolname="insuranceFeeSources3"]').check({ force: true });
                cy.get('input[formcontrolname="insuranceFeeSources5"]').check({ force: true });
            }

            cy.get('input[formcontrolname="hasLoan"][value="N"]').scrollIntoView().check();
            cy.get('input[formcontrolname="hasTermination"][value="N"]').scrollIntoView().check();

            count++;
        })

        // finally
        cy.get('.page__content__btn > button.btn-danger').click().wait(shortSleep);
        step++;
    })

    it('業務員核保報告書', () => {
        if (step > 16)
            return;

        cy.get('input[formcontrolname="relationship"][value="4"]').check();
        cy.get('input[formcontrolname="applicantPurposeChoice1"]').check();
        cy.get('input[formcontrolname="selfApply"][value="0"]').check();
        cy.get('input[formcontrolname="specialRemart"][value="0"]').check();
        // 被保險人財務狀況
        cy.get('input[formcontrolname="insuredWorkIncome"]').type(testData.financial.yearIncome);
        cy.get('input[formcontrolname="insuredOtherIncome"]').type(testData.financial.otherIncome);
        cy.get('input[formcontrolname="insuredHouseholdIncome"]').type(testData.financial.familyIncome);
        // 要保人財務狀況
        cy.get('input[formcontrolname="proposerWorkIncome"]').type(testData.financial.yearIncome);
        cy.get('input[formcontrolname="proposerOtherIncome"]').type(testData.financial.otherIncome);
        cy.get('input[formcontrolname="proposerHouseholdIncome"]').type(testData.financial.familyIncome);

        cy.get('input[formcontrolname="spouseCareer"]').type(testData.financial.spouseCareer);
        // 家中主要經濟來源
        cy.get('input[formcontrolname="economicSources1"]').check();
        // 保費來源
        cy.get('input[formcontrolname="insuranceFeeSources1"]').check({ force: true });
        cy.get('input[formcontrolname="insuranceFeeSources3"]').check({ force: true });
        cy.get('input[formcontrolname="insuranceFeeSources5"]').check({ force: true });
        cy.get('input[formcontrolname="reasonAndSourcePremiums"]').type(testData.financial.reason);
        cy.get('input[formcontrolname="hasLoan"]').check();
        cy.get('input[formcontrolname="hasLoan"][value="N"]').check();
        cy.get('input[formcontrolname="hasTermination"][value="N"]').check();
        // 負債
        cy.get('input[formcontrolname="hasLiabilities"][value="Y"]').check();
        cy.get('input[formcontrolname="proposerLiabilitiesType"]').type(testData.financial.borrowType);
        cy.get('input[formcontrolname="proposerTotalLiabilities"]').type(testData.financial.borrowing);
        cy.get('input[formcontrolname="insuredLiabilitiesType"]').type(testData.financial.borrowType);
        cy.get('input[formcontrolname="insuredTotalLiabilities"]').type(testData.financial.borrowing);
        // 其他商業保險
        cy.get('input[formcontrolname="proposerOtherInsuranceProducts"][value="0"]').check();
        cy.get('input[formcontrolname="insuredOtherInsuranceProducts"][value="0"]').check();
        //  要保人是否對於本次購買商品之保障內容或給付項目完全不關心
        cy.get('input[formcontrolname="proposerHighlyAttention"][value="1"]').check();
        cy.get('input[formcontrolname="notAssignReason"]').type('NoNoNo');

        cy.get('input[formcontrolname="notifyAgree"][value="0"]').check();
        cy.get('input[formcontrolname="insuredHealthAbnormal"][value="0"]').check();
        cy.get('input[formcontrolname="militaryService"][value="1"]').check();

        cy.get('input[formcontrolname="clerkStatement1"][value="0"]').check();
        cy.get('input[formcontrolname="clerkStatement2"][value="0"]').check();
        cy.get('input[formcontrolname="clerkStatement3"][value="0"]').check();
        cy.get('input[formcontrolname="clerkStatement4"][value="0"]').check();
        cy.get('input[formcontrolname="clerkStatement5"][value="0"]').check();

        cy.get('input[formcontrolname="proposerTeleAccessTime1"]').check();
        cy.get('input[formcontrolname="proposerTeleAccessNo"]').type(testData.insured.phoneNumberNight);
        cy.get('input[formcontrolname="insuredTeleAccessTime1"]').check();
        cy.get('input[formcontrolname="insuredTeleAccessNo"]').type(testData.insured.phoneNumberNight);
        cy.get('input[formcontrolname="legalRepresentativeAccessNo"]').type(testData.insured.phoneNumberNight);

        // finally
        cy.get('.page__content__btn > button.btn-danger').click().wait(shortSleep);
        step++;
    })

    it('疾病問卷', () => {
        if (step > 17)
            return;

        // 新增
        cy.get('.card-body > .btn').click();
        cy.get('select[formcontrolname="questionSelect"]').select("Q-0001");
        cy.get('select[formcontrolname="insuredSelect"]').select(testData.insured.baseInfoName);
        cy.get('button[formcontrolname="next"]').click();

        // 填寫
        // 1.
        cy.get('input[formcontrolname="occurrenceYear"]').type("111");
        cy.get('input[formcontrolname="occurrenceMonth"]').type("5");
        cy.get('input[formcontrolname="occurrenceDay"]').type("21");
        cy.get('textarea[formcontrolname="cause"]').type("這就是發生原因");
        // 2.
        cy.get('input[formcontrolname="haveAnyConditions"]').check("false");
        cy.get('input[formcontrolname="haveAnyConditions"]').check("true");
        cy.get('input[formcontrolname="conditions"]').eq(0).check();
        cy.get('input[formcontrolname="conditions"]').eq(1).check();
        cy.get('input[formcontrolname="conditions"]').eq(2).check();
        cy.get('input[formcontrolname="conditions"]').eq(3).check();
        cy.get('input[formcontrolname="lossConsciousness"]').check("false");
        cy.get('input[formcontrolname="lossConsciousness"]').check("true");
        cy.get('textarea[formcontrolname="coma"]').type("昏迷了十年");
        cy.get('input[formcontrolname="conditions"]').check({ force: true });
        cy.get('textarea[formcontrolname="fractureSite"]').type("全身粉粹性骨折");
        // 3.
        cy.get('input[formcontrolname="hospitalized"]').check("false");
        cy.get('input[formcontrolname="hospitalized"]').check("true");
        cy.get('textarea[formcontrolname="hospitalizedDay"]').type("11/05/21, 30天");
        cy.get('input[formcontrolname="continuousTreatment"]').check("false");
        cy.get('input[formcontrolname="continuousTreatment"]').check("true");
        cy.get('input[formcontrolname="lastClinicYear"]').type("111");
        cy.get('input[formcontrolname="lastClinicMonth"]').type("5");
        cy.get('input[formcontrolname="lastClinicDay"]').type("21");
        cy.get('input[formcontrolname="surgicalTreatment"]').check("false");
        cy.get('input[formcontrolname="surgicalTreatment"]').check("true");
        cy.get('textarea[formcontrolname="surgicalName"]').type("改造手術");
        cy.get('input[formcontrolname="implantation"]').check("false");
        cy.get('input[formcontrolname="implantation"]').check("true");
        cy.get('input[formcontrolname="takeOutYear"]').type("111");
        cy.get('input[formcontrolname="takeOutMonth"]').type("5");
        cy.get('input[formcontrolname="takeOutDay"]').type("21");
        cy.get('input[formcontrolname="haveSuggestion"]').check("false");
        cy.get('input[formcontrolname="haveSuggestion"]').check("true");
        cy.get('textarea[formcontrolname="suggestion"]').type("我沒有任何建議");
        // 4.
        cy.get('input[formcontrolname="defect"]').check("false");
        cy.get('input[formcontrolname="defect"]').check("true");
        cy.get('textarea[formcontrolname="defectDesc"]').type("受傷有任何機能喪失或缺損");
        // 5.
        cy.get('input[formcontrolname="haveSequelae"]').check("false");
        cy.get('input[formcontrolname="haveSequelae"]').check("true");
        cy.get('input[formcontrolname="sequelae"]').eq(0).check();
        cy.get('input[formcontrolname="sequelae"]').eq(1).check();
        cy.get('input[formcontrolname="sequelae"]').eq(2).check();
        cy.get('input[formcontrolname="sequelae"]').eq(3).check();
        cy.get('input[formcontrolname="sequelae"]').eq(4).check();
        cy.get('input[formcontrolname="sequelae"]').eq(5).check();
        cy.get('input[formcontrolname="sequelae"]').eq(6).check();
        cy.get('input[formcontrolname="sequelae"]').eq(7).check();
        cy.get('textarea[formcontrolname="canNotMoveDesc"]').type("我不能移動");
        cy.get('input[formcontrolname="sequelae"]').eq(8).check();
        cy.get('textarea[formcontrolname="sequelaeOther"]').type("這是其他選項");
        // 6.
        cy.get('input[formcontrolname="cured"]').check("true");
        cy.get('input[formcontrolname="cured"]').check("false");
        cy.get('textarea[formcontrolname="unhealedDesc"]').type("上為痊癒");
        // 7.
        cy.get('textarea[formcontrolname="hospitalName"]').type("臺大醫院");
        cy.get('input[formcontrolname="hospitalLocation"]').type("台北市公館區");
        cy.get('textarea[formcontrolname="medicalRecordNumber"]').type("RX-78-G3");

        cy.get('button[formcontrolname="next"]').click();

        // finally
        cy.get('.page__content__btn > button.btn-danger').click();

        // 是否填寫完畢
        cy.get('.modal-footer > .btn-primary').click();

        step++;
    })

    it('前往文件預覽', () => {
        if (step != 18)
            return;

        // 如果有任何警告視窗
        cy.isElementExist('app-base-dialog > .modal-footer > .btn-primary').then((isExist) => {
            if (isExist)
                cy.get('app-base-dialog > .modal-footer > .btn-primary').click();
        })

        // 前往文件預覽
        cy.get('app-yes-no-dialog > .modal-footer > .btn-primary').click();
    })
  })
  
  context('文件預覽', () => {
    if (mainStep > 2)
        return;

    it('文件預覽', () => {
        cy.wait(longSleep);

        var btnCount = 0;
        cy.get('tbody > tr > td > button.btn-outline-info').its('length').then((result) => {
            // 統計按鈕總數
            btnCount = result;

            for (var i = 0; i < btnCount; i++) {
                const $btn = cy.get('tbody > tr > td > button.btn-outline-info').eq(i);

                // loading pdf
                $btn.click();
                cy.wait(longSleep).then((nothing) => {
                    cy.isElementExist('.btn.btn-secondary').then((isExist) => {
                        if (isExist) {
                            // 關閉pdf
                            cy.get('.btn.btn-secondary').click();
                        } else {
                            // 迴圈按 下一頁
                            cy.pdfNextStepLoop();

                            // 按 同意
                            cy.get('.btn.btn-success').click();

                        }
                    })
                });

            }
        });

        // 下一步
        cy.get('.btn-primary').click();
    })
  })

  context('電子簽名', () => {
      if (mainStep > 3)
          return;

      it('電子簽名', () => {

          cy.get('.mdc-tab').each(($tab) => {
              cy.get($tab).click().wait(100);

              var btnCount = 0;
              cy.get('.signature').its('length').then((result) => {
                  // 統計按鈕總數
                  btnCount = result;

                  for (var i = 0; i < btnCount; i++) {

                      const $btn = cy.get('.signature').eq(i);

                      // 檢查是否已簽名
                      // 避免發生錯誤停止測試, 先找出一定會有的元素, 再用then進入後續處理
                      $btn.find('.signature__img')
                          .then((signature_img) => {
                              if (signature_img.children('img').length == 0) {
                                  // 開啟簽名
                                  $btn.click();

                                  cy.get("canvas.signature-pad__pad")
                                      .then((el) => {
                                          const rect = el[0].getBoundingClientRect();

                                          // 亂畫
                                          cy.window().then((window) => {
                                              const pageX = rect.left;
                                              const pageY = rect.top;
                                              cy.wrap(el)
                                                  .trigger("mousedown", {
                                                      which: 1,
                                                      pageX: pageX + Math.random() * rect.width,
                                                      pageY,
                                                      force: true,
                                                  })
                                              for (var i = 0; i < 6; i++) {
                                                  cy.wrap(el).trigger("mousemove", {
                                                      pageX: pageX + Math.random() * rect.width,
                                                      pageY: pageY + Math.random() * rect.height,
                                                      force: true,
                                                  })
                                              }
                                              cy.wrap(el)
                                                  .trigger("mousemove") // -- notice this new call
                                                  .trigger("mouseup", {
                                                      which: 1,
                                                      force: true,
                                                  });
                                          });
                                      });

                                  // 送出
                                  cy.get('.signature-pad__footer-btn--confirm').click();
                              }
                          })

                  }
              });
          })

          // 下一步
          cy.get('.btn-primary').click();
      })
  })

  context('上傳文件', () => {
      if (mainStep > 4)
          return;
      it('上傳文件', () => {
          var btnCount = 0;
          cy.get('app-accordion-items').its('length').then((result) => {
              // 統計欄位總數
              btnCount = result;

              for (var i = 0; i < btnCount; i++) {
                  cy.get('app-accordion-items').eq(i).find('tbody > tr > :nth-child(3)')
                      .then(($parent) => {

                          const $btn = $parent.find('.btn-info');

                          // 沒有"預覽"才拍照
                          if ($parent.children('.btn-success[style*="visibility: visible"]').length == 0) {
                              // 開啟相機
                              $btn.click();

                              // 關閉拍照
                              cy.get('app-camera-dialog > .camera > .camera-controls--top > div').first().click().wait(pdfWaiting);

                              // // 切換鏡頭
                              // cy.get('app-camera-dialog > .camera > .camera-controls--top > div').last().click().wait(pdfWaiting);
                              // // 拍照
                              // cy.get('app-camera-dialog > .camera > .camera-controls--bottom > div').first().click().wait(pdfWaiting);
                              // // 確認
                              // cy.get('app-camera-dialog > .camera > .camera-controls--bottom > div').last().click().wait(pdfWaiting);
                              // // success
                              // cy.get('app-success-dialog > .modal-footer > button').click();
                          }
                      })
              }
          })

          // 下一步
          cy.get('.text-md-end > .btn-primary').click();
      })
  })

  context('確認投保', () => {
      if (mainStep > 5)
          return;

      it('確認投保', () => {
          cy.wait(longSleep);

          cy.isElementExist('.btn.btn-outline-info.btn-sm').then((isExist) => {
              if (isExist) {
                  cy.get('.btn.btn-outline-info.btn-sm').click();
                  // 迴圈按 下一頁
                  cy.pdfNextStepLoop();

                  // 按 同意
                  cy.get('.btn.btn-success').click();
                  // 確認送件
                  cy.get('.btn-primary').click();
              }
          })

          // 開啟簽名, 多業務員
          cy.isElementExist('.mdc-tab').then((isExist) => {
              if (isExist) {
                  cy.get('.mdc-tab').each(($tab) => {
                      cy.get($tab).click().wait(100);

                      cy.get('.signature').click();

                      cy.get("canvas.signature-pad__pad")
                          .then((el) => {
                              const rect = el[0].getBoundingClientRect();

                              // 亂畫
                              cy.window().then((window) => {
                                  const pageX = rect.left;
                                  const pageY = rect.top;
                                  cy.wrap(el)
                                      .trigger("mousedown", {
                                          which: 1,
                                          pageX: pageX + Math.random() * rect.width,
                                          pageY,
                                          force: true,
                                      })
                                  for (var i = 0; i < 6; i++) {
                                      cy.wrap(el).trigger("mousemove", {
                                          pageX: pageX + Math.random() * rect.width,
                                          pageY: pageY + Math.random() * rect.height,
                                          force: true,
                                      })
                                  }
                                  cy.wrap(el)
                                      .trigger("mousemove") // -- notice this new call
                                      .trigger("mouseup", {
                                          which: 1,
                                          force: true,
                                      });
                              });
                          });

                      // 送出
                      cy.get('.signature-pad__footer-btn--confirm').click();
                  })

                  // 下一步
                  cy.wait(longSleep).get('.btn-primary').click();
              }

          })

          // cy.isElementExist('#confirm').then((isExist) => {
          //     if (isExist) {
          //         // 要確認刪除
          //         cy.get('#confirm').check();
          //         // 確認送件
          //         cy.get('.avatar-title').click();
          //     }
          // })

      })

      // it('送件完成', () => {
      //     cy.wait(longSleep * 2);

      //     // 看到確認結果
      //     cy.get('app-base-dialog').find('.btn-primary').should('have.exist');
      // })
  })
})  