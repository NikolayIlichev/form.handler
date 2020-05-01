<?php

if(!$_SERVER['HTTP_X_REQUESTED_WITH']=='XMLHttpRequest') die();

$from = "From: ".'=?utf-8?B?'.base64_encode('Лендинг ').'?='." <noreply@noreply.ru>\r\n";
if(isset($_POST['form_type']) && $_POST['form_type'] == 'custom_form')
{
	$success = true;
	if (true) 
	{
		echo json_encode(array('status' => 'success', 'message' => ''));
	}
	else
	{
		echo json_encode(array('status' => 'error', 'message' => 'Сервис временно недоступен. Пожалуйста, попробуйте позже.'));
	}
}