/* eslint-disable cypress/unsafe-to-chain-command */
/* eslint-disable cypress/no-unnecessary-waiting */
/* eslint-disable cypress/no-assigning-return-values */
import testData from '../../fixtures/2-UAT/0.1.1-UAT.json'
import { solver } from '../../support/CAPTCHAsolver.js'

var shortSleep = 1000
var longSleep = 1500
var pdfWaiting = 300

context('輸入測試', () => {
    var newRecord = false // 新增 or 修改
    var editOrderNo = 1

    /**
     * 主要步驟
     * 1-資料輸入
     * 2-文件預覽
     * 3-電子簽名
     * 4-上傳文件
     * 5-確認投保
     */

    /**
     * 次要步驟
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
        Cypress.config('baseUrl','http://10.67.67.108/')
        cy.visit('/mbis2/#/login')
        // cy.visit('/mbis/#/login?admin=TGL@70817744@tgl')
        cy.get('#uname').type(testData.userId)
        cy.get('#pin').type(testData.pin)
        solver()
        cy.get('.btn').click().wait(longSleep)
    })

    it('新增 行動投保', () => {
        if (newRecord) {
            cy.get('.order-lg-1 > .card > .card-body > :nth-child(1) > :nth-child(1) > .me-2 > .row > a > .avatar-md > .avatar-title').click({ force: true })
        }
    })

    it('修改 行動投保', () => {
        if (!newRecord) {
            cy.get(':nth-child(' + editOrderNo + ') > :nth-child(6) > :nth-child(1) > .ri-edit-2-line').click({ force: true })

            cy.isElementExist('app-normal-dialog button.btn-primary').then((isExist) => {
            if (isExist) {
                cy.get('app-normal-dialog button.btn-primary').click()
            }
            })
        }
    })
})

context('資料輸入', () => {
    it('check',() => {
        cy.wait(shortSleep)
        Cypress.env('itsMe',false)
        cy.get('div[data-swiper-slide-index="0"]').then(($headerElement) => {
            if ($headerElement.hasClass('step__item--last')) {
                Cypress.env('itsMe',true)
            } else {
                console.log('資料輸入 步驟 已完成')
            }
        })
    })

    let testConponentText = ''
    it('被保險人', () => {
        // 跳過本步驟
        if(!Cypress.env('itsMe')) {
            return
        }

        testConponentText = '被保險人'
        cy.findLeftSideBar(testConponentText).then((findItem) =>{
            if (findItem!=null) {
                if (findItem.find('div.page__sidebar-btn--completeCheck').length>0) {
                    console.log(`${testConponentText} 已完成`)
                    return expect(true).to.be.true
                } else {
                    findItem.click()
                }
                // 同意書
                cy.isElementExist('app-preview-dialog button.btn-success').then((isExist) => {
                    if (isExist) {
                        cy.pdfNextStepLoop()
                    }
                })

                cy.get('input[formcontrolname="baseInfoName"]').clear().type(testData.insured.baseInfoName)
                cy.get('input[formcontrolname="baseInfoGender"]').first().click()
                cy.get('input[formcontrolname="baseInfoPersonId"]').clear().type(testData.insured.baseInfoPersonId)
                cy.get('input[formcontrolname="baseInfoRomanName"]').clear().type(testData.insured.baseInfoName)

                // 日期(切換成成年日期)
                cy.get('.mat-datepicker-input').type(testData.insured.baseInfoBirthday)

                cy.get('select[formcontrolname="baseInfoMarry"]').select(testData.insured.baseInfoMarry)
                if (testData.insured.baseInfoNationality=="中華民國")
                    cy.get('input[formcontrolname="baseInfoNationalIsROC"]').check()
                else
                    cy.get('select[formcontrolname="baseInfoNationality"]').select(testData.insured.baseInfoNationality)
                cy.get('input[formcontrolname="serviceUnit"]').clear().type(testData.insured.serviceUnit)
                cy.get('input[formcontrolname="jobType"]').clear().type(testData.insured.jobType)
                cy.get('input[formcontrolname="workDetail"]').clear().type(testData.insured.workDetail)
                cy.get('input[formcontrolname="partTimeDetail"]').clear().type(testData.insured.partTimeDetail)

                // 正職職業代碼 A101
                cy.get('input[formcontrolname="jobInfoCareerFull"]').click()
                cy.get('button.btn-info').eq(0).click().wait(200)
                cy.get('tbody > :nth-child(1) > .align-items-center > .form-check-input').click()
                cy.get('.modal-footer > .btn').click()

                // 間職職業代碼 A102
                cy.get('input[formcontrolname="parttimeJobOccupyFull"]').click()
                cy.get('button.btn-info').eq(0).click().wait(200)
                cy.get('tbody > :nth-child(1) > .align-items-center > .form-check-input').click()
                cy.get('.modal-footer > .btn').click()

                // 電話
                cy.get('input[formcontrolname="phoneNumberLightArea"]').clear().type(testData.insured.phoneNumberLightArea)
                cy.get('input[formcontrolname="phoneNumberLight"]').clear().type(testData.insured.phoneNumberLight)
                cy.get('input[formcontrolname="phoneNumberLightExt"]').clear().type(testData.insured.phoneNumberLightExt)
                cy.get('input[formcontrolname="phoneNumberNightArea"]').clear().type(testData.insured.phoneNumberNightArea)
                cy.get('input[formcontrolname="phoneNumberNight"]').clear().type(testData.insured.phoneNumberNight)
                cy.get('input[formcontrolname="phoneNumberNightExt"]').clear().type(testData.insured.phoneNumberNightExt)
                cy.get('select[formcontrolname="cellphone"]').select(testData.insured.cellphone)
                cy.get('input[formcontrolname="cellphoneNumberNation"]').clear().type(testData.insured.cellphoneNumberNation).trigger('change')
                cy.get('input[formcontrolname="cellphoneNumber"]').clear().type(testData.insured.cellphoneNumber)

                // 地址
                cy.get('select[formcontrolname="addCity"]').select(testData.insured.addCity)
                cy.get('select[formcontrolname="addDistrict"]').select(testData.insured.addDistrict)
                cy.get('input[formcontrolname="addressBar"]').clear().type(testData.insured.addressBar)

                cy.get('input[formcontrolname="emailLocal"]').clear().type(testData.insured.emailLocal)
                cy.get('input[formcontrolname="emailDomain"]').clear().type(testData.insured.emailDomain)

                // finally
                cy.get('.page__content__btn > button.btn-danger').click()
                // 如果有任何警告視窗,那就按
                cy.isElementExist('app-warning-dialog button.btn-primary').then((isExist) => {
                    if (isExist) {
                        cy.get('app-warning-dialog button.btn-primary').click()
                    }
                })
            } else {
                console.log(`${testConponentText} 找不到`)
            }
        })
    })

    it('要保人', () => {
        // 跳過本步驟
        if(!Cypress.env('itsMe')) {
            return
        }

        testConponentText = '要保人'
        cy.findLeftSideBar(testConponentText).then((findItem) =>{
            if (findItem!=null) {
                if (findItem.find('div.page__sidebar-btn--completeCheck').length>0) {
                    console.log(`${testConponentText} 已完成`)
                    return expect(true).to.be.true
                } else {
                    findItem.click()
                }
                // ***** 以下為要保人輸入 *****
                cy.get('select[formcontrolname="relation"]').select(testData.proposer.relation)
                cy.get('input[formcontrolname="infoName"]').clear().type(testData.proposer.infoName)
                cy.get('input[formcontrolname="infoGender"]').last().click()
                cy.get('input[formcontrolname="infoPersonId"]').clear().type(testData.proposer.infoPersonId)
                cy.get('input[formcontrolname="romanName"]').clear().type(testData.proposer.romanName)

                // 日期(切換成成年日期)
                cy.get('.mat-datepicker-input').type(testData.proposer.infoBirthday)

                // 國籍
                if (testData.proposer.infoNational=="中華民國")
                    cy.get('input[formcontrolname="infoNationalIsROC"]').check()
                else
                    cy.get('select[formcontrolname="infoNationalOtherDesc"]').select(testData.proposer.infoNational)
                cy.get('select[formcontrolname="infoMarry"]').select(testData.proposer.infoMarry)
                cy.get('input[formcontrolname="serviceUnit"]').clear().type(testData.proposer.serviceUnit)
                cy.get('input[formcontrolname="jobType"]').clear().type(testData.proposer.jobType)
                cy.get('input[formcontrolname="workDetail"]').clear().type(testData.proposer.workDetail)
                cy.get('input[formcontrolname="partTimeDetail"]').clear().type(testData.proposer.partTimeDetail)

                // 正職職業代碼 A101
                cy.get('input[formcontrolname="jobOccupyFull"]').click()
                cy.get('button.btn-info').eq(0).click().wait(200)
                cy.get('tbody > :nth-child(1) > .align-items-center > .form-check-input').click()
                cy.get('.modal-footer > .btn').click()

                // 間職職業代碼 A102
                cy.get('input[formcontrolname="parttimeJobOccupyFull"]').click()
                cy.get('button.btn-info').eq(0).click().wait(200)
                cy.get('tbody > :nth-child(1) > .align-items-center > .form-check-input').click()
                cy.get('.modal-footer > .btn').click()

                // 電話
                cy.get('input[formcontrolname="phoneNumberLightArea"]').clear().type(testData.proposer.phoneNumberLightArea)
                cy.get('input[formcontrolname="phoneNumberLight"]').clear().type(testData.proposer.phoneNumberLight)
                cy.get('input[formcontrolname="phoneNumberLightExt"]').clear().type(testData.proposer.phoneNumberLightExt)
                cy.get('input[formcontrolname="phoneNumberNightArea"]').clear().type(testData.proposer.phoneNumberNightArea)
                cy.get('input[formcontrolname="phoneNumberNight"]').clear().type(testData.proposer.phoneNumberNight)
                cy.get('input[formcontrolname="phoneNumberNightExt"]').clear().type(testData.proposer.phoneNumberNightExt)
                cy.get('select[formcontrolname="phoneCellphone"]').select(testData.proposer.phoneCellphone)
                cy.get('input[formcontrolname="cellphoneNumberNation"]').clear().type(testData.proposer.cellphoneNumberNation).trigger('change')
                cy.get('input[formcontrolname="phoneCellphoneNumber"]').clear().type(testData.proposer.phoneCellphoneNumber)

                // 地址
                cy.get('select[formcontrolname="addrCity"]').select(testData.proposer.addrCity)
                cy.get('select[formcontrolname="addrDistrict"]').select(testData.proposer.addrDistrict)
                cy.get('input[formcontrolname="addrAddress"]').clear().type(testData.proposer.addrAddress)

                cy.get('input[formcontrolname="emailLocal"]').clear().type(testData.proposer.emailLocal)
                cy.get('input[formcontrolname="emailDomain"]').clear().type(testData.proposer.emailDomain)
                cy.get('input[formcontrolname="policyType"]').first().check()

                // 風險同意書
                cy.get('#pointer').click()
                cy.get('.col-10 > :nth-child(1) > .form-check-label').last().click()
                cy.get('.modal-footer > .btn').click()

                // finally
                cy.get('.page__content__btn > button.btn-danger').click()
                // 如果有任何警告視窗,那就按
                cy.isElementExist('app-warning-dialog button.btn-primary').then((isExist) => {
                    if (isExist) {
                        cy.get('app-warning-dialog button.btn-primary').click()
                    }
                })
            } else {
                console.log(`${testConponentText} 找不到`)
            }
        })
    })

    it('風險屬性', () => {
        // 跳過本步驟
        if(!Cypress.env('itsMe')) {
            return
        }

        testConponentText = '風險屬性'
        cy.findLeftSideBar(testConponentText).then((findItem) =>{
            if (findItem!=null) {
                if (findItem.find('div.page__sidebar-btn--completeCheck').length>0) {
                    console.log(`${testConponentText} 已完成`)
                    return expect(true).to.be.true
                } else {
                    findItem.click()
                }

                cy.get('#isInvestN').check()

                // finally
                cy.get('.page__content__btn > button.btn-danger').click()
            } else {
                console.log(`${testConponentText} 找不到`)
            }
        })
    })

    it('保險種類', () => {
        // 跳過本步驟
        if(!Cypress.env('itsMe')) {
            return
        }

        testConponentText = '保險種類'
        cy.findLeftSideBar(testConponentText).then((findItem) =>{
            if (findItem!=null) {
                if (findItem.find('div.page__sidebar-btn--completeCheck').length>0) {
                    console.log(`${testConponentText} 已完成`)
                    return expect(true).to.be.true
                } else {
                    findItem.click()
                }
                // 點左邊選單, 等待系統讀取合約檔案
                cy.wait(longSleep)

                // 新增主約
                cy.contains('增加主約').parent().click().wait(shortSleep)
                cy.get('.mat-mdc-tab-labels').children().eq(0).click()
                cy.contains('QHD').parent().children().last().find('button.btn-info').click()
                cy.get('.input-group > :nth-child(1) > .form-control').type('150')
                cy.get('.modal-footer > .btn-primary').click()

                // finally
                cy.get('.page__content__btn > button.btn-danger').click().wait(shortSleep)
            } else {
                console.log(`${testConponentText} 找不到`)
            }
        })
    })

    it('詢問事項', () => {
        // 跳過本步驟
        if(!Cypress.env('itsMe')) {
            return
        }

        testConponentText = '詢問事項'
        cy.findLeftSideBar(testConponentText).then((findItem) =>{
            if (findItem!=null) {
                if (findItem.find('div.page__sidebar-btn--completeCheck').length>0) {
                    console.log(`${testConponentText} 已完成`)
                    return expect(true).to.be.true
                } else {
                    findItem.click()
                }
                // 點左邊選單, 等待系統讀取合約檔案
                cy.wait(longSleep)

                // 要保書填寫說明
                // 迴圈按 下一頁
                cy.pdfNextStepLoop()

                // 身心障礙
                cy.isElementExist('input[formcontrolname="question_1"]').then((isExist) => {
                    if (isExist) {
                        cy.get('input[formcontrolname="question_1"][value="'+testData.noteAndInsuredRecord.question_1+'"]').click()
                    }
                })
                cy.isElementExist('input[formcontrolname="question_2"]').then((isExist) => {
                    if (isExist) {
                        cy.get('input[formcontrolname="question_2"][value="'+testData.noteAndInsuredRecord.question_1+'"]').click()
                    }
                })

                // 監護宣告
                cy.isElementExist('input[formcontrolname="question_3"]').then((isExist) => {
                    if (isExist) {
                        cy.get('input[formcontrolname="question_3"][value="'+testData.noteAndInsuredRecord.question_3+'"]').click()
                    }
                })
                cy.isElementExist('input[formcontrolname="question_4"]').then((isExist) => {
                    if (isExist) {
                        cy.get('input[formcontrolname="question_4"][value="'+testData.noteAndInsuredRecord.question_3+'"]').click()
                    }
                })
                cy.isElementExist('input[formcontrolname="question_5"]').then((isExist) => {
                    if (isExist) {
                        cy.get('input[formcontrolname="question_5"][value="'+testData.noteAndInsuredRecord.question_3+'"]').click()
                    }
                })
                

                // finally
                cy.get('.page__content__btn > button.btn-danger').click().wait(shortSleep)
            } else {
                console.log(`${testConponentText} 找不到`)
            }
        })
    })

    it('要保人帳戶資料', () => {
        // 跳過本步驟
        if(!Cypress.env('itsMe')) {
            return
        }

        testConponentText = '要保人帳戶'
        cy.findLeftSideBar(testConponentText).then((findItem) =>{
            if (findItem!=null) {
                if (findItem.find('div.page__sidebar-btn--completeCheck').length>0) {
                    console.log(`${testConponentText} 已完成`)
                    return expect(true).to.be.true
                } else {
                    findItem.click()
                }
                cy.isElementExist('.row > :nth-child(2) > .btn').then((isExist) => {
                    if (isExist) {
                        cy.get('.row > :nth-child(2) > .btn').click()
                        cy.get('.row > :nth-child(2) > .btn').click().wait(200)
                    }
                })

                cy.get('select[formcontrolname="bankCode"]').select(testData.bank.bankCode)
                cy.get('select[formcontrolname="branchCode"]').select(testData.bank.branchCode)
                cy.get('input[formcontrolname="account"]').clear().type(testData.bank.account)

                // finally
                cy.get('.page__content__btn > button.btn-danger').click().wait(shortSleep)
            } else {
                console.log(`${testConponentText} 找不到`)
            }
        })
    })

    it('自動墊繳', () => {
        // 跳過本步驟
        if(!Cypress.env('itsMe')) {
            return
        }

        testConponentText = '自動墊繳'
        cy.findLeftSideBar(testConponentText).then((findItem) =>{
            if (findItem!=null) {
                if (findItem.find('div.page__sidebar-btn--completeCheck').length>0) {
                    console.log(`${testConponentText} 已完成`)
                    return expect(true).to.be.true
                } else {
                    findItem.click()
                }
                cy.get('#autoPayment_left0').click()
                cy.get('#payer_relations0_1').scrollIntoView().click()

                // finally
                cy.get('.page__content__btn > button.btn-danger').click().wait(shortSleep)
            } else {
                console.log(`${testConponentText} 找不到`)
            }
        })
    })

    it('受益人', () => {
        // 跳過本步驟
        if(!Cypress.env('itsMe')) {
            return
        }

        testConponentText = '受益人'
        cy.findLeftSideBar(testConponentText).then((findItem) =>{
            if (findItem!=null) {
                if (findItem.find('div.page__sidebar-btn--completeCheck').length>0) {
                    console.log(`${testConponentText} 已完成`)
                    return expect(true).to.be.true
                } else {
                    findItem.click()
                }
                cy.get('.mat-mdc-tab-labels').children().each(($tab) => {
                    cy.get($tab).click().wait(100)

                    // 身故保險金受益人
                    cy.get('#cradio1dead' + $tab[0].innerText).check()
                    cy.isElementExist('p:contains("身故保險金受益人")').then((isExist) => {
                        if (isExist) {
                            cy.get('p:contains("身故保險金受益人")').parent().next().find('button.btn-primary').click()
                            cy.get('#isLegalFalse').check()
                            cy.get('select[formcontrolname="distribution"]').select(testData.beneficiary.distribution)
                            cy.get('input[formcontrolname="aveRatio"]').type(testData.beneficiary.aveRatio)
                            cy.get('select[formcontrolname="relationshipValue"]').select(testData.beneficiary.relationshipValue)
                            cy.get('input[formcontrolname="relationshipValueDesc"]').type(testData.beneficiary.relationshipValueDesc)
                            cy.get('input[formcontrolname="name"]').type(testData.beneficiary.name)
                            cy.get('input[formcontrolname="romanName"]').type(testData.beneficiary.romanName)
                            cy.get('input[formcontrolname="idNo"]').type(testData.beneficiary.idNo)
                            if (testData.beneficiary.infoNational=="中華民國")
                                cy.get('input[formcontrolname="infoNationalIsROC"]').check()
                            else
                                cy.get('select[formcontrolname="infoNationalOtherDesc"]').select(testData.beneficiary.infoNational)
                            cy.get('.mat-datepicker-input').type(testData.beneficiary.birthday)
                            cy.get('select[formcontrolname="addrCity"]').select(testData.beneficiary.addrCity)
                            cy.get('select[formcontrolname="addrDistrict"]').select(testData.beneficiary.addrDistrict)
                            cy.get('input[formcontrolname="addrDesc"]').type(testData.beneficiary.addrDesc)
                            cy.get('input[formcontrolname="phoneArea"]').type(testData.beneficiary.phoneArea)
                            cy.get('input[formcontrolname="phoneNumber"]').type(testData.beneficiary.phoneNumber)
                            cy.get('input[formcontrolname="phoneExt"]').type(testData.beneficiary.phoneExt)
                            cy.get('input[formcontrolname="cellPhoneNumber"]').type(testData.beneficiary.cellPhoneNumber)
                            cy.get('input[formcontrolname="assignInsurance"]').type(testData.beneficiary.assignInsurance)
                            cy.get('input[formcontrolname="forPay"]').check()
                            cy.get('input[formcontrolname="quotaInsurance"]').type(testData.beneficiary.quotaInsurance)
                            cy.get('.btn-info').click()
                            cy.get('app-yes-no-dialog button.btn-secondary').click()
                            cy.get('app-warning-dialog button.btn-primary').click()
                        }
                    })

                    // 祝壽保險金受益人
                    cy.isElementExist('#cradio1birth' + $tab[0].innerText).then((isExist) => {
                        if (isExist) {
                            cy.get('#cradio1birth' + $tab[0].innerText).check()
                        }
                    })

                    cy.isElementExist('p:contains("滿期、祝壽保險金受益人")').then((isExist) => {
                        if (isExist) {
                            cy.get('p:contains("滿期、祝壽保險金受益人")').parent().next().find('button.btn-primary').click()
                            cy.get('#isLegalFalse').check()
                            cy.get('select[formcontrolname="distribution"]').select(1)
                            cy.get('input[formcontrolname="aveRatio"]').type(testData.beneficiary.aveRatio)
                            cy.get('select[formcontrolname="relationshipValue"]').select(testData.beneficiary.relationshipValue)
                            cy.get('input[formcontrolname="relationshipValueDesc"]').type(testData.beneficiary.relationshipValueDesc)
                            cy.get('input[formcontrolname="name"]').type(testData.beneficiary.name)
                            cy.get('input[formcontrolname="romanName"]').type(testData.beneficiary.romanName)
                            cy.get('input[formcontrolname="idNo"]').type(testData.beneficiary.idNo)
                            if (testData.beneficiary.infoNational=="中華民國")
                                cy.get('input[formcontrolname="infoNationalIsROC"]').check()
                            else
                                cy.get('select[formcontrolname="infoNationalOtherDesc"]').select(testData.beneficiary.infoNational)
                            cy.get('.mat-datepicker-input').type(testData.beneficiary.birthday)
                            cy.get('select[formcontrolname="financialData"]').select(testData.bank.bankCode)
                            cy.get('select[formcontrolname="branch"]').select(testData.bank.branchCode)
                            cy.get('input[formcontrolname="accountNumber"]').type(testData.bank.account)

                            cy.get('.btn-info').click()
                            cy.get('app-yes-no-dialog button.btn-secondary').click()
                            cy.get('app-warning-dialog button.btn-primary').click()
                        }
                    })
                })

                // finally
                cy.get('.page__content__btn > button.btn-danger').click().wait(shortSleep)
            } else {
                console.log(`${testConponentText} 找不到`)
            }
        })
    })

    it('告知事項', () => {
        // 跳過本步驟
        if(!Cypress.env('itsMe')) {
            return
        }

        testConponentText = '告知事項'
        cy.findLeftSideBar(testConponentText).then((findItem) =>{
            if (findItem!=null) {
                if (findItem.find('div.page__sidebar-btn--completeCheck').length>0) {
                    console.log(`${testConponentText} 已完成`)
                    return expect(true).to.be.true
                } else {
                    findItem.click()
                }

                cy.isElementExist('input[formcontrolname="height"]').then((isExist) => {
                    if (isExist) {
                        cy.get('input[formcontrolname="height"]').clear().type(testData.note.height)
                        cy.get('input[formcontrolname="weight"]').clear().type(testData.note.weight)
                    }
                })

                // 答題
                for (let i = 0; i < 10; i++) {
                    for (let j = 0; j < 8; j++) {
                        let elementNameY = 'input[id="' + i.toString() + '_' + j.toString() + '_Y"]'
                        let elementNameN = 'input[id="' + i.toString() + '_' + j.toString() + '_N"]'
                        let isExistY = cy.isElementExist(elementNameY)
                        let isExistN = cy.isElementExist(elementNameN)
                        isExistY.then((isExist) => {
                            if (isExist)
                                cy.get(elementNameY).check()
                        })
                        isExistN.then((isExist) => {
                            if (isExist)
                                cy.get(elementNameN).check()
                        })
                    }
                }

                // 新增病例
                cy.get('.col-md-2 > .btn').click()
                cy.get('input[name="sickName"]').clear().type(testData.sickInfoList.sickName)
                cy.get('input[name="hospital"]').clear().type(testData.sickInfoList.hospital)
                cy.get('input[name="treatmentYear"]').clear().type(testData.sickInfoList.treatmentYear)
                cy.get('input[name="treatmentMonth"]').clear().type(testData.sickInfoList.treatmentMonth)
                cy.get('input[name="treatmentDay"]').clear().type(testData.sickInfoList.treatmentDay)
                cy.get('input[name="treatmentWay"]').clear().type(testData.sickInfoList.treatmentWay)
                cy.get('input[name="treatmentResults"]').clear().type(testData.sickInfoList.treatmentResults)
                cy.get('.modal-footer > :nth-child(2)').click()

                // finally
                cy.get('.page__content__btn > button.btn-danger').click().wait(shortSleep)
            } else {
                console.log(`${testConponentText} 找不到`)
            }
        })
    })

    it('重要事項', () => {
        // 跳過本步驟
        if(!Cypress.env('itsMe')) {
            return
        }

        testConponentText = '重要事項'
        cy.findLeftSideBar(testConponentText).then((findItem) =>{
            if (findItem!=null) {
                if (findItem.find('div.page__sidebar-btn--completeCheck').length>0) {
                    console.log(`${testConponentText} 已完成`)
                    return expect(true).to.be.true
                } else {
                    findItem.click()
                }

                // 同意書
                cy.isElementExist('.btn-success.w-70').then((isExist) => {
                    if (isExist)
                        cy.get('.btn-success.w-70').click()
                })

                // 全民健保
                cy.isElementExist('input[formcontrolname="healthInsured"]').then((isExist) => {
                    if (isExist) {
                        cy.get('input[formcontrolname="healthInsured"]').first().click()
                        cy.get('input[formcontrolname="confirm"]').click()
                    }
                })

                // 重新閱讀
                cy.get('.mb-3 > .d-grid > .btn').click()
                cy.get('button.btn-primary.w-70').contains('下一頁').click()
                cy.get('button.btn-primary.w-70').contains('下一頁').click()
                cy.get('button.btn-secondary.w-70').contains('關閉').click()

                // YES
                cy.get('.col-lg-12 > .d-grid > :nth-child(1)').click()

                // finally
                cy.get('.page__content__btn > button.btn-danger').click().wait(shortSleep)
            } else {
                console.log(`${testConponentText} 找不到`)
            }
        })
    })

    it('客戶投保權益 FATCA CRS', () => {
        // 跳過本步驟
        if(!Cypress.env('itsMe')) {
            return
        }

        testConponentText = '客戶投保權益'
        cy.findLeftSideBar(testConponentText).then((findItem) =>{
            if (findItem!=null) {
                if (findItem.find('div.page__sidebar-btn--completeCheck').length>0) {
                    console.log(`${testConponentText} 已完成`)
                    return expect(true).to.be.true
                } else {
                    findItem.click()
                }

                cy.get('#rightOneY').check()
                cy.get('#rightTwoY').check()
                cy.get('#rightThreeY').check()
                cy.get('#rightFourY').check()
                cy.get('#rightFiveY').check()

                // 法定代理人
                cy.isElementExist('#samePropser').then((isExist) => {
                    if (isExist) {
                        cy.get('#samePropser').check()
                        cy.get('input[formcontrolname="name"]').clear().type(testData.proposer.infoName)
                        cy.get('input[formcontrolname="legalRepreRomanName"]').clear().type(testData.proposer.romanName)
                        cy.get('.mat-datepicker-input').clear().type(testData.proposer.infoBirthday)
                        cy.get('input[formcontrolname="legalRepresentativePersonId"]').clear().type(testData.proposer.infoPersonId)
                    }
                })

                // FATCA
                cy.get('#fatcaOptionB').check()
                cy.get('#fatcaBOption1').check()

                // CRS
                cy.get('#crsOptionB').check()

                // finally
                cy.get('.page__content__btn > button.btn-danger').click().wait(shortSleep)
            } else {
                console.log(`${testConponentText} 找不到`)
            }
        })
    })

    it('W-8BEN', () => {
        // 跳過本步驟
        if(!Cypress.env('itsMe')) {
            return
        }

        testConponentText = 'W-8BEN'
        cy.findLeftSideBar(testConponentText).then((findItem) =>{
            if (findItem!=null) {
                if (findItem.find('div.page__sidebar-btn--completeCheck').length>0) {
                    console.log(`${testConponentText} 已完成`)
                    return expect(true).to.be.true
                } else {
                    findItem.click()
                }

                cy.get('input[formcontrolname="name"]').clear().type(testData.insured.baseInfoRomanName)
                cy.get('select[formcontrolname="nationality"]').select(testData.insured.baseInfoNationality)
                cy.get('input[formcontrolname="addr"]').clear().type(testData.insured.engAddress)
                cy.get('input[formcontrolname="city"]').clear().type(testData.insured.engCity)
                cy.get('select[formcontrolname="country"]').select(testData.insured.baseInfoNationality)
                cy.get('input[formcontrolname="diffAddr"]').clear().type(testData.insured.engAddress)
                cy.get('input[formcontrolname="diffCity"]').clear().type(testData.insured.engCity)
                cy.get('select[formcontrolname="diffCountry"]').select(testData.insured.baseInfoNationality)
                // 美國納稅人稅籍號碼
                cy.get('input[formcontrolname="taxNumbere"]').clear().type(testData.insured.taxNumbere)
                cy.get('input[formcontrolname="foreignTaxNumber"]').clear().type(testData.insured.foreignTaxNumber)
                cy.get('input[formcontrolname="referNumber"]').clear().type(testData.insured.referNumber)
                cy.get('.mat-datepicker-input').clear().type(testData.proposer.infoBirthday)
                // 租稅協定優惠
                cy.get('select[formcontrolname="beneficialCountry"]').select(testData.insured.baseInfoNationality)
                cy.get('input[formcontrolname="paragraph"]').clear().type(testData.insured.paragraph)
                cy.get('input[formcontrolname="rate"]').clear().type(testData.insured.rate)
                cy.get('input[formcontrolname="incomeType"]').clear().type(testData.insured.incomeType)
                cy.get('input[formcontrolname="conditions"]').clear().type(testData.insured.conditions)

                // finally
                cy.get('.page__content__btn > button.btn-danger').click().wait(shortSleep)
            } else {
                console.log(`${testConponentText} 找不到`)
            }
        })
    })

    it('CRS自我證明', () => {
        // 跳過本步驟
        if(!Cypress.env('itsMe')) {
            return
        }

        testConponentText = 'CRS自我證明表'
        cy.findLeftSideBar(testConponentText).then((findItem) =>{
            if (findItem!=null) {
                if (findItem.find('div.page__sidebar-btn--completeCheck').length>0) {
                    console.log(`${testConponentText} 已完成`)
                    return expect(true).to.be.true
                } else {
                    findItem.click()
                }

                // 自我證明表-個人 Self-Certification Form – Individua
                cy.get('.d-flex > .btn').click()
                cy.get('.modal-footer > .btn').click()

                // 個人帳戶
                cy.get('input[formcontrolname="lastName"]').clear().type(testData.insured.lastName)
                cy.get('input[formcontrolname="firstName"]').clear().type(testData.insured.firstName)
                cy.get('input[formcontrolname="middleName"]').clear().type(testData.insured.middleName)
                cy.get('.mat-datepicker-input').clear().type(testData.proposer.infoBirthday)
                // 現行地址
                cy.get('input[formcontrolname="currentAddress"]').type(testData.insured.engAddress)
                cy.get('input[formcontrolname="currentCity"]').clear().type(testData.insured.engCity)
                cy.get('select[formcontrolname="currentCountry"]').select(testData.insured.baseInfoNationality)
                cy.get('input[formcontrolname="currentZip"]').clear().type(testData.insured.zip)
                // 通訊地址
                cy.get('input[formcontrolname="address"]').type(testData.insured.engAddress)
                cy.get('input[formcontrolname="city"]').clear().type(testData.insured.engCity)
                cy.get('select[formcontrolname="country"]').select(testData.insured.baseInfoNationality)
                cy.get('input[formcontrolname="zip"]').clear().type(testData.insured.zip)
                // 出生地
                cy.get('input[formcontrolname="birthCity"]').clear().type(testData.insured.engCity)
                cy.get('select[formcontrolname="birthCountry"]').select(testData.insured.baseInfoNationality)
                // 稅務識別碼
                cy.get('.text-primary > .btn').click()
                cy.get('select[formcontrolname="liveCountry"]').select(testData.insured.baseInfoNationality)
                cy.get('input[formcontrolname="tin"]').clear().type(testData.proposer.infoPersonId)
                cy.get('.modal-footer > .btn-info').click()

                cy.get('.text-primary > .btn').click()
                cy.get('select[formcontrolname="liveCountry"]').select(testData.insured.liveCountry)
                cy.get('input[formcontrolname="tin"]').clear().type(testData.proposer.infoPersonId)
                cy.get('.modal-footer > .btn-info').click()

                // finally
                cy.get('.page__content__btn > button.btn-danger').click().wait(shortSleep)
            } else {
                console.log(`${testConponentText} 找不到`)
            }
        })
    })

    it('審閱期聲明', () => {
        // 跳過本步驟
        if(!Cypress.env('itsMe')) {
            return
        }

        testConponentText = '審閱期聲明'
        cy.findLeftSideBar(testConponentText).then((findItem) =>{
            if (findItem!=null) {
                if (findItem.find('div.page__sidebar-btn--completeCheck').length>0) {
                    console.log(`${testConponentText} 已完成`)
                    return expect(true).to.be.true
                } else {
                    findItem.click()
                }

                cy.get('.mat-mdc-tab-labels').children().each(($tab) => {
                    cy.get($tab).click().wait(100)

                    cy.get(':nth-child(1) > .form-check > .form-check-label').click()

                    // 審閱期至少三日
                    let today = new Date()
                    today.setDate(today.getDate() - 4)
                    let year = today.getFullYear()-1911
                    let month = (today.getMonth()+1).toString().padStart(2,'0')
                    let day = today.getDate().toString().padStart(2,'0')
                    cy.get('.mat-datepicker-input').type(year+month+day)
                })

                // finally
                cy.get('.page__content__btn > button.btn-danger').click().wait(shortSleep)
            } else {
                console.log(`${testConponentText} 找不到`)
            }
        })
    })

    it('招攬人員', () => {
        // 跳過本步驟
        if(!Cypress.env('itsMe')) {
            return
        }

        testConponentText = '招攬人員'
        cy.findLeftSideBar(testConponentText).then((findItem) =>{
            if (findItem!=null) {
                if (findItem.find('div.page__sidebar-btn--completeCheck').length>0) {
                    console.log(`${testConponentText} 已完成`)
                    return expect(true).to.be.true
                } else {
                    findItem.click()
                }

                cy.get('input[formcontrolname="commiAgentCode2"]').clear().type(testData.agent.agentCode2)
                cy.get('label[for="assignRate2"]').click().wait(500)

                // finally
                cy.get('.page__content__btn > button.btn-danger').click()
            } else {
                console.log(`${testConponentText} 找不到`)
            }
        })
    })

    it('財務狀況告知書', () => {
        // 跳過本步驟
        if(!Cypress.env('itsMe')) {
            return
        }

        testConponentText = '財務狀況告知書'
        cy.findLeftSideBar(testConponentText).then((findItem) =>{
            if (findItem!=null) {
                if (findItem.find('div.page__sidebar-btn--completeCheck').length>0) {
                    console.log(`${testConponentText} 已完成`)
                    return expect(true).to.be.true
                } else {
                    findItem.click()
                }

                let count = 0
                cy.get('.mdc-tab').each(($tab) => {
                    cy.get($tab).click().wait(100)

                    // 財務狀況
                    cy.get('input[formcontrolname="yearIncome"]').clear().type(testData.financial.yearIncome)
                    cy.get('input[formcontrolname="otherIncome"]').clear().type(testData.financial.otherIncome)
                    cy.get('input[formcontrolname="familyIncome"]').clear().type(testData.financial.familyIncome)
                    cy.get('input[formcontrolname="deposit"]').clear().type(testData.financial.deposit)
                    cy.get('input[formcontrolname="bankName"]').clear().type(testData.financial.bankName)
                    cy.get('input[formcontrolname="movableProperty"]').clear().type(testData.financial.movableProperty)
                    // 不動產
                    cy.get('input[formcontrolname="estate"]').clear().type(testData.financial.estate)
                    cy.get('input[formcontrolname="local"]').clear().type(testData.insured.engAddress)
                    cy.get('input[formcontrolname="ping2"]').clear().type(testData.financial.ping)
                    // 負債
                    cy.get('input[formcontrolname="borrowing"]').clear().type(testData.financial.borrowing)
                    cy.get('input[formcontrolname="borrowType"]').clear().type(testData.financial.borrowType)

                    if (count == 1) {
                        cy.get('input[formcontrolname="insuranceFeeSources1"]').check({ force: true })
                        cy.get('input[formcontrolname="insuranceFeeSources3"]').check({ force: true })
                        cy.get('input[formcontrolname="insuranceFeeSources5"]').check({ force: true })
                    }
                    
                    // 是否有辦理借款
                    cy.isElementExist('input[formcontrolname="hasLoan"][value="N"]').then((isExist) => {
                        if (isExist) {
                            cy.get('input[formcontrolname="hasLoan"][value="N"]').scrollIntoView().check()
                            cy.get('input[formcontrolname="hasTermination"][value="N"]').scrollIntoView().check()
                        }
                    })

                    count++
                })

                // finally
                cy.get('.page__content__btn > button.btn-danger').click().wait(shortSleep)
            } else {
                console.log(`${testConponentText} 找不到`)
            }
        })
    })

    it('業務員核保報告書', () => {
        // 跳過本步驟
        if(!Cypress.env('itsMe')) {
            return
        }

        testConponentText = '業務員核保報告書'
        cy.findLeftSideBar(testConponentText).then((findItem) =>{
            if (findItem!=null) {
                if (findItem.find('div.page__sidebar-btn--completeCheck').length>0) {
                    console.log(`${testConponentText} 已完成`)
                    return expect(true).to.be.true
                } else {
                    findItem.click()
                }

                cy.get('input[formcontrolname="relationship"][value="4"]').check()
                cy.get('input[formcontrolname="applicantPurposeChoice1"]').check()
                cy.get('input[formcontrolname="selfApply"][value="0"]').scrollIntoView().check()
                cy.get('input[formcontrolname="specialRemart"][value="0"]').check()
                // 被保險人財務狀況
                cy.get('input[formcontrolname="insuredWorkIncome"]').scrollIntoView().clear().type(testData.financial.yearIncome)
                cy.get('input[formcontrolname="insuredOtherIncome"]').clear().type(testData.financial.otherIncome)
                cy.get('input[formcontrolname="insuredHouseholdIncome"]').clear().type(testData.financial.familyIncome)
                // 要保人財務狀況
                cy.get('input[formcontrolname="proposerWorkIncome"]').scrollIntoView().clear().type(testData.financial.yearIncome)
                cy.get('input[formcontrolname="proposerOtherIncome"]').clear().type(testData.financial.otherIncome)
                cy.get('input[formcontrolname="proposerHouseholdIncome"]').clear().type(testData.financial.familyIncome)

                cy.get('input[formcontrolname="spouseCareer"]').scrollIntoView().clear().type(testData.financial.spouseCareer)
                // 家中主要經濟來源
                cy.get('input[formcontrolname="economicSources1"]').check()
                // 保費來源
                cy.get('input[formcontrolname="insuranceFeeSources1"]').scrollIntoView().check({ force: true })
                cy.get('input[formcontrolname="insuranceFeeSources3"]').check({ force: true })
                cy.get('input[formcontrolname="insuranceFeeSources5"]').check({ force: true })
                cy.get('input[formcontrolname="reasonAndSourcePremiums"]').clear().type(testData.financial.reason)
                cy.get('input[formcontrolname="hasLoan"]').check()
                cy.get('input[formcontrolname="hasLoan"][value="N"]').check()
                cy.get('input[formcontrolname="hasTermination"][value="N"]').check()
                // 負債
                cy.get('input[formcontrolname="hasLiabilities"][value="Y"]').scrollIntoView().check()
                cy.get('input[formcontrolname="proposerLiabilitiesType"]').clear().type(testData.financial.borrowType)
                cy.get('input[formcontrolname="proposerTotalLiabilities"]').clear().type(testData.financial.borrowing)
                cy.get('input[formcontrolname="insuredLiabilitiesType"]').clear().type(testData.financial.borrowType)
                cy.get('input[formcontrolname="insuredTotalLiabilities"]').clear().type(testData.financial.borrowing)
                // 其他商業保險
                cy.get('input[formcontrolname="proposerOtherInsuranceProducts"][value="0"]').check()
                cy.get('input[formcontrolname="insuredOtherInsuranceProducts"][value="0"]').check()
                //    要保人是否對於本次購買商品之保障內容或給付項目完全不關心
                cy.get('input[formcontrolname="proposerHighlyAttention"][value="1"]').scrollIntoView().check()
                cy.get('input[formcontrolname="notAssignReason"]').type('NoNoNo')

                cy.get('input[formcontrolname="notifyAgree"][value="0"]').scrollIntoView().check()
                if (testData.noteAndInsuredRecord.question_1==="Y") {
                    cy.get('input[formcontrolname="insuredHealthAbnormal"][value="1"]').check()
                    cy.get('input[formcontrolname="insuredHealthAbnormalState"]').type("身心障礙")
                } else {
                    cy.get('input[formcontrolname="insuredHealthAbnormal"][value="0"]').check()
                }
                cy.get('input[formcontrolname="militaryService"][value="1"]').check()

                cy.get('input[formcontrolname="clerkStatement1"][value="0"]').scrollIntoView().check()
                cy.get('input[formcontrolname="clerkStatement2"][value="0"]').check()
                cy.get('input[formcontrolname="clerkStatement3"][value="0"]').check()
                cy.get('input[formcontrolname="clerkStatement4"][value="0"]').check()
                cy.get('input[formcontrolname="clerkStatement5"][value="0"]').check()

                cy.get('input[formcontrolname="proposerTeleAccessTime1"]').scrollIntoView().check()
                cy.get('input[formcontrolname="proposerTeleAccessNo"]').clear().type(testData.insured.phoneNumberNight)
                cy.get('input[formcontrolname="insuredTeleAccessTime1"]').check()
                cy.get('input[formcontrolname="insuredTeleAccessNo"]').clear().type(testData.insured.phoneNumberNight)
                cy.get('input[formcontrolname="legalRepresentativeAccessNo"]').clear().type(testData.insured.phoneNumberNight)

                // finally
                cy.get('.page__content__btn > button.btn-danger').click().wait(shortSleep)
            } else {
                console.log(`${testConponentText} 找不到`)
            }
        })
    })

    it('疾病問卷', () => {
        // 跳過本步驟
        if(!Cypress.env('itsMe')) {
            return
        }

        testConponentText = '疾病問卷'
        cy.findLeftSideBar(testConponentText).then((findItem) =>{
            if (findItem!=null) {
                if (findItem.find('div.page__sidebar-btn--completeCheck').length>0) {
                    console.log(`${testConponentText} 已完成`)
                    return expect(true).to.be.true
                } else {
                    findItem.click()
                }

                // 新增
                cy.get('.card-body > .btn').click()
                cy.get('select[name="questionSelect"]').select("Q-0001")
                cy.get('select[name="insuredSelect"]').select(testData.insured.baseInfoName)
                cy.get('button[name="next"]').click()

                // 填寫
                // 1.
                cy.get('input[formcontrolname="occurrenceYear"]').type("111")
                cy.get('input[formcontrolname="occurrenceMonth"]').type("5")
                cy.get('input[formcontrolname="occurrenceDay"]').type("21")
                cy.get('textarea[formcontrolname="cause"]').clear().type("這就是發生原因")
                // 2.
                cy.get('input[formcontrolname="haveAnyConditions"]').check("false")
                cy.get('input[formcontrolname="haveAnyConditions"]').check("true")
                cy.get('input[formcontrolname="conditions"]').eq(0).check()
                cy.get('input[formcontrolname="conditions"]').eq(1).check()
                cy.get('input[formcontrolname="conditions"]').eq(2).check()
                cy.get('input[formcontrolname="conditions"]').eq(3).check()
                cy.get('input[formcontrolname="lossConsciousness"]').check("false")
                cy.get('input[formcontrolname="lossConsciousness"]').check("true")
                cy.get('textarea[formcontrolname="coma"]').clear().type("昏迷了十年")
                cy.get('input[formcontrolname="conditions"]').check({ force: true })
                cy.get('textarea[formcontrolname="fractureSite"]').clear().type("全身粉粹性骨折")
                // 3.
                cy.get('input[formcontrolname="hospitalized"]').check("false")
                cy.get('input[formcontrolname="hospitalized"]').check("true")
                cy.get('textarea[formcontrolname="hospitalizedDay"]').clear().type("11/05/21, 30天")
                cy.get('input[formcontrolname="continuousTreatment"]').check("false")
                cy.get('input[formcontrolname="continuousTreatment"]').check("true")
                cy.get('input[formcontrolname="lastClinicYear"]').clear().type("111")
                cy.get('input[formcontrolname="lastClinicMonth"]').clear().type("5")
                cy.get('input[formcontrolname="lastClinicDay"]').clear().type("21")
                cy.get('input[formcontrolname="surgicalTreatment"]').check("false")
                cy.get('input[formcontrolname="surgicalTreatment"]').check("true")
                cy.get('textarea[formcontrolname="surgicalName"]').clear().type("改造手術")
                cy.get('input[formcontrolname="implantation"]').check("false")
                cy.get('input[formcontrolname="implantation"]').check("true")
                cy.get('input[formcontrolname="takeOutYear"]').clear().type("111")
                cy.get('input[formcontrolname="takeOutMonth"]').type("5")
                cy.get('input[formcontrolname="takeOutDay"]').clear().type("21")
                cy.get('input[formcontrolname="haveSuggestion"]').check("false")
                cy.get('input[formcontrolname="haveSuggestion"]').check("true")
                cy.get('textarea[formcontrolname="suggestion"]').clear().type("我沒有任何建議")
                // 4.
                cy.get('input[formcontrolname="defect"]').check("false")
                cy.get('input[formcontrolname="defect"]').check("true")
                cy.get('textarea[formcontrolname="defectDesc"]').clear().type("受傷有任何機能喪失或缺損")
                // 5.
                cy.get('input[formcontrolname="haveSequelae"]').check("false")
                cy.get('input[formcontrolname="haveSequelae"]').check("true")
                cy.get('input[formcontrolname="sequelae"]').eq(0).check()
                cy.get('input[formcontrolname="sequelae"]').eq(1).check()
                cy.get('input[formcontrolname="sequelae"]').eq(2).check()
                cy.get('input[formcontrolname="sequelae"]').eq(3).check()
                cy.get('input[formcontrolname="sequelae"]').eq(4).check()
                cy.get('input[formcontrolname="sequelae"]').eq(5).check()
                cy.get('input[formcontrolname="sequelae"]').eq(6).check()
                cy.get('input[formcontrolname="sequelae"]').eq(7).check()
                cy.get('textarea[formcontrolname="canNotMoveDesc"]').clear().type("我不能移動")
                cy.get('input[formcontrolname="sequelae"]').eq(8).check()
                cy.get('textarea[formcontrolname="sequelaeOther"]').clear().type("這是其他選項")
                // 6.
                cy.get('input[formcontrolname="cured"]').check("true")
                cy.get('input[formcontrolname="cured"]').check("false")
                cy.get('textarea[formcontrolname="unhealedDesc"]').clear().type("上為痊癒")
                // 7.
                cy.get('textarea[formcontrolname="hospitalName"]').clear().type("臺大醫院")
                cy.get('input[formcontrolname="hospitalLocation"]').clear().type("台北市公館區")
                cy.get('textarea[formcontrolname="medicalRecordNumber"]').type("RX-78-G3")

                cy.get('button[name="next"]').click()

                // finally
                cy.get('.page__content__btn > button.btn-danger').click()

                // 是否填寫完畢
                cy.get('.modal-footer > .btn-primary').click()
            } else {
                console.log(`${testConponentText} 找不到`)
            }
        })
    })

    it('前往文件預覽', () => {
        // 跳過本步驟
        if(!Cypress.env('itsMe')) {
            return
        }

        cy.wait(shortSleep)
        cy.intercept('**/case/flow-step*').as('caseFlowStep')
        cy.intercept('**/insurance/updateInsuranceRecord*').as('checkUpdateRecord')
        
        // 是否進入文件預覽
        cy.isElementExist('app-yes-no-dialog button.btn-primary').then((isExist) => {
            if (isExist) {
                cy.get('app-yes-no-dialog button.btn-primary').click()
            } else {
                // 主動按下 檢核儲存
                cy.get('div.page__content__btn.bottom-0.end-0 > button.btn-danger').click()

                // 如果有任何警告視窗,那就按
                cy.isElementExist('app-base-dialog button.btn-primary').then((isExist) => {
                    if (isExist) {
                        cy.get('app-base-dialog button.btn-primary').click()
                    }
                })

                cy.wait('@checkUpdateRecord').then( (interception) => {
                    // 是否進入文件預覽
                    cy.isElementExist('app-yes-no-dialog button.btn-primary').then((isExist) => {
                        if (isExist) {
                            cy.get('app-yes-no-dialog button.btn-primary').click()
                        }
                    })
                })
            }
        })
        cy.wait('@caseFlowStep').then((interception) => {})
    })
})

