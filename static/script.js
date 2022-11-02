let chat = document.querySelector("#chat")
let input = document.querySelector("#message-input")
let btnSubmit = document.querySelector("#btn-submit")
const roomName = JSON.parse($('#room-name').text());
const userName = JSON.parse($('#user-name').text());
let counter = 0  // Счетчик для формирования id сообщений к которым нужно получить доступ
let page = -1  // Номер страниы загруженной последней (до 0, по убыванию)

const webSocket = new WebSocket('ws://' + window.location.host + '/ws/chat/' + roomName + '/');

webSocket.onmessage = function(e) {
    const data = JSON.parse(e.data);
    if (data.what_it == 'message'){
        if (userName == data.user){
            chat.innerHTML += '<div class="msg" id="mes' + data.id + '">' + data.message + '</div>'
        } else {
            chat.innerHTML += '<div class="msg">' + data.message + '</div>'
        }
    }
    if (data.what_it == 'message_status'){
//        chat.innerHTML += '<div class="msg">' + data.message + ' OK </div>'
        $('#mes'+data.message).attr('style', 'color:#0000FF;')
    }
    if (data.what_it == 'user_status'){
        chat.innerHTML += '<div class="msg">' + data.message + '</div>'
    }


//    alert($('#mes1').text())
};


btnSubmit.addEventListener("click", () => {
    message = input.value;
//    chat.innerHTML += '<div class="msg" id="mes' + counter + '">' + message + '</div>'
    webSocket.send(JSON.stringify({
        'message': message,
        'label': counter
    }));
    input.value = '';
    counter ++;
})


// -------------------------------------------------------------------------------------
// Отправка фильтров на API. Получение слов и вывод
function get_page(){
        let send = {
            user: userName,
            room: roomName,
            page: page,
        };
        let data = JSON.stringify(send);

         $.ajax({
             url: url_api,
             type: 'POST',
               headers: {
    "Content-type": "application/json"
  },
             data: data,
             cache: true,
             success: function (data) {

                // Вывод полученных сообщений
                let time = data['time'];
                data = data['words'];
                $('#out').append('<div class="alert alert-danger" role="alert">Всего: ' + s + " слов</div>");

             },
             error: function(){
                 console.log("error")
             }
         })

    }
