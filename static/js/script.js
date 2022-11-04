$(document).ready(function(){

let chat = document.querySelector("#chat")
let input = document.querySelector("#message-input")
let btnSubmit = document.querySelector("#btn-submit")
const roomName = JSON.parse($('#room-name').text());
const userName = JSON.parse($('#user-name').text());
let counter = 0  // Счетчик для формирования id сообщений к которым нужно получить доступ
let page = 1  // Номер страниы загруженной последней (которую нужно загрузить)
mes_count = JSON.parse($('#mes-count').text());  // Сколько сообщений на момент входа (для пагинации)
date_now = new Date(new Date().setHours(0,0,0,0));  // Текущая дата для текущих сообщений
date_archive = date_now; // Дата, при выводе архивных сообщений

var months = ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля',
              'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря', ];

const webSocket = new WebSocket('ws://' + window.location.host + '/ws/chat/' + roomName + '/');

webSocket.onmessage = function(e) {
    get_page();  // Получаем и выводим последнюю страницу истории сообщений

    const data = JSON.parse(e.data);
    data.message = data.message.replace(/(\r\n|\n|\r)/g,'<br />');

    let datetime_message = new Date(new Date().setHours(0,0,0,0));  // Текущая дата
    let time = new Date().toLocaleTimeString().slice(0, -3)
    let date_message = new Date(datetime_message.setHours(0,0,0,0))

    // Вывод даты
    if (date_message > date_now){
        date_now = date_message
        out_date = '<div class="date">' + date_now.getDate() + ' ' + months[date_now.getMonth()]
        if (date_now.getFullYear() != date_now.getFullYear()) {
            out_date = out_date + ' ' + date_now.getFullYear()
        }
        out_date = out_date + '</div>'
        $('#chat').append(out_date);
    }

    if (data.what_it == 'message'){
        // Вывод сообщения
            let doing = 'receive'
            let status = ''
            another = '<span style="color: blue">' + data.user + '</span><br>'
            if (userName == data.user) {
                // Пользователь - автор сообщения
                doing = 'send'
                status = ' <span class="check" id="mes' + data.id + '"><i class="fa fa-check" aria-hidden="true"></i></span>'
                another = ''
            }

            $('#chat').append('<p class="' + doing + '">' + another + data.message +
                '<br><span class="time">' + time + status + '</span></p>');
    }
    if (data.what_it == 'message_status'){
        // Подтверждаем запись сообщения в БД
        $('#mes'+ data.message).append('<i class="fa fa-check" aria-hidden="true"></i>')
    }
    if (data.what_it == 'user_status'){
        // Сообщаем о новом пользователе
        $('#chat').append('<div class="date">' + data.message + '</div>');
    }

    // Переход к новым сообщениям
    var destination = $('#new_mes').offset().top;
    jQuery("html:not(:animated),body:not(:animated)").animate({scrollTop: destination}, 0);
    $('#message-input').focus();
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
// Получение сообщений и вывод
function get_page(scroll=1){
    var csrf_token = $('#next_page [name="csrfmiddlewaretoken"]').val();
    let send = {
        user: userName,
        room: roomName,
        page: page,
        mes_count: mes_count,
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
        console.log(data['return'])
        // Вывод полученных сообщений
        if (data['return'] != '') {
            let string = data['return'];
            page = data.page
            for (let item of Object.values(string)){

                item.text = item.text.replace(/(\r\n|\n|\r)/g,'<br />');
                let doing = 'receive'
                let status = ''
                another = '<span style="color: blue">' + item.user__username + '</span><br>'
                if (userName == item.user__username) {
                    // Пользователь - автор сообщения
                    doing = 'send'
                    status = ' <span class="check"><i class="fa fa-check" aria-hidden="true"></i><i class="fa fa-check" aria-hidden="true"></i></span>'
                    another = ''
                }

                let datetime_message = new Date(item.created)
                let time = datetime_message.toLocaleTimeString().slice(0, -3)
                let date_message = new Date(datetime_message.setHours(0,0,0,0))

                // Вывод даты
                if (date_message < date_archive){
                    out_date = '<div class="date">' + date_archive.getDate() + ' ' + months[date_archive.getMonth()]
                    if (date_archive.getFullYear() != date_now.getFullYear()) {
                        out_date = out_date + ' ' + date_archive.getFullYear()
                    }
                    out_date = out_date + '</div>'
                    $('#chat').prepend(out_date);
                    date_archive = date_message
                }

                $('#chat').prepend('<p class="' + doing + '">' + another + item.text +
                    '<br><span class="time">' + time + status + '</span></p>');

            }
            out_date = '<div class="date">' + date_archive.getDate() + ' ' + months[date_archive.getMonth()]
            if (date_archive.getFullYear() != date_now.getFullYear()) {
                out_date = out_date + ' ' + date_archive.getFullYear()
            }
            out_date = out_date + '</div>'
            $('#chat').prepend(out_date);

            if (scroll) {
                // Переход к новым сообщениям
                var destination = $('#new_mes').offset().top;
                jQuery("html:not(:animated),body:not(:animated)").animate({scrollTop: destination}, 0);
            }
            $('#message-input').focus();

        } else {
            return
        }

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
    if (document.body.scrollTop < 20 && document.documentElement.scrollTop < 20) {
        get_page(0);
        // Переход к выведенным словам
        var destination = 30;
        jQuery("html:not(:animated),body:not(:animated)").animate({scrollTop: destination}, 0);

    }
}
// -----------------------------------------------------------------------------------------

});