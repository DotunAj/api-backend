$(document).ready(function(){
    $('.delete-resource').on('click', function(e){
        $target = $(e.target);
        const id = $target.attr('data-id');
        $.ajax({
            type:'DELETE',
            url:'/resources/'+id,
            success: function(response){
                window.location.href='/dashboard';
            },
            error: function(err){
                console.log(err);
            }
        });
    });
});

$(document).ready(function(){
    $('.delete-user').on('click', function(e){
        $target = $(e.target);
        const id = $target.attr('data-id');
        $.ajax({
            type:'DELETE',
            url:'/users/'+id,
            success: function(response){
                window.location.href='/dashboard';
            },
            error: function(err){
                console.log(err);
            }
        });
    });
});