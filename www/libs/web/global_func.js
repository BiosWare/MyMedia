var hideNotification = null;

function centerWindow(obj_to_center){
    var screen_h = $(document).height();
    var login_h = $(obj_to_center).height();
    var total_h = (screen_h-login_h)/2;

    $($(obj_to_center).parent()).attr('style', 'top:'+total_h+'px;');
}

function startLoading() {
    $('.loader').addClass('active');
    $("#backgroundLoading").attr("class", "back-load");
}

function finishLoading() {
    $('.loader').removeClass('active');
    $('#backgroundLoading').removeAttr('class');
}

function closeMessageBox(message_type){
    if(message_type===undefined){
        var msg_class = document.getElementById('msg_e').className;
        var class_array = msg_class.split(' ');

        for(var c=0;c<class_array.length;c++){
            var item = class_array[c];
            if(item.indexOf('alert-')!==-1){
                message_type = ' '+item;
                break;
            }
        }
    }

    $('#msg_e').fadeOut(500, function(){
        document.getElementById('msg_e').className = document.getElementById('msg_e').className.replace(new RegExp(message_type, 'g'), '');

        clearTimeout(hideNotification);
        hideNotification=null;
    });
}

function messageBox(msg, message_type, time){
    if(message_type===undefined)
        message_type = 'alert-success';
    else
        message_type = 'alert-'+message_type;

    document.getElementById('msg_e').className += ' '+message_type;
    document.getElementById('mb_msg').innerHTML = msg;

    if(time===undefined)
        time = 5000;

    $('#msg_e').fadeIn(500);

    clearInterval(hideNotification);
    hideNotification = setTimeout(function(){
        closeMessageBox(message_type);
    }, time);
}

function open_confirm(msg, title, confirm_btn_msg, cancel_btn_msg, confirm_callback, close_callback){
    document.getElementById('c_modal_title').innerHTML = title;
    document.getElementById('c_modal_body').innerHTML = msg;

    document.getElementById('c_confirm_btn').innerHTML = confirm_btn_msg;
    document.getElementById('c_close_btn').innerHTML = cancel_btn_msg;

    if(close_callback === undefined){
        close_callback = function(){
            $('#confirm_modal').modal('hide');
        };
    }

    if(confirm_callback === undefined){
        confirm_callback = function(){
            $('#confirm_modal').modal('hide');
        };
    }

    document.getElementById('c_confirm_btn').onclick = confirm_callback;
    document.getElementById('c_close_btn').onclick = close_callback;

    $('#confirm_modal').modal('show');
}

function close_confirm(){
    $('#confirm_modal').modal('hide');
}

$(document).ready(function(){
    $('#msg_e').hide();

    $.ajax({
        url: '/mmapi/network/stats/get',
        type: 'GET',
        dataType:'json'
    }).done(function(dat){
      var SERVER_PORT = $('#server_port_value').val();
      $('#network_ips_list').append('<li class="dropdown-header">Local Address</li>');

      for(var c=0;c<dat.net_inter.length;c++){
        var item = dat.net_inter[c];

        $('#network_ips_list').append('<li role="separator" class="divider"></li> <li><a>'+item.address+' ('+item.family+')</a></li>');
      }

      $('#network_ips_list').append('<li role="separator" class="divider"></li>  <li class="dropdown-header">Server Listening Port</li>');
      $('#network_ips_list').append('<li><a>'+SERVER_PORT+'</a></li>');
    }).fail(function(){
        $('#network_ips_list').html('<li><a>Can\'t get network interfaces!</a></li>');
    });

    $('#mb_close').on('click', function(){
        closeMessageBox();
    });
});
