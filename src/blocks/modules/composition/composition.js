// document.addEventListener('DOMContentLoaded', function () {
//   // 'use strict';
//   const errorMessage = 'Нет соединения попробуйте еще...',
//     loadMessage = 'Загрузка...',
//     successMessage = 'Спасибо! Мы скоро с вами свяжемся!',
//     statusMessage = document.createElement('span'),
//     forms = document.querySelectorAll('form');

//   const errMessage = document.createElement('span');
//   const errShortName = document.createElement('span');

//   statusMessage.style.cssText = `font-size: 1em; color: red;`;
//   errMessage.style.cssText = `font-size: 1em; color: red;`;
//   errShortName.style.cssText = `font-size: 1em; color: red;`;
//   errMessage.textContent = 'Поля не должны быть пустыми';

//   const errorMessages = (inputs, index) => {
              
//       inputs[index].insertAdjacentElement('afterend', errMessage);
//       setTimeout(() => {
//           errMessage.remove();
//       }, 2000);
//   };
//   forms.forEach(elem => {

//       elem.addEventListener('input', event => {
//           const pattNameMess = /[?!,.%:*(/><)_^#$@&~'}[{\-+="№;a-zA-Z0-9]$/;
//           let target = event.target;
          
//           if (target.matches('.form-name')) {
//               if (target.value.length < 2){
//                   errShortName.textContent = 'Короткое имя!';
//                   target.insertAdjacentElement('afterend', errShortName);
//               } else {
//                 errShortName.remove(); 
//               }
//               target.value = target.value.replace(pattNameMess, '');
//           }
//           if (target.value.length >= 18) {
//             errShortName.remove();    
//           }
//       });

//       elem.addEventListener('submit', event => {
//           event.preventDefault();
//           let formInputs = elem.querySelectorAll('input');
//           elem.appendChild(statusMessage);
          
//           if ( formInputs[0].value === '' || formInputs[1].value === '') {
//               errMessage.textContent = 'Поля не должны быть пустыми';
//               errorMessages(formInputs, 1);
//               return;
//           }
//           if ( formInputs[1].value.length < 18) {
//               errMessage.textContent = 'Неправельный номер';
//               formInputs[1].insertAdjacentElement('afterend', errMessage);
//               return;
//           }
          
//           statusMessage.textContent = loadMessage;
          
//           const formData = new FormData(elem);
//           const  body = {};
//           for (const val of formData.entries()) {
//               body[val[0]] = val[1];
//           }

//           postData(body)
//               .then(response => {
//                   if (response.status !== 200) {
//                       throw new Error(`status network ${response.status} not 200`);
//                   }
//                   statusMessage.textContent = successMessage;
//               })
//               .catch(error => {
//                   statusMessage.textContent = errorMessage;
//                   console.warn(error);
//               })
//               .finally(() => {
//                   setTimeout(() => {
//                       errMessage.remove();
//                       statusMessage.remove();
//                       const formInputs = elem.querySelectorAll('input');
//                       formInputs.forEach(elem => {
//                           elem.value = '';
//                       });
//                   }, 2000);
//               });

//       });
//   });

//   const postData = (body) => {
//       return fetch('/success.php', {
//           method: 'POST',
//           headers: {
//               'Content-Type': 'application/json'
//           },
//           body: JSON.stringify(body)
//       });
//   };

//   var phoneInputs = document.querySelectorAll('input[data-tel-input]');

//   var getInputNumbersValue = function (input) {
//       // Return stripped input value — just numbers
//       return input.value.replace(/\D/g, '');
//   }

//   var onPhonePaste = function (e) {
//       var input = e.target,
//           inputNumbersValue = getInputNumbersValue(input);
//       var pasted = e.clipboardData || window.clipboardData;
//       if (pasted) {
//           var pastedText = pasted.getData('Text');
//           if (/\D/g.test(pastedText)) {
//               // Attempt to paste non-numeric symbol — remove all non-numeric symbols,
//               // formatting will be in onPhoneInput handler
//               input.value = inputNumbersValue;
//               return;
//           }
//       }
//   }

//   var onPhoneInput = function (e) {
//       var input = e.target,
//           inputNumbersValue = getInputNumbersValue(input),
//           selectionStart = input.selectionStart,
//           formattedInputValue = '';

//       if (!inputNumbersValue) {
//           return input.value = '';
//       }

//       if (input.value.length != selectionStart) {
//           // Editing in the middle of input, not last symbol
//           if (e.data && /\D/g.test(e.data)) {
//               // Attempt to input non-numeric symbol
//               input.value = inputNumbersValue;
//           }
//           return;
//       }

//       if (['7', '8', '9'].indexOf(inputNumbersValue[0]) > -1) {
//           if (inputNumbersValue[0] == '9') inputNumbersValue = '7' + inputNumbersValue;
//           var firstSymbols = (inputNumbersValue[0] == '8') ? '8' : '+7';
//           formattedInputValue = input.value = firstSymbols + ' ';
//           if (inputNumbersValue.length > 1) {
//               formattedInputValue += '(' + inputNumbersValue.substring(1, 4);
//           }
//           if (inputNumbersValue.length >= 5) {
//               formattedInputValue += ') ' + inputNumbersValue.substring(4, 7);
//           }
//           if (inputNumbersValue.length >= 8) {
//               formattedInputValue += '-' + inputNumbersValue.substring(7, 9);
//           }
//           if (inputNumbersValue.length >= 10) {
//               formattedInputValue += '-' + inputNumbersValue.substring(9, 11);
//           }
//       } else {
//           formattedInputValue = '+' + inputNumbersValue.substring(0, 16);
//       }
//       input.value = formattedInputValue;
//   }
//   var onPhoneKeyDown = function (e) {
//       // Clear input after remove last symbol
//       var inputValue = e.target.value.replace(/\D/g, '');
//       if (e.keyCode == 8 && inputValue.length == 1) {
//           e.target.value = '';
//       }
//   }
//   for (var phoneInput of phoneInputs) {
//       phoneInput.addEventListener('keydown', onPhoneKeyDown);
//       phoneInput.addEventListener('input', onPhoneInput, false);
//       phoneInput.addEventListener('paste', onPhonePaste, false);
//   }
// });