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
};

// ---------------------------------------------------------------------------
// Соединение разорвано

webSocket.onclose = function(event) {
  if (event.wasClean) {
    location.reload();
  }
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
    var csrf_token = $('#next_page [name="csrfmiddlewaretoken"]').val();
    let send = {
        user: userName,
        room: roomName,
        page: page,
    };
    let data = JSON.stringify(send);
     $.ajax({
        url: $('#next_page').attr("action"),
        type: 'POST',
         headers: {
            'X-CSRFToken': csrf_token
         },
        data: data,
        cache: true,
        success: function (data) {

        // Вывод полученных сообщений
        let string = data['string'];
            $('#chat').prepend('<div class="msg">' + string + '</div>');
        },
        error: function(){
         console.log("error")
        }
     })

    }

// -------------------------------------------------------------------------------
// Когда прокрутка экрана доходиь до 0 запускаем подгрузку сообщений

window.onscroll = function() {scrollFunction()};
function scrollFunction() {
    if (document.body.scrollTop == 0 && document.documentElement.scrollTop == 0) {
        get_page();
    }
}
// -----------------------------------------------------------------------------------------
