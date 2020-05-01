document.addEventListener('DOMContentLoaded', function () {

	let customForm = document.querySelectorAll('form.custom_form');

	if (customForm.length) {
		customForm.forEach(function (el) {
			el.addEventListener('submit', function (event) {
				event.preventDefault();

				let options = {
					form: event.currentTarget, // submited form
					errorClass: 'input-error', // css class for stylizing fields with error
					pathTo: '/example/backend.php', // path to backend handler 
					additionalData: null // additional data that added to submited form 
				};

				let formHandler = new FormHandler(options); // create handler object

				formHandler.validateForm(); // cheking form for correct data and empties
				formHandler.ajaxSend('custom_form', function (curFormObj) { // submiting form data to backend path
					alert('Success!');
				}); 
			});
		});
	}
});