context('文件預覽', () => {
    it('check',() => {
        cy.wait(shortSleep)
        Cypress.env('itsMe',false)
        cy.get('div[data-swiper-slide-index="1"]').then(($headerElement) => {
            if ($headerElement.hasClass('step__item--last')) {
                Cypress.env('itsMe',true)
            } else {
                console.log('文件預覽 步驟 已完成')
            }
        })
    })

    it('文件預覽main', () => {
        // 跳過本步驟
        if(!Cypress.env('itsMe')) {
            return
        }
        cy.intercept('**/document/List*').as('documentList')
        cy.intercept('**/document/file*').as('documentFile')

        var btnCount = 0
        cy.get('tbody > tr > td > button.btn-outline-info').its('length').then((result) => {
            // 統計按鈕總數
            btnCount = result

            for (var i = 0; i < btnCount; i++) {
                const $btn = cy.get('tbody > tr > td > button.btn-outline-info').eq(i)

                // 按 請確認是否預覽下份文件
                cy.isElementExist('app-yes-no-dialog button.btn.btn-primary').then((isExist) => {
                    if (isExist) {
                        cy.get('app-yes-no-dialog button.btn.btn-primary').click()
                    } else {
                        $btn.click()
                    }
                })
                
                // loading pdf
                cy.wait('@documentFile').wait(shortSleep).then( _ => {
                    cy.isElementExist('.btn.btn-secondary').then((isExist) => {
                        if (isExist) {
                            // 關閉pdf
                            cy.get('.btn.btn-secondary').click()
                        } else {
                            // 迴圈按 下一頁
                            cy.pdfNextStepLoop()
                        }
                    })
                })
            }
        })

        // 下一步
        cy.get('.btn-primary').click()

    })
})

