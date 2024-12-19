/**
 * 驗證碼破解
 * 不能砍
 */

export function solver() {
  cy.readFile('cypress/support/cbl-js/CBL.min.js').then((code) => {
    // model
    let model_text;
    cy.readFile("cypress/support/cbl-js/model.txt").then((content) => {
      model_text = content;
    });

    const script = document.createElement('script');
    script.innerHTML = code;
    cy.document().then((doc) => {
      doc.head.appendChild(script);
      // 现在可以在Cypress测试中使用CBL对象和其方法了
      cy.window().then((win) => {
        const cbl = win.CBL({
          preprocess: function (img) {
            img.binarize(100);
            img.colorRegions(50);
          },
          /* Load the model we saved during training. */
          model_string: model_text,
          character_set: "0123456789",
          exact_characters: 4,
          blob_min_pixels: 50,
          blob_max_pixels: 400,
          pattern_width: 25,
          pattern_height: 25,
          perceptive_colorspace: true,
          /* Define a method that fires immediately after successfully loading a saved model. */
          model_loaded: function () {
            // Don't enable the solve button until the model is loaded.
            // document.getElementById('solve').style.display = "block";
          }
        });

        const readyGo = function () {
          // Using the saved model, attempt to find a solution to a specific image.
          cbl.solve('#captcha').done(function (solution) {
            // Upon finding a solution, fill the solution textbox with the answer.
            cy.get('#verificatoinCode').type(solution)
          });
        }
        readyGo();
      });
    });
  });
}