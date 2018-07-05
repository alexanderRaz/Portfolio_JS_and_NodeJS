window.onload = function(){
    
    //добавление сообщени в конец списка
    submitMsg.onclick = function() {
	  let input = document.getElementById('msg');
      let messageFromInput = input.value;
      let listMessages = document.getElementById('messages');
	  let newLi = document.createElement('li');
	  newLi.innerHTML = messageFromInput;
	  listMessages.appendChild(newLi);	  
      return false;
    };
};