context('電子簽名', () => {
    it('check',() => {
        cy.wait(shortSleep)
        Cypress.env('itsMe',false)
        cy.get('div[data-swiper-slide-index="2"]').then(($headerElement) => {
            if ($headerElement.hasClass('step__item--last')) {
                Cypress.env('itsMe',true)
            } else {
                console.log('電子簽名 步驟 已完成')
            }
        })
    })

    it('電子簽名', () => {
        // 跳過本步驟
        if(!Cypress.env('itsMe')) {
            return
        }

        cy.get('.mdc-tab').each(($tab) => {
            cy.get($tab).click().wait(100)

            var btnCount = 0
            cy.get('.signature').its('length').then((result) => {
                // 統計按鈕總數
                btnCount = result

                for (var i = 0; i < btnCount; i++) {

                    const $btn = cy.get('.signature').eq(i)

                    // 檢查是否已簽名
                    // 避免發生錯誤停止測試, 先找出一定會有的元素, 再用then進入後續處理
                    $btn.find('.signature__img')
                        .then((signature_img) => {
                            if (signature_img.children('img').length == 0) {
                                // 開啟簽名
                                $btn.click()

                                cy.get("canvas.signature-pad__pad")
                                    .then((el) => {
                                        const rect = el[0].getBoundingClientRect()

                                        // 亂畫
                                        cy.window().then((window) => {
                                            const pageX = rect.left
                                            const pageY = rect.top
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
                                                })
                                        })
                                    })

                                // 送出
                                cy.get('.signature-pad__footer-btn--confirm').click()
                            }
                        })

                }
            })
        })

        // 下一步
        cy.get('.btn-primary').click()
    })
})

