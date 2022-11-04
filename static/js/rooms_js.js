
$(document).ready(function(){

    const modal = new bootstrap.Modal(document.querySelector('#exampleModal'));
    modal.show();

    $('#exampleModal').on('shown.bs.modal', function() {
        // #myInput - id элемента, которому необходимо установить фокус
        $('#room').focus();
    });

    $('#exampleModal').modal({
        show: false
    });

    // Новая комната
    $('#new_room').click(function(){
        const regex = new RegExp('^[-.a-zA-Z0-9]+$');
        const v = $('#room').val()
        if (regex.test(v)) {
            url = '/chat/' + v;
            $(location).attr('href',url);
        } else {
            alert('Некорректное название комнаты')
        }

    });
});
