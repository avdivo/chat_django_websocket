$(document).ready(function(){

    const modal = new bootstrap.Modal(document.querySelector('#exampleModal'));
    modal.show();

    $('#exampleModal').on('shown.bs.modal', function() {
        // #myInput - id элемента, которому необходимо установить фокус
        $('#myInput').focus();
    })

    $('#exampleModal').modal({
        show: false
    });

});