context('上傳文件', () => {
    it('check',() => {
        cy.wait(shortSleep)
        Cypress.env('itsMe',false)
        cy.get('div[data-swiper-slide-index="3"]').then(($headerElement) => {
            if ($headerElement.hasClass('step__item--last')) {
                Cypress.env('itsMe',true)
            } else {
                console.log('上傳文件 步驟 已完成')
            }
        })
    })

    it('上傳文件', () => {
        // 跳過本步驟
        if(!Cypress.env('itsMe')) {
            return
        }

        var btnCount = 0
        cy.get('app-accordion-items').its('length').then((result) => {
            // 統計欄位總數
            btnCount = result

            for (var i = 0; i < btnCount; i++) {
                cy.get('app-accordion-items').eq(i).find('tbody > tr > :nth-child(3)')
                    .then(($parent) => {

                        const $btn = $parent.find('.btn-info')

                        // 沒有"預覽"才拍照
                        if ($parent.children('.btn-success[style*="visibility: visible"]').length == 0) {
                            // 開啟相機
                            $btn.click()

                            // 關閉拍照
                            cy.get('app-camera-dialog > .camera > .camera-controls--top > div').first().click().wait(pdfWaiting)

                            // // 切換鏡頭
                            // cy.get('app-camera-dialog > .camera > .camera-controls--top > div').last().click().wait(pdfWaiting)
                            // // 拍照
                            // cy.get('app-camera-dialog > .camera > .camera-controls--bottom > div').first().click().wait(pdfWaiting)
                            // // 確認
                            // cy.get('app-camera-dialog > .camera > .camera-controls--bottom > div').last().click().wait(pdfWaiting)
                            // // success
                            // cy.get('app-success-dialog > .modal-footer > button').click()
                        }
                    })
            }
        })

        // 下一步
        cy.get('.text-md-end > .btn-primary').click()
    })
})

context('確認投保', () => {
    it('check',() => {
        cy.wait(shortSleep)
        Cypress.env('itsMe',false)
        cy.get('div[data-swiper-slide-index="4"]').then(($headerElement) => {
            if ($headerElement.hasClass('step__item--last')) {
                Cypress.env('itsMe',true)
            } else {
                console.log('確認投保 步驟 已完成')
            }
        })
    })

    it('確認投保', () => {
        // 跳過本步驟
        if(!Cypress.env('itsMe')) {
            return
        }

        cy.isElementExist('.btn.btn-outline-info.btn-sm').then((isExist) => {
            if (isExist) {
                cy.get('.btn.btn-outline-info.btn-sm').each(($btn) => {
                    cy.get($btn).click()
                    // 迴圈按 下一頁
                    cy.pdfNextStepLoop()           
                })

                // 確認送件
                cy.get('.btn-primary').click()
            }
        })

        // 開啟簽名, 多業務員
        cy.isElementExist('.mdc-tab').then((isExist) => {
            if (isExist) {
                cy.get('.mdc-tab').each(($tab) => {
                    cy.get($tab).click().wait(100)

                    cy.get('.signature').click()

                    cy.get("canvas.signature-pad__pad")
                        .then((el) => {
                            const rect = el[0].getBoundingClientRect()

                            // 亂畫
                            cy.window().then((window) => {
                                const pageX = rect.left
                                const pageY = rect.top
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
                                    })
                            })
                        })

                    // 送出
                    cy.get('.signature-pad__footer-btn--confirm').click()
                })

                // 下一步
                cy.wait(shortSleep).get('.btn-primary').click()
            }

        })

        // cy.isElementExist('#confirm').then((isExist) => {
        //         if (isExist) {
        //                 // 要確認刪除
        //                 cy.get('#confirm').check()
        //                 // 確認送件
        //                 cy.get('.avatar-title').click()
        //         }
        // })

    })

    it.skip('送件完成', () => {
            cy.wait(longSleep * 2)

            // 看到確認結果
            cy.get('app-base-dialog').find('.btn-primary').should('have.exist')
    })
})